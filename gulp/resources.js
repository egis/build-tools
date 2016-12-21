/**
 * Created by Nikolay Glushchenko <nick@nickalie.com> on 08.09.2015.
 */

"use strict";
const gulp = require('gulp');
const replaceAll = require('./common').replaceAll;
const common = require('./common');

const dest = 'build';
gulp.task('resources-prod', () => {
    return gulp.src(['resources/**/*', "*.html"])
        .pipe(replaceAll())
        .pipe(gulp.dest(dest));
});

gulp.task('resources-dev', ['bundle'], () => {
    return gulp.src(['dist/**/*', 'examples/**/*'], {base: '.'})
        .pipe(replaceAll())
        .pipe(gulp.dest(dest));
});

let deps = ['resources-prod'];
if (!common.prod) {
    deps.push('resources-dev');
}
gulp.task('resources', deps);
