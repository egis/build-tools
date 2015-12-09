var gulp = require('gulp');
var replace = require('gulp-replace');
var common = require('../common');

module.exports = function(distDir, srcDir, bundleName) {
    return gulp.src(distDir + '/' + bundleName + '.map')
        //.pipe(replace('../../src', '../src')) //this loads correct sourcemaps for examples if used without uglifier
        .pipe(replace('../../' + srcDir + '/', '')) //this makes uglifier not error about missing files, but it doesn't work still.
        .pipe(gulp.dest(distDir));
};
