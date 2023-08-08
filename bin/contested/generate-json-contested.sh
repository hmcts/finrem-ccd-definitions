#!/usr/bin/env bash
node ./ccd-definition-processor/bin/xlsx2json -D definitions/contested/json -i definitions/contested/xlsx/ccd-config-base-contested.xlsx && pretty-quick --pattern 'definitions/**/json/**.json'
