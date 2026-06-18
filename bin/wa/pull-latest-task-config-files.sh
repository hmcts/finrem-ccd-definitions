#!/usr/bin/env bash

set -euo pipefail

repo_url=${1:-}
branch_name=${2:-master}
target_dir=${3:-camunda}

if [[ -z "${repo_url}" ]]; then
  echo "WA task configuration repository not configured. Skipping DMN source pull."
  exit 0
fi

clone_dir=$(mktemp -d)

cleanup() {
  rm -rf "${clone_dir}"
}

trap cleanup EXIT

echo "Pulling WA task configuration resources from ${repo_url} (${branch_name})"
git clone --depth 1 --branch "${branch_name}" "${repo_url}" "${clone_dir}"

rm -rf "${target_dir}"
mkdir -p "${target_dir}"

if [[ -d "${clone_dir}/src/main/resources/dmn" ]]; then
  cp -R "${clone_dir}/src/main/resources/dmn/." "${target_dir}/"
elif find "${clone_dir}/src/main/resources" -maxdepth 1 -name '*.dmn' | grep -q .; then
  find "${clone_dir}/src/main/resources" -maxdepth 1 -name '*.dmn' -exec cp {} "${target_dir}/" \;
else
  echo "No DMN resources found in ${repo_url}."
fi
