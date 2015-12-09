var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var common = require('./common');
var main = common.pkg.mainFile;
var replace = require('gulp-replace');
var babel = require('gulp-babel');
var debug = require('gulp-debug');
var print = require('gulp-print');
var changed = require('gulp-changed');
var plumber = require('gulp-plumber');

function devCompilingPipeline(src, renameTo, destDir, srcDir) {
    destDir = destDir || 'dist';
    srcDir = srcDir || 'src';
    var d0 = 0;
    var res = src
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
        }));

    if (renameTo) {
        res = res.pipe(concat(renameTo));
    }

    return res
        .pipe(sourcemaps.write('.', {includeContent: true, sourceRoot: '../' + srcDir}))
        .pipe(gulp.dest(destDir));
}

gulp.task('dev-recompile', function () {
    return devCompilingPipeline(gulp.src(['src/**/*.js', 'src/.lib-exports.js', '!src/**/*_scsslint_*']));
});

gulp.task('dev-recompile-tests', function () {
    return devCompilingPipeline(gulp.src(['test/**/*.js', 'test/.lib-exports.js', '!test/**/*_scsslint_*']), null,
        'build-test', 'test');
});

gulp.task('recompile-examples', function () {
    return devCompilingPipeline(gulp.src(['src/.Examples.js']), 'Examples.js');
});

gulp.task('generate-systemjs-index', ['generate-es6-index', 'dev-recompile'], function() {
    var destDir  = 'dist';
    return gulp.src([destDir + '/work/rollup-wildcard-exports.js', destDir + '/.lib-exports.js'])
        .pipe(debug())
        .pipe(replace(/export \* from '(.+)'/g, "require('$1')"))
        .pipe(concat('index.js'))
        .pipe(gulp.dest(destDir + '/'))
});

gulp.task('generate-systemjs-tests-index', ['generate-es6-index-test', 'dev-recompile-tests'], function() {
    var destDir  = 'build-test';
    return gulp.src([destDir + '/work/rollup-wildcard-exports.js', destDir + '/.lib-exports.js'])
        .pipe(debug())
        .pipe(replace(/export \* from '(.+)'/g, "require('$1')"))
        .pipe(concat('index.js'))
        .pipe(gulp.dest(destDir + '/'))
});

gulp.task('dev-bundle', ['generate-systemjs-index', 'dev-recompile', 'templates'], function() {
    return gulp.src(['dist/templates/*.js', __dirname + '/../../systemjs/dist/system.js',
            __dirname + '/systemjs/propagate/loader.js', 'src/.loader.js'])
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(concat(main + ".js"))
        .pipe(sourcemaps.write('.', {includeContent: true}))
        .pipe(gulp.dest('build'));
});

gulp.task('dev-examples-bundle', ['recompile-examples'], function() {
    return gulp.src(['src/.examples-loader.js'])
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(concat("examples.js"))
        .pipe(sourcemaps.write('.', {includeContent: true}))
        .pipe(gulp.dest('build'));
});

gulp.task('dev-bundle-tests', ['generate-systemjs-tests-index', 'dev-recompile-tests'], function() {
    return gulp.src(['test/.loader.js'])
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(concat("tests.js"))
        .pipe(sourcemaps.write('.', {includeContent: true}))
        .pipe(gulp.dest('build-test'));
});
