#!/usr/bin/env bash

set -euo pipefail

username=${1:?Username is required}
password=${2:?Password is required}
role_classification=${3:-PUBLIC}
role_name=${4:?Role name is required}
role_attributes=${5:-'{"jurisdiction":"DIVORCE"}'}
role_category=${6:-ADMIN}
authorisations=${7:-null}
grant_type=${8:-STANDARD}
basedir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"

if [[ -z "${ROLE_ASSIGNMENT_URL:-}" ]]; then
  echo "ROLE_ASSIGNMENT_URL is required." >&2
  exit 1
fi

if [[ -z "${API_GATEWAY_S2S_KEY:-}" ]]; then
  echo "API_GATEWAY_S2S_KEY is required." >&2
  exit 1
fi

user_token=$("${basedir}/../utils/idam-lease-user-token.sh" "${username}" "${password}")
user_id=$("${basedir}/../utils/idam-user-id.sh" "${user_token}")
one_time_password=$("${basedir}/../utils/generate-s2s-otp.sh" "${API_GATEWAY_S2S_KEY}")
service_token=$("${basedir}/../utils/idam-lease-service-token.sh" ccd_gw "${one_time_password}")

curl --silent --show-error --fail -X POST "${ROLE_ASSIGNMENT_URL}/am/role-assignments" \
  -H "accept: application/vnd.uk.gov.hmcts.role-assignment-service.create-assignments+json;charset=UTF-8;version=1.0" \
  -H "Authorization: Bearer ${user_token}" \
  -H "ServiceAuthorization: Bearer ${service_token}" \
  -H "Content-Type: application/json" \
  -d '{ "roleRequest": {
          "assignerId": "'"${user_id}"'",
          "process": "staff-organisational-role-mapping",
          "reference": "'"${user_id}/${role_name}"'",
          "replaceExisting": true,
          "byPassOrgDroolRule": true
        },
        "requestedRoles": [
          {
            "actorIdType": "IDAM",
            "actorId": "'"${user_id}"'",
            "roleType": "ORGANISATION",
            "roleName": "'"${role_name}"'",
            "classification": "'"${role_classification}"'",
            "grantType": "'"${grant_type}"'",
            "roleCategory": "'"${role_category}"'",
            "readOnly": false,
            "attributes": '"${role_attributes}"',
            "authorisations": '"${authorisations}"'
          }
        ]
      }'
