#!/bin/bash

timeout 20 yarn semantic-release --dry-run > semantic-dry.out || true
cat semantic-dry.out
