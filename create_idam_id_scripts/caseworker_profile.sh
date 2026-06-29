#!/usr/bin/env bash

set -euo pipefail

PROFILES_FILE="caseworker_profile_request.json"

ENVIRONMENT="${1:-}"
CLIENT_SECRET="${2:-}"
S2S_OTP="${3:-}"
ACTION="${4:-}"

if [[ -z "$ENVIRONMENT" || -z "$CLIENT_SECRET" || -z "$S2S_OTP" || -z "$ACTION" ]]; then
    echo "Usage:"
    echo "./caseworker_profile.sh <env> <client_secret> <s2s_otp> <add|update>"
    exit 1
fi

BASE_URL="http://rd-caseworker-ref-api-${ENVIRONMENT}.service.core-compute-${ENVIRONMENT}.internal/refdata/case-worker/profile"
DELETE_URL="http://rd-caseworker-ref-api-${ENVIRONMENT}.service.core-compute-${ENVIRONMENT}.internal/refdata/case-worker/users"

RESULTS="[]"

####################################################
# FUNCTIONS
####################################################

get_access_token() {

    curl -s --location --request POST \
        "https://idam-api.${ENVIRONMENT}.platform.hmcts.net/o/token" \
        --header "Content-Type: application/x-www-form-urlencoded" \
        --data-urlencode "grant_type=password" \
        --data-urlencode "username=prd.demo.cgi2@hmcts.net" \
        --data-urlencode "password=Password123" \
        --data-urlencode "client_id=rd-professional-api" \
        --data-urlencode "client_secret=${CLIENT_SECRET}" \
        --data-urlencode "scope=openid profile roles manage-user create-user search-user" \
        | jq -r '.access_token'
}

get_service_token() {

    curl -s --location \
        "http://rpe-service-auth-provider-${ENVIRONMENT}.service.core-compute-${ENVIRONMENT}.internal/testing-support/lease" \
        --header "Content-Type: application/json" \
        --data "{
            \"microservice\":\"rd_user_profile_api\",
            \"oneTimePassword\":\"${S2S_OTP}\"
        }"
}

delete_profile() {

    local token="$1"
    local service_token="$2"
    local email="$3"

    echo "Deleting existing profile for ${email}..."

    response=$(curl -s -w "\n%{http_code}" \
        -X DELETE \
        "${DELETE_URL}?emailPattern=${email}" \
        -H "accept: application/json" \
        -H "Authorization: Bearer ${token}" \
        -H "ServiceAuthorization: ${service_token}")

    body=$(echo "$response" | sed '$d')
    status=$(echo "$response" | tail -n1)

    case "$status" in
        200|202|204)
            echo "✓ Existing profile deleted"
            ;;

        404)
            echo "No existing profile found"
            ;;

        *)
            echo "Delete returned HTTP ${status}"
            [[ -n "$body" ]] && echo "$body"
            ;;
    esac
}

create_profile() {

    local token="$1"
    local service_token="$2"
    local payload="$3"
    local email="$4"

    response=$(curl -s -w "\n%{http_code}" \
        -X POST \
        "${BASE_URL}" \
        -H "accept: application/json" \
        -H "Authorization: Bearer ${token}" \
        -H "ServiceAuthorization: ${service_token}" \
        -H "Content-Type: application/json" \
        -d "${payload}")

    body=$(echo "$response" | sed '$d')
    status=$(echo "$response" | tail -n1)

    echo "HTTP Status: ${status}"

    case "$status" in
        200|201)

            echo "✓ Profile created: ${email}"

            [[ -z "$body" ]] && body="{}"

            RESULTS=$(echo "$RESULTS" | jq \
                --arg email "$email" \
                --argjson response "$body" \
                '. += [{
                    email: $email,
                    action: "add",
                    response: $response
                }]')
            ;;

        401)

            echo "✗ Unauthorized"

            RESULTS=$(echo "$RESULTS" | jq \
                --arg email "$email" \
                '. += [{
                    email: $email,
                    action: "add",
                    httpStatus: 401,
                    error: "Unauthorized"
                }]')
            ;;

        404)

            echo "✗ Endpoint not found"

            RESULTS=$(echo "$RESULTS" | jq \
                '. += [{
                    action: "add",
                    httpStatus: 404,
                    error: "Endpoint not found"
                }]')
            ;;

        *)

            echo "✗ Failed (${status})"

            RESULTS=$(echo "$RESULTS" | jq \
                --arg email "$email" \
                --arg status "$status" \
                --arg body "$body" \
                '. += [{
                    email: $email,
                    action: "add",
                    httpStatus: ($status|tonumber),
                    error: $body
                }]')
            ;;
    esac
}

update_profile() {

    local token="$1"
    local service_token="$2"
    local payload="$3"
    local email="$4"

    response=$(curl -s -w "\n%{http_code}" \
        -X PUT \
        "${BASE_URL}" \
        -H "accept: application/json" \
        -H "Authorization: Bearer ${token}" \
        -H "ServiceAuthorization: ${service_token}" \
        -H "Content-Type: application/json" \
        -d "${payload}")

    body=$(echo "$response" | sed '$d')
    status=$(echo "$response" | tail -n1)

    echo "HTTP Status: ${status}"

    case "$status" in
        200|204)

            echo "✓ Profile updated: ${email}"

            [[ -z "$body" ]] && body="{}"

            RESULTS=$(echo "$RESULTS" | jq \
                --arg email "$email" \
                --argjson response "$body" \
                '. += [{
                    email: $email,
                    action: "update",
                    response: $response
                }]')
            ;;

        401)

            echo "✗ Unauthorized"

            RESULTS=$(echo "$RESULTS" | jq \
                --arg email "$email" \
                '. += [{
                    email: $email,
                    action: "update",
                    httpStatus: 401,
                    error: "Unauthorized"
                }]')
            ;;

        404)

            echo "✗ Profile not found"

            RESULTS=$(echo "$RESULTS" | jq \
                --arg email "$email" \
                '. += [{
                    email: $email,
                    action: "update",
                    httpStatus: 404,
                    error: "Profile not found"
                }]')
            ;;

        *)

            echo "✗ Failed (${status})"

            RESULTS=$(echo "$RESULTS" | jq \
                --arg email "$email" \
                --arg status "$status" \
                --arg body "$body" \
                '. += [{
                    email: $email,
                    action: "update",
                    httpStatus: ($status|tonumber),
                    error: $body
                }]')
            ;;
    esac
}

####################################################
# MAIN
####################################################

echo "Processing profiles from ${PROFILES_FILE}"

TOKEN=$(get_access_token)

if [[ -z "$TOKEN" || "$TOKEN" == "null" ]]; then
    echo "Failed to retrieve IDAM access token"
    exit 1
fi

echo "✓ IDAM token retrieved"

SERVICE_TOKEN=$(get_service_token)

if [[ -z "$SERVICE_TOKEN" || "$SERVICE_TOKEN" == "null" ]]; then
    echo "Failed to retrieve ServiceAuthorization token"
    exit 1
fi

echo "✓ ServiceAuthorization token retrieved"

while read -r profile
do

    email=$(echo "$profile" | jq -r '.email_id // .user.email // "unknown"')

    echo "----------------------------------------"
    echo "Profile : ${email}"
    echo "Action  : ${ACTION}"

    case "$ACTION" in

        add)
            #delete_profile "$TOKEN" "$SERVICE_TOKEN" "$email"

            create_profile "$TOKEN" "$SERVICE_TOKEN" "$profile" "$email"
            ;;

        update)
            update_profile "$TOKEN" "$SERVICE_TOKEN" "$profile" "$email"
            ;;

        *)
            echo "Invalid action: ${ACTION}"
            echo "Supported actions: add | update"
            exit 1
            ;;
    esac

done < <(jq -c '.[]' "${PROFILES_FILE}")

####################################################
# WRITE OUTPUT
####################################################

echo "$RESULTS" | jq . > caseworker_profile_response.json

echo
echo "========================================"
echo "Responses written to caseworker_profile_response.json"
echo "========================================"

cat caseworker_profile_response.json