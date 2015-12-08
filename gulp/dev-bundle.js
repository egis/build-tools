var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var connect = require('gulp-connect');
var concat = require('gulp-concat');
var common = require('./common');
var main = common.pkg.mainFile;
var replace = require('gulp-replace');
var babel = require('gulp-babel');
var debug = require('gulp-debug');
var print = require('gulp-print');
var changed = require('gulp-changed');
var plumber = require('gulp-plumber');

function devCompilingPipeline(src, renameTo) {
    var d0 = 0;
    var res = src
        .pipe(changed('dist'))
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

    res
        .pipe(sourcemaps.write('.', {includeContent: true, sourceRoot: '../src'}))
        .pipe(gulp.dest('dist'))
        .pipe(connect.reload());

}

gulp.task('dev-recompile', function () {
    return devCompilingPipeline(gulp.src(['src/**/*.js', 'src/.lib-exports.js', '!src/**/*_scsslint_*']));
});

gulp.task('examples-recompile', function () {
    return devCompilingPipeline(gulp.src(['src/.Examples.js']), 'Examples.js');
});

gulp.task('generate-systemjs-index', ['generate-es6-index', 'dev-recompile'], function() {
    var destDir  = 'dist';
    return gulp.src([destDir + '/work/rollup-wildcard-exports.js', destDir + '/.lib-exports.js'])
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

gulp.task('dev-examples-bundle', ['examples-recompile'], function() {
    return gulp.src(['src/.examples-loader.js'])
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(concat("examples.js"))
        .pipe(sourcemaps.write('.', {includeContent: true}))
        .pipe(gulp.dest('build'));
});
