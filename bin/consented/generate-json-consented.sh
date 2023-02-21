#!/usr/bin/env bash
pushd ccd-definition-processor xlsx2json -D ../definitions/consented/json -i ../definitions/consented/xlsx/ccd-config-base-consented.xlsx && popd && pretty-quick --pattern 'definitions/**/json/**.json'
