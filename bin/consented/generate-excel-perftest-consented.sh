#!/usr/bin/env bash

source default.env
FR_ENV=perftest CCD_DEF_COS_URL=$npm_package_config_perftest_cosUrl CCD_DEF_CCD_URL=$npm_package_config_perftest_ccdUrl CCD_DEF_AAC_URL=$npm_package_config_perftest_aacUrl EXCLUDE='*-prod.json' yarn run generate-excel-consented