var gulp = require('gulp');
var jsonTransform = require('gulp-json-transform');
var directoryMap = require("gulp-directory-map");
var concat = require('gulp-concat');
var forIn = require('lodash.forin');
var is = require('is');

var filename = 'lib-exports.js.gen';

var destDir = 'dist/work';
gulp.task('copy-rollup-index', function () {
    return gulp.src(__dirname + '/propagate/rollup-index.js')
        .pipe(gulp.dest(destDir));

});

gulp.task('gen-stage1-file-list', function ()
{
    return gulp.src('src/**/*.js')
        .pipe(directoryMap({
            filename: 'modules.json'
        }))
        .pipe(gulp.dest(destDir))
});

gulp.task('gen-stage2-wildcard-exports', ['gen-stage1-file-list'], function () {
    return gulp.src(destDir + '/' + modules.json)
        .pipe(jsonTransform(function(data) {
            var blacklist = ['.rollup-lib-exports.js', '.rollup-manual-exports.js', '.rollup-index.js', 'index.js'];
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
        .pipe(concat('rollup-wildcard-exports.js'))
        .pipe(gulp.dest(destDir))
});

gulp.task('gen-stage3-join-exports', ['gen-stage2-wildcard-exports'], function ()
{
    return gulp.src([destDir + 'rollup-wildcard-exports.js' , 'src/.rollup-manual-exports.js'])
        .pipe(concat('rollup-all-exports.js'))
        .pipe(gulp.dest(destDir))
});

gulp.task('generate-es6-index', ['copy-rollup-index', 'gen-stage3-join-exports']);
