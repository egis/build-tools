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
var webserver = require('./gulp/webserver');
var exit = require('gulp-exit');
var reloadConnection = require('./gulp/reload-connection');
var _ = require('lodash');

require('./gulp/styles');
require('./gulp/bundle');
require('./gulp/dev-bundle');
require('./gulp/rollup/tasks');
require('./gulp/plugin');
require('./gulp/cleanup');

gulp.task('resources', ['del-main-dist'], resources);
gulp.task('dependencies', ['resources'], bower);
gulp.task('package', ['all'], pack);
gulp.task('all', ['bundle', 'styles', 'resources']);
gulp.task('templates', ['partials'], templates);
gulp.task('partials', ['del-main-dist'], partials);
gulp.task('default', ['package', 'webserver', 'watch']);

gulp.task('webserver', webserver(common.port));

var devPackageTaskDeps = ['dev-bundle-main', 'styles', 'resources'];
if (common.pkg.examples) devPackageTaskDeps.push('dev-bundle-examples');

gulp.task('dev-package', devPackageTaskDeps, pack);

gulp.task('watch', ['dev-package', 'dev-bundle-tests', 'webserver'], function() {
    _.each(common.bundleKinds, function(kind) {
        gulp.watch([common.srcDirs[kind] + '/**/*.js'], ['dev-recompile-' + kind], reloadConnection);
        gulp.watch([common.srcDirs[kind] + '.lib-exports.js'], ['dev-bundle-' + kind], reloadConnection);
    });
    gulp.watch([common.srcDirs.main + '/.dev-loader.js'], ['dev-package'], reloadConnection);
    gulp.watch('src/**/*.hbs', ['templates'], reloadConnection);
    gulp.watch('style/**/*.*', ['styles'], reloadConnection);
});

