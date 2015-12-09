/**
 * Created by Nikolay Glushchenko <nick@nickalie.com> on 08.09.2015.
 */

var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var gzip = require('gulp-gzip');
var common = require('./common');
var delDist = require('./del-dist');
var fixSourcemaps = require('./rollup/fix-sourcemaps');

gulp.task('old-dist-structure-cleanup', function() {
    return delDist(common.dist.dir);
});

gulp.task('fix-main-sourcemaps', ['compile'], function() {
    return fixSourcemaps.distBundle('main');
});

gulp.task('fix-examples-sourcemaps', ['compile-examples'], function() {
    return fixSourcemaps.distBundle('examples');
});

gulp.task('fix-main-build-sourcemaps', ['do-bundle-main'], function() {
    return fixSourcemaps.endBundle('main');
});

gulp.task('do-bundle-main', ['compile', 'templates', 'fix-main-sourcemaps'], function() {
    return gulp.src([common.dist.main + '/' + common.bundles.main, common.dist.main + '/templates/*.js'])
        .pipe(sourcemaps.init({loadMaps: true, debug: true}))
        .pipe(common.replaceAll())
        //.pipe(uglify({mangle: false}))
        .pipe(concat(common.bundles.main))
        .pipe(sourcemaps.write('.', {includeContent: false, sourceRoot: '../' + common.srcDirs.main}))
        .pipe(gulp.dest('build'))
        .pipe(gzip())
        .pipe(gulp.dest('build/'));
});

gulp.task('bundle-main', ['do-bundle-main', 'fix-main-build-sourcemaps']);

gulp.task('bundle-examples', ['compile-examples', 'fix-examples-sourcemaps'], function() {
    return gulp.src([common.dist.examples + '/' + common.bundles.examples])
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write('.', {includeContent: false, sourceRoot: '../' + common.srcDirs.examples}))
        .pipe(gulp.dest('build'));
});

gulp.task('bundle', ['old-dist-structure-cleanup', 'bundle-main', 'bundle-examples']);
