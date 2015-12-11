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
        .pipe(gulp.dest(destDir));
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

    gulp.task('prepare-' + kind + '-dev-loader', ['del-' + kind + '-dist'], function() {
        return gulp.src([common.srcDirs[kind] + '/.dev-loader.js'])
            .pipe(sourcemaps.init())
            .pipe(replace('HOST', common.host))
            .pipe(replace('PORT', common.port))
            .pipe(sourcemaps.write('.', {includeContent: true}))
            .pipe(gulp.dest(common.dist[kind]))
    });
});

function devBundle(kind, sources, destDir) {
    return gulp.src(sources)
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(concat(common.bundles[kind]))
        .pipe(sourcemaps.write('.', {includeContent: true}))
        .pipe(gulp.dest(destDir))
        .pipe(gzip())
        .pipe(gulp.dest('build'));
}

gulp.task('dev-bundle-main', ['generate-systemjs-main-index', 'dev-recompile-main', 'templates', 'prepare-main-dev-loader'], function() {
    return devBundle('main', [common.dist.main + '/templates/*.js', __dirname + '/../../systemjs/dist/system.js',
            common.dist.main  + '/.dev-loader.js'], 'build')
});

var nonMainKinds = ['tests'];
if (common.pkg.examples) nonMainKinds.push('examples');
_.each(nonMainKinds, function(kind) {
    gulp.task('dev-bundle-' + kind, ['generate-systemjs-' + kind + '-index', 'dev-recompile-' + kind,
            'prepare-' + kind + '-dev-loader'], function() {

        return devBundle(kind, [common.dist[kind] + '/.dev-loader.js'], common.dist[kind]);
    });
});
