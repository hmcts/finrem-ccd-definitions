#!/usr/bin/env bash
git submodule update --init --recursive && pushd ccd-definition-processor/ && yarn install && popd