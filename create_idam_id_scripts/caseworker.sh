#!/usr/bin/env bash
#
# Creates the WA caseworker test users listed in caseworker_request.json.
#
#   add    - log in as each user; users that can log in are left untouched (another
#            pipeline may be using them). Users that can't log in (expired, missing,
#            broken) are recreated. This is what pipelines run.
#   update - delete and recreate every user (to reset roles or passwords).
#            Manual use only: it logs out any pipeline currently using these users.

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
USERS_FILE="${SCRIPT_DIR}/caseworker_request.json"
OUTPUT_FILE="${SCRIPT_DIR}/caseworker_response.json"

# shellcheck source=idam_common.sh
source "${SCRIPT_DIR}/idam_common.sh"

ENVIRONMENT="${1:-}"
ACTION="${2:-}"
PASSWORD="${3:-}"

if [[ -z "$ENVIRONMENT" || -z "$ACTION" || -z "$PASSWORD" ]]; then
    echo "Usage: $0 <env> <add|update> <password>"
    exit 1
fi

if [[ "$ACTION" != "add" && "$ACTION" != "update" ]]; then
    echo "❌ Invalid action: $ACTION"
    echo "   Supported actions: add, update"
    exit 1
fi

RESULT_IDS="[]"

record_id() {
    RESULT_IDS=$(echo "$RESULT_IDS" | jq --arg id "$1" '. += [$id]')
}

# Usage: post_user <payload>. Prints the HTTP status of the create call.
post_user() {
    local payload="$1"
    local final_payload response status

    final_payload=$(echo "$payload" | jq --arg pw "$PASSWORD" '.password = $pw')

    response=$(curl -s -w "\n%{http_code}" -X POST \
        "https://idam-testing-support-api.${ENVIRONMENT}.platform.hmcts.net/test/idam/users" \
        -H "Authorization: Bearer ${TOKEN}" \
        -H "Content-Type: application/json" \
        -d "${final_payload}")

    status=$(echo "$response" | tail -n1)

    if [[ "$status" != "201" && "$status" != "409" ]]; then
        echo "  ❌ Create returned HTTP $status" >&2
        echo "$response" | sed '$d' >&2
    fi

    echo "$status"
}

# Creates a user that can't log in. Only deletes when IDAM still holds an old,
# unusable record for it (create returns 409 and the login still fails).
recreate_user() {
    local payload="$1"
    local email="$2"
    local userId="$3"
    local status

    status=$(post_user "$payload")

    if [[ "$status" == "409" ]]; then
        if idam_can_log_in "$ENVIRONMENT" "$email" "$PASSWORD"; then
            # Another pipeline recreated it between our login check and this call.
            echo "  ✓ Recreated by another pipeline, can log in now"
            record_id "$userId"
            return
        fi

        echo "  ▶ Old record exists but can't log in: deleting and recreating..."
        idam_delete_user_by_id "$ENVIRONMENT" "$TOKEN" "$userId"
        status=$(post_user "$payload")
    fi

    if [[ "$status" == "201" || "$status" == "409" ]] \
        && idam_can_log_in "$ENVIRONMENT" "$email" "$PASSWORD"; then
        echo "  ✓ User created, login verified → $userId"
        record_id "$userId"
    else
        echo "  ❌ User still can't log in after recreating → $email"
    fi
}

require_access_token "$ENVIRONMENT"

echo ""
echo "▶ Processing users from: $USERS_FILE (action: $ACTION)"

while read -r user; do

    payload=$(echo "$user" | jq -c '.payload')
    email=$(echo "$user" | jq -r '.payload.user.email')
    userId=$(echo "$user" | jq -r '.payload.user.id')

    echo "----------------------------------------"
    echo "▶ User: $email ($userId)"

    if [[ "$ACTION" == "update" ]]; then
        echo "  ▶ Updating user (delete + recreate)..."
        idam_delete_user_by_id "$ENVIRONMENT" "$TOKEN" "$userId"
        recreate_user "$payload" "$email" "$userId"
    elif idam_can_log_in "$ENVIRONMENT" "$email" "$PASSWORD"; then
        echo "  ✓ Can log in, leaving untouched"
        record_id "$userId"
    else
        echo "  ▶ Can't log in (expired or missing), recreating..."
        recreate_user "$payload" "$email" "$userId"
    fi

done < <(jq -c '.[]' "$USERS_FILE")

echo "$RESULT_IDS" | jq . > "$OUTPUT_FILE"

echo ""
echo "========================================"
echo "▶ IDs of users that can log in written to $OUTPUT_FILE"
echo "========================================"

cat "$OUTPUT_FILE"
