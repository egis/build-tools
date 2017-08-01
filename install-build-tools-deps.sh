#!/bin/bash

echo "hello from install-build-tools-deps"
cp package.json package.json.bak
npm run merge-build-tools-deps
yarn
mv package.json.bak package.json
