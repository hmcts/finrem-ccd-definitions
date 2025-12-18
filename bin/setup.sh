#!/usr/bin/env bash
git submodule update --init --recursive && pushd ccd-definition-processor/ && YARN_ENABLE_IMMUTABLE_INSTALLS=false yarn install && popd

# Resolve directory of this script (works with symlinks)
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
node "${SCRIPT_DIR}/setup-precommit-hooks.mjs"