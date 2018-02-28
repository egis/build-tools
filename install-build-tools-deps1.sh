#!/bin/bash

BASEDIR=$(dirname "$0")
YARN_LOCATION=node_modules/$CURRENT_MODULE_NAME/node_modules/.bin $BASEDIR/install-build-tools-deps.sh
