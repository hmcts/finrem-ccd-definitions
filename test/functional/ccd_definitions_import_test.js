Feature('Import CCD Definitions');

if (process.env.IMPORT_PREVIEW) {
    Scenario('upload Consented preview config file @preview', ({I}) => {
        I.loginToAdminConsole();
        I.uploadConfig(`../../definitions/consented/xlsx/ccd-config-preview-consented-${process.env.GIT_COMMIT}.xlsx`);
    }).retry({retries: 3, minTimeout: 30000});

    Scenario('upload Contested preview config file @preview', ({I}) => {
        I.loginToAdminConsole();
        I.uploadConfig(`../../definitions/contested/xlsx/ccd-config-preview-contested-${process.env.GIT_COMMIT}.xlsx`);
    }).retry({retries: 3, minTimeout: 300000});
}
