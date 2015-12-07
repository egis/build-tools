var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');

var rollup = require('gulp-rollup');
var babel = require('rollup-plugin-babel');
var prod = require('../common').prod;

module.exports = function(bundleDir, moduleName) {
    return gulp.src(bundleDir + '/work/rollup-index.js', {read: false})
        .pipe(sourcemaps.init())
        .pipe(rollup({
            // any option supported by rollup can be set here, including sourceMap
            format: 'iife',
            sourceMap: true,
            moduleName: moduleName,
            globals: {
                egisui: 'EgisUI'
            },
            plugins: [babel( {
            plugins:[
                [require("babel-plugin-transform-es2015-template-literals"), {loose: false}],
                [require("babel-plugin-transform-es2015-literals"), {loose: false}],
                [require("babel-plugin-transform-es2015-function-name"), {loose: false}],
                [require("babel-plugin-transform-es2015-arrow-functions"), {loose: false}],
                [require("babel-plugin-transform-es2015-block-scoped-functions"), {loose: false}],
                [require("babel-plugin-transform-es2015-classes"), {loose: false}],
                [require("babel-plugin-transform-es2015-object-super"), {loose: false}],
                [require("babel-plugin-transform-es2015-shorthand-properties"), {loose: false}],
                [require("babel-plugin-transform-es2015-computed-properties"), {loose: false}],
                [require("babel-plugin-transform-es2015-for-of"), {loose: false}],
                [require("babel-plugin-transform-es2015-sticky-regex"), {loose: false}],
                [require("babel-plugin-transform-es2015-unicode-regex"), {loose: false}],
                [require("babel-plugin-check-es2015-constants"), {loose: false}],
                [require("babel-plugin-transform-es2015-spread"), {loose: false}],
                [require("babel-plugin-transform-es2015-parameters"), {loose: false}],
                [require("babel-plugin-transform-es2015-destructuring"), {loose: false}],
                [require("babel-plugin-transform-es2015-block-scoping"), {loose: false}],
                [require("babel-plugin-transform-es2015-typeof-symbol"), {loose: false}],
                [require("babel-plugin-external-helpers-2"), {loose: false}],
                [require("babel-plugin-transform-regenerator"), { async: false, asyncGenerators: false }]
                ],
                "highlightCode": true,
                "compact": false
            })]
        }))
        .pipe(concat(moduleName + '.js'))
        .pipe(sourcemaps.write('.', {includeContent: !prod, sourceRoot: '../src'}))
        .pipe(gulp.dest(bundleDir + '/'));
};
