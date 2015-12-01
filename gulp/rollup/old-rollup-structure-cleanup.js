var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');

var babel = require('rollup-plugin-babel');
var del = require('del');

module.exports = function()
{
    del.sync('src/.rollup-index.js');
    del.sync('src/.rollup-lib-exports.js');
};
