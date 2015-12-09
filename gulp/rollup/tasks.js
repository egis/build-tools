var oldBuildTestStructureCleanup = require('./old-build-test-structure-cleanup');
var rollup = require('./compile-and-bundle');
var gulp = require('gulp');
var generateEs6IndexTasks = require('./generate-es6-index-tasks');
var fixSourcemaps = require('./fix-sourcemaps');
var common = require('../common');
var delDist = require('../del-dist');

generateEs6IndexTasks('', 'src', common.dist.main);
generateEs6IndexTasks('-test', 'test', common.dist.test);

gulp.task('del-dist', function() {
    return delDist(common.dist.main);
});

gulp.task('del-test-dist', ['old-build-test-structure-cleanup'], function () {
    return delDist(common.dist.test);
});

gulp.task('old-build-test-structure-cleanup', oldBuildTestStructureCleanup);
gulp.task('rollup-compile', ['del-dist', 'generate-es6-index'], function() {
    return rollup(common.dist.main, common.pkg.name);
});

gulp.task('rollup-compile-examples', function() {
    return rollup('build', 'examples', 'examples/index.js');
});

gulp.task('fix-rollup-sourcemaps', ['rollup-compile'], fixSourcemaps);

gulp.task('compile', ['rollup-compile', 'fix-rollup-sourcemaps', 'rollup-compile-examples']);
gulp.task('compile-tests', ['del-test-dist', 'generate-es6-index-test'], function() {
    return rollup(common.dist.test, 'tests');
});

