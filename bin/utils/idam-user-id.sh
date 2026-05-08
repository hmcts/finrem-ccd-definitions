#!/usr/bin/env bash

set -euo pipefail

user_token=${1:?User token is required}
idam_api_base_url=${IDAM_API_URL_BASE:-https://idam-api.aat.platform.hmcts.net}

curl --silent --show-error --fail \
  -X GET "${idam_api_base_url}/details" \
  -H "accept: application/json" \
  -H "authorization: Bearer ${user_token}" | jq -r '.id'
