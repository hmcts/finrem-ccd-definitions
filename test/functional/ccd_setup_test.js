const { createCcdRoles, importCcdConfig } = require('../helpers/ccd-config-utils');
const assert = require('assert');

const adminUserName = process.env.CCD_ADMIN_USER_NAME;
const adminPassword = process.env.CCD_ADMIN_PASSWORD;

Feature('CCD Config Setup');

Scenario('add all the roles using CCD Definition Store API @preview', async () => {
    await createCcdRoles(adminUserName, adminPassword);
}).retry({ retries: 1, minTimeout: 30000 });

if (process.env.IMPORT_PREVIEW) {
    Scenario('import Consented preview config file @preview', async () => {
        let result = await importCcdConfig(adminUserName, adminPassword,
            `../../definitions/consented/xlsx/ccd-config-preview-consented-${process.env.GIT_COMMIT}.xlsx`);
        assert.equal(result, 'Case Definition data successfully imported');
    }).retry({ retries: 1, minTimeout: 30000 });

    Scenario('import Contested preview config file @preview', async () => {
        let result = await importCcdConfig(adminUserName, adminPassword,
            `../../definitions/contested/xlsx/ccd-config-preview-contested-${process.env.GIT_COMMIT}.xlsx`);
        assert.equal(result, 'Case Definition data successfully imported');
    }).retry({ retries: 1, minTimeout: 30000 });
}
