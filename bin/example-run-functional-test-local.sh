#!/bin/bash
set -ex

# Setup required environment variables for running test locally .
export CCD_ADMIN_USERNAME=
export CCD_ADMIN_PASSORD=
export USERNAME_SOLICITOR=
export PASSWORD_SOLICITOR=
export USERNAME_CASEWORKER=
export PASSWORD_CASEWORKER=
export USERNAME_JUDGE=
export PASSWORD_JUDGE=
export USERNAME_CAA=
export PASSWORD_CAA=
export USERNAME_RESPONDENT_SOLICITOR=
export CCD_ADMIN_URL=https://ccd-admin-web.aat.platform.hmcts.net
export CCD_DATA_API_URL=http://ccd-data-store-api-aat.service.core-compute-aat.internal
export CCD_WEB_URL=https://manage-case.aat.platform.hmcts.net
export XUI_ORG_WEB_URL=https://manage-org.aat.platform.hmcts.net
export NIGHTLY_TEST=true
export IDAM_CLIENT_SECRET=
export CCD_SUBMIT_S2S_SECRET=
export TESTS_FOR_ACCESSIBILITY=false
export RUNNING_ENV=aat
 yarn test:fullfunctional
