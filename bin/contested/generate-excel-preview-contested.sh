#!/usr/bin/env bash

source default.env
FR_ENV=preview CCD_DEF_COS_URL=$COS_API_URL CCD_DEF_CCD_URL=$CCD_DATA_API_URL CCD_DEF_AAC_URL=$AAC_API_URL EXCLUDE='*-prod.json' yarn run generate-excel-contested