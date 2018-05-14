#!/bin/bash

if [ "${CIRCLE_PROJECT_USERNAME}" == "egis" ] && [ "${CIRCLE_BRANCH}" == "master" ]; then
    node_modules/.bin/semantic-release pre || true
    npm publish || true
    node_modules/.bin/semantic-release post || true
fi
