var gulp = require('gulp');
var replace = require('gulp-replace');

module.exports = function() {
    return gulp.src('dist/EgisUI.js.map')
        //.pipe(replace('../../src', '../src')) //this loads correct sourcemaps for examples if used without uglifier
        .pipe(replace('../../src', '')) //this makes uglifier not error about missing files, but it doesn't work still.
        .pipe(gulp.dest('dist/'));
};
