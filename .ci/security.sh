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

echo "Checking ZAP rules file"
ls -la /zap/wrk/zap
cat /zap/wrk/zap/zap-rules.conf

zap-baseline.py \
  -t "${TARGET_URL}" \
  -c "/zap/wrk/zap/zap-rules.conf" \
  -r "${REPORT_HTML}" \
  -J "${REPORT_JSON}" \
  -I \
  -s \
  -z "-config globalexcludeurl.url_list.url\\(0\\).regex='^https?:\\/\\/.*\\/(?:.*login.*)+$'"

HTML_REPORT="${REPORT_DIR}/${REPORT_HTML}"
RAW_JSON_REPORT="${REPORT_DIR}/${REPORT_JSON_RAW}"
JSON_REPORT="${REPORT_DIR}/${REPORT_JSON}"

if [[ ! -f "${HTML_REPORT}" ]]; then
  echo "ZAP HTML report was not generated: ${HTML_REPORT}"
  exit 1
fi

if [[ ! -f "${RAW_JSON_REPORT}" ]]; then
  echo "ZAP JSON report was not generated: ${RAW_JSON_REPORT}"
  exit 1
fi

echo "Creating Jenkins report without medium findings"

jq '
  .site |= map(
    .alerts |= map(
      select(((.riskcode // "0") | tostring) != "2")
    )
  )
' "${RAW_JSON_REPORT}" > "${JSON_REPORT}"

cp "${HTML_REPORT}" "${OUTPUT_DIR}/${REPORT_HTML}"
cp "${RAW_JSON_REPORT}" "${OUTPUT_DIR}/${REPORT_JSON_RAW}"
cp "${JSON_REPORT}" "${OUTPUT_DIR}/${REPORT_JSON}"

chown -R 1001:1002 \
  "${HTML_REPORT}" \
  "${RAW_JSON_REPORT}" \
  "${JSON_REPORT}" \
  "${OUTPUT_DIR}"

echo "ZAP baseline scan completed"
echo "Full reports copied to ${OUTPUT_DIR}"