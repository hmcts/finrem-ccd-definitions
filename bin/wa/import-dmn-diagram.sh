#!/usr/bin/env bash

set -euo pipefail

workspace=${1:?Workspace path is required}
tenant_id=${2:-financial-remedy}
product=${3:-finrem}
requested_dmn_dir=${4:-camunda}
basedir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
microservice=${WA_CAMUNDA_S2S_MICROSERVICE:-finrem_case_orchestration}
s2s_secret=${WA_CAMUNDA_S2S_SECRET:-${FINREM_CASE_ORCHESTRATION_SERVICE_S2S_KEY:-}}
camunda_base_url=${CAMUNDA_BASE_URL:-http://localhost:9404}

dmn_source="${requested_dmn_dir}"
if [[ ! -d "${dmn_source}" ]]; then
  dmn_source="${workspace}/${requested_dmn_dir}"
fi

dmn_filepath=$(realpath "${dmn_source}" 2>/dev/null || true)

if [[ -z "${dmn_filepath}" || ! -d "${dmn_filepath}" ]]; then
  echo "No DMN source directory found. Skipping WA DMN import."
  exit 0
fi

if ! find "${dmn_filepath}" -name '*.dmn' | grep -q .; then
  echo "No DMN files found under ${dmn_filepath}. Skipping WA DMN import."
  exit 0
fi

if [[ -z "${s2s_secret}" ]]; then
  echo "WA_CAMUNDA_S2S_SECRET or FINREM_CASE_ORCHESTRATION_SERVICE_S2S_KEY is required for DMN import." >&2
  exit 1
fi

one_time_password=$("${basedir}/../utils/generate-s2s-otp.sh" "${s2s_secret}")
service_token=$("${basedir}/../utils/idam-lease-service-token.sh" "${microservice}" "${one_time_password}")

find "${dmn_filepath}" -name '*.dmn' -print0 | while IFS= read -r -d '' file; do
  upload_response=$(curl --insecure --silent --show-error --fail-with-body -w "\n%{http_code}" -X POST \
    "${camunda_base_url}/engine-rest/deployment/create" \
    -H "Accept: application/json" \
    -H "ServiceAuthorization: Bearer ${service_token}" \
    -F "deployment-name=$(basename "${file}")" \
    -F 'deploy-changed-only=true' \
    -F "deployment-source=${product}" \
    -F "tenant-id=${tenant_id}" \
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
