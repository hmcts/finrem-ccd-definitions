function solicitorCreateGeneralApplication() {
    const I = this;

    I.waitForPage('select[id="next-step"]');
    I.selectOption('select[id="next-step"]', 'Create General Application');
    I.wait("2");
    I.click("Go");
    //Broken below
    I.waitForText("General Applications");
    I.click("Add new");
    I.checkOption("Applicant");
    I.checkOption("Yes");
    I.waitForText("Time estimate");
    I.fillField("Time estimate", "10");
    I.attachFile('input[type="file"]', '../data/dummy.pdf');
    I.wait("5");
    I.click('Continue');
    I.wait("5");
    I.waitForText("Event summary");
    I.click('Submit');
    I.waitForText('General Applications');
    I.clickTab('General Applications');

}

function caseWorkerReferGeneralApplication() {
    const I = this;

    I.waitForPage('select[id="next-step"]');
    I.selectOption('select[id="next-step"]', 'Refer to Judge (Application)');
    I.wait("2");
    I.click("Go");

    I.selectOption("Please select from general application", "General Application 1");
    I.fillField("Judge's email address", "judgefr@mailinator.com");
    I.click("Continue");
    I.click("Submit");

    I.see("Awaiting Judiciary Response (Application)")
    I.clickTab('General Applications');
    I.waitForText('General Applications');
}

function judgeGeneralApplicationOutcome() {
    const I = this;

    I.waitForPage('select[id="next-step"]');
    I.selectOption('select[id="next-step"]', 'General Application Outcome');
    I.wait("2");
    I.click("Go");

    I.selectOption("Please select from general application", "General Application 1");
    I.checkOption("Approved");
    I.click("Continue");
    I.click("Submit");

    I.see("General Application Outcome");
    I.clickTab('General Applications');
    I.waitForText('General Applications');
}

function generalApplicationDirections() {
    const I = this;

    I.waitForPage('select[id="next-step"]');
    I.selectOption('select[id="next-step"]', 'General Application Directions');
    I.wait("2");
    I.click("Go");

    I.selectOption("Please select from general application", "General Application 1");
    I.checkOption("No");
    I.fillField("Recitals", "Recite recite recitals!")
    I.selectOption('select[id="generalApplicationDirectionsJudgeType"]', "District Judge");
    I.fillField("Name of Judge", "Chapman");
    I.fillField('input[id="generalApplicationDirectionsCourtOrderDate-day"]', "01");
    I.fillField('input[id="generalApplicationDirectionsCourtOrderDate-month"]', "01");
    I.fillField('input[id="generalApplicationDirectionsCourtOrderDate-year"]', "2023");
    I.fillField("Directions from the Judge", "These are the directions from the judge, direct direct!");

    I.click("Continue");
    I.click("Submit");

    I.clickTab('General Applications');
    I.waitForText('General Applications');
}

module.exports = { solicitorCreateGeneralApplication, caseWorkerReferGeneralApplication, judgeGeneralApplicationOutcome, generalApplicationDirections };