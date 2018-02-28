#!/bin/bash

cp package.json package.json.bak
BASEDIR=$(dirname "$0")
node $BASEDIR/merge-build-tools-deps.js
yarn add yarn@1.5.1 && node_modules/.bin/yarn --ignore-engines
if [[ "$KEEP_MODIFIED_PACKAGE" != 'true' ]]; then
    mv package.json.bak package.json
fi
