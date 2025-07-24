import {expect, test} from "../../../fixtures/fixtures.ts";
import {ContestedCaseFactory} from "../../../data-utils/factory/contested/ContestedCaseFactory.ts";
import config from "../../../config/config.ts";
import {ContestedEvents} from "../../../config/case-data.ts";
import {consentOrderTable} from "../../../resources/check_your_answer_content/consent_order/consentOrderTable.ts";
import {
    consent_order_process_tab
} from "../../../resources/tab_content/contested/consent_order_process_tab.ts";
import {DateHelper} from "../../../data-utils/DateHelper.ts";

test.describe("Consent order in contested case", () => {
    test(
        "Create consent order in Form A contested case",
        { tag: ["@accessibility"] },
        async ({
            loginPage,
            manageCaseDashboardPage,
            natureOfApplicationPage,
            writtenAgreementPage,
            uploadOrderDocumentsPage,
            caseDetailsPage,
            createCaseSavingYourAnswersPage,
            checkYourAnswersPage,
            createGeneralOrderPage,
            consentApplicationApprovePage,
            sendOrderPage,
            eventSummaryPage,
            makeAxeBuilder
        }, testInfo) => {
            // Set up court information.
            const courtName = "Coventry Combined Court Centre";
            const courtAddress = "140 Much Park Street, Coventry, CV1 2SN";
            const courtEmail: string = "FRCBirmingham@justice.gov.uk";
            const courtPhone: string = "0300 123 5577";
            let url: string = ContestedEvents.consentOrder.ccdCallback;

            const caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication();

            // Sign in
            await manageCaseDashboardPage.visit();
            await loginPage.loginWaitForPath(
                config.caseWorker.email,
                config.caseWorker.password,
                config.manageCaseBaseURL,
                config.loginPaths.worklist
            );
            await manageCaseDashboardPage.navigateToCase(caseId);

            await caseDetailsPage.selectNextStep(ContestedEvents.consentOrder);

            // Nature of App
            await natureOfApplicationPage.selectNatureOfApplication();
            await natureOfApplicationPage.addConsentedPropertyAdjustmentDetails();
            await natureOfApplicationPage.navigateContinue(url, 2);

            await writtenAgreementPage.selectConsentOrder(true, false);
            await natureOfApplicationPage.navigateContinue(url, 3);

            await uploadOrderDocumentsPage.uploadConsentOrder();
            await uploadOrderDocumentsPage.navigateContinue(url, 4);

            await uploadOrderDocumentsPage.selectAndUploadJointD81(true);
            await uploadOrderDocumentsPage.navigateContinue(url, 5);

            await uploadOrderDocumentsPage.uploadPensionDocument('Form P1');
            await uploadOrderDocumentsPage.navigateContinue(url, 6);

            await uploadOrderDocumentsPage.uploadVariationOrderDoc();
            await uploadOrderDocumentsPage.navigateContinue(url, 7);

            await createCaseSavingYourAnswersPage.checkSelectedCourtAddress(courtAddress);
            await createCaseSavingYourAnswersPage.checkSelectedCourtName(courtName);
            await createCaseSavingYourAnswersPage.checkSelectedCourtPhone(courtPhone);
            await createCaseSavingYourAnswersPage.checkSelectedCourtEmail(courtEmail);
            await createCaseSavingYourAnswersPage.navigateContinue(url+ "/submit");

            await checkYourAnswersPage.assertCheckYourAnswersPage(consentOrderTable);
            await createCaseSavingYourAnswersPage.navigateSubmit();

            await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.consentOrder.listItem);

            await caseDetailsPage.validateFileTree([
                {
                    type: 'folder',
                    label: "Applications",
                    children : [
                        {
                            type: 'folder',
                            label: "Consent Order To Finalise Proceedings",
                            children: [
                                {
                                    type: 'file',
                                    label: 'test.pdf'
                                },
                                {
                                    type: 'file',
                                    label: 'Form P1.pdf'
                                },
                                {
                                    type: 'file',
                                    label: 'OnlineForm.pdf'
                                },
                                {
                                    type: 'file',
                                    label: 'Variation order.pdf'
                                }
                            ]
                        }
                    ]
                }
            ]);

            const description = "Create general order for consent";
            await caseDetailsPage.selectNextStep(ContestedEvents.createGeneralOrderConsent);
            url = ContestedEvents.createGeneralOrderConsent.ccdCallback;
            await createGeneralOrderPage.assertPageTitle('Create General Order (consent)');
            await createGeneralOrderPage.selectJudge('District Judge');
            await createGeneralOrderPage.fillDescription(description);
            await createGeneralOrderPage.enterCourtDate();
            await createGeneralOrderPage.navigateContinue(url, 2);
            await createGeneralOrderPage.assertPreviewOfGeneralOrder();
            await createGeneralOrderPage.navigateContinue(url + '/submit');
            await createGeneralOrderPage.navigateSubmit();

            await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.createGeneralOrderConsent.listItem);
            await caseDetailsPage.assertTabData(consent_order_process_tab);
            await caseDetailsPage.validateFileTree([
                {
                    type: 'folder',
                    label: "Approved Orders",
                    children : [
                        {
                            type: 'folder',
                            label: "Consent Order To Finalise Proceedings",
                            children: [
                                {
                                    type: 'file',
                                    label: 'generalOrder-',
                                    contentSnippets: [
                                        `Case No: ${caseId}`,
                                        `Order made by District Judge Mumford on ${DateHelper.getTodayFullFormattedDate()} SITTING AT the Family`,
                                        `Court at the ${courtName}.`,
                                        description
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]);

            // respond  to consent order
            await caseDetailsPage.selectNextStep(ContestedEvents.respondToConsentOrder);
            url = ContestedEvents.respondToConsentOrder.ccdCallback;
            await uploadOrderDocumentsPage.navigateContinue(url, 2);
            await uploadOrderDocumentsPage.navigateContinue(url, 3);
            await uploadOrderDocumentsPage.navigateContinue(url, 4);
            await uploadOrderDocumentsPage.navigateContinue(url, 5);
            await uploadOrderDocumentsPage.navigateContinue(url + '/submit');
            await uploadOrderDocumentsPage.navigateSubmit();
            await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.respondToConsentOrder.listItem);

            await caseDetailsPage.selectNextStep(ContestedEvents.assignToJudgeConsent);
            await uploadOrderDocumentsPage.navigateSubmit();
            await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.assignToJudgeConsent.listItem);
            await manageCaseDashboardPage.signOut();

            // log in as judge to approve the consent application
            await manageCaseDashboardPage.visit();
            await loginPage.loginWaitForPath(
                config.judge.email,
                config.judge.password,
                config.manageCaseBaseURL,
                config.loginPaths.cases
            );
            await manageCaseDashboardPage.navigateToCase(caseId);
            // Approve consent application
            await caseDetailsPage.selectNextStep(ContestedEvents.consentApplicationApproved);
            url = ContestedEvents.consentApplicationApproved.ccdCallback;
            await consentApplicationApprovePage.assertConsentApplicationApprovedPage();
            await consentApplicationApprovePage.assertMandatoryFields();
            await consentApplicationApprovePage.selectSubjectToDecreeAbsoluteValue(true);
            await consentApplicationApprovePage.selectCopyOfOrderToPensionProvider(true, "The Court");
            await consentApplicationApprovePage.selectJudge('District Judge');
            await consentApplicationApprovePage.enterCourtDate();
            await consentApplicationApprovePage.navigateContinue(url + '/submit');

            await checkYourAnswersPage.assertCheckYourAnswersPage({
                tableName: "Check your answers",
                rows: [
                    { cellItem: 'Subject to Decree Absolute/Final Order?', value: 'Yes' },
                    { cellItem: 'Does a copy of this order need to be served to the pension provider?', value: 'Yes' },
                    { cellItem: 'Who is responsible for sending a copy of the order to the pension provider?', value: 'The Court' },
                    { cellItem: 'Select Judge', value: 'District Judge' },
                    { cellItem: "Name of Judge", value: "Peter Chapman" },
                    { cellItem: 'Date of order', value: DateHelper.getTodayFormattedDate() }
                ]
            })
            await consentApplicationApprovePage.navigateSubmit();
            await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.consentApplicationApproved.listItem);
            await caseDetailsPage.assertTabData([
                {
                    tabName: "Consent Order Process",
                    tabContent: [
                        { tabItem: 'Subject to Decree Absolute/Final Order?', value: 'Yes' },
                        { tabItem: 'Does a copy of this order need to be served to the pension provider?', value: 'Yes' },
                        { tabItem: 'Who is responsible for sending a copy of the order to the pension provider?', value: 'The Court' },
                        { tabItem: 'Select Judge', value: 'District Judge' },
                        { tabItem: "Name of Judge", value: "Peter Chapman" },
                        { tabItem: 'Date of order', value: DateHelper.getTodayFormattedDate() }
                    ]
                }
            ]);
            await manageCaseDashboardPage.signOut();

            // log in as caseworker to check the consent order
            await manageCaseDashboardPage.visit();
            await loginPage.loginWaitForPath(
                config.caseWorker.email,
                config.caseWorker.password,
                config.manageCaseBaseURL,
                config.loginPaths.worklist
            );
            await manageCaseDashboardPage.navigateToCase(caseId);
            await caseDetailsPage.selectNextStep(ContestedEvents.sendConsentOrder);
            await sendOrderPage.navigateContinue();
            await sendOrderPage.navigateContinue();
            await checkYourAnswersPage.assertCheckYourAnswersPage({
                tableName: "Check your answers",
                rows: [
                    { cellItem: "Who should receive this order?", value: "Applicant - Frodo BagginsRespondent - Smeagol Gollum"}
                ]
            });
            await sendOrderPage.navigateSubmit();
            await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.sendConsentOrder.listItem);

            await caseDetailsPage.selectNextStep(ContestedEvents.closeCase)
            await eventSummaryPage.navigateSubmit();
            await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.closeCase.listItem);

            if (config.run_accessibility) {
                const accessibilityScanResults = await makeAxeBuilder().analyze();

                await testInfo.attach('accessibility-scan-results', {
                    body: JSON.stringify(accessibilityScanResults, null, 2),
                    contentType: 'application/json'
                });

                expect(accessibilityScanResults.violations).toEqual([]);
            }
        });
});
