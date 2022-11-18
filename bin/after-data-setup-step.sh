#!/usr/bin/env bash

mv $(pwd)/src/test/resources/ccd_definition/keepme ./
rm -rf $(pwd)/src/test/resources/ccd_definition/* 2>/dev/null
mv ./keepme $(pwd)/src/test/resources/ccd_definition/
