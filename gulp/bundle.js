/**
 * Created by Nikolay Glushchenko <nick@nickalie.com> on 08.09.2015.
 */

var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var gulpif = require('gulp-if');
var connect = require('gulp-connect');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var gzip = require('gulp-gzip');
var pseudoconcat = require('gulp-pseudoconcat-js');
var common = require('./common');
var pkg = common.pkg;
var deploy = common.deploy;
var prod = common.prod;
var port = common.pkg.port || 8101;
var main = common.pkg.mainFile;
var host = common.host || 'localhost';
var replace = require('gulp-replace');

module.exports = function()
{

	if (common.watch ) {
		return gulp.src(['dist/**/*.js', 'dist/templates/*.js'])
		    .pipe(sourcemaps.init({loadMaps: true}))
		    .pipe(gulpif(prod, uglify({mangle: false}))) 
		    .pipe(gulpif(common.watch, pseudoconcat(main + ".js", {
            webRoot: 'src',
            host: 'http://' + host + ':' + port + '/'
        }), concat( main + ".js")))
		    .pipe(sourcemaps.write('.', {includeContent: !prod}))
		    .pipe(gulp.dest('build'))
		    .pipe(gzip())
		    .pipe(gulp.dest('build/'))
		    .pipe(connect.reload());
	} else {
		 return gulp.src(['dist/**/*.js', 'dist/templates/*.js'])
 		.pipe(common.replaceAll())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(gulpif(prod, uglify({mangle: false}))) 
        .pipe(concat(pkg.mainFile + ".js"))
        .pipe(sourcemaps.write('.', {includeContent: !prod}))
        .pipe(gulp.dest('build'))
        .pipe(gzip())
        .pipe(gulp.dest('build/'));
	}
};