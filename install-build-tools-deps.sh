#!/bin/bash

cp package.json package.json.bak
BASEDIR=$(dirname "$0")
node $BASEDIR/merge-build-tools-deps.js
if [[ "$SKIP_YARN_INSTALL" != 'true' ]]; then
    npm install yarn@1.5.1
    $YARN_LOCATION=node_modules/.bin
fi
$YARN_LOCATION/yarn --ignore-engines
if [[ "$KEEP_MODIFIED_PACKAGE" != 'true' ]]; then
    mv package.json.bak package.json
fi
