var gulp = require('gulp');
var jsonTransform = require('gulp-json-transform');
var directoryMap = require("gulp-directory-map");
var concat = require('gulp-concat');
var forIn = require('lodash.forin');
var is = require('is');

var filename = 'lib-exports.js.gen';
gulp.task('gen-stage1-file-list', function ()
{
    return gulp.src('src/**/*.js')
        .pipe(directoryMap({
            filename: filename
        }))
        .pipe(gulp.dest('dist'))
});

gulp.task('gen-stage2-wildcard-exports', ['gen-stage1-file-list'], function () {
    return gulp.src('dist/' + filename)
        .pipe(jsonTransform(function(data) {
            var blacklist = ['lib-exports.js', 'lib-exports2.js', 'special-exports.js', 'rollup-index.js', 'index.js'];
            var lines = [];
            var fillLines;
            fillLines = function(values) {
                forIn(values, function(value) {
                    if (is.string(value)) {
                        if (blacklist.indexOf(value) === -1) {
                            lines.push("export * from './" + value.replace(/\.js$/, '') + "';");
                        }
                    } else {
                        fillLines(value);
                    }
                });
            };
            fillLines(data);
            return lines.join('\n');
        }))
        .pipe(gulp.dest('dist/out'))
});

gulp.task('gen-stage3-join-exports', ['gen-stage2-wildcard-exports'], function ()
{
    return gulp.src(['dist/out/' + filename , 'src/special-exports.js'])
        .pipe(concat('lib-exports.js'))
        .pipe(gulp.dest('src/'))
});

gulp.task('generate-es6-index', ['gen-stage3-join-exports']);
