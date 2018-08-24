#!/usr/bin/env node

function exactBuildToolsVersion(dstJson, srcJson) {
    let exact = srcJson.version;
    let currenter = (key) => dstJson[key] && dstJson[key]['@egis/build-tools'];
    let targetKey = 'dependencies';
    let current = currenter(targetKey);
    if (!current) {
        targetKey = 'devDependencies';
        current = currenter(targetKey);
    }
    if (!exact.includes('semantic') && current !== exact) {
        console.log(`Fixing @egis/build-tools version from ${current}` +
            ` to ${exact} in ${targetKey} to avoid incompatibilities`);
        if (current) {
            dstJson[targetKey] = Object.assign(dstJson[targetKey], {"@egis/build-tools": exact});
        }
    }
}

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
exactBuildToolsVersion(dstJson, srcJson);
fs.writeFileSync('package.json', JSON.stringify(dstJson), 'utf8');
