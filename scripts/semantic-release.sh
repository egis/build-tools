#!/bin/bash

if [ "${CIRCLE_PROJECT_USERNAME}" == "egis" ] && [ "${CIRCLE_BRANCH}" == "master" ]; then
    node_modules/.bin/semantic-release pre || true
    ((cat package.json | jq '.version' | grep -v semantic) && npm publish) || true
    node_modules/.bin/semantic-release post || true
    if [ "${SEMANTIC_DEPENDENTS_UPDATES}" == "true" ]; then
        node_modules/.bin/semantic-dependents-updates-github || true
    fi
fi
