/**
 * Created by Nikolay Glushchenko <nick@nickalie.com> on 08.09.2015.
 */

var gulp = require('gulp');
var plumber = require('gulp-plumber');
var concat = require('gulp-concat');
var handlebars = require('gulp-handlebars');
var wrap = require('gulp-wrap');
var common = require('./common');

module.exports = function ()
{
    return gulp.src(['src/**/_*.hbs'])
        .pipe(plumber())
        .pipe(handlebars())
        .pipe(wrap('Handlebars.registerPartial("<%= file.stem.substr(1) %>", Handlebars.template(<%= contents %>));'))
        .pipe(concat('partials.js'))
        .pipe(gulp.dest(common.dist.main + '/templates'));
};
