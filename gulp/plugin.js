var utils = require('../utils');
var gulp = require('gulp');
var debug = require('gulp-debug');
var gulpif = require('gulp-if');
var replace = require('gulp-replace');
var zip = require('gulp-zip');
var concat = require('gulp-concat');
var exit = require('gulp-exit');
var del = require('del');
var sourcemaps = require('gulp-sourcemaps');
var common = require('./common');
var _ = require('lodash');

gulp.task('plugin_concat', ['compile-main', 'templates'], function() {
     return gulp.src([common.dist.main + "/**/*.js", common.dist.main + "/templates/*.js"])
        .pipe(concat( common.bundles.main ))
        .pipe(gulpif(common.watch, replace('/dist/', '/')))
        .pipe(gulpif(common.watch, replace('http://localhost:' +  common.port  + '/../', 'http://localhost:' +  common.port  + '/')))
        .pipe(debug())
        .pipe(gulp.dest('build/'))
});

function packagePlugin() {
    var file = common.module.main + (common.pkg.plugin ? ".zip" : ".war");
    del.sync('tmp');
    utils.sh("mkdir -p tmp/System/plugins/" + common.pkg.plugin + "/");
    utils.sh("mkdir -p tmp/PT-SCRIPTS");
    utils.sh("rm -rf build/System || echo ok");
    utils.sh("rm build/*.js.gz || echo ok");
    utils.sh("rm build/*.js.map.gz || echo ok" );
    if (!common.watch) {
        utils.sh("cp install.groovy tmp/PT-SCRIPTS/ || echo ok");
        utils.sh("cp -R resources/* tmp/ || echo ok");
    }
    utils.sh("cp -R build/* tmp/System/plugins/" + common.pkg.plugin + "/");
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
        gulp.watch([common.srcDirs[kind] + '/**/*.js'], ['dev-recompile-' + kind]);
        gulp.watch([common.srcDirs[kind] + '/.lib-exports.js'], ['dev-recompile-' + kind, 'generate-systemjs-' + kind + '-index']);
    });
    gulp.watch(['**/.dev-loader.js'], ['plugin-dev-package']);
    gulp.watch('src/**/*.hbs', ['templates']);
    gulp.watch('style/**/*.*', ['styles']);
});
