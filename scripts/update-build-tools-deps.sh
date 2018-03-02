#!/bin/bash

cp package.json package.json.bak
BASEDIR=$(dirname "$0")
node $BASEDIR/merge-build-tools-deps.js
if [[ "$YARN_LOCATION" == "" ]]; then
    test -f node_modules/.bin/yarn && YARN_LOCATION=node_modules/.bin
    test -f node_modules/@egis/build-tools/node_modules/.bin/yarn && YARN_LOCATION=node_modules/@egis/build-tools/node_modules/.bin
fi
$YARN_LOCATION/yarn --ignore-engines
rc=$?
if [[ "$KEEP_MODIFIED_PACKAGE" != 'true' ]]; then
    mv package.json.bak package.json
fi
exit $rc
