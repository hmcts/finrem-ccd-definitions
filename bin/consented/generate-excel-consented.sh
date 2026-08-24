#!/usr/bin/env bash
ENABLE_WA=${ENABLE_WA:-false}
if [ "$ENABLE_WA" = "true" ]; then
  waExclusion=""
else
  waExclusion="*-wa-nonprod.json"
fi

if [ -z "$waExclusion" ] && [ -z "$EXCLUDE" ]; then
  fullExclusion=""
elif [ -z "$EXCLUDE" ]; then
  fullExclusion="${waExclusion}"
elif [ -z "$waExclusion" ]; then
  fullExclusion="${EXCLUDE}"
else
  fullExclusion="${EXCLUDE},${waExclusion}"
fi

if [ "$ENABLE_WA" = "true" ]; then
  publishWAEvent = "Y"
  outputFile="../definitions/consented/xlsx/ccd-config-${FR_ENV:-base}-consented-wa-${GIT_COMMIT:-base}.xlsx"
else
  publishWAEvent = "N"
  outputFile="../definitions/consented/xlsx/ccd-config-${FR_ENV:-base}-consented-${GIT_COMMIT:-base}.xlsx"
fi

echo "Creating definition for $ENABLE_WA = '${ENABLE_WA}' flag with value CCD_DEF_PUBLISH = ${publishWAEvent}"

pushd ccd-definition-processor && \
  CCD_DEF_CASE_TYPE_ID=FinancialRemedyMVP2 \
  CCD_DEF_PUBLISH=${publishWAEvent} \
  yarn --cwd ccd-definition-processor json2xlsx \
  -D ../definitions/consented/json \
  -e ${fullExclusion} \
  -o ${outputFile} && \
popd
