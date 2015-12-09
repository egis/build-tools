var oldBuildTestStructureCleanup = require('./old-build-test-structure-cleanup');
var rollup = require('./compile-and-bundle');
var gulp = require('gulp');
var generateEs6IndexTasks = require('./generate-es6-index-tasks');
var common = require('../common');

generateEs6IndexTasks('main');
generateEs6IndexTasks('tests');
generateEs6IndexTasks('examples');

gulp.task('old-build-test-structure-cleanup', oldBuildTestStructureCleanup);
gulp.task('compile', ['generate-es6-index-main'], function() {
    return rollup('main', common.pkg.name);
});

gulp.task('compile-examples', ['generate-es6-index-examples'], function() {
    return rollup('examples', 'Examples');
});

gulp.task('compile-tests', ['generate-es6-index-tests'], function() {
    return rollup('test', 'Tests');
});

