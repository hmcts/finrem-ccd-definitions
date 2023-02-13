#!/usr/bin/env bash
git submodule update --init --recursive && pushd ccd-definition-processor/ && YARN_ENABLE_IMMUTABLE_INSTALLS=false yarn install && popd