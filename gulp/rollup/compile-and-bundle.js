var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');

var rollup = require('./rollup');
var babel = require('rollup-plugin-babel');
var common = require('../common');
var plumber = require('gulp-plumber');
var replace = require('gulp-replace');

module.exports = function(bundleKind) {
    var bundleDir = common.dist[bundleKind];
    var moduleName = common.module[bundleKind];
    var entryFile = bundleDir + '/.rollup-index.js';
    var bundleFilename = common.bundles[bundleKind];
    var srcDir = common.srcDirs[bundleKind];
    var res =  gulp.src(entryFile, {read: false})
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(rollup(moduleName))
        .pipe(concat(bundleFilename));
    if (common.pkg.name !== common.egisUiPkgName) {
        res = res
            .pipe(replace('(function (exports)', common.egisUiPkgName + '.loaded(function() {(function (exports)'))
            .pipe(replace('})((this.' + common.pkg.name + ' = {}));', '})((this.' + common.pkg.name + ' = {}))});'));
    }
    return res
        .pipe(sourcemaps.write('.', {includeContent: false, sourceRoot: '../../' + srcDir}))
        .pipe(gulp.dest(bundleDir + '/'))
};
