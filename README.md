# finrem-ccd-definitions
Financial Remedy configuration definitions for CCD.

This allows for the FR CCD Config to be easily edited and stored in Github as JSON rather than version controlled in Confluence as Xlsx files.

## Setup

To install the dependencies for both this project and the submodule (ccd-definition-processor), run:
`yarn install && yarn reset-ccd-submodule`

## Convert JSON to Excel

Depending on if you want the generated Excel to be for the Consented or Contested Journeys - add the appropriate journey to the end of the command.

### Generate Excel Configs for all environments (Local, Demo, ITHC, AAT & Prod)

For Consented Journey:
```
yarn generate-excel-all-consented
```
For Contested Journey:
```
yarn generate-excel-all-contested
```

The generated excel files will be in `defintions/consented/xlsx` or `defintions/contested/xlsx` respectively.

### Generate Excel Configs for a specific environment i.e. AAT/DEMO/ITHC
```
yarn generate-bulk-excel-(local/demo/aat/ithc/prod)
```

E.g.:
`yarn generate-excel-aat-consented`
or
`yarn generate-excel-aat-contested`


## Convert Excel to JSON

If you prefer to make the changes directly to the Excel Configuration file, and then convert back to JSON:

1) Generate a fresh **base** Excel file from the existing JSON for the appropriate journey using the `yarn generate-excel-{consented/contested}`. The generated Excel file will be in `defintions/{CHOSEN_JOURNEY}/xlsx/ccd-config-base-{JOURNEY}.xlsx` and will contain placeholder URLs.
2) Make your changes to `ccd-config-base.xlsx` but ensure you don't modify the placeholder URLS (${CCD_DEF_COS_URL}/). These are used to dynamically change the callback URLs for each environment.
3) Once you're finished with your changes in the Excel file, convert back to JSON using `yarn generate-json-{consented/contested}`
4) Review the JSON file changes to ensure all your changes are correct

## Verification

### Eslint is included and will verify the config is properly formatted:

`yarn lint`

### To run the unit tests to verify you have correctly made changes:

`yarn test`

### Run full E2E Tests for both Journeys:

Run full E2E tests of both the Consented & Contested Journeys on CCD

1) Configure defined env variables from [Jenkinsfile_nightly](https://github.com/hmcts/finrem-ccd-definitions/blob/master/Jenkinsfile_nightly) pipeline .
2) Values for env variables can be found in Azure finrem aat key vault.
3) `yarn test:functional` will create cases via API (runs on PR and master AAT).
4) `yarn test:nightly-functional` will create both API, UI screen tests and verifies data in tabs (runs on nightly pipeline on AAT).


## ccd-definition-processor

This repo makes use of https://github.com/hmcts/ccd-definition-processor to generate the excel file. You may have to update this repo if, for example, you need to add a column to the definitions spreadsheet.

Ideally this should be a published NPM package, so that we can include it in package.json but at the moment we include it as a git submodule

A submodule is simply a pointer to a repo and a commit. If you want to reset that repo to the latest upstream master, run:

```
yarn reset-ccd-submodule
```

You need to use this if you have accidentally change this pointer reference to something other than what you intended (you can instead modify the above command to package.json to check out a specific commit/version of that submodule)

It's also important to note that once you update to a new reference (i.e you commit a change to the `ccd-definition-processor` _file_) you need to make sure everyone else runs `yarn setup` again to get the updated reference as well.

## Feature toggle
If you want to test something on local, aat or demo env, but don't want to release it on prod make sure you move
all definitions you don't want to release to a file with suffix "-nonprod.json".

Similarly, each file can have a "prod" version where we store all definitions that will ONLY go to prod, but not on test environment spreadsheets.

A combination of the 2 can also be used, for example to toggle a CaseEvent to behave differently in PROD and AAT, the CaseEvent can be declared once in the "nonprod" version and once in the "prod" version

To do it, you need to create a folder for files related to that xlsx tab, eg: "AuthorisationCaseEvent" where you move
the production file "AuthorisationCaseEvent.json" and you create another one with definitions you don't want to release
yet (eg. AuthorisationCaseEvent-noprod.json, but can be any name such as "definitions-for-bsp-ABC-nonprod.json").

When "toggled off" definitions can be released, just move them to the prod file and remove them from nonprod file.
Then follow the typical release process.

Please read more here:
https://tools.hmcts.net/confluence/display/FR/Feature+toggles+for+CCD+definition

## How to access PR deployment
GitHub will have the main URL for this deployment. e.g. `https://finrem-ccd-definitions-pr-<number>.service.core-compute-preview.internal/`
However, this URL in itself is not very useful. There are two subdomains that are useful.

* Visit `https://gateway-finrem-ccd-definitions-pr-<number>.service.core-compute-preview.internal` in separate tab and whitelist accept the SSL certificate.

- "case-management-web-" for the Case management UI: e.g. `https://case-management-web-finrem-ccd-definitions-pr-<number>.service.core-compute-preview.internal/`

* Login with an authorised AAT user [listed here](https://github.com/hmcts/finrem-ccd-definitions/blob/master/definitions/consented/json/UserProfile/UserProfile-nonprod.json)

- "admin-web-" for the Case management UI: e.g. `https://admin-web-finrem-ccd-definitions-pr-<number>.service.core-compute-preview.internal/`

Config changes are now uploaded to AAT when a PR branch is merged to master. When we want to release config changes to DEMO/ITHC:

1) Excel files for the Consented or Contested Journey can be found in the `Artifacts` tab of the Jenkins build on merge to master
3) Login to the CCD Admin Web Portal for the relevant environment
4) Go to "Import Case Definition" and upload the appropriate Excel file and verify it uploaded successfully

## Release To Production

Jenkins now generates the config ready to release to PROD, this can be found in the `Artifacts` tab of the Jenkins build on merge to master. 

NOTE: Jenkins will populate Judge details in the PROD configs that is not available locally, so PROD configs should never be used when generated locally and instead should always be taken from Jenkins.

Follow this guide for releasing a new config file to Production:
https://tools.hmcts.net/confluence/display/FR/Get+a+new+CCD+config+uploaded+to+Production
