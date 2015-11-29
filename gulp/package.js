/**
 * Created by Nikolay Glushchenko <nick@nickalie.com> on 08.09.2015.
 */

var gulp = require('gulp');
var gulpif = require('gulp-if');
var addsrc = require('gulp-add-src');
var zip = require('gulp-zip');
var exit = require('gulp-exit');
var del = require('del');
var rename = require('gulp-rename');
var pseudoconcat = require('gulp-pseudoconcat-js');


var common = require('./common');
var pkg = common.pkg;
var deploy = common.deploy;
var prod = common.prod;
var port = common.pkg.port || 8101;
var main = common.pkg.mainFile;
var host = common.host || 'localhost';
console.log('')

module.exports = function()
{
    var file = pkg.name + (pkg.plugin ? ".zip" : ".war");
    del.sync('build/' + file);
    console.log('Deploying to ' + deploy + "/" + file);
    return gulp.src(["build/**/*", '!**/' + file, '!build/' + pkg.name + '/**/*'])
        .pipe(addsrc("dist/*.png"))
        .pipe(zip(file))
        .pipe(gulp.dest(deploy))
        .pipe(gulp.dest('.'))
        .pipe(gulpif(prod, exit()));
};
