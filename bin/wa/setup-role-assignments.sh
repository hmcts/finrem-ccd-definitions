#!/usr/bin/env bash
#
# Creates Finrem WA org mappings for AAT caseworker user IDs listed in
# aat-caseworker-user-ids.json. Jenkins runs this after WA preview install so
# the PR AM org-role-mapping service has users available for task testing.

set -euo pipefail

basedir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
user_ids_file=${1:-"${basedir}/aat-caseworker-user-ids.json"}
user_type=${2:-CASEWORKER}
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
  echo "jq is required to validate ${user_ids_file}." >&2
  exit 1
fi

if ! jq -e '.userIds | type == "array" and length > 0' "${user_ids_file}" >/dev/null; then
  echo "User ID file ${user_ids_file} must contain a non-empty userIds array." >&2
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

payload=$(jq -c '{userIds: .userIds}' "${user_ids_file}")
user_count=$(jq '.userIds | length' "${user_ids_file}")
url="${org_role_mapping_url}/am/testing-support/createOrgMapping?userType=${user_type}"

echo "Creating WA org mappings for ${user_count} ${user_type} user(s) from ${user_ids_file}."
curl --silent --show-error --fail "${url}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${idam_token}" \
  -H "ServiceAuthorization: ${s2s_token}" \
  -d "${payload}"
