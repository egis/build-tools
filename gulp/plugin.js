var gulp = require('gulp');
var debug = require('gulp-debug');
var gulpif = require('gulp-if');
var replace = require('gulp-replace');
var zip = require('gulp-zip');
var concat = require('gulp-concat');
var _ = require('lodash');
var path = require('path');
var shelljs = require('shelljs');
var watch = require('gulp-watch');

var common = require('./common');

gulp.task('plugin_concat', ['compile-main', 'templates'], function() {
     return gulp.src([common.dist.main + "/**/*.js", common.dist.main + "/templates/*.js"])
        .pipe(common.replaceAll())
        .pipe(concat( common.bundles.main ))
        .pipe(gulpif(common.watch, replace('/dist/', '/')))
        .pipe(gulpif(common.watch, replace('http://localhost:' +  common.port  + '/../', 'http://localhost:' +  common.port  + '/')))
        .pipe(debug())
        .pipe(gulp.dest('build/'))
});

function packagePlugin() {
    var file = common.module.main + (common.pkg.plugin ? ".zip" : ".war");
    var distDir = 'tmp';
    shelljs.rm('-rf', distDir);
    var pluginDir = path.join(distDir, "System", "plugins", common.pkg.plugin);
    shelljs.mkdir("-p", pluginDir);
    shelljs.cp("build/*.js", pluginDir);
    var metaInfPluginDir = path.join(distDir, "META-INF");
    shelljs.mkdir("-p", metaInfPluginDir);
    shelljs.cp("package.json", metaInfPluginDir);
    console.log('Deploying to ' + common.deploy + "/" + file);
    return gulp.src(["tmp/**/*"])
        .pipe(zip(file))
        .pipe(gulp.dest(common.deploy))
        .pipe(gulp.dest('.'))
}

gulp.task('plugin', ['plugin_concat'], function() {
    return packagePlugin();
});

gulp.task('plugin-dev-package', ['dev-bundle-main', 'styles', 'resources'], function() {
    return packagePlugin();
});

gulp.task('plugin_watch', ['plugin-dev-package', 'dev-bundle-tests', 'webserver'], function() {
    _.each(common.bundleKinds, function(kind) {
        watch([common.srcDirs[kind] + '/**/*.js'], function() {
            gulp.start('dev-recompile-' + kind);
        });
        watch([common.srcDirs[kind] + '/.lib-exports.js'], function() {
            gulp.start('dev-recompile-' + kind);
            gulp.start('generate-systemjs-' + kind + '-index');
        });
    });
    watch('src/.dev-loader.js', function() {
        gulp.start('plugin-dev-package');
    });
    watch('src/**/*.hbs', function() {
        gulp.start('templates');
    });
    watch('style/**/*.*', function() {
        gulp.start('styles');
    });
});
