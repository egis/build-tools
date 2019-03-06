#!/bin/bash

mkdir build
yarn semantic-release --dry-run > build/semantic-dry.out || true
cat build/semantic-dry.out
perl -ne 'print "$1\n" if /The next release version is (.*)$/' build/semantic-dry.out > build/.version
cat build/.version
