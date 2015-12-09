var gulp = require('gulp');
var replace = require('gulp-replace');
var common = require('../common');

module.exports = function() {
    return gulp.src(common.dist.main + '/EgisUI.js.map')
        .pipe(replace('../src', ''))    //This makes uglifier not error about missing files, but it doesn't work still. Remove to make sourcemaps work fine without uglifier.
        .pipe(gulp.dest('dist/'));
};
