#!/usr/bin/env bash

set -euo pipefail

microservice=${1:?Microservice name is required}
one_time_password=${2:-}
s2s_url_base=${S2S_URL_BASE:-http://rpe-service-auth-provider-aat.service.core-compute-aat.internal}
lease_path=/testing-support/lease

if [[ "${ENV:-aat}" == "prod" ]]; then
  lease_path=/lease
fi

payload=$(printf '{"microservice":"%s"' "${microservice}")
if [[ -n "${one_time_password}" ]]; then
  payload=$(printf '%s,"oneTimePassword":"%s"' "${payload}" "${one_time_password}")
fi
payload="${payload}}"

curl --insecure --fail --show-error --silent -X POST \
  "${s2s_url_base}${lease_path}" \
  -H "Content-Type: application/json" \
  -d "${payload}"
