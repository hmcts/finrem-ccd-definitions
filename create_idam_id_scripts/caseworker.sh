#!/usr/bin/env bash

set -euo pipefail

USERS_FILE="caseworker_request.json"

ENVIRONMENT="${1:-}"
ACTION="${2:-}"

# Azure Key Vault configuration
KEYVAULT_NAME="finrem-aat"
SECRET_NAME="finrem-idam-client-secret"

if [[ -z "$ENVIRONMENT" || -z "$ACTION" ]]; then
    echo "Usage: ./idam_batch.sh <env> <add|update>"
    exit 1
fi

RESULT_IDS="[]"

###############################################
# AZURE FUNCTIONS
###############################################

ensure_azure_login() {
    if ! az account show >/dev/null 2>&1; then
        echo "Logging into Azure..."
        az login
    fi
}

get_client_secret() {
    ensure_azure_login

    CLIENT_SECRET=$(az keyvault secret show \
        --vault-name "$KEYVAULT_NAME" \
        --name "$SECRET_NAME" \
        --query value \
        -o tsv)

    [[ -n "$CLIENT_SECRET" ]] || {
        echo "Failed to retrieve client secret."
        exit 1
    }
}

###############################################
# IDAM FUNCTIONS
###############################################

get_access_token() {
    curl -s -X POST \
        "https://idam-web-public.${ENVIRONMENT}.platform.hmcts.net/o/token" \
        -H "Content-Type: application/x-www-form-urlencoded" \
        -d "grant_type=client_credentials" \
        -d "client_id=finrem" \
        -d "client_secret=${CLIENT_SECRET}" \
        -d "scope=profile roles" \
    | jq -r '.access_token'
}

delete_user_if_exists() {
    local token="$1"
    local userId="$2"

    response=$(curl -s -w "\n%{http_code}" -X DELETE \
        "https://idam-testing-support-api.${ENVIRONMENT}.platform.hmcts.net/test/idam/users/${userId}" \
        -H "Authorization: Bearer ${token}")

    status=$(echo "$response" | tail -n1)

    case "$status" in
        200|204)
            echo "  ✓ Existing user deleted → $userId"
            ;;
        404)
            echo "  ✓ User does not exist → $userId"
            ;;
        *)
            echo "  ⚠ Delete returned HTTP $status"
            ;;
    esac
}

create_user() {
    local token="$1"
    local payload="$2"
    local password="$3"
    local email="$4"

    final_payload=$(echo "$payload" | jq --arg pw "$password" '.password = $pw')

    response=$(curl -s -w "\n%{http_code}" -X POST \
        "https://idam-testing-support-api.${ENVIRONMENT}.platform.hmcts.net/test/idam/users" \
        -H "Authorization: Bearer ${token}" \
        -H "Content-Type: application/json" \
        -d "${final_payload}")

    body=$(echo "$response" | sed '$d')
    status=$(echo "$response" | tail -n1)

    case "$status" in
        201)
            user_id=$(echo "$body" | jq -r '.id')
            echo "  ✓ User created → $user_id"
            RESULT_IDS=$(echo "$RESULT_IDS" | jq --arg id "$user_id" '. += [$id]')
            ;;
        409)
            echo "  ⚠ User already exists → $email"
            ;;
        *)
            echo "  ❌ Failed to create user (HTTP $status)"
            echo "$body" | jq .
            ;;
    esac
}

###############################################
# MAIN
###############################################

get_client_secret

echo ""
echo "▶ Processing users from: $USERS_FILE"

while read -r user; do

    password=$(echo "$user" | jq -r '.password')
    payload=$(echo "$user" | jq -c '.payload')
    email=$(echo "$user" | jq -r '.payload.user.email')
    userId=$(echo "$user" | jq -r '.payload.user.id')

    echo "----------------------------------------"
    echo "▶ User: $email"
    echo "▶ Action: $ACTION"

    token=$(get_access_token)

    if [[ -z "$token" || "$token" == "null" ]]; then
        echo "  ❌ Failed to retrieve access token"
        continue
    fi

    echo "  ✓ Access token retrieved"

    case "$ACTION" in
        add)
            echo "  ▶ Deleting existing user if present..."
            delete_user_if_exists "$token" "$userId"

            echo "  ▶ Creating user..."
            create_user "$token" "$payload" "$password" "$email"
            ;;
        update)
            echo "  ▶ Updating user (delete + recreate)..."
            delete_user_if_exists "$token" "$userId"
            create_user "$token" "$payload" "$password" "$email"
            ;;
        *)
            echo "  ❌ Invalid action: $ACTION"
            echo "     Supported actions: add, update"
            exit 1
            ;;
    esac

done < <(jq -c '.[]' "$USERS_FILE")

###############################################
# WRITE RESULT JSON
###############################################

echo "$RESULT_IDS" | jq . > caseworker_response.json

echo ""
echo "========================================"
echo "▶ New User IDs written to caseworker_response.json"
echo "========================================"

cat caseworker_response.json