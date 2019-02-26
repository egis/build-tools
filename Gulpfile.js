/**
 * Created by Nikolay Glushchenko <nick@nickalie.com> on 08.09.2015.
 */

var gulp = require('gulp');
var _ = require('lodash');
var path = require('path');
var watch = require('gulp-watch');

var resources = require('./gulp/resources');
var dependencies = require('./gulp/dependencies');
var common = require('./gulp/common');
var pack = require('./gulp/package');
var partials = require('./gulp/partials');
var templates = require('./gulp/templates');
var webserver = require('./gulp/webserver');

require('./gulp/styles');
require('./gulp/bundle');
require('./gulp/dev-bundle');
require('./gulp/rollup/tasks');
require('./gulp/plugin');
require('./gulp/karma-testingbot');

gulp.task('resources', resources);
gulp.task('dependencies', ['resources'], dependencies);
gulp.task('package', ['all'], pack);
gulp.task('all', ['bundle', 'styles', 'resources']);
gulp.task('templates', ['partials'], templates);
gulp.task('partials', partials);
gulp.task('default', ['package', 'webserver', 'watch']);

gulp.task('webserver', webserver(common.port));

var devPackageTaskDeps = ['dev-bundle-main', 'styles', 'resources'];
if (common.pkg.examples) devPackageTaskDeps.push('dev-bundle-examples');

gulp.task('test', function() {});

gulp.task('dev-package', devPackageTaskDeps, pack);

gulp.task('watch', ['dev-package', 'dev-bundle-tests', 'webserver'], function() {
    _.each(common.bundleKinds, function(kind) {
        watch(path.join(common.srcDirs[kind], '**', '*.js'), function() {
            gulp.start('dev-recompile-' + kind);
        });
        watch(path.join(common.srcDirs[kind], '.lib-exports.js'), function() {
                gulp.start('dev-recompile-' + kind);
                gulp.start('generate-systemjs-' + kind + '-index');
        });
    });
    watch(path.join(common.srcDirs.main, '.dev-loader.js'), function() {
        gulp.start('dev-package');
    });
    watch(path.join(common.srcDirs.main, '**', '*.hbs'), function() {
        gulp.start('templates');
    });
    watch('style/**/*.*', function() {
        gulp.start('styles');
    });
});
