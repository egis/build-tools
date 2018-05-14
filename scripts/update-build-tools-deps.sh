#!/bin/bash

if [ "$KEEP_MODIFIED_PACKAGE" != 'true' ]; then
    cp package.json package.json.bak
fi
BASEDIR=$(dirname "$0")
if [ -e "$BASEDIR/merge-build-tools-deps.js" ] ; then
    node $BASEDIR/merge-build-tools-deps.js
else
    node $BASEDIR/merge-build-tools-deps
fi
yarn --ignore-engines
rc=$?

if [ "$KEEP_MODIFIED_PACKAGE" != 'true' ]; then
    mv package.json.bak package.json
fi
exit $rc
