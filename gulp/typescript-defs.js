var gulp = require('gulp');
var debug = require('gulp-debug');

gulp.task('prepare-to-publish', function ()
{
    return gulp.src(['src/**/*.d.ts'])
        .pipe(debug())
        .pipe(gulp.dest('build'))
});
