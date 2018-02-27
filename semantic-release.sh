#!/bin/bash

node_modules/condition-circle/refs.sh && (npm publish || true) && node_modules/.bin/semantic-release post
