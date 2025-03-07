async function assignCaseToApplicant(config, manageOrgDashboardPage, loginPage, caseId) {
    await manageOrgDashboardPage.visit();
    await loginPage.login(config.applicantCAA.email, config.applicantCAA.password, config.manageOrgBaseURL);
    await manageOrgDashboardPage.searchAndSelectCaseToAssign(caseId);
    await manageOrgDashboardPage.assignCaseToEmail(config.applicant_solicitor.email);
    await manageOrgDashboardPage.navigateContinue();
    await manageOrgDashboardPage.navigateConfirm();
}

module.exports = { assignCaseToApplicant };
