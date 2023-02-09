#!/usr/bin/env bash

source default.env
FR_ENV=prod CCD_DEF_COS_URL=$npm_package_config_prod_cosUrl CCD_DEF_CCD_URL=$npm_package_config_prod_ccdUrl CCD_DEF_AAC_URL=$npm_package_config_prod_aacUrl EXCLUDE='*-nonprod.json' yarn run generate-excel-consented