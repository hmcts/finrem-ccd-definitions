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
        "Create consent order in Form A contested case - Consent Order - General Consent Order - respond to consent order - assign to judge - approve consent application - send consent order - close case",
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
            axeUtils
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
            await axeUtils.audit();
            await natureOfApplicationPage.navigateContinue(url, 2);

            await writtenAgreementPage.selectConsentOrder(true, false);
            await natureOfApplicationPage.navigateContinue(url, 3);

            await uploadOrderDocumentsPage.uploadConsentOrder();
            await uploadOrderDocumentsPage.navigateContinue(url, 4);

            await uploadOrderDocumentsPage.selectAndUploadJointD81(true);
            await axeUtils.audit();
            await uploadOrderDocumentsPage.navigateContinue(url, 5);

            await uploadOrderDocumentsPage.uploadPensionDocument('Form P1');
            await axeUtils.audit();
            await uploadOrderDocumentsPage.navigateContinue(url, 6);

            await uploadOrderDocumentsPage.uploadVariationOrderDoc();
            await uploadOrderDocumentsPage.navigateContinue(url, 7);

            await createCaseSavingYourAnswersPage.checkSelectedCourtAddress(courtAddress);
            await createCaseSavingYourAnswersPage.checkSelectedCourtName(courtName);
            await createCaseSavingYourAnswersPage.checkSelectedCourtPhone(courtPhone);
            await createCaseSavingYourAnswersPage.checkSelectedCourtEmail(courtEmail);
            await axeUtils.audit();
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
            await axeUtils.audit();
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
            await axeUtils.audit();
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
            await manageCaseDashboardPage.signOut();
        });

    test(
        "Create consent order in Form A contested case - Consent Order - assign to judge - Consent order not approved - respond to consent order - assign to judge - approve - send consent order - close case",
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
                   consentOrderNotApprovedPage,
                   consentApplicationApprovePage,
                   sendOrderPage,
                   eventSummaryPage,
                   axeUtils
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

            await caseDetailsPage.selectNextStep(ContestedEvents.assignToJudgeConsent);
            await uploadOrderDocumentsPage.navigateSubmit();
            await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.assignToJudgeConsent.listItem);
            await manageCaseDashboardPage.signOut();

            // log in as judge to Not approve the consent application
            await manageCaseDashboardPage.visit();
            await loginPage.loginWaitForPath(
                config.judge.email,
                config.judge.password,
                config.manageCaseBaseURL,
                config.loginPaths.cases
            );
            await manageCaseDashboardPage.navigateToCase(caseId);

            await caseDetailsPage.selectNextStep(ContestedEvents.consentOrderNotApproved);
            url = ContestedEvents.consentOrderNotApproved.ccdCallback;

            await consentOrderNotApprovedPage.assertPageTitle();
            await consentOrderNotApprovedPage.assertMandatoryFields();
            await consentOrderNotApprovedPage.verifyReasonsForRefusal();
            await consentOrderNotApprovedPage.selectAllReasonsForRefusal();
            await consentOrderNotApprovedPage.selectJudge("His Honour Judge")
            await axeUtils.audit();
            await consentOrderNotApprovedPage.navigateContinue();
            await consentOrderNotApprovedPage.navigateContinue(url + '/submit');
            const reasons = [
                "Insufficient information has been provided as to the parties’ capital positions if the order were effected",
                "Insufficient information has been provided as to the parties’ housing needs and whether they are met by the order",
                "Insufficient information has been provided as to the justification for departure from equality of capital",
                "Insufficient information has been provided as to the parties’ pension provision if the order were effected",
                "Insufficient information has been provided as to the children’s housing needs and whether they are met by the order",
                "The pension annex has not been attached",
                "It is unclear whether the Respondent has obtained independent legal advice",
                "The D81 form is incomplete",
                "Application should be fixed for hearing on first available date for 20 minutes when the Court will consider whether the draft order should be approved. Both parties should attend and if they do not do so the Court may not approve the order",
                "Financial Remedy application to be transferred to the Applicant’s home court to consider listing directions",
                "Entire case to be transferred to the Applicant’s home court to consider listing directions",
                "The proposed order does not appear to be fair taking account of S25 Matrimonial Causes Act 1973.  The parties are requested to explain more fully the thinking behind the order and why it is fair.",
                "Please provide a breakdown of the pension values/property values as it is not possible to understand the values of what each party will receive.",
            ];

            await checkYourAnswersPage.assertCheckYourAnswersPage({
                tableName: "Check your answers",
                rows: [
                    "Application Not Approved",
                    'Reason for Refusal',
                    ...reasons,
                    { cellItem: 'Select Judge', value: 'His Honour Judge' },
                    { cellItem: "Name of Judge", value: "Peter Chapman" },
                    { cellItem: 'Date of order', value: DateHelper.getTodayFormattedDate() }
                ]
            });

            await consentOrderNotApprovedPage.navigateSubmit();
            await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.consentOrderNotApproved.listItem);
            await caseDetailsPage.assertTabData([
                {
                    tabName: "Consent Order Process",
                    tabContent: [
                        "Refused Order Collection",
                        "Consent Order Annexed and Stamped"
                    ]
                }
            ]);

            await manageCaseDashboardPage.signOut();

            await manageCaseDashboardPage.visit();
            await loginPage.loginWaitForPath(
                config.caseWorker.email,
                config.caseWorker.password,
                config.manageCaseBaseURL,
                config.loginPaths.worklist
            );
            await manageCaseDashboardPage.navigateToCase(caseId);

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
            await manageCaseDashboardPage.signOut();
        });
});
