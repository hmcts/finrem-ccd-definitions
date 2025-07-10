import {test} from "../../fixtures/fixtures.ts";
import {ContestedCaseFactory} from "../../data-utils/factory/contested/ContestedCaseFactory.ts";
import config from "../../config/config.ts";

test.describe('Confidentiality of cases', () => {

    test(
        'Draft cases should not be visible to other users', {tag: []},
        async ({loginPage, manageCaseDashboardPage}) => {

            // Create a draft case
            const solCaseId = await ContestedCaseFactory.createBaseContestedFormA();
            const caseworkerCaseId = await ContestedCaseFactory.createBaseContestedPaperCase();

            await manageCaseDashboardPage.visit();
            await loginPage.loginWaitForPath(config.applicant_solicitor.email, config.applicant_solicitor.password, config.manageCaseBaseURL, config.loginPaths.cases);
            await manageCaseDashboardPage.navigateToCase(solCaseId);
            await manageCaseDashboardPage.navigateToCase(caseworkerCaseId, false);
            await manageCaseDashboardPage.signOut();

            await manageCaseDashboardPage.visit();
            await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
            await manageCaseDashboardPage.navigateToCase(caseworkerCaseId);
            await manageCaseDashboardPage.navigateToCase(solCaseId, false);
            await manageCaseDashboardPage.signOut();

        }
    );
});

test(
    'Validate Case List Page', {tag: []},
    async ({loginPage, manageCaseDashboardPage, caseListPage}) => {
        await manageCaseDashboardPage.visit();
        await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
        await caseListPage.visit();

        await caseListPage.verifyCaseListPageForConsentedCase([
                'Any',
                'New Paper Case',
                'Awaiting HWF Decision',
                'Solicitor - Awaiting Payment',
                'Awaiting Payment Response',
                'Application Submitted',
                'Application Issued',
                'Awaiting Judicial Response',
                'Consent Order Not Approved',
                'Consent Order Approved',
                'Consent Order Made',
                'Awaiting Response',
                'Response Received',
                'Awaiting Information',
                'Information Received',
                'Close',
                'Ready For Hearing'
        ]);
        await caseListPage.verifyCaseListPageForContestedCase([
                'Any',
                'Awaiting HWF Decision',
                'Awaiting Payment Response',
                'Application Submitted',
                'Application Issued',
                'Gate Keeping And Allocation',
                'Scheduling And Hearing',
                'Prepare For Hearing',
                'Ready for Hearing',
                'Close',
                'Case Worker Review',
                'Judge Draft Order',
                'Solicitor Draft Order',
                'Review Order',
                'Draft Order Not Approved',
                'Schedule & Raise Directions Order',
                'Order Drawn',
                'Order Sent',
                'Consented Order Submitted',
                'Awaiting Judiciary Response (Consent)',
                'Consent Assigned to Judge',
                'Consented Order Approved',
                'Response Received',
                'Consented Order Not Approved',
                'General Application',
                'Awaiting Judiciary Response (Application)',
                'General Application Outcome',
                'Application Drafted',
                '[NOT IN USE] Consent Process',
                '[NOT IN USE] Awaiting Judiciary Response',
                '[NOT IN USE] Consent Order Approved',
                '[NOT IN USE] Consent Order Not Approved',
                '[NOT IN USE] Consent Order Made'
        ]);

        await manageCaseDashboardPage.signOut();

        await loginPage.loginWaitForPath(config.applicant_solicitor.email, config.applicant_solicitor.password, config.manageCaseBaseURL, config.loginPaths.cases);
        await caseListPage.visit();

        await caseListPage.verifyCaseListPageForConsentedCase([
                'Any',
                'Application Drafted',
                'New Paper Case',
                'Awaiting HWF Decision',
                'Solicitor - Awaiting Payment',
                'Awaiting Payment Response',
                'Application Submitted',
                'Application Issued',
                'Awaiting Judicial Response',
                'Consent Order Not Approved',
                'Consent Order Approved',
                'Consent Order Made',
                'Awaiting Response',
                'Response Received',
                'Awaiting Information',
                'Information Received',
                'Close',
                'Ready For Hearing'
        ], false );
        await caseListPage.verifyCaseListPageForContestedCase([
                'Any',
                'Application Drafted',
                'Awaiting HWF Decision',
                'Awaiting Payment Response',
                'Application Submitted',
                'Application Issued',
                'Gate Keeping And Allocation',
                'Scheduling And Hearing',
                'Prepare For Hearing',
                'Ready for Hearing',
                'Close',
                'Case Worker Review',
                'Judge Draft Order',
                'Solicitor Draft Order',
                'Review Order',
                'Draft Order Not Approved',
                'Schedule & Raise Directions Order',
                'Order Drawn',
                'Order Sent',
                'Consented Order Submitted',
                'Awaiting Judiciary Response (Consent)',
                'Consent Assigned to Judge',
                'Consented Order Approved',
                'Response Received',
                'Consented Order Not Approved',
                'Awaiting Judiciary Response (Application)',
                'General Application Outcome',
                'Application Drafted',
                '[NOT IN USE] Consent Process',
                '[NOT IN USE] Awaiting Judiciary Response',
                '[NOT IN USE] Consent Order Approved',
                '[NOT IN USE] Consent Order Not Approved',
                '[NOT IN USE] Consent Order Made'
        ], false);

        await manageCaseDashboardPage.signOut();

        await loginPage.loginWaitForPath(config.judge.email, config.judge.password, config.manageCaseBaseURL, config.loginPaths.cases);
        await caseListPage.visit();

        await caseListPage.verifyCaseListPageForConsentedCase([
                'Any',
                'New Paper Case',
                'Awaiting HWF Decision',
                'Solicitor - Awaiting Payment',
                'Awaiting Payment Response',
                'Application Submitted',
                'Application Issued',
                'Awaiting Judicial Response',
                'Consent Order Not Approved',
                'Consent Order Approved',
                'Consent Order Made',
                'Awaiting Response',
                'Response Received',
                'Awaiting Information',
                'Information Received',
                'Close',
                'Ready For Hearing'
        ], false);
        await caseListPage.verifyCaseListPageForContestedCase([
                'Any',
                'Awaiting HWF Decision',
                'Awaiting Payment Response',
                'Application Submitted',
                'Application Issued',
                'Gate Keeping And Allocation',
                'Scheduling And Hearing',
                'Prepare For Hearing',
                'Ready for Hearing',
                'Close',
                'Case Worker Review',
                'Judge Draft Order',
                'Solicitor Draft Order',
                'Review Order',
                'Draft Order Not Approved',
                'Schedule & Raise Directions Order',
                'Order Drawn',
                'Order Sent',
                'Consented Order Submitted',
                'Awaiting Judiciary Response (Consent)',
                'Consent Assigned to Judge',
                'Consented Order Approved',
                'Response Received',
                'Consented Order Not Approved',
                'General Application',
                'Awaiting Judiciary Response (Application)',
                'General Application Outcome',
                'Application Drafted',
                '[NOT IN USE] Consent Process',
                '[NOT IN USE] Awaiting Judiciary Response',
                '[NOT IN USE] Consent Order Approved',
                '[NOT IN USE] Consent Order Not Approved',
                '[NOT IN USE] Consent Order Made'
        ], false);

        await manageCaseDashboardPage.signOut();
    }
);