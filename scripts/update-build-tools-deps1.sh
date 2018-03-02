#!/bin/bash

BASEDIR=$(dirname "$0")
YARN_LOCATION=node_modules/$CURRENT_MODULE_NAME/node_modules/.bin $BASEDIR/update-build-tools-deps.sh
