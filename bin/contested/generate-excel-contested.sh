#!/usr/bin/env bash
CCD_DEF_CASE_TYPE_ID=FinancialRemedyContested && pushd ccd-definition-processor && yarn --cwd ccd-definition-processor json2xlsx -D ../definitions/contested/json -e ${EXCLUDE} -o ../definitions/contested/xlsx/ccd-config-${FR_ENV:-base}-contested-${GIT_COMMIT:-base}.xlsx && popd
