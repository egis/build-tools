#!/bin/bash

cp package.json package.json.bak
BASEDIR=$(dirname "$0")
echo "hello from install-build-tools-deps: $BASEDIR"
node node_modules/@egis/build-tools/merge-build-tools-deps.js
yarn
mv package.json.bak package.json
