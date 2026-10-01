#!/usr/bin/env bash
ENABLE_WA=${ENABLE_WA:-false}
ENABLE_GS=${ENABLE_GS:-false}

VARIANT_FLAGS=""

if [ "$ENABLE_WA" = "true" ]; then
  VARIANT_FLAGS="-wa"
fi

if [ "$ENABLE_GS" = "true" ]; then
  VARIANT_FLAGS="${VARIANT_FLAGS}-gs"
fi

echo "Copying definitions file with VARIANT_FLAGS = '${VARIANT_FLAGS}'."

cp -R definitions/consented/xlsx/ccd-config-preview-consented${VARIANT_FLAGS}-${GIT_COMMIT:-base}.xlsx src/test/resources/ccd_definition