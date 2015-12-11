/**
 * Created by Nikolay Glushchenko <nick@nickalie.com> on 08.09.2015.
 */


var glue = require("gulp-glue");
var gulp = require('gulp');
var plumber = require('gulp-plumber');
var debug = require('gulp-debug');
var sourcemaps = require('gulp-sourcemaps');
var gzip = require('gulp-gzip');
var sass = require('gulp-sass');
var less = require('gulp-less');
var concat = require('gulp-concat');
var replace = require('gulp-replace');
var addsrc = require('gulp-add-src');
var connect = require('gulp-connect');
var os = require('os');
var utils = require('../utils');
var del = require('del');
var common = require('./common');

var main = common.main;

require('./cleanup');

gulp.task('styles', ['less', 'sass', 'css'], function (done)
{
    connect.reload();
    done();
});

gulp.task('sass', ['del-main-dist'], function ()
{
    return gulp.src(['style/*.sass', 'style/*.scss'])
        .pipe(plumber())
        .pipe(sass.sync())
        .pipe(gulp.dest(common.dist.main))
});

gulp.task('less', ['del-main-dist'], function ()
{
    return gulp.src('style/theme.less')
        .pipe(plumber())
        .pipe(debug())
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(replace('/*# sourceMappingURL=../build/', '/*# sourceMappingURL='))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('build'))
        .pipe(gzip())
        .pipe(gulp.dest('build'));
});

gulp.task('css', ['less', 'sass'], function ()
{
    return gulp.src([common.dist.main + '/*.css', 'sprites/build/*.css', 'style/*.css'])
        .pipe(debug())
        .pipe(concat(main + ".css"))
        .pipe(debug())
        .pipe(addsrc('sprites/build/*.*'))
        .pipe(gulp.dest('build'))
        .pipe(gzip())
        .pipe(gulp.dest('build'))
});

gulp.task('sprites', function (cb) {

    //TODO sprites task hangs on windows
    //need to find workaround
    if (os.platform().indexOf('win') === 0)
    {
        cb();
    }

    if (!utils.exists('sprites/')) {
        cb();
        return;
    }
    del.sync("sprites/build/*");

    return gulp.src(['sprites/**/*'])
        .pipe(glue({
            url: './',
            recursive: true,
            source: './sprites/',
            quiet: true,
            output: './sprites/build/',
            css: 'sprites/build/'
        }, function () {
            cb();
        }))
});
