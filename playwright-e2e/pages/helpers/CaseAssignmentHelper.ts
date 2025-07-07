import { ManageOrgDashboardPage } from '../ManageOrgDashboardPage';
import { SigninPage } from "../SigninPage";
import config from "../../config/config";

export async function assignCaseToApplicant(
    loginPage: SigninPage,
    manageOrgDashboardPage: ManageOrgDashboardPage,
    caseId: string
): Promise<void> {
    await manageOrgDashboardPage.visit();
    await loginPage.loginWaitForPath(config.applicantCAA.email, config.applicantCAA.password, config.manageOrgBaseURL, config.loginPaths.organisation);
    await manageOrgDashboardPage.searchAndSelectCaseToAssign(caseId);
    await manageOrgDashboardPage.assignCaseToEmail(config.applicant_solicitor.email);
    await manageOrgDashboardPage.navigateContinue();
    await manageOrgDashboardPage.navigateConfirm();
    await manageOrgDashboardPage.signOut();
}

export async function assignCaseToRespondent(
    loginPage: SigninPage,
    manageOrgDashboardPage: ManageOrgDashboardPage,
    caseId: string
): Promise<void> {
    await manageOrgDashboardPage.visit();
    await loginPage.loginWaitForPath(config.respondentCAA.email, config.respondentCAA.password, config.manageOrgBaseURL, config.loginPaths.organisation);
    await manageOrgDashboardPage.searchAndSelectCaseToAssign(caseId);
    await manageOrgDashboardPage.assignCaseToEmail(config.respondent_solicitor.email);
    await manageOrgDashboardPage.navigateContinue();
    await manageOrgDashboardPage.navigateConfirm();
    await manageOrgDashboardPage.signOut();
}
