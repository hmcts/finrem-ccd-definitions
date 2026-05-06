#!/usr/bin/env bash
WA_ENABLED=${WA_ENABLED:-false}
if [ "$WA_ENABLED" = "true" ]; then
  waExclusion=""
else
    waExclusion="*-wa.json"
fi

if [ -z "$waExclusion" ]; then
  fullExclusion="${EXCLUDE}"
else
  fullExclusion="${EXCLUDE},${waExclusion}"
fi
pushd ccd-definition-processor && \
  CCD_DEF_CASE_TYPE_ID=FinancialRemedyMVP2 \
  CCD_DEF_PUBLISH=${CCD_DEF_PUBLISH:-N} \
  yarn --cwd ccd-definition-processor json2xlsx \
  -D ../definitions/consented/json \
  -e ${fullExclusion} \
  -o ../definitions/consented/xlsx/ccd-config-${FR_ENV:-base}-consented-${GIT_COMMIT:-base}.xlsx && \
popd
