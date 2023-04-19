function solicitorCreateGeneralApplication() {
    const I = this;
    I.waitForPage('select[id="next-step"]');
    I.selectOption('select[id="next-step"]', 'Create General Application');
    I.wait("2");
    I.click("Go");
    I.waitForText("General Applications");
    I.click("Add new");
    I.checkOption("Applicant");
    I.checkOption("No");
    I.attachFile('input[type="file"]', '../data/confidentialDoc.pdf');
    I.wait("5");
    I.waitForContinueButtonEnabled();
    I.click("Continue");
    I.waitForText("Submit");
    I.click("Submit");
    
    I.clickTab('General Applications');
    I.waitForText('General Applications');
}

module.exports = { solicitorCreateGeneralApplication };