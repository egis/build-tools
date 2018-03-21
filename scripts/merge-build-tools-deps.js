#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var join = path.join;

var dst = fs.readFileSync('package.json');
var dstJson = JSON.parse(dst);
var srcPath = join(__dirname, '..', '/package.json');
var src = fs.readFileSync(srcPath);
var srcJson = JSON.parse(src);
dstJson.devDependencies = Object.assign({}, srcJson.devDependencies, dstJson.devDependencies);
dstJson.dependencies = Object.assign({}, srcJson.dependencies, dstJson.dependencies);
fs.writeFileSync('package.json', JSON.stringify(dstJson), 'utf8');
