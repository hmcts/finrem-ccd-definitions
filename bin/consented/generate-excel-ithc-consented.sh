#!/usr/bin/env bash

source default.env
FR_ENV=ithc CCD_DEF_COS_URL=$npm_package_config_ithc_cosUrl CCD_DEF_CCD_URL=$npm_package_config_ithc_ccdUrl CCD_DEF_AAC_URL=$npm_package_config_ithc_aacUrl EXCLUDE='*-prod.json' yarn run generate-excel-consented