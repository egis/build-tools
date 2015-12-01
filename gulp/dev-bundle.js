var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var connect = require('gulp-connect');
var concat = require('gulp-concat');
var gzip = require('gulp-gzip');
var pseudoconcat = require('gulp-pseudoconcat-js');
var common = require('./common');
var port = common.pkg.port || 8101;
var main = common.pkg.mainFile;
var host = common.host || 'localhost';
var replace = require('gulp-replace');

module.exports = function()
{
    return gulp.src(['dist/**/*.js', 'dist/templates/*.js'])
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(pseudoconcat(main + ".js", {
            webRoot: 'src',
            host: 'http://' + host + ':' + port + '/'
        }), concat( main + ".js"))
        .pipe(sourcemaps.write('.', {includeContent: true}))
        .pipe(gulp.dest('build'))
        .pipe(connect.reload());
};