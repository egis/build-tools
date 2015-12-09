var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');

var rollup = require('./rollup');
var babel = require('rollup-plugin-babel');
var delDist = require('../del-dist');
var common = require('../common');

module.exports = function(bundleKind, moduleName) {
    var bundleDir = common.dist[bundleKind];
    var entryFile = bundleDir + '/.rollup-index.js';
    var bundleFilename = common.bundles[bundleKind];
    var srcDir = common.srcDirs[bundleKind];
    delDist(bundleDir);
    return gulp.src(entryFile, {read: false})
        .pipe(sourcemaps.init())
        .pipe(rollup(moduleName))
        .pipe(concat(bundleFilename))
        .pipe(sourcemaps.write('.', {includeContent: false, sourceRoot: '../../' + srcDir}))
        .pipe(gulp.dest(bundleDir + '/'))
};
