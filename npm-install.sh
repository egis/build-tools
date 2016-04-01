#!/bin/bash
cp package.json package.json.bak
cp node_modules/@egis/build-tools/package.json .
npm install --unsafe-perm
mv package.json.bak package.json