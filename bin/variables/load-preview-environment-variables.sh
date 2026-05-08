#!/usr/bin/env bash

set -euo pipefail

pr=${1:?Preview PR number is required}

echo 'export ENVIRONMENT=preview'
echo 'export ENV=preview'
echo 'export SERVICE_AUTH_PROVIDER_API_BASE_URL=http://rpe-service-auth-provider-aat.service.core-compute-aat.internal'
echo 'export S2S_URL_BASE=http://rpe-service-auth-provider-aat.service.core-compute-aat.internal'
echo 'export IDAM_API_URL_BASE=https://idam-api.aat.platform.hmcts.net'
echo 'export CCD_IDAM_REDIRECT_URL=https://ccd-case-management-web-aat.service.core-compute-aat.internal/oauth2redirect'
echo "export CCD_DEFINITION_STORE_API_BASE_URL=https://ccd-definition-store-finrem-ccd-definitions-pr-${pr}.preview.platform.hmcts.net"
echo "export CCD_DEF_CASE_SERVICE_BASE_URL=http://finrem-ccd-definitions-pr-${pr}-finrem-cos"
echo "export CCD_DEF_AAC_MANAGER_CASE_URL=https://aac-finrem-ccd-definitions-pr-${pr}.preview.platform.hmcts.net"
echo "export ROLE_ASSIGNMENT_URL=https://am-role-assignment-service-finrem-ccd-definitions-pr-${pr}.preview.platform.hmcts.net"
echo "export CAMUNDA_BASE_URL=https://camunda-finrem-ccd-definitions-pr-${pr}.preview.platform.hmcts.net"
