#!/bin/bash

package=$1
if [ ! -d node_modules/$package ]; then
  yarn add $package
fi
