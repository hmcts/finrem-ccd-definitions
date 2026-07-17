#!/usr/bin/env bash

set -euo pipefail

echo "Running OWASP ZAP baseline scan"

REPORT_DIR="/zap/wrk"
OUTPUT_DIR="/zap/wrk/functional-output"

REPORT_HTML="activescan.html"
REPORT_JSON_RAW="report-full.json"
REPORT_JSON="report.json"

RULES_FILE="/zap/wrk/zap/zap-rules.conf"

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

echo "Environment: ${RUNNING_ENV}"
echo "Target: ${TARGET_URL}"

if [[ ! -f "${RULES_FILE}" ]]; then
  echo "ZAP rules file was not found: ${RULES_FILE}"
  exit 1
fi

echo "Using ZAP rules file:"
cat "${RULES_FILE}"

mkdir -p "${OUTPUT_DIR}"

RAW_JSON_REPORT="${REPORT_DIR}/${REPORT_JSON_RAW}"
FILTERED_JSON_REPORT="${REPORT_DIR}/${REPORT_JSON}"
HTML_REPORT="${REPORT_DIR}/${REPORT_HTML}"

set +e

zap-baseline.py \
  -t "${TARGET_URL}" \
  -c "${RULES_FILE}" \
  -r "${REPORT_HTML}" \
  -J "${REPORT_JSON_RAW}" \
  -I \
  -s \
  -z "-config globalexcludeurl.url_list.url\\(0\\).regex='.*login\\.microsoftonline\\.com.*' \
      -config globalexcludeurl.url_list.url\\(1\\).regex='.*launchdarkly\\.com.*' \
      -config globalexcludeurl.url_list.url\\(2\\).regex='.*google-analytics\\.com.*' \
      -config globalexcludeurl.url_list.url\\(3\\).regex='.*googletagmanager\\.com.*'"

ZAP_EXIT_CODE=$?

set -e

echo "ZAP baseline command exited with code: ${ZAP_EXIT_CODE}"

if [[ "${ZAP_EXIT_CODE}" -ne 0 && "${ZAP_EXIT_CODE}" -ne 2 ]]; then
  echo "ZAP scan failed because of an execution error."
  exit "${ZAP_EXIT_CODE}"
fi

if [[ ! -f "${HTML_REPORT}" ]]; then
  echo "ZAP HTML report was not generated: ${HTML_REPORT}"
  exit 1
fi

if [[ ! -f "${RAW_JSON_REPORT}" ]]; then
  echo "ZAP JSON report was not generated: ${RAW_JSON_REPORT}"
  exit 1
fi

echo "Creating Jenkins report without medium-severity findings"

jq '
  .site |= map(
    .alerts |= map(
      select(((.riskcode // "0") | tostring) != "2")
    )
  )
' "${RAW_JSON_REPORT}" > "${FILTERED_JSON_REPORT}"

if [[ ! -s "${FILTERED_JSON_REPORT}" ]]; then
  echo "Filtered ZAP report was not created correctly."
  exit 1
fi

cp "${HTML_REPORT}" "${OUTPUT_DIR}/${REPORT_HTML}"
cp "${RAW_JSON_REPORT}" "${OUTPUT_DIR}/${REPORT_JSON_RAW}"
cp "${FILTERED_JSON_REPORT}" "${OUTPUT_DIR}/${REPORT_JSON}"

chmod -R a+rwX "${OUTPUT_DIR}"
chmod a+rw "${HTML_REPORT}" "${RAW_JSON_REPORT}" "${FILTERED_JSON_REPORT}"

echo "ZAP baseline scan completed"
echo "Full HTML report: ${OUTPUT_DIR}/${REPORT_HTML}"
echo "Full JSON report: ${OUTPUT_DIR}/${REPORT_JSON_RAW}"
echo "Jenkins-filtered JSON report: ${OUTPUT_DIR}/${REPORT_JSON}"