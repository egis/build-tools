/**
 * Created by Nikolay Glushchenko <nick@nickalie.com> on 08.09.2015.
 */

var gulp = require('gulp');
var plumber = require('gulp-plumber');
var concat = require('gulp-concat');
var handlebars = require('gulp-handlebars');
var wrap = require('@bretkikehara/gulp-wrap');
var path = require('path');
var common = require('./common');

module.exports = function ()
{
    return gulp.src(['src/**/_*.hbs'])
        .pipe(plumber())
        .pipe(handlebars())
        .pipe(wrap('Handlebars.registerPartial(<%= partialName %>, Handlebars.template(<%= contents %>));',
            function (file) {
                let fileName = file.relative;
                // Strip the extension and the underscore
                // Escape the output with JSON.stringify
                return {
                    partialName: JSON.stringify(path.basename(fileName, '.js').substr(1))
                };
            }))
        .pipe(concat('partials.js'))
        .pipe(gulp.dest(common.dist.main + '/templates'));
};