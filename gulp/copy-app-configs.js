var gulp = require('gulp');

gulp.task('copy-app-configs', function () {
    return gulp.src(__dirname + '/../app_configs/**/*', {base: __dirname + '/../app_configs', dot: true})
        .pipe(gulp.dest('./'));

});

