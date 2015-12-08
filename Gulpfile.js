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

require('./gulp/styles');
require('./gulp/dev-bundle');
require('./gulp/rollup/tasks');
require('./gulp/plugin');

var port = common.pkg.port || 8101;

gulp.task('resources', resources);
gulp.task('dependencies', ['resources'], bower);
gulp.task('package', ['all'], pack);
gulp.task('all', ['bundle', 'styles', 'resources']);
gulp.task('templates', ['partials'], templates);
gulp.task('partials', partials);
gulp.task('default', ['package', 'webserver', 'watch']);
gulp.task('do-bundle', ['compile', 'templates'], require('./gulp/bundle'));
gulp.task('bundle', ['compile', 'templates'], require('./gulp/bundle'));

gulp.task('webserver', webserver(port));

gulp.task('dev-package', ['del-dist', 'dev-bundle', 'dev-examples-bundle', 'styles', 'resources'], pack);

gulp.task('watch', ['dev-package', 'compile-tests', 'webserver'], function() {
    gulp.watch(['src/**/*.js'], ['dev-recompile']);
    gulp.watch(['src/.examples-loader.js'], ['dev-examples-bundle']);
    gulp.watch(['src/.Examples.js'], ['examples-recompile']);
    gulp.watch(['test/**/*.js'], ['compile-tests']);
    gulp.watch('src/**/*.hbs', ['templates']);
    gulp.watch('style/**/*.*', ['styles']);
});

