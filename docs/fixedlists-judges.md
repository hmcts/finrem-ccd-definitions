# Judge Data in FixedLists

Judge data is stored in the `FixedLists` tab of the CCD definitions file. However, judge details that are used in the production environment are not stored in this repository. Instead they are stored in an Azure Key Vault.

The values are stored as FixedLists JSON in key vault `finrem-aat` secrets `fixedlists-consented-judgedetails-x` where _x_ is a sequence number.
Each secret stores the details of 115 judges.

The Jenkins pipeline is responsible for downloading these secrets and injecting the values into the configuration that is imported into production.

## Updating Judge Data

**CRITICAL: When updating existing data for a judge do not amend or delete the value of `ListElementCode` (the email address).
This can cause failures with production cases if they are using that value.**

If a judge's email and display name have changed then you should leave the existing email address (`ListElementCode`) in the JSON data unchanged and only update the name (`ListElement`).

The following steps should be used to update judge data stored in the secrets:

1. Open a terminal windows and run `cd bin/judges`
2. Back up the current secrets by running `./backup.sh`. This will write the secrets to `bin/judges/build/backup`
3. Extract the existing judge JSON data into a single file by running `node extract.js`. This will write the JSON to `bin/judges/build/extracted.json`
4. Update `extracted.json` with the new judge data. New entries can be appended to the end of the file
5. Run `node validate.js` to produce a report of the changes introduced
6. Run `node sort.js` to sort the JSON data alphabetically by judge name. The output will be written to `bin/judges/build/sorted.json`
7. Run `node split.js` to split the JSON data into separate files consisting of 115 judges each. The output will be written to `bin/judges/build/output`
8. Run `./update-prod-secrets.sh` to update the secrets in the Azure Key Vault with the files in `bin/judges/build/output`
9. Rerun the `finrem-ccd-definitions` Jenkins pipeline to import the updated judge data into production

Note the `bin/judges` directory also contains `import.js` which could be used to update judge data provided in a spreadsheet.
