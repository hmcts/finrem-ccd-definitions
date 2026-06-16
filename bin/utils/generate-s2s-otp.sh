#!/usr/bin/env bash

set -euo pipefail

secret=${1:?S2S secret is required}

if command -v oathtool >/dev/null 2>&1; then
  oathtool --totp -b "${secret}"
  exit 0
fi

if command -v docker >/dev/null 2>&1; then
  docker run --rm hmctsprod.azurecr.io/imported/toolbelt/oathtool --totp -b "${secret}"
  exit 0
fi

echo "Neither oathtool nor docker is available to generate an S2S one-time password." >&2
exit 1
