var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');

var pkg = require('./common').pkg;
var prod = require('./common').prod;
var rollup = require('gulp-rollup');
var babel = require('rollup-plugin-babel');

module.exports = function()
{
    return gulp.src('src/.rollup-index.js', {read: false})
        .pipe(rollup({
            // any option supported by rollup can be set here, including sourceMap
            format: 'iife',
            sourceMap: true,
            moduleName: pkg.name,
            globals: {
                egisui: 'EgisUI'
            },
            plugins: [ babel({'presets': ['es2015-rollup'], 'highlightCode': true}) ]
        }))
        .pipe(concat(pkg.name + '.js'))
        .pipe(sourcemaps.write('.', {includeContent: !prod}))
        .pipe(gulp.dest('dist/'));
};
