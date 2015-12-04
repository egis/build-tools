var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');

var rollup = require('gulp-rollup');
var babel = require('rollup-plugin-babel');

module.exports = function(moduleName) {
    return rollup({
        // any option supported by rollup can be set here, including sourceMap
        format: 'iife',
        sourceMap: true,
        moduleName: moduleName,
        globals: {
            egisui: 'EgisUI'
        },
        plugins: [ babel({
            'presets': ['es2015-rollup'],
            'highlightCode': true
        }) ]
    })
};
