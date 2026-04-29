#!/usr/bin/env bash
WA_ENABLED=${WA_ENABLED:-false}

if [ "$WA_ENABLED" = "true" ]; then
  waExclusion="*-nonWA*"
else
  waExclusion="*-WA-*"
fi

fullExclusion="${EXCLUDE},${waExclusion}"

pushd ccd-definition-processor && \
  CCD_DEF_CASE_TYPE_ID=FinancialRemedyMVP2 \
  CCD_DEF_PUBLISH=${CCD_DEF_PUBLISH:-N} \
  yarn --cwd ccd-definition-processor json2xlsx \
  -D ../definitions/consented/json \
  -e ${fullExclusion} \
  -o ../definitions/consented/xlsx/ccd-config-${FR_ENV:-base}-consented-${GIT_COMMIT:-base}.xlsx && \
popd