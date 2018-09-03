#!/bin/bash

timeout 20 ./node_modules/.bin/semantic-release pre || true
