/**
 * Created by Nikolay Glushchenko <nick@nickalie.com> on 08.09.2015.
 */

var gulp = require('gulp');
var mainDepsFiles = require('./gulp-main-bower-files');
var gutil = require('gulp-util');
var filter = require('gulp-filter');
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');
var sourcemaps = require('gulp-sourcemaps');
var ignore = require('gulp-ignore');
var debug = require('gulp-debug');
var concat = require('gulp-concat');
var gzip = require('gulp-gzip');
var flatten = require('gulp-flatten');
var merge = require('merge-stream');
var _ = require('underscore');
var dependenciesJson = require('./common').dependenciesJson;
var prod = require('./common').prod;
var rename = require('gulp-rename');
var jsonTransform = require('gulp-json-transform');

console.log('prod mode=' + prod)
module.exports = function(done) {
    var bower_excludes = dependenciesJson.excludes.map(function(it) {
        return "**/" + it + "/**/*";
    });

    var bower_standalone = dependenciesJson.standalone.map(function(it) {
        return "**/" + it + "/**/*";
    });

    for (var i = 0; i < dependenciesJson.standalone.length; i++) {
        bowerConcat(filter('**/' + dependenciesJson.standalone[i] + "/**/*"), dependenciesJson.standalone[i], false);
    }

    _.each(dependenciesJson.directories, function(dirs, dep) {
        console.log('coping ' + JSON.stringify(dirs) + " for " + dep);

        dirs.forEach(function(dir) {
            var base = "node_modules/" + dep;
            if (dir.from) {
                gulp.src(base + "/" + dir.from, {
                    base: base
                })
                    .pipe(rename(function(file) {
                        file.dirname = dir.to;
                    }))
                    .pipe(gulp.dest('build/'));
                return;
            }

            gulp.src(base + "/" + dir, {
                base: base
            }).pipe(gulp.dest('build/'));
        });

    });

    if (dependenciesJson.excludes.length > 0 || dependenciesJson.standalone.length > 0) {
        bowerConcat(ignore.exclude(_.union(bower_excludes, bower_standalone)), 'dependencies', prod, done);
    } else {
        bowerConcat(gutil.noop(), 'dependencies', prod, done)
    }
};

function bowerConcat(expr, name, _uglify) {
    var js = bower()
        .pipe(expr)
        .pipe(filter('**/*.js'))
        .pipe(debug())
        .pipe(sourcemaps.init())
        .pipe(gulpif(_uglify, uglify({
            mangle: false
        })))
        .pipe(concat(name + '.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('build'))
        .pipe(gzip())
        .pipe(gulp.dest('build'));

    var css = bower()
        .pipe(expr)
        .pipe(filter('**/*.css'))
        .pipe(concat(name + '.css'))
        .pipe(gulp.dest('build'))
        .pipe(gzip())
        .pipe(gulp.dest('build'));

    var other = bower()
        .pipe(expr)
        .pipe(filter(['**/*', '!**/*.css', '!**/*.js', '!**/*.less']))
        .pipe(flatten())
        .pipe(gulp.dest('build'));

    return merge(js, css, other)
}

function bower() {
    src = gulp.src('./dependencies.json')
        .pipe(jsonTransform(function() {
            var res = JSON.stringify(dependenciesJson);
            // console.log('res', res);
            return res;
        }))
        .pipe(rename("bower.json"))
        .pipe(gulp.dest("."));
    var options = {};
    if (dependenciesJson.overrides.length > 0) {
        options.overrides = dependenciesJson.overrides;
    }
    return src.pipe(mainDepsFiles(options));
}