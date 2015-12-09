/**
 * Created by Nikolay Glushchenko <nick@nickalie.com> on 08.09.2015.
 */

var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var gzip = require('gulp-gzip');
var common = require('./common');
var pkg = common.pkg;

module.exports = function() {
    return gulp.src([common.dist.main + '/' + common.pkg.name + '.js', common.dist.main + '/templates/*.js', '!' + common.dist.main + '/work/**/*'])
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(common.replaceAll())
        .pipe(uglify({mangle: false}))
        .pipe(concat(pkg.mainFile + ".js"))
        .pipe(sourcemaps.write('.', {includeContent: false, sourceRoot: '../src'}))
        .pipe(gulp.dest('build'))
        .pipe(gzip())
        .pipe(gulp.dest('build/'));
};
