var gulp = require('gulp');
var replace = require('gulp-replace');

module.exports = function() {
    return gulp.src('dist/EgisUI.js.map')
        .pipe(replace('../../src', ''))
        .pipe(gulp.dest('dist/'));
};
