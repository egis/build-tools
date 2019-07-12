/**
 * Created by Nikolay Glushchenko <nick@nickalie.com> on 08.09.2015.
 */


var gulp = require('gulp');
var plumber = require('gulp-plumber');
var debug = require('gulp-debug');
var sourcemaps = require('gulp-sourcemaps');
var gzip = require('gulp-gzip');
var sass = require('gulp-sass');
var common = require('./common');
var rename = require('gulp-rename');
var utils = require('../utils');

var main = common.main;

gulp.task('styles', ['sass']);

gulp.task('sass', function ()
{
    const MAIN = 'style/main.scss';
    if (!utils.exists(MAIN)) {
        return;
    }
    return gulp.src([MAIN])
        .pipe(plumber())
        .pipe(debug())
        .pipe(sourcemaps.init())
        .pipe(sass.sync({includePaths: ['node_modules']}))
        .pipe(rename(main + '.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('build'))
        .pipe(gzip())
        .pipe(gulp.dest('build'))
});
