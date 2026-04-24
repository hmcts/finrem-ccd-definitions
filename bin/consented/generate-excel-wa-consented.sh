#!/usr/bin/env bash
set -eu

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"
staged_dir="${ROOT_DIR}/target/staged-json"

# clean and create staging dir
rm -rf "${staged_dir}"
mkdir -p "${staged_dir}"

# copy consented + WA definitions into staging dir
cp -R "${ROOT_DIR}/definitions/consented/json/." "${staged_dir}/"
cp -R "${ROOT_DIR}/definitions/workAllocation/." "${staged_dir}/"

# run json2xlsx against the merged staging dir
pushd ccd-definition-processor && \
  CCD_DEF_CASE_TYPE_ID=FinancialRemedyMVP2 \
  yarn --cwd ccd-definition-processor json2xlsx \
  -D "${staged_dir}" \
  -e ${EXCLUDE} \
  -o ../definitions/consented/xlsx/ccd-config-${FR_ENV:-base}-consented-${GIT_COMMIT:-base}.xlsx && \
popd