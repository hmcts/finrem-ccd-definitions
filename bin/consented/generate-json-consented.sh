#!/usr/bin/env bash
node ./ccd-definition-processor/bin/xlsx2json -D definitions/consented/json -i definitions/consented/xlsx/ccd-config-base-consented.xlsx && pretty-quick --pattern 'definitions/**/json/**.json'
