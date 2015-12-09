var gulp = require('gulp');
var delDist = require('./del-dist');

gulp.task('del-main-dist', function() {
    return delDist(common.dist.main);
});

gulp.task('del-examples-dist', function() {
    return delDist(common.dist.examples);
});

gulp.task('del-tests-dist', function() {
    return delDist(common.dist.tests);
});
