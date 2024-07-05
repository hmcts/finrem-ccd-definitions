#!/usr/bin/env bash

source default.env
FR_ENV=local CCD_DEF_COS_URL=http://localhost:9000 CCD_DEF_AAC_URL=http://localhost:4454 CCD_DEF_CCD_URL=$npm_package_config_local_ccdUrl EXCLUDE='*-prod.json' yarn run generate-excel-contested
