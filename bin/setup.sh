#!/usr/bin/env bash
git submodule update --init --recursive && pushd ccd-definition-processor/ && CI=true yarn install && popd