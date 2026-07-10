#!/usr/bin/env bash

set -euo pipefail

ZAP_IMAGE="${ZAP_IMAGE:-ghcr.io/zaproxy/zaproxy:stable}"
ZAP_CONTAINER_NAME="${ZAP_CONTAINER_NAME:-finrem-zap-${BUILD_NUMBER:-local}}"
ZAP_PORT="${ZAP_PORT:-8080}"
ZAP_REPORT_DIR="${ZAP_REPORT_DIR:-zap-reports}"
ZAP_API_URL="http://127.0.0.1:${ZAP_PORT}"
ZAP_PROXY_URL="${ZAP_PROXY_URL:-http://127.0.0.1:${ZAP_PORT}}"

mkdir -p "${ZAP_REPORT_DIR}"

cleanup() {
  docker logs "${ZAP_CONTAINER_NAME}" \
    > "${ZAP_REPORT_DIR}/zap-container.log" 2>&1 || true

  docker rm -f "${ZAP_CONTAINER_NAME}" >/dev/null 2>&1 || true
}

trap cleanup EXIT

echo "Starting OWASP ZAP..."

docker run --detach \
  --name "${ZAP_CONTAINER_NAME}" \
  --publish "${ZAP_PORT}:8080" \
  --volume "$(pwd)/${ZAP_REPORT_DIR}:/zap/wrk:rw" \
  "${ZAP_IMAGE}" \
  zap.sh \
  -daemon \
  -host 0.0.0.0 \
  -port 8080 \
  -config api.disablekey=true \
  -config api.addrs.addr.name=.* \
  -config api.addrs.addr.regex=true

echo "Waiting for ZAP API..."

ready=false

for attempt in $(seq 1 60); do
  if curl --silent --fail \
    "${ZAP_API_URL}/JSON/core/view/version/" >/dev/null; then
    ready=true
    break
  fi

  sleep 2
done

if [[ "${ready}" != "true" ]]; then
  echo "ZAP did not become ready."
  exit 1
fi

echo "Running Playwright smoke tests through ZAP..."

export ZAP_PROXY_URL

playwright_exit_code=0
yarn test:zap-smoke || playwright_exit_code=$?

echo "Waiting for ZAP passive scan to complete..."

for attempt in $(seq 1 120); do
  remaining=$(
    curl --silent \
      "${ZAP_API_URL}/JSON/pscan/view/recordsToScan/" |
      sed -E 's/.*"recordsToScan":"?([0-9]+)"?.*/\1/'
  )

  if [[ "${remaining}" == "0" ]]; then
    break
  fi

  echo "ZAP passive scan records remaining: ${remaining}"
  sleep 2
done

echo "Generating ZAP reports..."

curl --silent --fail \
  "${ZAP_API_URL}/OTHER/core/other/htmlreport/" \
  --output "${ZAP_REPORT_DIR}/zap-report.html"

curl --silent --fail \
  "${ZAP_API_URL}/OTHER/core/other/jsonreport/" \
  --output "${ZAP_REPORT_DIR}/zap-report.json"

curl --silent --fail \
  "${ZAP_API_URL}/OTHER/core/other/xmlreport/" \
  --output "${ZAP_REPORT_DIR}/zap-report.xml"

if [[ "${playwright_exit_code}" -ne 0 ]]; then
  echo "Playwright smoke tests failed with exit code ${playwright_exit_code}."
  exit "${playwright_exit_code}"
fi

echo "Playwright ZAP smoke test completed."