var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');

var rollup = require('./rollup');
var babel = require('rollup-plugin-babel');
var fixSourcemaps = require('./fix-sourcemaps');

module.exports = function(bundleDir, moduleName, srcDir, entryFile) {
    entryFile = entryFile || bundleDir + '/.rollup-index.js';
    var moduleFilename = moduleName + '.js';
    return gulp.src(entryFile, {read: false})
        .pipe(sourcemaps.init())
        .pipe(rollup(moduleName))
        .pipe(concat(moduleFilename))
        .pipe(sourcemaps.write('.', {includeContent: false, sourceRoot: '../../' + srcDir}))
        .pipe(gulp.dest(bundleDir + '/'))
        .pipe(fixSourcemaps(bundleDir, srcDir, moduleFilename));
};
