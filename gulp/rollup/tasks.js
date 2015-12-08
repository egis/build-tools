var delDir = require('../del-dir');
var oldRollupStructureCleanup = require('./old-rollup-structure-cleanup');
var rollup = require('./compile-and-bundle');
var gulp = require('gulp');
var testsBundleDir = 'build-test';

var generateEs6IndexTasks = require('./gulp/rollup/generate-es6-index-tasks');

generateEs6IndexTasks('', 'src', 'dist/work');
generateEs6IndexTasks('-test', 'test', testsBundleDir + '/work');

gulp.task('del-dist', function() {
    return delDir('dist');
});
gulp.task('del-build-test', function () {
    return delDir(testsBundleDir + '/work');
});

gulp.task('old-rollup-structure-cleanup', oldRollupStructureCleanup);
gulp.task('rollup-compile', ['del-dist', 'old-rollup-structure-cleanup', 'generate-es6-index'], function() {
    return rollup('dist', common.pkg.name);
});

gulp.task('rollup-compile-examples', function() {
    return rollup('build', 'examples', 'src/Examples.js');
});

gulp.task('fix-rollup-sourcemaps', ['rollup-compile'], require('./gulp/rollup/fix-sourcemaps'));

gulp.task('compile', ['rollup-compile', 'fix-rollup-sourcemaps']);
gulp.task('compile-tests', ['del-build-test', 'generate-es6-index-test'], function() {
    return rollup(testsBundleDir, 'tests');
});

