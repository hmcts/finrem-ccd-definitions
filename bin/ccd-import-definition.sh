#!/bin/bash
## Usage: ./ccd-import-definition.sh path_to_definition
##
## Import the given definition in CCD's definition store.
##
## Prerequisites:
##  - Microservice `ccd_gw` must be authorised to call service `ccd-definition-store-api`

if [ -z "$1" ]
  then
    echo "Usage: ./ccd-import-definition.sh path_to_definition"
    exit 1
elif [ ! -f "$1" ]
  then
    echo "File not found: $1"
    exit 1
fi

binFolder=$(dirname "$0")

userToken="$(${binFolder}/utils/idam-user-token.sh)"

echo "$userToken"

serviceToken="$(${binFolder}/utils/lease-service-token.sh ccd_admin)"

curl -k -S --silent \
  https://ccd-definition-store-finrem-ccd-definitions-pr-679.service.core-compute-preview.internal/import \
  -H "Authorization: Bearer ${userToken}" \
  -H "ServiceAuthorization: ${serviceToken}" \
  -F file="@$1" \
  -w "\n"
