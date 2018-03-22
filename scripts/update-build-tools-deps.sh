#!/bin/bash

if [ "$KEEP_MODIFIED_PACKAGE" != 'true' ]; then
    cp package.json package.json.bak
fi
merge-build-tools-deps
yarn --ignore-engines
rc=$?

if [ "$KEEP_MODIFIED_PACKAGE" != 'true' ]; then
    mv package.json.bak package.json
fi
exit $rc
