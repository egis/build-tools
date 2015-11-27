var gulp = require('gulp');
var merge = require('merge-stream');

gulp.task('copy-app-configs', function ()
{
    return gulp.src(__dirname + '/../app_configs/**/*', {base: __dirname + '/../app_configs', dot: true})
        .pipe(gulp.dest('./'));

});

