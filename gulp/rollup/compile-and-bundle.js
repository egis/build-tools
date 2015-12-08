var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');

var rollup = require('./rollup');
var babel = require('rollup-plugin-babel');
var prod = require('../common').prod;

module.exports = function(bundleDir, moduleName, entryFile) {
    entryFile = entryFile || bundleDir + '/work/rollup-index.js';
    return gulp.src(entryFile, {read: false})
        .pipe(sourcemaps.init())
        .pipe(rollup(moduleName))
        .pipe(concat(moduleName + '.js'))
        .pipe(sourcemaps.write('.', {includeContent: false, sourceRoot: '../src'}))
        .pipe(gulp.dest(bundleDir + '/'));
};
