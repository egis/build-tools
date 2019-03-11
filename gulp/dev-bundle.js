var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var replace = require('gulp-replace');
var babel = require('gulp-babel');
var debug = require('gulp-debug');
var print = require('gulp-print');
var changed = require('gulp-changed');
var plumber = require('gulp-plumber');
var _ = require('lodash');
var gzip = require('gulp-gzip');
var pseudoconcat = require('gulp-pseudoconcat-js');
var common = require('./common');
var utils = require('../utils');

_.each(common.bundleKinds, function(kind) {
    gulp.task('dev-recompile-' + kind, function() {
        var srcDir = common.srcDirs[kind];
        var destDir = common.dist[kind];
        var t0 = {};

        let sources = [srcDir + '/**/*.js'];
        let s1 = srcDir + '/.lib-exports.js';
        if (utils.exists(s1)) {
            sources.push(s1);
        }
        sources.push('!' + srcDir + '/**/*_scsslint_*');
        return gulp.src(sources)
            .pipe(changed(destDir))
            .pipe(print(function(filename) {
                var t = new Date().getTime();
                var fnKey = filename.replace(srcDir, '');
                t0[fnKey] = t;
            }))
            .pipe(common.replaceAll())
            .pipe(sourcemaps.init())
            .pipe(plumber())
            .pipe(debug())
            .pipe(babel({
                highlightCode: true,
                presets: ['es2015']
            }))
            .pipe(sourcemaps.write('.', {includeContent: true}))
            .pipe(gulp.dest(destDir))
            .pipe(print(function(filename) {
                var t = new Date().getTime();
                var fnKey = filename.replace(destDir, '').replace('.map', '');
                var res = t - (t0[fnKey] || 0);
                var report = ['done ', filename, ' in ', res, 'ms'];
                return report.join("");
            }));
    });

    gulp.task('generate-systemjs-' + kind + '-index', ['gen-stage2-wildcard-exports-' + kind, 'dev-recompile-' + kind],
        function () {
            var destDir = common.dist[kind];
            let sources = utils.filterExistingFiles([destDir + '/.work/.rollup-wildcard-exports.js',
                destDir + '/.lib-exports.js']);
            if (sources.length === 0) {
                return;
            }
            return gulp.src(sources)
                .pipe(debug())
                .pipe(replace(/export \* from '(.+)'/g, "require('$1')"))
                .pipe(concat('dev-index.js'))   //not with dot 'cause Gulp webserver doesn't serve .dotfiles
                .pipe(gulp.dest(destDir + '/'))
        });

    gulp.task('dist-' + kind + '-systemjs', function() {
        var systemjsDir = 'node_modules/systemjs';
        return gulp.src([
                systemjsDir + '/dist/system-polyfills.js',
                systemjsDir + '/dist/system.js'
        ])
            .pipe(gulp.dest(common.dist[kind]))
    });

    var prepareDevLoaderTaskDeps = [];
    if (kind === 'main') prepareDevLoaderTaskDeps.push('dist-' + kind + '-systemjs');
    gulp.task('prepare-' + kind + '-dev-loader', prepareDevLoaderTaskDeps, function() {
        let s1 = common.srcDirs[kind] + '/.dev-loader.js';
        if (!utils.exists(s1)) {
            return;
        }
        return gulp.src(s1)
            .pipe(sourcemaps.init())
            .pipe(replace('HOST', common.host))
            .pipe(replace('PORT', common.port))
            .pipe(concat('dev-loader.js'))   //not with dot 'cause Gulp webserver doesn't serve .dotfiles
            .pipe(sourcemaps.write('.', {includeContent: true}))
            .pipe(gulp.dest(common.dist[kind]))
    });

    var devBundleTaskDeps = ['generate-systemjs-' + kind + '-index', 'dev-recompile-' + kind,
            'prepare-' + kind + '-dev-loader'];
    if (kind === 'main') devBundleTaskDeps.push('templates');

    gulp.task('dev-bundle-' + kind, devBundleTaskDeps, function() {

        var destDir = common.dist[kind];
        let sources = utils.filterExistingFiles([common.dist[kind] + '/dev-loader.js']);
        sources.unshift(common.dist[kind] + '/templates/*.js');
        if (kind === 'main') {
            sources.unshift(common.dist['main'] + '/system.js');
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

