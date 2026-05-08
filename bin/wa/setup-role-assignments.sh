#!/usr/bin/env bash

set -euo pipefail

config_file=${1:-"$(dirname "$0")/role-assignments.json"}
basedir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"

if [[ ! -f "${config_file}" ]]; then
  echo "Role assignment config ${config_file} not found. Skipping WA role assignments."
  exit 0
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required to parse ${config_file}." >&2
  exit 1
fi

entries=$(jq 'length' "${config_file}")
if [[ "${entries}" == "0" ]]; then
  echo "No WA role assignment entries configured in ${config_file}. Skipping."
  exit 0
fi

for index in $(seq 0 $((entries - 1))); do
  username_env=$(jq -r ".[$index].usernameEnv" "${config_file}")
  password_env=$(jq -r ".[$index].passwordEnv" "${config_file}")
  role_classification=$(jq -r ".[$index].roleClassification // \"PUBLIC\"" "${config_file}")
  role_name=$(jq -r ".[$index].roleName" "${config_file}")
  role_attributes=$(jq -c ".[$index].roleAttributes // {\"jurisdiction\":\"DIVORCE\"}" "${config_file}")
  role_category=$(jq -r ".[$index].roleCategory // \"ADMIN\"" "${config_file}")
  authorisations=$(jq -c ".[$index].authorisations // null" "${config_file}")
  grant_type=$(jq -r ".[$index].grantType // \"STANDARD\"" "${config_file}")

  username=${!username_env:-}
  password=${!password_env:-}

  if [[ -z "${username}" || -z "${password}" ]]; then
    echo "Skipping entry ${index}: ${username_env}/${password_env} is not available."
    continue
  fi

  "${basedir}/organisational-role-assignment.sh" \
    "${username}" \
    "${password}" \
    "${role_classification}" \
    "${role_name}" \
    "${role_attributes}" \
    "${role_category}" \
    "${authorisations}" \
    "${grant_type}"
done
