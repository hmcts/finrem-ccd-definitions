#!/bin/bash
set -ex

# Setup required for Saucelabs environment variables. CCD_WEB_URL should be set by CNP
export E2E_FRONTEND_URL=${CCD_WEB_URL}
export FEATURE_IDAM=true
export E2E_ADD_WAIT_CROSSBROWSER=true

EXIT_STATUS=0
BROWSER_GROUP=chrome yarn test-crossbrowser-e2e || EXIT_STATUS=$?
BROWSER_GROUP=firefox yarn test-crossbrowser-e2e || EXIT_STATUS=$?
BROWSER_GROUP=microsoft yarn test-crossbrowser-e2e || EXIT_STATUS=$?
echo EXIT_STATUS: $EXIT_STATUS
exit $EXIT_STATUS
