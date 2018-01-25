"use strict";

/**
 * Please use Node 7.0.0+ to run this script
 */

var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var common = require('./common');
var _ = require('lodash');
var glob = require('glob');
var utils = require('../utils');
var fs = require('fs');
var argv = require('optimist').argv;
var is = require('is_js');

function loadAppConfig(pkg, pkgRootDir, serveStaticMap, watchedFiles) {
    if (pkg.routes) {
        _.each(pkg.routes, routeItem => {
            let route, routeDir;
            if (is.array(routeItem)) {
                [route, routeDir] = routeItem;
            } else {
                route = routeItem;
                routeDir = 'build'
            }
            if (!route.startsWith('/')) route = '/web/' + route;
            serveStaticMap[route] = serveStaticMap[route] || [];

            //serve css directly from app' build folder - this makes CSS injection work and persist on browser reload
            let path = '../' + pkgRootDir + '/' + routeDir;
            serveStaticMap[route].push(path);
            console.log(pkgRootDir + ' adds route:', `${route} => ${path}`);
        });
    }

    if (pkg.watchedFiles) {
        _.flatten([pkg.watchedFiles]).forEach(path => {
            path = '../' + pkgRootDir + '/' + path;
            console.log(pkgRootDir + ' adds watched path:', path);
            watchedFiles.push(path);
        });
    }
}

let loadJsonConfig = function (fileName, filePath) {
    let cfg;
    fileName = filePath + '/' + fileName;
    if (utils.exists(fileName)) {
        try {
            cfg = JSON.parse(fs.readFileSync(fileName, 'utf8'));
        } catch (e) {
            console.error('Failed parsing config file' + fileName + ':', e);
        }
    }
    return cfg;
};

function loadApps(rootDir, config) {
    let serveStaticMap = {};
    let watchedFiles = [];

    glob.sync(rootDir + '/*/').forEach(filePath => {
        filePath = filePath.substring(0, filePath.length - 1);
        let pkg = loadJsonConfig('package.json', filePath);
        if (!pkg) return;
        let pkgDir = filePath.split('/');
        pkgDir = pkgDir[pkgDir.length - 1];
        if (pkg.plugin && pkgDir !== argv.plugin) {
            console.log(`ignoring plugin ${pkgDir} because it's not the requested one`);
            return
        }
        let cfg = loadJsonConfig('portal-browser-sync.json', filePath);
        if (cfg) loadAppConfig(cfg, pkgDir, serveStaticMap, watchedFiles);
    });

    let serveStatic = [];

    _.forEach(serveStaticMap, (value, key) => {
        serveStatic.push({route: key, dir: value});
    });

    config.files = watchedFiles;
    config.serveStatic = serveStatic;
}

gulp.task('browsersync', () => {
    let toProxy = (argv['proxied-host'] || 'localhost') + ':' + (argv['proxied-port'] || 8080);

    let config = {
        proxy: toProxy,
        startPath: "/web/portal",
        open: 'external',
        ghostMode: false,
        reloadDebounce: 500
    };

    if (argv.tunnel) config.tunnel = argv.tunnel;
    if (common.port) config.port = common.port;

    loadApps('..', config);

    browserSync.init(config);
});
