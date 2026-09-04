#!/usr/bin/env bash
ENABLE_GS=${ENABLE_GS:-false}
if [ "$ENABLE_GS" = "true" ]; then
  gsExclusion=""
else
  gsExclusion="*-gs-nonprod.json"
fi

if [ -z "$gsExclusion" ] && [ -z "$EXCLUDE" ]; then
  fullExclusion=""
elif [ -z "$EXCLUDE" ]; then
  fullExclusion="${gsExclusion}"
elif [ -z "$gsExclusion" ]; then
  fullExclusion="${EXCLUDE}"
else
  fullExclusion="${EXCLUDE},${gsExclusion}"
fi

if [ "$ENABLE_GS" = "true" ]; then
  publishGSEvent="Y"
  outputFile="../definitions/consented/xlsx/ccd-config-${FR_ENV:-base}-consented-gs-${GIT_COMMIT:-base}.xlsx"
else
  publishGSEvent="N"
  outputFile="../definitions/consented/xlsx/ccd-config-${FR_ENV:-base}-consented-${GIT_COMMIT:-base}.xlsx"
fi

echo "Creating definition for ENABLE_GS = '${ENABLE_GS}' flag with value CCD_DEF_PUBLISH = ${publishGSEvent}"

pushd ccd-definition-processor && \
  CCD_DEF_CASE_TYPE_ID=FinancialRemedyMVP2 \
  CCD_DEF_PUBLISH=${publishGSEvent:-N} \
  yarn --cwd ccd-definition-processor json2xlsx \
  -D ../definitions/consented/json \
  -e ${fullExclusion} \
  -o ${outputFile} && \
popd
