#ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
#source "${ROOT_DIR}/default.env"
#
#if [ "${1:-}" = "no-wa" ]; then
#  FR_ENV=preview CCD_DEF_COS_URL=$COS_API_URL CCD_DEF_CCD_URL=$CCD_DATA_API_URL CCD_DEF_AAC_URL=$AAC_API_URL EXCLUDE='*-prod.json' yarn run generate-excel-consented
#else
#  FR_ENV=preview CCD_DEF_COS_URL=$COS_API_URL CCD_DEF_CCD_URL=$CCD_DATA_API_URL CCD_DEF_AAC_URL=$AAC_API_URL EXCLUDE='*-prod.json' yarn run generate-excel-wa-consented
#fi

#!usr/bin/env
WA_ENABLED=true CCD_DEF_PUBLISH=Y FR_ENV=aat ... EXCLUDE='*-prod.json' yarn run generate-excel-consented