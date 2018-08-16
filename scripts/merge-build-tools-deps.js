#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var join = path.join;

var dst = fs.readFileSync('package.json');
var dstJson = JSON.parse(dst);
var srcPath = join(__dirname, '..', '/package.json');
var src = fs.readFileSync(srcPath);
var srcJson = JSON.parse(src);
let exact = srcJson.version;
let current = dstJson.devDependencies['@egis/build-tools'];
dstJson.devDependencies = Object.assign({}, srcJson.devDependencies, dstJson.devDependencies);
if (!exact.includes('semantic') && current !== exact) {
    console.log(`Fixing @egis/build-tools version from ${current}` +
        ` to ${exact} to avoid incompatibilities`);
    dstJson.devDependencies = Object.assign(dstJson.devDependencies, {"@egis/build-tools": exact});
}
dstJson.dependencies = Object.assign({}, srcJson.dependencies, dstJson.dependencies);
fs.writeFileSync('package.json', JSON.stringify(dstJson), 'utf8');
