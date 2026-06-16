#!/usr/bin/env bash

set -euo pipefail

username=${1:?IDAM username is required}
password=${2:?IDAM password is required}
idam_uri=${IDAM_API_URL_BASE:-https://idam-api.aat.platform.hmcts.net}
redirect_uri=${CCD_IDAM_REDIRECT_URL:-http://localhost:3451/oauth2redirect}
client_id=ccd_gateway
client_secret=${CCD_API_GATEWAY_IDAM_CLIENT_SECRET:-${CCD_API_GATEWAY_OAUTH2_CLIENT_SECRET:-ccd_gateway_secret}}
scope=openid%20profile%20roles

curl --silent --show-error --fail \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -X POST "${idam_uri}/o/token?grant_type=password&redirect_uri=${redirect_uri}&client_id=${client_id}&client_secret=${client_secret}&username=${username}&password=${password}&scope=${scope}" \
  -d '' | jq -r '.access_token'
