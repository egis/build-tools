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
        .pipe(sourcemaps.write('.', {includeContent: true, sourceRoot: '../' + srcDir}))
        .pipe(gulp.dest(destDir));
}

gulp.task('dev-recompile', function () {
    return devCompilingPipeline('main');
});

gulp.task('dev-recompile-tests', function () {
    return devCompilingPipeline('tests');
});

gulp.task('dev-recompile-examples', function () {
    return devCompilingPipeline('examples');
});

gulp.task('generate-systemjs-index', ['generate-es6-index', 'dev-recompile'], function() {
    var destDir  = common.dist.main;
    return gulp.src([destDir + '/.work/.rollup-wildcard-exports.js', destDir + '/.lib-exports.js'])
        .pipe(debug())
        .pipe(replace(/export \* from '(.+)'/g, "require('$1')"))
        .pipe(concat('index.js'))
        .pipe(gulp.dest(destDir + '/'))
});

gulp.task('generate-systemjs-tests-index', ['generate-es6-index-test', 'dev-recompile-tests'], function() {
    var destDir  = common.dist.tests;
    return gulp.src([destDir + '/.work/.rollup-wildcard-exports.js', destDir + '/.lib-exports.js'])
        .pipe(debug())
        .pipe(replace(/export \* from '(.+)'/g, "require('$1')"))
        .pipe(concat('index.js'))
        .pipe(gulp.dest(destDir + '/'))
});

gulp.task('dev-bundle', ['generate-systemjs-index', 'dev-recompile', 'templates'], function() {
    return gulp.src([common.dist.main + '/templates/*.js', __dirname + '/../../systemjs/dist/system.js',
        'src/.dev-loader.js'])

        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(concat(common.bundles.main))
        .pipe(sourcemaps.write('.', {includeContent: true}))
        .pipe(gulp.dest('build'));
});

gulp.task('dev-bundle-examples', ['dev-recompile-examples'], function() {
    return gulp.src(['examples/.dev-loader.js'])
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(concat(common.bundles.tests))
        .pipe(sourcemaps.write('.', {includeContent: true}))
        .pipe(gulp.dest('build'));
});

gulp.task('dev-bundle-tests', ['generate-systemjs-tests-index', 'dev-recompile-tests'], function() {
    return gulp.src(['test/.dev-loader.js'])
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(concat("tests.js"))
        .pipe(sourcemaps.write('.', {includeContent: true}))
        .pipe(gulp.dest('build'));
});
