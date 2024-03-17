const { createCcdRoles } = require('../helpers/ccd-config-utils');

const adminUserName = process.env.CCD_ADMIN_USER_NAME;
const adminPassword = process.env.CCD_ADMIN_PASSWORD;

Feature('CCD Config Setup');

Scenario('add all the roles using CCD Definition Store API @preview', async () => {
    await createCcdRoles(adminUserName, adminPassword);
}).retry({ retries: 1, minTimeout: 30000 });
