#!/usr/bin/env bash
pushd ccd-definition-processor xlsx2json -D ../definitions/contested/json -i ../definitions/contested/xlsx/ccd-config-base-contested.xlsx && popd && pretty-quick --pattern 'definitions/**/json/**.json'
