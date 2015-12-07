var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var connect = require('gulp-connect');
var concat = require('gulp-concat');
var pseudoconcat = require('gulp-pseudoconcat-js');
var common = require('./common');
var port = common.pkg.port || 8101;
var main = common.pkg.mainFile;
var host = common.host || 'localhost';
var replace = require('gulp-replace');
var babel = require('gulp-babel');
var debug = require('gulp-debug');
var print = require('gulp-print');
var changed = require('gulp-changed');

gulp.task('dev-recompile', function () {
    var d0 = 0;
    return gulp.src(['src/**/*.js', '!src/.rollup*', '!src/**/*_scsslint_*', '!src/index.js'])
        .pipe(changed('dist'))
        .once('data', function() {d0 = new Date().getTime()})
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
        .pipe(sourcemaps.write('.', {includeContent: !common.prod, sourceRoot: '../src'}))
        .pipe(gulp.dest('dist'))
        .pipe(connect.reload());

});

gulp.task('generate-systemjs-index', ['generate-es6-index'], function() {
    var destDir  = 'dist';
    return gulp.src([destDir + '/work/rollup-wildcard-exports.js'])
        .pipe(replace(/export \* from '(.+)'/g, "require('$1')"))
        .pipe(concat('index.js'))
        .pipe(gulp.dest(destDir + '/'))
});

gulp.task('dev-bundle', ['generate-systemjs-index', 'dev-recompile', 'templates'], function() {
    return gulp.src([__dirname + '/systemjs/propagate/loader.js', __dirname + '/../../systemjs/dist/systemjs.js',
        'dist/templates/*.js'])

        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(concat(main + ".js"))
        .pipe(sourcemaps.write('.', {includeContent: true}))
        .pipe(gulp.dest('build'));
});
