/**
 * Created by Nikolay Glushchenko <nick@nickalie.com> on 08.09.2015.
 */

var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var gzip = require('gulp-gzip');
var common = require('./common');
var delDist = require('./gulp/del-dist');
var fixSourcemaps = require('./rollup/fix-sourcemaps');

gulp.task('old-dist-structure-cleanup', function() {
    return delDist(common.dist.dir);
});

gulp.task('fix-main-sourcemaps', function() {
    return gulp.src(common.dist.main + '/' + common.bundles.main + '.map').pipe(fixSourcemaps(common.srcDirs.main));
});

gulp.task('fix-examples-sourcemaps', function() {
    return gulp.src(common.dist.examples + '/' + common.bundles.examples).pipe(fixSourcemaps(common.srcDirs.examples));
});

gulp.task('bundle-main', ['compile', 'templates', 'fix-main-sourcemaps'], function() {
    return gulp.src([common.dist.main + '/' + common.bundles.main, common.dist.main + '/templates/*.js'])
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(common.replaceAll())
        .pipe(uglify({mangle: false}))
        .pipe(concat(common.bundles.main))
        .pipe(sourcemaps.write('.', {includeContent: false, sourceRoot: '../' + common.srcDirs.main}))
        .pipe(gulp.dest('build'))
        .pipe(gzip())
        .pipe(gulp.dest('build/'));
});

gulp.task('bundle-examples', ['compile-examples', 'fix-examples-sourcemaps'], function() {
    return gulp.src([common.dist.examples + '/' + common.bundles.examples])
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write('.', {includeContent: false, sourceRoot: '../' + common.srcDirs.examples}))
        .pipe(gulp.dest('build'));
});

gulp.task('bundle', ['old-dist-structure-cleanup', 'bundle-main', 'bundle-examples']);
