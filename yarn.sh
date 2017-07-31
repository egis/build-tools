#!/bin/bash
cp package.json package.json.bak
cp yarn.lock yarn.lock.bak
cp node_modules/@egis/build-tools/package.json .
cp node_modules/@egis/build-tools/yarn.lock .
yarn
mv package.json.bak package.json
(mv yarn.lock.bak yarn.lock) || true
