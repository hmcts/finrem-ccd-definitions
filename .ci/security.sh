#!/usr/bin/env bash

set -euo pipefail

REPORT_DIR="/zap/wrk"
OUTPUT_DIR="${WORKSPACE:-$(pwd)}/functional-output"

REPORT_HTML="activescan.html"
REPORT_JSON="report.json"

RUNNING_ENV="${RUNNING_ENV:-aat}"

case "${RUNNING_ENV}" in
  aat)
    TARGET_URL="https://manage-case.aat.platform.hmcts.net"
    ;;
  demo)
    TARGET_URL="https://manage-case.demo.platform.hmcts.net"
    ;;
  pr-*)
    TARGET_URL="https://manage-case.aat.platform.hmcts.net"
    ;;
  *)
    echo "Unsupported RUNNING_ENV: ${RUNNING_ENV}"
    exit 1
    ;;
esac

echo "Running OWASP ZAP baseline scan"
echo "Environment: ${RUNNING_ENV}"
echo "Target: ${TARGET_URL}"

mkdir -p "${REPORT_DIR}"
mkdir -p "${OUTPUT_DIR}"

zap-baseline.py \
  -t "${TARGET_URL}" \
  -r "${REPORT_HTML}" \
  -J "${REPORT_JSON}" \
  -I \
  -s \
  -z "-config globalexcludeurl.url_list.url\\(0\\).regex='^https?:\\/\\/.*\\/(?:.*login.*)+$'"

HTML_REPORT="${REPORT_DIR}/${REPORT_HTML}"
JSON_REPORT="${REPORT_DIR}/${REPORT_JSON}"

if [[ ! -f "${HTML_REPORT}" ]]; then
  echo "ZAP HTML report was not generated: ${HTML_REPORT}"
  exit 1
fi

if [[ ! -f "${JSON_REPORT}" ]]; then
  echo "ZAP JSON report was not generated: ${JSON_REPORT}"
  exit 1
fi

cp "${HTML_REPORT}" "${OUTPUT_DIR}/${REPORT_HTML}"
cp "${JSON_REPORT}" "${OUTPUT_DIR}/${REPORT_JSON}"

echo "ZAP baseline scan completed"
echo "Reports copied to ${OUTPUT_DIR}"