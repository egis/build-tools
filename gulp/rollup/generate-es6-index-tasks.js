var gulp = require('gulp');
var jsonTransform = require('gulp-json-transform');
var directoryMap = require("gulp-directory-map");
var concat = require('gulp-concat');
var forIn = require('lodash.forin');
var is = require('is');
var replace = require('gulp-replace');

module.exports = function(tasksSuffix, srcDir, destDir)
{
    var destDir = destDir + '/work';

    gulp.task('copy-rollup-index' + tasksSuffix, function () {
        return gulp.src(__dirname + '/propagate/rollup-index.js')
            .pipe(gulp.dest(destDir + '/'));

    });

    gulp.task('gen-stage1-file-list' + tasksSuffix, function ()
    {
        return gulp.src(srcDir + '/**/*.js')
            .pipe(directoryMap({
                filename: 'modules.json'
            }))
            .pipe(gulp.dest(destDir + '/'))
    });

    gulp.task('gen-stage2-wildcard-exports' + tasksSuffix, ['gen-stage1-file-list' + tasksSuffix], function () {
        return gulp.src(destDir + '/modules.json')
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
            .pipe(gulp.dest(destDir + '/'))
    });

    gulp.task('gen-stage3-finalize-exports' + tasksSuffix, ['gen-stage2-wildcard-exports' + tasksSuffix], function ()
    {
        return gulp.src([destDir + '/rollup-wildcard-exports.js' , srcDir + '/.rollup-manual-exports.js'])
            .pipe(replace('./', '../../' + srcDir + '/'))
            .pipe(concat('rollup-all-exports.js'))
            .pipe(gulp.dest(destDir + '/'))
    });

    gulp.task('generate-es6-index' + tasksSuffix, ['copy-rollup-index' + tasksSuffix, 'gen-stage3-finalize-exports' + tasksSuffix]);
}
