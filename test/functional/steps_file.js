
// in this file you can append custom step methods to 'I' object

const { waitForContinueButtonEnabled } = require('./pages/common/common');
const { waitForPage } = require('./pages/common/common');
const { createCase } = require('./pages/create-case/create-case');

module.exports = () => {
  return actor({

    // Define custom steps here, use 'this' to access default methods of I.
    // It is recommended to place a general 'login' function here.
    loginToAdminConsole() {
      this.amOnPage(`${process.env.CCD_ADMIN_URL}`);
      this.see('Sign in');
      this.fillField('username', 'ccd-importer@server.net');
      this.fillField('password', 'Password12');
      this.click('Sign in');
      this.see('Welcome to CCD Admin Web');
    },
    createRole(role) {
      this.click('Manage User Roles');
      this.click('Create User Role');
      this.fillField('role', role);
      this.click('Create');
    },
    uploadConfig(path) {
      this.click('Import Case Definition');
      this.attachFile('file', path);
      this.click('Submit');
    },
    signInIdam(username, password) {
      this.amOnPage(`${process.env.CCD_WEB_URL}`);
      this.wait('5');
      this.waitForText('Email address');
      this.fillField('username', username);
      this.fillField('password', password);
      this.click('Sign in');
      this.wait('15');
    },
    createCase,
    waitForPage,
    waitForContinueButtonEnabled
  });
};
