var gulp = require('gulp');
var concat = require('gulp-concat');

module.exports = function() {
    return gulp.src('test/**/*.js')
        .pipe(concat("bundle-es6.js"))
        .pipe(gulp.dest('test/'));
};
