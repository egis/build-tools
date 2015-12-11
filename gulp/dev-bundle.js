var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var common = require('./common');
var replace = require('gulp-replace');
var babel = require('gulp-babel');
var debug = require('gulp-debug');
var print = require('gulp-print');
var changed = require('gulp-changed');
var plumber = require('gulp-plumber');
var _ = require('lodash');
var gzip = require('gulp-gzip');
var pseudoconcat = require('gulp-pseudoconcat-js');
var connect = require('gulp-connect');

require('./cleanup');

function devCompilingPipeline(kind) {
    var srcDir = common.srcDirs[kind];
    var destDir = common.dist[kind];
    var d0 = 0;
    return gulp.src([srcDir + '/**/*.js', srcDir + '/.lib-exports.js', '!' + srcDir + '/**/*_scsslint_*'])
        .pipe(changed(destDir))
        .pipe(sourcemaps.init())
        .once('data', function() {d0 = new Date().getTime()})
        .pipe(plumber())
        .pipe(debug())
        .pipe(babel({
            highlightCode: true,
            presets: ['es2015']
        }))
        .pipe(print(function() {
            var d = new Date().getTime();
            var res = d - d0;
            d0 = d;
            return ['done in ', res, 'ms'].join("");
        }))
        .pipe(sourcemaps.write('.', {includeContent: true}))
        .pipe(gulp.dest(destDir))
        .pipe(connect.reload());
}

_.each(common.bundleKinds, function(kind) {
    gulp.task('dev-recompile-' + kind, [], function () {
        return devCompilingPipeline(kind);
    });

    gulp.task('generate-systemjs-' + kind + '-index', ['gen-stage2-wildcard-exports-' + kind, 'dev-recompile-' + kind], function() {
        var destDir  = common.dist[kind];
        return gulp.src([destDir + '/.work/.rollup-wildcard-exports.js', destDir + '/.lib-exports.js'])
            .pipe(debug())
            .pipe(replace(/export \* from '(.+)'/g, "require('$1')"))
            .pipe(concat('dev-index.js'))   //not with dot 'cause Gulp webserver doesn't serve .dotfiles
            .pipe(gulp.dest(destDir + '/'))
    });

    gulp.task('dist-' + kind + '-systemjs', function() {
        return gulp.src([__dirname + '/../../systemjs/dist/system-polyfills.js', __dirname + '/../../systemjs/dist/system.js'])
            .pipe(gulp.dest(common.dist[kind]))
    });

    gulp.task('prepare-' + kind + '-dev-loader', ['del-' + kind + '-dist', 'dist-' + kind + '-systemjs'], function() {
        return gulp.src([common.srcDirs[kind] + '/.dev-loader.js'])
            .pipe(sourcemaps.init())
            .pipe(replace('HOST', common.host))
            .pipe(replace('PORT', common.port))
            .pipe(concat('dev-loader.js'))   //not with dot 'cause Gulp webserver doesn't serve .dotfiles
            .pipe(sourcemaps.write('.', {includeContent: true}))
            .pipe(gulp.dest(common.dist[kind]))
    });

    gulp.task('dev-bundle-' + kind, ['generate-systemjs-' + kind + '-index', 'dev-recompile-' + kind,
        'templates', 'prepare-' + kind + '-dev-loader'], function() {

        var destDir = common.dist[kind];
        var sources = [
                common.dist[kind] + '/dev-loader.js',
                common.dist[kind] + '/templates/*.js'];
        if (kind === 'main') {
            sources = _(sources).unshift(common.dist['main'] + '/system.js').value();
            destDir = 'build';
        }
        return gulp.src(sources)
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(pseudoconcat(common.bundles[kind], {
                host: 'http://' + common.host + ':' + common.port + '/'
            }))
            .pipe(sourcemaps.write('.', {includeContent: true}))
            .pipe(gulp.dest(destDir))
            .pipe(gzip())
            .pipe(gulp.dest(destDir));
    });
});

