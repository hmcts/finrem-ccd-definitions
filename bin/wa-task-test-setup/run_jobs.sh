#!/usr/bin/env bash

set -euo pipefail

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd "${script_dir}"

environment="${1:?Usage: ./run_jobs.sh <environment>}"

echo "Running caseworker.sh..."

./caseworker.sh \
  "${environment}" \
  "1tCA59sk1N8aytRa99sXTEHSXTHG8YHNdOCZCI6DTc2jfU9WbXjb7nB3JGYVYAno" \
  add

echo "Running Judicary.sh..."

./Judicary.sh "${environment}"

echo "Test users created successfully."