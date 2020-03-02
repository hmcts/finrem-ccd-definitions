# div-ccd-definitions
Financial Remedy configuration definitions for CCD
 
## Setup

### Pre-requirements 
Install nvm to manage node from https://github.com/nvm-sh/nvm

Install required node version using `nvm install`

### Install

Run `yarn install && yarn setup` to install the dependencies for both this project and the submodule

## Convert JSON to Excel

Depending on if you want the generated Excel to be for the Consented or Contested Journeys - add the appropriate journey to the end of the command.

### For all environments

`yarn generate-excel-all-consented` to generate excel configs for all environments (Demo, AAT and Prod) for consented journey

`yarn generate-excel-all-contested` to generate excel configs for all environments (Demo, AAT and Prod) for contested journey

The generated excel files will be in `defintions/consented/xlsx` or `defintions/contested/xlsx` respectively. 

### For a specific environment

`yarn generate-excel-(local\demo\aat\prod)` 

For example

`yarn generate-excel-aat`

### For a bulk-action config

`yarn generate-bulk-excel-(local\demo\aat\prod)` 

For example

`yarn generate-excel-aat-consented`

or 

`yarn generate-excel-aat-contested`

## Convert Excel to JSON

If you prefer to make the changes directly on the Excel file, and then convert back to JSON:

1) Generate a fresh **base** Excel file for the appropriate journey using the `yarn generate-excel-{consented/contested}`. The generated excel file will be in `defintions/{CHOSEN_JOURNEY}/xlsx/ccd-config-base.xlsx` and will contain placeholder URLs.
2) Make the changes to `ccd-config-base.xlsx` but ensure you don't have any environment-specific URLs (use placeholders instead).
3) Once you're satisfied with your changes in the Excel file, convert back to JSON using `yarn generate-json-{consented/contested}`
4) Review the JSON file changes to ensure all your changes are correct

## Accessing CCD on preview/per PR

A full CCD instance is created PR via Helm charts which can be accessed using the details below.

If you do not require this, add `[NO-CCD]` at the start of the PR title in GitHub.

* Visit `https://gateway-div-ccd-definitions-pr-<number>.service.core-compute-preview.internal` and whitelist accept the SSL certificate
* Access the PR on `https://case-management-web-div-ccd-definitions-pr-<number>.service.core-compute-preview.internal`
* Login with an authorised AAT user [listed here](https://github.com/hmcts/div-ccd-definitions/blob/master/definitions/divorce/json/UserProfile.json)

### Accessing documents on a CCD PR

To access generated documents on a CCD PR, you have to use the AAT env gateway:

* Ensure you're logged in with a user that can access the documents (e.g caseworker or solicitor depending on the case) on https://www-ccd.aat.platform.hmcts.net/
* Copy the document URL from the Documents tab in CCD, and replace the hostname with `https://gateway-ccd.aat.platform.hmcts.net`

### Creating cases 

To be able to create a case as a solicitor in a CCD PR, you have to create:

* a CMS PR pointing to the CCD instance (e.g https://github.com/hmcts/div-case-maintenance-service/pull/190)
* a COS PR pointing to the above CMS PR (e.g https://github.com/hmcts/div-case-orchestration-service/pull/534)
* temperately change config.aat.cosUrl in package.json to point to the COS PR

This will ensure that callbacks point back to the correct CCD URL.

## Applications useful urls

* CCD admin `https://admin-web-div-ccd-definitions-pr-<number>.service.core-compute-preview.internal` [Importer username/password can be found here](https://github.com/hmcts/ccd-docker-definition-importer#configuration)
* CCD data-store-api `http://data-store-api-div-ccd-definitions-pr-<number>.service.core-compute-preview.internal`

To run the tests on CCD PR environment you need to replace `core_case_data.api.url` on COS and CMS to use your PR `data-store-api` URL 


## ccd-definition-processor

This repo makes use of https://github.com/hmcts/ccd-definition-processor to generate the excel file. You may have to update this repo if, for example, you need to add a column to the definitions spreadsheet.

Ideally this should be a published NPM package, so that we can include it in package.json but at the moment we include it as a git submodule

A submodule is simply a pointer to a repo and a commit. If you want to reset that repo to the latest upstream master, run

```
yarn reset-ccd-submodule
```

You need to use this if you have accidentally change this pointer reference to something other than what you intended (you can instead modify the above command to package.json to check out a specific commit/version of that submodule)

It's also important to note that once you update to a new reference (i.e you commit a change to the `ccd-definition-processor` _file_) you need to make sure everyone else runs `yarn setup` again to get the updated reference as well.


## Release

When we want to release config changes to production:

1) Generate all excel files using `yarn generate-excel-all-{consented/contested}`
2) Upload the excel file for the AAT env and QA the changes
3) Create a new release in https://github.com/hmcts/finrem-ccd-definitions/releases/new
4) Upload all the generate Excel files to the release and add give it the same version number from (3)
5) Raise a RDM ticket (e.g. RDM-5372) and add link to the release created in step (7)
6) Ask tester to sign off the RDM if changes pass and assign the RDM ticket to someone in the RDM team



## LEFT TO DO BEFORE GO LIVE

- Remove private user details etc
- Push and replace master
- Upload to AAT/DEMO and confirm everything still works etc
