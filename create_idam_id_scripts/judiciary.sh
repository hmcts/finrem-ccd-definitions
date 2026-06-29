#!/bin/bash

set -euo pipefail

# Validate arguments
if [ $# -ne 1 ]; then
    echo "Usage: $0 <environment>"
    echo "Example: $0 aat"
    echo "Example: $0 perftest"
    exit 1
fi

ENVIRONMENT="$1"

INPUT_FILE="judiciary_request.json"
OUTPUT_FILE="judiciary_response.json"

BASE_URL="https://idam-api.${ENVIRONMENT}.platform.hmcts.net/testing-support/accounts"

# Verify input file exists
if [ ! -f "$INPUT_FILE" ]; then
    echo "Input file not found: $INPUT_FILE"
    exit 1
fi

# Verify jq is installed
if ! command -v jq >/dev/null 2>&1; then
    echo "jq is required but not installed."
    exit 1
fi

IDS=()

echo "Using environment: $ENVIRONMENT"
echo "Base URL: $BASE_URL"
echo

while IFS= read -r USER_JSON
do
    EMAIL=$(echo "$USER_JSON" | jq -r '.email')

    echo "=================================================="
    echo "Processing: $EMAIL"

    # Delete existing user
    DELETE_STATUS=$(curl -s \
        -o /dev/null \
        -w "%{http_code}" \
        -X DELETE \
        "${BASE_URL}/${EMAIL}" \
        -H "accept: */*")

    echo "Delete status: ${DELETE_STATUS}"

    # Create user
    RESPONSE=$(curl -s \
        --location "$BASE_URL" \
        --proto '=https' \
        --proto-redir '=https' \
        --header "Content-Type: application/json" \
        --data-raw "$USER_JSON")

    ID=$(echo "$RESPONSE" | jq -r '.id // empty')

    if [[ -z "$ID" ]]; then
        echo "Failed to create user: $EMAIL"
        echo "Response:"
        echo "$RESPONSE"
        echo
        continue
    fi

    echo "Created user successfully"
    echo "User ID: $ID"

    IDS+=("$ID")

done < <(jq -c '.[]' "$INPUT_FILE")

# Write IDs as JSON array
printf '%s\n' "${IDS[@]}" | jq -R . | jq -s . > "$OUTPUT_FILE"

echo
echo "=================================================="
echo "Completed"
echo "Users created: ${#IDS[@]}"
echo "Output file: $OUTPUT_FILE"