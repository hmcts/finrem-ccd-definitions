# finrem-ccd-definitions
Financial Remedy configuration definitions for CCD
 
## Note: For now until we remove the Judge's usernames and email addresses this Github Repo must remain Private

## Setup

To install the dependencies for both this project and the submodule (ccd-definition-processor), run:
`yarn install && yarn setup` 

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

Eslint is included and will verify the config is properly formatted:

`yarn lint`

To run the unit tests to verify you have correctly made changes:

`yarn test`

## Accessing CCD on preview/per PR

A full CCD instance is created PR via Helm charts which can be accessed using the details below. If you do not require this, add `[NO-CCD]` at the start of the PR title in GitHub.

1) Visit `https://gateway-finrem-ccd-definitions-pr-<number>.service.core-compute-preview.internal` and whitelist accept the SSL certificate
2) Access the PR on `https://case-management-web-finrem-ccd-definitions-pr-<number>.service.core-compute-preview.internal`
3) Login with an authorised AAT user [listed here](https://github.com/hmcts/finrem-ccd-definitions/blob/master/definitions/{consented/contested}/json/UserProfile.json)


## ccd-definition-processor

This repo makes use of https://github.com/hmcts/ccd-definition-processor to generate the excel file. You may have to update this repo if, for example, you need to add a column to the definitions spreadsheet.

Ideally this should be a published NPM package, so that we can include it in package.json but at the moment we include it as a git submodule

A submodule is simply a pointer to a repo and a commit. If you want to reset that repo to the latest upstream master, run:

```
yarn reset-ccd-submodule
```

You need to use this if you have accidentally change this pointer reference to something other than what you intended (you can instead modify the above command to package.json to check out a specific commit/version of that submodule)

It's also important to note that once you update to a new reference (i.e you commit a change to the `ccd-definition-processor` _file_) you need to make sure everyone else runs `yarn setup` again to get the updated reference as well.


## Release to AAT / DEMO / ITHC:

When we want to release config changes to AAT/DEMO/ITHC:

1) Generate all the Excel files for the Consented or Contested Journey using `yarn generate-excel-all-{consented/contested}`
3) Login to the CCD Admin Web Portal for the relevant environment
4) Go to "Import Case Definition" and upload the appropriate Excel file and verify it uploaded successfully

## Release To Production

When we want to release config changes to Production (Note this should be done after verifying the changes on AAT and signed off by QA):

1) Generate all the Excel files for the Consented or Contested Journey using `yarn generate-excel-all-{consented/contested}`
2) You now need to replace the test Judges' data with the correct data stored in Confluence (Note - this must not be stored in the repo and so these changes must not be committed.)
3) Login to Confluence and navigate to XXX
4) Replace the entire UserProfile tab from your generated Excel with that from Confluence - this will ensure the appropriate Production users are able to login
5) Next you have to replace the list of Judges that it is possible to be assigned to. This is done in the 'FixedLists' tab - be careful to only modify what is necessary.
    - If Consented Journey - replace all users associated with 'FR_fl_AssignToJudge'
    - If Contested Journey - replace all users associated with 'FR_fl_Judge'
5) Raise a RDM ticket (e.g. RDM-5372) and add the appropriate Production Excel Config (5) - remember not to commit these changes

## LEFT TO DO BEFORE GO LIVE

- Create confluence page for Judges information - update ReadMe to reflect this
- Unskip two skipped tests (UserRoleStateAuth.test.js) and confirm behaviour for both consented and contested with Harry/Jakub
- Upload to AAT/DEMO and confirm everything still works etc
- Extend to also handle Exception Record config?
