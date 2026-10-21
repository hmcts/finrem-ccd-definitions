#!/usr/bin/env bash

set -euo pipefail

user_token=${1:?User token is required}
idam_oidc_base_url=${IDAM_OIDC_URL_BASE:-https://idam-web-public.aat.platform.hmcts.net}

curl --silent --show-error --fail \
  -X GET "${idam_oidc_base_url}/o/userinfo" \
  -H "accept: application/json" \
  -H "authorization: Bearer ${user_token}" | jq -r '.uid'

