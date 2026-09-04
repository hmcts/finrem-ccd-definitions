#!/usr/bin/env bash
#
# Pulls Finrem WA task configuration DMN files into a local import directory.
# Jenkins runs this before DMN import so the preview Camunda deployment uses
# the latest task configuration from the configured task-configuration repo.

set -euo pipefail

repo_url=${1:-}
pr_number=${2:-}
branch_name=${3:-master}
target_dir=${4:-camunda}

if [[ -z "${repo_url}" ]]; then
  echo "WA task configuration repository not configured. Skipping DMN source pull."
  exit 0
fi

clone_dir=$(mktemp -d)

cleanup() {
  rm -rf "${clone_dir}"
}

trap cleanup EXIT

git -C "${clone_dir}" init
git -C "${clone_dir}" remote add origin "${repo_url}"

if [[ -n "${pr_number}" ]] && git -C "${clone_dir}" fetch --depth 1 origin "pull/${pr_number}/head"; then
    echo "Pulling WA task configuration from ${repo_url}, PR number ${pr_number}."
    git -C "${clone_dir}" checkout -q FETCH_HEAD
else
    echo "Pulling WA task configuration resources from ${repo_url}, branch: (${branch_name})"
    git -C "${clone_dir}" fetch --depth 1 origin ${branch_name}
    git -C "${clone_dir}" checkout ${branch_name}
fi

rm -rf "${target_dir}"
mkdir -p "${target_dir}"

if [[ -d "${clone_dir}/src/main/resources/dmn" ]]; then
  cp -R "${clone_dir}/src/main/resources/dmn/." "${target_dir}/"
elif find "${clone_dir}/src/main/resources" -maxdepth 1 -name '*.dmn' | grep -q .; then
  find "${clone_dir}/src/main/resources" -maxdepth 1 -name '*.dmn' -exec cp {} "${target_dir}/" \;
else
  echo "No DMN resources found in ${repo_url}."
fi
