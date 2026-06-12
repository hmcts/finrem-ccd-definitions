#!/usr/bin/env bash

set -euo pipefail

workspace=${1:?Workspace path is required}
requested_bpmn_dir=${2:-}
basedir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
microservice=${WA_CAMUNDA_S2S_MICROSERVICE:-finrem_case_orchestration}
s2s_secret=${WA_CAMUNDA_S2S_SECRET:-${FINREM_CASE_ORCHESTRATION_SERVICE_S2S_KEY:-}}
camunda_base_url=${CAMUNDA_BASE_URL:-http://localhost:9404}

if [[ -n "${requested_bpmn_dir}" && -d "${requested_bpmn_dir}" ]]; then
  bpmn_filepath=$(realpath "${requested_bpmn_dir}")
else
  bpmn_filepath=$(realpath "${workspace}/resources" 2>/dev/null || true)
fi

if [[ -z "${bpmn_filepath}" || ! -d "${bpmn_filepath}" ]]; then
  echo "No BPMN source directory found. Skipping WA BPMN import."
  exit 0
fi

if ! find "${bpmn_filepath}" -name '*.bpmn' | grep -q .; then
  echo "No BPMN files found under ${bpmn_filepath}. Skipping WA BPMN import."
  exit 0
fi

if [[ -z "${s2s_secret}" ]]; then
  echo "WA_CAMUNDA_S2S_SECRET or FINREM_CASE_ORCHESTRATION_SERVICE_S2S_KEY is required for BPMN import." >&2
  exit 1
fi

one_time_password=$("${basedir}/../utils/generate-s2s-otp.sh" "${s2s_secret}")
service_token=$("${basedir}/../utils/idam-lease-service-token.sh" "${microservice}" "${one_time_password}")

find "${bpmn_filepath}" -name '*.bpmn' -print0 | while IFS= read -r -d '' file; do
  upload_response=$(curl --insecure --silent --show-error --fail-with-body -w "\n%{http_code}" -X POST \
    "${camunda_base_url}/engine-rest/deployment/create" \
    -H "Accept: application/json" \
    -H "ServiceAuthorization: Bearer ${service_token}" \
    -F "deployment-name=$(date +"%Y%m%d-%H%M%S")-$(basename "${file}")" \
    -F "file=@${file}")

  upload_http_code=$(echo "${upload_response}" | tail -n 1)
  upload_response_content=$(echo "${upload_response}" | sed '$d')

  if [[ "${upload_http_code}" == '200' ]]; then
    echo "$(basename "${file}") uploaded successfully (${upload_response_content})"
  else
    echo "$(basename "${file}") upload failed with http code ${upload_http_code} and response (${upload_response_content})" >&2
    exit 1
  fi
done
