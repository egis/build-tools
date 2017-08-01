#!/bin/bash
cp package.json package.json.bak
merge-build-tools-deps
yarn
mv package.json.bak package.json
