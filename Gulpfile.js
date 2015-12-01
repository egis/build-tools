/**
 * Created by Nikolay Glushchenko <nick@nickalie.com> on 08.09.2015.
 */

var gulp = require('gulp');
var resources = require('./gulp/resources');
var bower = require('./gulp/bower');
var common = require('./gulp/common');
var pack = require('./gulp/package');
var partials = require('./gulp/partials');
var templates = require('./gulp/templates');
var rollup = require('./gulp/rollup/compile-and-bundle');
var webserver = require('./gulp/webserver');
var exit = require('gulp-exit');
var delDist = require('./gulp/del-dist');
var oldRollupStructureCleanup = require('./gulp/rollup/old-rollup-structure-cleanup');

var generateEs6IndexTasks = require('./gulp/rollup/generate-es6-index-tasks');
generateEs6IndexTasks('', 'src', 'dist/work');
generateEs6IndexTasks('-test', 'test', 'build-test/work');

var port = common.pkg.port || 8101;

require('./gulp/styles');

gulp.task('resources', resources);
gulp.task('dependencies', ['resources'], bower);
gulp.task('package', ['all'], pack);
gulp.task('all', ['bundle', 'styles', 'resources']);
gulp.task('templates', ['partials'], templates);
gulp.task('partials', partials);
gulp.task('default', ['package', 'webserver', 'watch']);
gulp.task('del-dist', delDist);

gulp.task('old-rollup-structure-cleanup', oldRollupStructureCleanup);
gulp.task('compile', ['del-dist', 'old-rollup-structure-cleanup', 'generate-es6-index'], function() {
    return rollup('dist', common.pkg.name);
});

gulp.task('compile-tests', ['generate-es6-index-test'], function() {
    return rollup('build-test', 'tests');
});

gulp.task('bundle', ['compile', 'templates'], require('./gulp/bundle'));
gulp.task('dev-bundle', ['compile', 'templates'], require('./gulp/dev-bundle'));
gulp.task('webserver', webserver(port));

require('./gulp/plugin.js');

gulp.task('watch', ['dev-bundle', 'compile-tests', 'webserver'], function() {
    gulp.watch(['src/**/*.js', 'src/.rollup-manual-exports.js'], ['dev-bundle']);
    gulp.watch(['dist/*.js', 'test/**/*.js'], ['compile-tests']);
    gulp.watch('src/**/*.hbs', ['templates']);
    gulp.watch('style/**/*.*', ['styles']);
});

