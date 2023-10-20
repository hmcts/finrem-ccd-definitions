# functional tests


## How to run functional test against AAT


1) import these evn variables

        export CCD_ADMIN_USERNAME=ccd-importer@server.net
        
        export CCD_ADMIN_PASSWORD=Password1234
        
        export USERNAME_SOLICITOR=fr_applicant_sol@sharklasers.com
        
        export PASSWORD_SOLICITOR=Testing123
        
        export USERNAME_CASEWORKER=claire_fr_mumford@yahoo.com
        
        export PASSWORD_CASEWORKER=Nagoya0102
        
        export USERNAME_JUDGE=peter_fr_chapman@yahoo.com
        
        export PASSWORD_JUDGE=Nagoya0102
        
        export USERNAME_CAA=fr_respondent_solicitor@mailinator.com
        
        export PASSWORD_CAA=Testing1234
        
        export USERNAME_RESPONDENT_SOLICITOR=fr_respondent_sol@mailinator.com
        
        export CCD_DATA_API_URL=http://ccd-data-store-api-aat.service.core-compute-aat.internal
        
        export CCD_WEB_URL=https://manage-case.aat.platform.hmcts.net
        
        export XUI_ORG_WEB_URL=https://manage-org.aat.platform.hmcts.net
        
        export NIGHTLY_TEST=true
        
        export IDAM_CLIENT_SECRET=thUphEveC2Ekuqedaneh4jEcRuba4t2t
        
        export CCD_SUBMIT_S2S_SECRET=DWYML5ONMS7KG44R
         
        export USERNAME_SOLICITOR1=fr_applicant_solicitor1@mailinator.com
        
        export PASSWORD_SOLICITOR1=Testing1234
        
        export USERNAME_BARRISTER1=fr_applicant_barrister1@mailinator.com
   
        export PASSWORD_BARRISTER1=Testing1234


2) open `codecept.conf.js` file and update this parameter `show: true`

3) place the tag `@mytest` in the scenario  (for ex. 'Consent Case Creation For Caseworker @nightly @preview @mytest')

4) To run the test run this `yarn test:mytest` 
        the test include API calls requires VPN on.

5) To run test against preview env requires these env variables
        
        export CCD_ADMIN_USERNAME=ccd-importer@server.net
          
        export CCD_ADMIN_PASSWORD=Password1234
        
        export USERNAME_SOLICITOR=fr_applicant_sol@sharklasers.com
        
        export PASSWORD_SOLICITOR=Testing123
        
        export USERNAME_CASEWORKER=claire_fr_mumford@yahoo.com
        
        export PASSWORD_CASEWORKER=Nagoya0102
        
        export USERNAME_JUDGE=peter_fr_chapman@yahoo.com
        
        export PASSWORD_JUDGE=Nagoya0102
        
        export USERNAME_CAA=fr_respondent_solicitor@mailinator.com
        
        export PASSWORD_CAA=Testing1234
        
        export USERNAME_RESPONDENT_SOLICITOR=fr_respondent_sol@mailinator.com
        
        export NIGHTLY_TEST=true
        
        export IDAM_CLIENT_SECRET=thUphEveC2Ekuqedaneh4jEcRuba4t2t
        
        export CCD_SUBMIT_S2S_SECRET=DWYML5ONMS7KG44R

        export CCD_DATA_API_URL=https://ccd-data-store-api-finrem-ccd-definitions-pr-1222.preview.platform.hmcts.net
        
        export CCD_WEB_URL=https://xui-finrem-ccd-definitions-pr-1222.preview.platform.hmcts.net

        export XUI_ORG_WEB_URL=https://xui-mo-finrem-ccd-definitions-pr-1222.preview.platform.hmcts.net

        export USERNAME_SOLICITOR1=fr_applicant_solicitor1@mailinator.com

        export PASSWORD_SOLICITOR1=Testing1234

        export USERNAME_BARRISTER1=fr_applicant_barrister1@mailinator.com

        export PASSWORD_BARRISTER1=Testing1234

6) To run the test against any env overwrite these env variable and replace it with relevant URL/s
        
        export CCD_DATA_API_URL=https://ccd-data-store-api-finrem-ccd-definitions-pr-1222.preview.platform.hmcts.net
        
        export CCD_WEB_URL=https://xui-finrem-ccd-definitions-pr-1222.preview.platform.hmcts.net

        export XUI_ORG_WEB_URL=https://xui-mo-finrem-ccd-definitions-pr-1222.preview.platform.hmcts.net
        
        