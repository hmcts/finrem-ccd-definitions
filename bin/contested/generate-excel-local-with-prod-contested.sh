#!/usr/bin/env bash

source default.env
FR_ENV=local CCD_DEF_COS_URL=$npm_package_config_local_cosUrl CCD_DEF_AAC_URL=$npm_package_config_local_aacUrl CCD_DEF_CCD_URL=$npm_package_config_local_ccdUrl EXCLUDE='*-prod.json' yarn run generate-excel-contested
