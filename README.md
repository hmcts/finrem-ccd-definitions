# finrem-ccd-definitions


Financial Remedy configuration definitions for CCD.

This allows for the FR CCD Config to be easily edited and stored in GitHub as JSON rather than version controlled in Confluence as Xlsx files.

## Setup

To install the dependencies for both this project and the submodule (ccd-definition-processor), run:
`yarn install && yarn reset-ccd-submodule`

## Setup for M1 chip Macs

If running yarn install throws an error with this output:

`The chromium binary is not available for arm64`

1) Run `brew install chromium`
2) Run `xattr -cr /Applications/Chromium.app`
3) Add these env variables to your .zshrc file
`export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true`
``export PUPPETEER_EXECUTABLE_PATH=`which chromium` ``
4) Save file and restart terminal
5) Run `source ~/.zshrc`
6) `yarn install && yarn reset-ccd-submodule`

## Convert JSON to Excel

Depending on if you want the generated Excel to be for the Consented or Contested Journeys - add the appropriate journey to the end of the command.

### Generate Excel Configs for all environments (Local, Demo, ITHC, AAT & Prod)

For Consented Journey:
```sh
yarn generate-excel-all-consented
```
For Contested Journey:
```sh
yarn generate-excel-all-contested
```

The generated Excel files will be in `defintions/consented/xlsx` or `defintions/contested/xlsx` respectively.

### Generate Excel Configs for a specific environment i.e. AAT/DEMO/DEMO-PROD-LIKE/ITHC/PERFTEST

* Note DEMO-PROD-LIKE does not include '-nonprod' files so should be a replication of the Production config, just pointing to Demo.
```sh
yarn generate-bulk-excel-(local/demo/aat/ithc/perftest/demo-prod-like/prod)
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

## Dependency Vulnerabilities Check
Run this script to perform a security audit on Yarn dependencies.

```bash
./yarn-audit-with-suppressions.sh
```

## Run E2E Tests Locally
E2E tests can be run locally, although they still use AAT.

### Setup
```bash
yarn playwright install
```
Import AAT environment variables. Ask a colleague for an `e2e-aat.env` file. This should not be stored in GitHub.
```bash
source ./e2e-aat.env
```

In `codecept.conf.js` set the `Playwright` options `show: true` and `headless: false`.

Also consider setting `retries: 0`.

### Run
To run a single test, add `@mytest` to the Scenario title. For example,

`Scenario('Contested Matrimonial Case Creation by Solicitor @nightly @mytest'...`

Connect to the VPN.

Execute:
```bash
yarn test:mytest
```

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
4) `yarn test:fullfunctional` will create both API, UI screen tests and verifies data in tabs (runs on nightly pipeline on AAT).
5) To create cases on demo, point CCD_DATA_API_URL to ccd demo API url and RUNNING_ENV=demo, run the scenario tests.

### Running additional tests in the Jenkins PR Pipeline
1. Add one or more appropriate labels to your PR in GitHub. Valid labels are:

- ```enable_full_functional_tests```

2. Trigger a build of your PR in Jenkins.

## ccd-definition-processor

This repo makes use of https://github.com/hmcts/ccd-definition-processor to generate the excel file. You may have to update this repo if, for example, you need to add a column to the definitions spreadsheet.

Ideally this should be a published NPM package, so that we can include it in package.json but at the moment we include it as a git submodule

A submodule is simply a pointer to a repo and a commit. If you want to reset that repo to the latest upstream master, run:

```sh
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

## How to access a PR deployment

A PR will create a full CCD/ExUI stack in the preview environment as defined in the [Helm chart](charts/finrem-ccd-definitions/values.preview.template.yaml).

If you require a particular finrem-cos PR image rather than the latest production image then you should specify this
using a GitHub label. Add a label `use-finrem-cos-pr-number` replacing `number` with the value required.

GitHub will have the main URL for a PR deployment. e.g. `https://finrem-ccd-definitions-pr-<number>.preview.platform.hmcts.net/`

This can be found be clicking 'View Deployment' in the conversation tab of the PR. However, this URL in itself is not very useful.

To access a PR deployment via the UI for testing it must be persisted once the Jenkins build pipeline has finished.

This is achieved by adding the label `enable_keep_helm` to the PR before it builds.

The following URLs will then be available. Replace `<number>` with the value of your PR.

| Application         | URL                                                                                |
|---------------------|------------------------------------------------------------------------------------|
| Manage Cases        | `https://xui-finrem-ccd-definitions-pr-<number>.preview.platform.hmcts.net/`       |
| Manage Organisation | `https://xui-mo-finrem-ccd-definitions-pr-<number>.preview.platform.hmcts.net/`    |
| CCD Admin Web       | `https://admin-web-finrem-ccd-definitions-pr-<number>.preview.platform.hmcts.net/` |

* Login with an authorised AAT user [listed here](https://github.com/hmcts/finrem-ccd-definitions/blob/master/definitions/consented/json/UserProfile/UserProfile-nonprod.json)

See also:
* https://tools.hmcts.net/confluence/display/RSE/Divorce+Local+Environment+Set+up+using+Preview
* https://tools.hmcts.net/confluence/display/RSE/Debugging+a+service+in+Preview+Cluster+via+Telepresence

## Deploying CCD Config Changes to Demo or ITHC

Config changes are now uploaded to AAT when a PR branch is merged to master. When we want to release config changes to Demo/ITHC:

1) Excel files for the Consented or Contested Journey can be found in the `Artifacts` tab of the Jenkins build on merge to master
3) Login to the CCD Admin Web Portal for the relevant environment
4) Go to "Import Case Definition" and upload the appropriate Excel file and verify it uploaded successfully

## Release To Production

Jenkins now generates the config ready to release to PROD, this can be found in the `Artifacts` tab of the Jenkins build on merge to master.

NOTE: Jenkins will populate Judge details in the PROD configs that is not available locally, so PROD configs should never be used when generated locally and instead should always be taken from Jenkins.

## Judiciary Data in FixedLists

To update judge data in `FixedLists` for Production, follow this guide:
https://tools.hmcts.net/confluence/display/FR/Adding+new+FR+Judges
