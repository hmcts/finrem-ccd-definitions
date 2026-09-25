#!/usr/bin/env bash
ENABLE_WA=${ENABLE_WA:-false}
ENABLE_GS=${ENABLE_GS:-false}

if [ "$ENABLE_WA" = "true" ]; then
  waExclusion=""
  publishWAEvent="Y"
else
  waExclusion="*-wa-nonprod.json"
  publishWAEvent="N"
fi

if [ "$ENABLE_GS" = "true" ]; then
  gsExclusion=""
else
  gsExclusion="*-gs-nonprod.json"
fi

fullExclusionArray=()
if [ -n "$EXCLUDE" ]; then
  fullExclusionArray+=("${EXCLUDE}")
fi

if [ -n "$waExclusion" ]; then
  fullExclusionArray+=("${waExclusion}")
fi

if [ -n "$gsExclusion" ]; then
  fullExclusionArray+=("${gsExclusion}")
fi

fullExclusion=$(IFS=","; echo "${fullExclusionArray[*]}")

if [ "$ENABLE_WA" = "true" ] && [ "$ENABLE_GS" = "true" ]; then
  outputFile="../definitions/consented/xlsx/ccd-config-${FR_ENV:-base}-consented-wa-gs-${GIT_COMMIT:-base}.xlsx"
elif [ "$ENABLE_WA" = "true" ]; then
  outputFile="../definitions/consented/xlsx/ccd-config-${FR_ENV:-base}-consented-wa-${GIT_COMMIT:-base}.xlsx"
elif [ "$ENABLE_GS" = "true" ]; then
  outputFile="../definitions/consented/xlsx/ccd-config-${FR_ENV:-base}-consented-gs-${GIT_COMMIT:-base}.xlsx"
else
  outputFile="../definitions/consented/xlsx/ccd-config-${FR_ENV:-base}-consented-${GIT_COMMIT:-base}.xlsx"
fi

echo "fullExclusion = ${fullExclusion}"
echo "outputFile = ${outputFile}"

echo "Creating definition for ENABLE_WA = '${ENABLE_WA}' flag with value CCD_DEF_PUBLISH = ${publishWAEvent}"

pushd ccd-definition-processor && \
  CCD_DEF_CASE_TYPE_ID=FinancialRemedyMVP2 \
  CCD_DEF_PUBLISH=${publishWAEvent:-N} \
  yarn --cwd ccd-definition-processor json2xlsx \
  -D ../definitions/consented/json \
  -e ${fullExclusion} \
  -o ${outputFile} && \
popd
