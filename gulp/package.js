/**
 * Created by Nikolay Glushchenko <nick@nickalie.com> on 08.09.2015.
 */

var gulp = require('gulp');
var addsrc = require('gulp-add-src');
var zip = require('gulp-zip');
var del = require('del');

var common = require('./common');
var utils = require('../utils');
var pkg = common.pkg;
var deploy = common.deploy;
console.log('');

module.exports = function()
{
    if (!common.module.main) return;
    if (utils.exists('build/.version')) {
        utils.sh('cp build/.version build/version');
    } else {
        console.log('No build/.version - are we in dev mode?');
    }
    var file = common.module.main + (pkg.plugin ? ".zip" : ".war");
    del.sync('build/' + file);
    console.log('Deploying to ' + (deploy ? deploy : '.') + "/" + file);
    let res = gulp.src(["build/**/*", '!**/' + file, '!build/' + common.module.main + '/', '!build/' + common.module.main + '/**/*', '!build/test/**/**'])
        .pipe(addsrc(common.dist.main + "/*.png"))
        .pipe(zip(file));
    if (deploy) {
        res = res.pipe(gulp.dest(deploy));
    }
    return res.pipe(gulp.dest('.'));
};
