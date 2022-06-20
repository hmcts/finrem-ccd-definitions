/* eslint-disable no-undefined, no-invalid-this */
async function waitForPage(header, headerText) {
  const I = this;

  try {
    if (headerText === undefined) {
      await I.waitForElement(header, '90');
    } else {
      await I.waitForText(headerText, '90', header);
    }
  } catch (error) {
    throw error;
  }
}

function waitForContinueButtonEnabled() {
  const I = this;

  I.waitForElement('button[type = "submit"]:not(:disabled)', '90');
  //I.scrollTo('button[type = "submit"]:not(:disabled)');
}

module.exports = { waitForPage, waitForContinueButtonEnabled };
