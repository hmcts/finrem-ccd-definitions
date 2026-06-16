#!/usr/bin/env bash

set -euo pipefail

microservice=${1:?Microservice name is required}
one_time_password=${2:?One-time password is required}

"$(dirname "$0")/../s2s-token.sh" "${microservice}" "${one_time_password}"
