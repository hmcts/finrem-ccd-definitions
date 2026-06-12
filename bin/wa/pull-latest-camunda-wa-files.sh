#!/usr/bin/env bash

set -euo pipefail

branch_name=${1:-master}
repo_url=${WA_TASK_BPMN_REPO_URL:-https://github.com/hmcts/wa-standalone-task-bpmn.git}
clone_dir=$(mktemp -d)

cleanup() {
  rm -rf "${clone_dir}"
}

trap cleanup EXIT

echo "Pulling WA task BPMN resources from ${repo_url} (${branch_name})"
git clone --depth 1 --branch "${branch_name}" "${repo_url}" "${clone_dir}"

rm -rf ./resources
mkdir -p ./resources
cp -R "${clone_dir}/src/main/resources/." ./resources/
