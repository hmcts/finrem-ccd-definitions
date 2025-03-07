async function assignCaseToApplicant(config, manageOrgDashboardPage, loginPage, caseId) {
    await manageOrgDashboardPage.visit();
    await loginPage.login(config.applicantCAA.email, config.applicantCAA.password, config.manageOrgBaseURL);
    await manageOrgDashboardPage.searchAndSelectCaseToAssign(caseId);
    await manageOrgDashboardPage.assignCaseToEmail(config.applicant_solicitor.email);
    await manageOrgDashboardPage.navigateContinue();
    await manageOrgDashboardPage.navigateConfirm();
    //await manageOrgDashboardPage.wait(1000);
    await manageOrgDashboardPage.signOut();
}

async function assignCaseToRespondent(config, manageOrgDashboardPage, loginPage, caseId) {
    await manageOrgDashboardPage.visit();
    await loginPage.login(config.respondentCAA.email, config.respondentCAA.password, config.manageOrgBaseURL);
    await manageOrgDashboardPage.searchAndSelectCaseToAssign(caseId);
    await manageOrgDashboardPage.assignCaseToEmail(config.respondent_solicitor.email);
    await manageOrgDashboardPage.navigateContinue();
    await manageOrgDashboardPage.navigateConfirm();
    //await manageOrgDashboardPage.wait(1000);
    await manageOrgDashboardPage.signOut();
}

module.exports = { assignCaseToApplicant, assignCaseToRespondent };
