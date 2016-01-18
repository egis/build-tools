/**
 * Created by Nikolay Glushchenko <nick@nickalie.com> on 08.09.2015.
 */

var gulp = require('gulp');
var addsrc = require('gulp-add-src');
var zip = require('gulp-zip');
var del = require('del');

var common = require('./common');
var pkg = common.pkg;
var deploy = common.deploy;
console.log('');

module.exports = function()
{
    var file = pkg.name + (pkg.plugin ? ".zip" : ".war");
    del.sync('build/' + file);
    console.log('Deploying to ' + deploy + "/" + file);
    return gulp.src(["build/**/*", '!**/' + file, '!build/' + pkg.name + '/', '!build/' + pkg.name + '/**/*', '!build/test/**/**'])
        .pipe(addsrc(common.dist.main + "/*.png"))
        .pipe(zip(file))
        .pipe(gulp.dest(deploy))
        .pipe(gulp.dest('.'));
};
