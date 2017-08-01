#!/usr/bin/env node

const fs = require('fs');

let dst = fs.readFileSync('package.json');
let dstJson = JSON.parse(dst);
let srcPath = __dirname  + '/package.json';
let src = fs.readFileSync(srcPath);
let srcJson = JSON.parse(src);
dstJson.devDependencies = Object.assign(srcJson.devDependencies, dstJson.devDependencies);
fs.writeFileSync('package.json', JSON.stringify(dstJson), 'utf8');
