#!/bin/bash

grep "version\"\:" node_modules/*/*/package.json > $OUT_DIR/npm_versions.txt
grep "version\"\:" node_modules/*/package.json >> $OUT_DIR/npm_versions.txt
grep "version\"\:" node_modules/*/*/*/package.json >> $OUT_DIR/npm_versions.txt
([ -d bower_components ] && grep "version\"\:" bower_components/*/.bower.json > $OUT_DIR/bower_versions.txt) || echo no bower
