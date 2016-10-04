"use strict";

var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var common = require('./common');
var _ = require('lodash');
var glob = require('glob');
var utils = require('../utils');
var fs = require('fs');
var argv = require('optimist').argv;

function loadAppConfig(pkg, dir, serveStaticMap, watchedFiles) {
    if (pkg.routes) {
        _.each(pkg.routes, route => {
            route = '/web/' + route;
            serveStaticMap[route] = serveStaticMap[route] || [];

            //serve css directly from app' build folder - this makes CSS injection work and persist on browser reload
            let path = dir + '/build';
            serveStaticMap[route].push(path);
            console.log(dir + ' adds route:', route, path);
        });
    }

    if (pkg.watchedFiles) {
        _.flatten([pkg.watchedFiles]).forEach(path => {
            path = dir + '/' + path;
            console.log(dir + ' adds watched path:', path);
            watchedFiles.push(path);
        });
    }
}

function loadApps(rootDir, config) {
    let serveStaticMap = {};
    let watchedFiles = [];

    glob.sync(rootDir + '/*').forEach(filePath => {
        let jsonPath = filePath + '/portal-browser-sync.json';
        if (utils.exists(jsonPath)) {
            let pkg;
            try {
                pkg = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
            } catch (e) {
                console.error('Failed parsing config file' + jsonPath + ':', e);
            }
            loadAppConfig(pkg, filePath, serveStaticMap, watchedFiles);
        }
    });

    let serveStatic = [];

    _.forEach(serveStaticMap, (value, key) => {
        serveStatic.push({route: key, dir: value});
    });

    config.files = watchedFiles;
    config.serveStatic = serveStatic;
}

gulp.task('browsersync', () => {
    let toProxy = common.host + ':8080';

    let config = {
        proxy: toProxy,
        startPath: "/web/portal",
        open: 'external',
        tunnel: argv.tunnel
    };

    loadApps('..', config);

    console.log('serveStatic', config.serveStatic);
    console.log('watched files', config.files);

    browserSync.init(config);
});
