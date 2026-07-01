#!/usr/bin/env bash
#
# Creates Finrem WA org mappings for the users listed in
# aat-caseworker-user-ids.json. Jenkins runs this after WA preview install so
# the PR AM org-role-mapping service has users available for task testing.

set -euo pipefail

basedir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
user_ids_file="${basedir}/aat-caseworker-user-ids.json"
org_role_mapping_url=${ORG_ROLE_MAPPING_URL:-}

if [[ -z "${org_role_mapping_url}" && -n "${CHANGE_ID:-}" ]]; then
  org_role_mapping_url="https://am-org-role-mapping-service-finrem-ccd-definitions-pr-${CHANGE_ID}.preview.platform.hmcts.net"
fi

if [[ -z "${org_role_mapping_url}" ]]; then
  echo "ORG_ROLE_MAPPING_URL or CHANGE_ID is required." >&2
  exit 1
fi

if [[ ! -f "${user_ids_file}" ]]; then
  echo "User ID file ${user_ids_file} not found." >&2
  exit 1
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required." >&2
  exit 1
fi

idam_admin_username=${IDAM_DATA_STORE_SYSTEM_USER_USERNAME:?IDAM_DATA_STORE_SYSTEM_USER_USERNAME is required}
idam_admin_password=${IDAM_DATA_STORE_SYSTEM_USER_PASSWORD:?IDAM_DATA_STORE_SYSTEM_USER_PASSWORD is required}

idam_token=$("${basedir}/../utils/idam-lease-user-token.sh" "${idam_admin_username}" "${idam_admin_password}")
s2s_token=$("${basedir}/../s2s-token.sh" am_org_role_mapping_service)

if [[ -z "${idam_token}" || -z "${s2s_token}" ]]; then
  echo "IDAM token and S2S token are required." >&2
  exit 1
fi

response_file=$(mktemp)
trap 'rm -f "${response_file}"' EXIT

create_org_mappings() {
  local json_key=$1
  local user_type=$2

  local user_count
  user_count=$(jq --arg key "${json_key}" '(.[$key] // []) | length' "${user_ids_file}")

  if [[ "${user_count}" -eq 0 ]]; then
    echo "No ${json_key} users found. Skipping."
    return
  fi

  local payload
  payload=$(jq -c --arg key "${json_key}" '{userIds: (.[$key] // [])}' "${user_ids_file}")

  local url="${org_role_mapping_url}/am/testing-support/createOrgMapping?userType=${user_type}"

  echo "Creating WA org mappings for ${user_count} ${user_type} user(s)."

  status_code=$(curl \
    --silent \
    --show-error \
    --output "${response_file}" \
    --write-out "%{http_code}" \
    --request POST "${url}" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer ${idam_token}" \
    -H "ServiceAuthorization: ${s2s_token}" \
    -d "${payload}") || {
      curl_exit=$?
      echo "WA org mapping setup request failed with curl exit code ${curl_exit}." >&2
      exit "${curl_exit}"
    }

  case "${status_code}" in
    2*)
      echo "WA org mappings created successfully for ${user_type}."
      ;;
    404)
      if grep -Eiq "Caseworker data could not be found|User details.*found in RD" "${response_file}"; then
        echo "Skipping WA org mapping setup because the configured ${user_type} user(s) were not found in RD."
        cat "${response_file}"
      else
        echo "WA org mapping setup failed with HTTP ${status_code}." >&2
        cat "${response_file}" >&2
        exit 1
      fi
      ;;
    *)
      echo "WA org mapping setup failed with HTTP ${status_code}." >&2
      cat "${response_file}" >&2
      exit 1
      ;;
  esac
}

create_org_mappings caseworker CASEWORKER
create_org_mappings judicial JUDICIAL