#!/bin/bash

mkdir build
CIRCLE_PR_NUMBER="" CIRCLE_PR_REPONAME="" CIRCLE_PR_USERNAME="" CIRCLE_PULL_REQUEST="" CIRCLE_PULL_REQUESTS="" CI_PULL_REQUEST="" CI_PULL_REQUESTS="" CIRCLE_BRANCH="master" yarn semantic-release --dry-run > build/semantic-dry.out || true
cat build/semantic-dry.out
perl -ne 'print "$1\n" if /The next release version is (.*)$/' build/semantic-dry.out > build/.version
VERSION=$(cat build/.version)
if [ "${VERSION}" == "" ]; then
    echo "Semantic version isn't generated - please investigate"
    exit -1
fi
cat build/.version
