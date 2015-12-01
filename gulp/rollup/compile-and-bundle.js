var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');

var prod = require('../common').prod;
var rollup = require('gulp-rollup');
var babel = require('rollup-plugin-babel');

module.exports = function(bundleDir, moduleName) {
    return gulp.src(bundleDir + '/work/rollup-index.js', {read: false})
        .pipe(rollup({
            // any option supported by rollup can be set here, including sourceMap
            format: 'iife',
            sourceMap: true,
            moduleName: moduleName,
            globals: {
                egisui: 'EgisUI',
                window: 'window'
            },
            plugins: [ babel({'presets': ['es2015-rollup'], 'highlightCode': true}) ]
        }))
        .pipe(concat(moduleName + '.js'))
        .pipe(sourcemaps.write('.', {includeContent: !prod}))
        .pipe(gulp.dest(bundleDir + '/'));
};
