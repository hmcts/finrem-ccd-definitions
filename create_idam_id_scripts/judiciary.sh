#!/bin/bash
#
# Creates the WA judge test users listed in judiciary_request.json.
#
#   add    (default) - log in as each judge; judges that can log in are left untouched
#                      (another pipeline may be using them). Judges that can't log in
#                      (expired, missing, broken) are recreated. This is what pipelines run.
#   update           - delete and recreate every judge (to reset roles or passwords).
#                      Manual use only: it logs out any pipeline using these judges.

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"

# shellcheck source=idam_common.sh
source "${SCRIPT_DIR}/idam_common.sh"

if [[ $# -lt 2 || $# -gt 3 ]]; then
    echo "Usage: $0 <environment> <password> [add|update]"
    echo "Example: $0 aat MySecurePassword123"
    exit 1
fi

ENVIRONMENT="$1"
PASSWORD="$2"
ACTION="${3:-add}"

if [[ "$ACTION" != "add" && "$ACTION" != "update" ]]; then
    echo "Invalid action: $ACTION (supported: add, update)"
    exit 1
fi

INPUT_FILE="${SCRIPT_DIR}/judiciary_request.json"
OUTPUT_FILE="${SCRIPT_DIR}/judiciary_response.json"

# Judges are created and deleted through the legacy accounts API, as before.
BASE_URL="https://idam-api.${ENVIRONMENT}.platform.hmcts.net/testing-support/accounts"

if [ ! -f "$INPUT_FILE" ]; then
    echo "Input file not found: $INPUT_FILE"
    exit 1
fi

if ! command -v jq >/dev/null 2>&1; then
    echo "jq is required but not installed."
    exit 1
fi

IDS=()

delete_judge() {
    local email="$1"
    local status

    status=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE \
        "${BASE_URL}/${email}" \
        -H "accept: */*")

    echo "Delete status: ${status}"
}

# Prints the created user's id, or nothing if the create failed.
create_judge() {
    local user_json="$1"
    local response

    user_json=$(echo "$user_json" | jq --arg pw "$PASSWORD" '.password = $pw')

    response=$(curl -s \
        --location "$BASE_URL" \
        --proto '=https' \
        --proto-redir '=https' \
        --header "Content-Type: application/json" \
        --data-raw "$user_json")

    echo "$response" | jq -r '.id // empty' 2>/dev/null || true
}

# Creates a judge that can't log in. Only deletes when the create fails and the
# judge still can't log in, i.e. IDAM holds an old, unusable record for them.
recreate_judge() {
    local user_json="$1"
    local email="$2"
    local user_id="$3"
    local id

    id=$(create_judge "$user_json")

    if [[ -z "$id" ]]; then
        if idam_can_log_in "$ENVIRONMENT" "$email" "$PASSWORD"; then
            # Another pipeline recreated it between our login check and this call.
            echo "Recreated by another pipeline, can log in now"
            IDS+=("$user_id")
            return
        fi

        echo "Old record exists but can't log in: deleting and recreating..."
        delete_judge "$email"
        id=$(create_judge "$user_json")
    fi

    if [[ -n "$id" ]] && idam_can_log_in "$ENVIRONMENT" "$email" "$PASSWORD"; then
        echo "Created user successfully, login verified"
        echo "User ID: $id"
        IDS+=("$id")
    else
        echo "Failed: $email still can't log in after recreating"
        echo
    fi
}

echo "Using environment: $ENVIRONMENT (action: $ACTION)"
echo "Base URL: $BASE_URL"
echo

# The client secret is needed for the login check.
get_client_secret

while IFS= read -r USER_JSON
do
    EMAIL=$(echo "$USER_JSON" | jq -r '.email')
    USER_ID=$(echo "$USER_JSON" | jq -r '.id')

    echo "=================================================="
    echo "Processing: $EMAIL ($USER_ID)"

    if [[ "$ACTION" == "update" ]]; then
        echo "Updating user (delete + recreate)..."
        delete_judge "$EMAIL"
        recreate_judge "$USER_JSON" "$EMAIL" "$USER_ID"
    elif idam_can_log_in "$ENVIRONMENT" "$EMAIL" "$PASSWORD"; then
        echo "Can log in, leaving untouched"
        IDS+=("$USER_ID")
    else
        echo "Can't log in (expired or missing), recreating..."
        recreate_judge "$USER_JSON" "$EMAIL" "$USER_ID"
    fi

done < <(jq -c '.[]' "$INPUT_FILE")

if [[ ${#IDS[@]} -gt 0 ]]; then
    printf '%s\n' "${IDS[@]}" | jq -R . | jq -s . > "$OUTPUT_FILE"
else
    echo "[]" > "$OUTPUT_FILE"
fi

echo
echo "=================================================="
echo "Completed"
echo "Judges that can log in: ${#IDS[@]}"
echo "Output file: $OUTPUT_FILE"
