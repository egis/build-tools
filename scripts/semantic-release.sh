#!/bin/bash

if [ "${CIRCLE_PROJECT_USERNAME}" == "egis" ] && [ "${CIRCLE_BRANCH}" == "master" ]; then
    yarn semantic-release --dry-run > semantic-dry.out || true
    cat semantic-dry.out
    grep "Published release" semantic-dry.out && (yarn semantic-release || true)
    if [ "${SEMANTIC_DEPENDENTS_UPDATES}" == "true" ]; then
        node_modules/.bin/semantic-dependents-updates-github || true
    fi
fi
