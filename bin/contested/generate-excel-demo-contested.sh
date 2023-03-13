#!/usr/bin/env bash

source default.env
FR_ENV=demo CCD_DEF_COS_URL=$npm_package_config_demo_cosUrl CCD_DEF_CCD_URL=$npm_package_config_demo_ccdUrl CCD_DEF_AAC_URL=$npm_package_config_demo_aacUrl EXCLUDE='*-prod.json' yarn run generate-excel-contested