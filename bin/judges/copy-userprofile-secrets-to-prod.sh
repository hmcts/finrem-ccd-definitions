#!/bin/bash

set -euo pipefail

SOURCE_VAULT="finrem-aat"
TARGET_VAULT="finrem-prod"

for i in {1..6}; do
  SECRET_NAME="userprofile-consented-judgedetails-$i"

  echo "Processing $SECRET_NAME..."

  # Do not overwrite an existing Prod secret
  if az keyvault secret show \
      --vault-name "$TARGET_VAULT" \
      --name "$SECRET_NAME" \
      --query id \
      -o tsv >/dev/null 2>&1; then
    echo "$SECRET_NAME already exists in $TARGET_VAULT - skipping"
    continue
  fi

  SECRET_VALUE=$(az keyvault secret show \
      --vault-name "$SOURCE_VAULT" \
      --name "$SECRET_NAME" \
      --query value \
      -o tsv)

  az keyvault secret set \
      --vault-name "$TARGET_VAULT" \
      --name "$SECRET_NAME" \
      --value "$SECRET_VALUE" \
      >/dev/null

  echo "Copied $SECRET_NAME to $TARGET_VAULT"
done

echo "Done"
