#!/usr/bin/env bash
pushd ccd-definition-processor && CCD_DEF_CASE_TYPE_ID=FinancialRemedyMVP2 yarn --cwd ccd-definition-processor json2xlsx -D ../definitions/consented/json -e ${EXCLUDE} -o ../definitions/consented/xlsx/ccd-config-${FR_ENV:-base}-consented-${GIT_COMMIT:-base}.xlsx && popd
