#!/usr/bin/env bash
#
# Shared IDAM helpers for the WA test user scripts. Source this file; don't run it.
#
# Pipelines run these scripts in parallel (nightly, every PR build), and IDAM test
# users expire on their own. So the test for "does this user need recreating?" is
# "can it log in with its password right now?":
#
#   - can log in    -> another pipeline may be using it: leave it untouched
#   - can't log in  -> expired, missing or broken: nobody can be using it, so it is
#                      safe to (re)create
#
# Looking a user up by id (GET /test/idam/users/{id}) is not used: it returns 404
# for users created through the legacy /testing-support/accounts API even while
# they exist and can log in.

KEYVAULT_NAME="finrem-aat"
SECRET_NAME="finrem-idam-client-secret"
IDAM_CLIENT_ID="finrem"

ensure_azure_login() {
    if ! az account show >/dev/null 2>&1; then
        if [[ -n "${CI:-}" || -n "${JENKINS_URL:-}" ]]; then
            echo "No Azure CLI session is available in AZURE_CONFIG_DIR=${AZURE_CONFIG_DIR:-<not set>}."
            echo "Interactive Azure login is disabled in CI."
            exit 1
        fi

        echo "Logging into Azure..."
        az login
    fi
}

# Sets CLIENT_SECRET.
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

# Usage: get_access_token <env>. Prints a client_credentials token.
get_access_token() {
    local environment="$1"

    curl -s -X POST \
        "https://idam-web-public.${environment}.platform.hmcts.net/o/token" \
        -H "Content-Type: application/x-www-form-urlencoded" \
        -d "grant_type=client_credentials" \
        -d "client_id=${IDAM_CLIENT_ID}" \
        --data-urlencode "client_secret=${CLIENT_SECRET}" \
        -d "scope=profile roles" \
    | jq -r '.access_token'
}

# Sets CLIENT_SECRET and TOKEN, exiting if either can't be obtained.
require_access_token() {
    local environment="$1"

    get_client_secret
    TOKEN=$(get_access_token "$environment")

    if [[ -z "$TOKEN" || "$TOKEN" == "null" ]]; then
        echo "❌ Failed to retrieve IDAM access token"
        exit 1
    fi
}

# Usage: idam_can_log_in <env> <email> <password>
# Logs in as the user with a password grant, the same way the tests do.
# Returns 0 if IDAM issues a token, 1 if it rejects the credentials (invalid_grant:
# the user is expired, missing, locked or has a different password).
# Exits on any other response, so an IDAM outage or a bad client secret never looks
# like "can't log in" and triggers a recreate.
idam_can_log_in() {
    local environment="$1"
    local email="$2"
    local password="$3"
    local response body status

    response=$(curl -s -w "\n%{http_code}" -X POST \
        "https://idam-web-public.${environment}.platform.hmcts.net/o/token" \
        -H "Content-Type: application/x-www-form-urlencoded" \
        -d "grant_type=password" \
        -d "client_id=${IDAM_CLIENT_ID}" \
        --data-urlencode "client_secret=${CLIENT_SECRET}" \
        --data-urlencode "username=${email}" \
        --data-urlencode "password=${password}" \
        -d "scope=openid profile roles")

    body=$(echo "$response" | sed '$d')
    status=$(echo "$response" | tail -n1)

    if [[ "$status" == "200" ]] && echo "$body" | jq -e '.access_token' >/dev/null 2>&1; then
        return 0
    fi

    if [[ "$status" == "400" || "$status" == "401" ]] \
        && [[ "$(echo "$body" | jq -r '.error // empty' 2>/dev/null)" == "invalid_grant" ]]; then
        return 1
    fi

    echo "  ❌ Login check for ${email} returned HTTP ${status} (expected 200 or invalid_grant)"
    echo "$body" | jq -c 'del(.access_token, .id_token, .refresh_token)' 2>/dev/null || true
    exit 1
}

# Usage: idam_delete_user_by_id <env> <token> <userId>
# Only call this for a user that can't log in, or from a manual 'update' run.
idam_delete_user_by_id() {
    local environment="$1"
    local token="$2"
    local userId="$3"
    local status

    status=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE \
        "https://idam-testing-support-api.${environment}.platform.hmcts.net/test/idam/users/${userId}" \
        -H "Authorization: Bearer ${token}")

    case "$status" in
        200|204) echo "  ✓ Old user deleted → $userId" ;;
        404)     echo "  ✓ Nothing to delete → $userId" ;;
        *)       echo "  ⚠ Delete returned HTTP $status" ;;
    esac
}
