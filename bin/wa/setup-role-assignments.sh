#!/usr/bin/env bash

set -euo pipefail

basedir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
user_type=${1:-CASEWORKER}
org_role_mapping_url=${ORG_ROLE_MAPPING_URL:-}

if [[ -z "${org_role_mapping_url}" && -n "${CHANGE_ID:-}" ]]; then
  org_role_mapping_url="https://am-org-role-mapping-service-finrem-ccd-definitions-pr-${CHANGE_ID}.preview.platform.hmcts.net"
fi

if [[ -z "${org_role_mapping_url}" ]]; then
  echo "ORG_ROLE_MAPPING_URL or CHANGE_ID is required." >&2
  exit 1
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required to build the org mapping request." >&2
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

user_ids=()
for credential_pair in \
  USERNAME_CASEWORKER:PASSWORD_CASEWORKER \
  USERNAME_SUPERCASEWORKER:PASSWORD_SUPERCASEWORKER
do
  username_env=${credential_pair%%:*}
  password_env=${credential_pair##*:}
  username=${!username_env:-}
  password=${!password_env:-}

  if [[ -z "${username}" || -z "${password}" ]]; then
    echo "Skipping ${username_env}/${password_env}: credentials are not available."
    continue
  fi

  user_token=$("${basedir}/../utils/idam-lease-user-token.sh" "${username}" "${password}")
  user_id=$("${basedir}/../utils/idam-user-id.sh" "${user_token}")

  if [[ -n "${user_id}" && "${user_id}" != "null" ]]; then
    user_ids+=("${user_id}")
  fi
done

if [[ "${#user_ids[@]}" -eq 0 ]]; then
  echo "No Finrem caseworker user IDs found for WA org mapping." >&2
  exit 1
fi

payload=$(printf '%s\n' "${user_ids[@]}" | jq -R . | jq -s '{userIds: .}')
url="${org_role_mapping_url}/am/testing-support/createOrgMapping?userType=${user_type}"

echo "Creating WA org mappings for ${#user_ids[@]} ${user_type} user(s)."
curl --silent --show-error --fail "${url}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${idam_token}" \
  -H "ServiceAuthorization: ${s2s_token}" \
  -d "${payload}"
