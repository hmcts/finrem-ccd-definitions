import { test } from "../../../fixtures/fixtures.ts";
import {ContestedCaseFactory} from "../../../data-utils/factory/contested/ContestedCaseFactory.ts";
import config from "../../../config/config.ts";
import {ConsentedEvents, ContestedEvents} from "../../../config/case-data.ts";

test.describe("Consent order in contested case", () => {
    test(
        "Create consent order in Form A contested case",
        { tag: ["@accessibility"] },
        async ({
            loginPage,
            manageCaseDashboardPage,
            natureOfApplicationPage,
            propertyAdjustmentPage,
            periodicalPaymentsPage,
            writtenAgreementPage,
            fastTrackProcedurePage,
            financialAssetsPage,
            financialRemedyCourtPage,
            miamQuestionPage,
            miamDetailsPage,
            uploadOrderDocumentsPage,
            createCaseCheckYourAnswersPage,
            caseDetailsPage,
            expressCaseEnrolledPage,
            createCaseSavingYourAnswersPage,
            checkYourAnswersPage
        }) => {
            // Set up court information.
            const courtName = "BIRMINGHAM CIVIL AND FAMILY JUSTICE CENTRE";
            const courtAddress = "Priory Courts, 33 Bull Street, Birmingham, B4 6DS";
            const courtEmail: string = "FRCBirmingham@justice.gov.uk";
            const courtPhone: string = "0300 123 5577";
            const url = ConsentedEvents.consentOrder.ccdCallback;

            const caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication();

            // Sign in
            await manageCaseDashboardPage.visit();
            await loginPage.loginWaitForPath(
                config.applicant_solicitor.email,
                config.applicant_solicitor.password,
                config.manageCaseBaseURL,
                config.loginPaths.cases
            );
            await manageCaseDashboardPage.navigateToCase(caseId);

            await caseDetailsPage.selectNextStep(ContestedEvents.consentOrder);

            // Nature of App
            await natureOfApplicationPage.selectNatureOfApplication();
            await natureOfApplicationPage.addConsentedPropertyAdjustmentDetails();
            await natureOfApplicationPage.navigateContinue(url, 2);



        });
});
