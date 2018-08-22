#!/bin/bash

package=$1
if [ ! -d node_modules/$package ]; then
  yarn add --ignore-engines $package
fi
