/**
 * Created by Nikolay Glushchenko <nick@nickalie.com> on 08.09.2015.
 */

var gulp = require('gulp');
var argv = require('optimist').argv;
var resources = require('./gulp/resources');
var bower = require('./gulp/bower');
var common = require('./gulp/common');
var pack = require('./gulp/package');
var partials = require('./gulp/partials');
var templates = require('./gulp/templates');
var rollup = require('./gulp/rollup');
var webserver = require('./gulp/webserver');

require('./gulp/generate-es6-index');
require('./gulp/copy-app-configs');


console.log(require('optimist').argv.watch);

var port = common.pkg.port || 8101;

require('./gulp/styles');

gulp.task('resources', resources);
gulp.task('dependencies', ['resources'], bower);
gulp.task('package', ['all'], pack);
gulp.task('all', ['bundle', 'styles', 'resources']);
gulp.task('templates', ['partials'], templates);
gulp.task('partials', partials);
gulp.task('default', ['package', 'webserver', 'watch']);


gulp.task('compile', ['copy-app-configs', 'generate-es6-index'], rollup);
gulp.task('bundle', ['compile', 'templates'], require('./gulp/bundle'));
gulp.task('webserver', webserver(port));

require('./gulp/plugin.js');

gulp.task('watch', ['package'], function() {
    gulp.watch(['src/**/*.js', "!src/.rollup-lib-exports.js"], ['bundle']);
    gulp.watch('src/**/*.hbs', ['templates']);
    gulp.watch('style/**/*.*', ['styles']);
    gulp.run('webserver')
});

