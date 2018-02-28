#!/bin/bash

BASEDIR=$(dirname "$0")
SKIP_YARN_INSTALL=true YARN_LOCATION=node_modules/$CURRENT_MODULE_NAME/node_modules/.bin $BASEDIR/install-build-tools-deps.sh
