/* eslint-disable no-invalid-this */
const verifyTabText = require('../../../data/verify-consented-tab-data.json');
const verifyContestedTabText = require('../../../data/verify-contested-tab-data.json');
const verifyContestedPaperTabText = require('../../../data/verify-contested-paper-case-tab-data.json');

function historyTab(caseType, tabName, eventName, endState) {
  const I = this;
  I.waitForText(tabName, '30');
  I.see(eventName);
  I.see(endState);
}

async function applicantTab(caseType, tabName) {
  const I = this;
  I.retry(3).waitForText(tabName, '90');
  // eslint-disable-next-line default-case
  switch (caseType) {
  case 'consented':
    await I.waitForNavigationToComplete('#mat-tab-label-0-1');
    await I.see(verifyTabText.applicantTab.applicantLastName);
    await I.see(verifyTabText.applicantTab.applicantsLocalCourt);
    await I.see(verifyTabText.applicantTab.applicantSolicitorName);
    await I.see(verifyTabText.applicantTab.applicantSolicitorFirm);
    await I.see(verifyTabText.applicantTab.applicantEmail);
    await I.see(verifyTabText.applicantTab.applicantEmailCommunication);
    break;
  case 'contested':
    await I.waitForNavigationToComplete('#mat-tab-label-0-1');
    await I.see(verifyContestedTabText.applicantTab.applicantLastName);
    await I.see(verifyContestedTabText.applicantTab.applicantSolicitorName);
    await I.see(verifyContestedTabText.applicantTab.applicantSolicitorFirm);
    await I.see(verifyContestedTabText.applicantTab.applicantEmail);
    await I.see(verifyContestedTabText.applicantTab.applicantEmailCommunication);
    break;
  case 'contestedPaper':
    await I.wait(3);
    await I.waitForNavigationToComplete('#mat-tab-label-0-1');
    await I.see(verifyContestedPaperTabText.applicantTab.applicantLastName);
    await I.see(verifyContestedPaperTabText.applicantTab.applicantSolicitorName);
    await I.see(verifyContestedPaperTabText.applicantTab.applicantSolicitorFirm);
    await I.see(verifyContestedPaperTabText.applicantTab.applicantEmail);
    await I.see(verifyContestedPaperTabText.applicantTab.applicationMadeOnPaper);
    break;
  }
}

async function respondentTab(caseType, tabName) {
  const I = this;
  I.retry(3).waitForText(tabName, '90');
  // eslint-disable-next-line default-case
  switch (caseType) {
  case 'consented':
    await I.waitForNavigationToComplete('#mat-tab-label-0-2');
    I.see(verifyTabText.respondentTab.respondentLastName);
    I.see(verifyTabText.respondentTab.respondentSolicitorName);
    I.see(verifyTabText.respondentTab.respondentSolicitorFirm);
    I.see(verifyTabText.respondentTab.respondentEmail);
    I.see(verifyTabText.respondentTab.respondentPostCode);
    break;
  case 'contested':
    await I.waitForNavigationToComplete('#mat-tab-label-0-3');
    I.see(verifyContestedTabText.respondentTab.respondentLastName);
    I.see(verifyContestedTabText.respondentTab.respondentSolicitorName);
    I.see(verifyContestedTabText.respondentTab.respondentSolicitorFirm);
    I.see(verifyContestedTabText.respondentTab.respondentEmail);
    I.see(verifyContestedTabText.respondentTab.respondentPostCode);
    break;
  case 'contestedPaper':
    await I.waitForNavigationToComplete('#mat-tab-label-0-3');
    I.see(verifyContestedPaperTabText.respondentTab.respondentLastName);
    I.see(verifyContestedPaperTabText.respondentTab.respondentRepresented);
    I.see(verifyContestedPaperTabText.respondentTab.respondentBuildingName);
    I.see(verifyContestedPaperTabText.respondentTab.respondentEmail);
    I.see(verifyContestedPaperTabText.respondentTab.respondentPostCode);
    break;
  }
}

async function divorceTab(caseType, tabName) {
  const I = this;
  I.waitForText(tabName, '5');
  // eslint-disable-next-line default-case
  switch (caseType) {
  case 'consented':
    await I.waitForNavigationToComplete('#mat-tab-label-0-3');
    I.runAccessibilityTest();
    I.see(verifyTabText.divorceTab.divorceCaseNumber);
    I.see(verifyTabText.divorceTab.decreeNisiFileName);
    break;
  case 'contested':
    await I.waitForNavigationToComplete('#mat-tab-label-0-2');
    I.see(verifyContestedTabText.divorceTab.divorceCaseNumber);
    I.see(verifyContestedTabText.divorceTab.decreeNisiFileName);
    I.see(verifyContestedTabText.divorceTab.applicantsLocalCourt);
    break;
  case 'contestedPaper':
    await I.waitForNavigationToComplete('#mat-tab-label-0-2');
    I.see(verifyContestedPaperTabText.divorceTab.divorceCaseNumber);
    I.see(verifyContestedPaperTabText.divorceTab.decreeNisiFileName);
    I.see(verifyContestedPaperTabText.divorceTab.applicantsLocalCourt);
    break;
  }
}

async function natureOfApplicationTab(caseType, tabName) {
  const I = this;
  I.waitForText(tabName, '5');
  // eslint-disable-next-line default-case
  switch (caseType) {
  case 'consented':
    await I.waitForNavigationToComplete('#mat-tab-label-0-4');
    I.see(verifyTabText.natureOfApplicationTab.applicationFor1);
    I.see(verifyTabText.natureOfApplicationTab.applicationFor2);
    I.see(verifyTabText.natureOfApplicationTab.addressDetails);
    I.see(verifyTabText.natureOfApplicationTab.mortgageDetails);
    I.see(verifyTabText.natureOfApplicationTab.orderForChildren);
    break;
  case 'contested':
    await I.waitForNavigationToComplete('#mat-tab-label-0-4');
    I.see(verifyContestedTabText.natureOfApplicationTab.applicationFor1);
    I.see(verifyContestedTabText.natureOfApplicationTab.applicationFor2);
    I.see(verifyContestedTabText.natureOfApplicationTab.addressDetails);
    I.see(verifyContestedTabText.natureOfApplicationTab.mortgageDetails);
    I.see(verifyContestedTabText.natureOfApplicationTab.orderForChildren);
    break;
  case 'contestedPaper':
    await I.waitForNavigationToComplete('#mat-tab-label-0-4');
    I.see(verifyContestedPaperTabText.natureOfApplicationTab.applicationFor1);
      I.see(verifyContestedPaperTabText.natureOfApplicationTab.applicationFor2);
    I.see(verifyContestedPaperTabText.natureOfApplicationTab.addressDetails);
    I.see(verifyContestedPaperTabText.natureOfApplicationTab.mortgageDetails);
    I.see(verifyContestedPaperTabText.natureOfApplicationTab.orderForChildren);
    break;
  }
}

async function authorisationTab(caseType, tabName) {
  const I = this;
  I.waitForText(tabName, '5');
  // eslint-disable-next-line default-case
  switch (caseType) {
  case 'consented':
    await I.waitForNavigationToComplete('#mat-tab-label-0-5');
    I.see(verifyTabText.authorisationTab.solicitorName);
    I.see(verifyTabText.authorisationTab.solicitorFirm);
    I.see(verifyTabText.authorisationTab.signedDate);
    break;
  case 'contested':
    await I.waitForNavigationToComplete('#mat-tab-label-0-5');
    I.see(verifyContestedTabText.authorisationTab.solicitorName);
    I.see(verifyContestedTabText.authorisationTab.solicitorFirm);
    I.see(verifyContestedTabText.authorisationTab.signedDate);
    break;
  case 'contestedPaper':
    I.see(verifyContestedPaperTabText.authorisationTab.solicitorName);
    I.see(verifyContestedPaperTabText.authorisationTab.solicitorFirm);
    I.see(verifyContestedPaperTabText.authorisationTab.signedDate);
    break;
  }
}
/* eslint-disable */
async function caseDocumentsTab(caseType, tabName, eventName) {
  const I = this;
  I.retry(3).waitForText(verifyContestedPaperTabText.historyTab.tabName, 30);
  // if (!I.see(tabName)) {
  //   await I.waitForNavigationToComplete('.mat-tab-header-pagination.mat-tab-header-pagination-after.mat-elevation-z4.mat-ripple')
  // }
  I.retry(3).waitForText(tabName, '90');
  // eslint-disable-next-line default-case
  switch (caseType) {
  case 'consented':
    await I.waitForNavigationToComplete('#mat-tab-label-0-6');
    await I.see(verifyTabText.caseDocumentsTab.draftDocumentName);
    await I.see(verifyTabText.caseDocumentsTab.latestConsentOrderLabel);
    await I.see(verifyTabText.caseDocumentsTab.pensionTypeName);
    if (eventName === verifyTabText.historyTab.issueApplicationEvent) {
      await I.see(verifyTabText.caseDocumentsTab.onlineFormA);
    }
    break;
  case 'contested':
    await I.waitForNavigationToComplete('#mat-tab-label-0-6');
    if (eventName === verifyContestedTabText.historyTab.assignToJudgeEvent ||
         eventName === verifyContestedTabText.historyTab.consentOrderEvent ||
         eventName === verifyContestedTabText.historyTab.assignToJudgeConsentEvent ||
         eventName === verifyContestedTabText.historyTab.createGeneralApplicationEvent ||
         eventName === verifyContestedTabText.historyTab.submitUploadCaseFilesEvent ||
         eventName === verifyContestedTabText.historyTab.sendOrderEvent) {
      await I.see(verifyContestedTabText.caseDocumentsTab.onlineFormA);
    } else {
      await I.see(verifyContestedTabText.caseDocumentsTab.draftOnlineFormA);
    }
    if (eventName === verifyContestedTabText.historyTab.createGeneralApplicationEvent) {
      await I.see(verifyContestedTabText.caseDocumentsTab.gaApplicationReceivedFrom);
      await I.see(verifyContestedTabText.caseDocumentsTab.gaHearingRequired);
      await I.see(verifyContestedTabText.caseDocumentsTab.gaLatestApplication);
      await I.see(verifyContestedTabText.caseDocumentsTab.gaUploadDraftOrder);
      await I.see(verifyContestedTabText.caseDocumentsTab.gaApplicationReceivedFrom);
    }
    break;
  case 'contestedPaper':
    await I.waitForNavigationToComplete('#mat-tab-label-0-5');
    await I.see(verifyContestedPaperTabText.caseDocumentsTab.uploadedOtherDocument);
    await I.see(verifyContestedPaperTabText.caseDocumentsTab.uploadedPaperDocumentLabel);
    await I.see(verifyContestedPaperTabText.caseDocumentsTab.uploadedPaperDocument);
    break;
  }
}

async function paymentDetailsTab(caseType, tabName) {
  const I = this;
  I.retry(3).waitForText(tabName, '90');
  // eslint-disable-next-line default-case
  switch (caseType) {
  case 'consented':
    //await I.waitForNavigationToComplete(".mat-tab-header-pagination.mat-tab-header-pagination-after.mat-elevation-z4.mat-ripple");
    await I.waitForNavigationToComplete('#mat-tab-label-0-7');
    I.see(verifyTabText.paymentDetailsTab.hwfNumber);
    I.see(verifyTabText.paymentDetailsTab.feeCode);
    I.see(verifyTabText.paymentDetailsTab.amount);
    break;
  case 'contested':
    await I.waitForNavigationToComplete('#mat-tab-label-0-7');
    I.see(verifyContestedTabText.paymentDetailsTab.hwfNumber);
    I.see(verifyContestedTabText.paymentDetailsTab.feeCode);
    I.see(verifyContestedTabText.paymentDetailsTab.amount);
    break;
  case 'contestedPaper':
    await I.waitForNavigationToComplete('#mat-tab-label-0-6');
    I.see(verifyContestedPaperTabText.paymentDetailsTab.hwfNumber);
    I.see(verifyContestedPaperTabText.paymentDetailsTab.feeCode);
    I.see(verifyContestedPaperTabText.paymentDetailsTab.amount);
    break;
  }
}
async function judgeDetailsTab(caseType, tabName, eventName) {
  const I = this;
  I.wait(5);
  I.retry(3).waitForText(tabName, '90');
  // eslint-disable-next-line default-case
  switch (caseType) {
  case 'consented':
    await I.waitForNavigationToComplete('div[id="mat-tab-label-0-8"]');
    I.see(verifyTabText.judgeDetailsTab.applicantFName);
    I.see(verifyTabText.judgeDetailsTab.respondentFName);
    I.see(verifyTabText.judgeDetailsTab.decreeNisiDate);
    I.see(verifyTabText.judgeDetailsTab.decreeNisiDocument);
    if (eventName === verifyTabText.historyTab.issueApplicationEvent) {
      I.see(verifyTabText.judgeDetailsTab.newApplication);
    }
    break;
  case 'contested':
    I.see(verifyContestedTabText.judgeDetailsTab.applicantFName);
    I.see(verifyContestedTabText.judgeDetailsTab.respondentFName);
    I.see(verifyContestedTabText.judgeDetailsTab.decreeNisiDate);
    I.see(verifyContestedTabText.judgeDetailsTab.decreeNisiDocument);
    if (eventName === verifyContestedTabText.historyTab.issueApplicationEvent) {
      I.see(verifyContestedTabText.judgeDetailsTab.newApplication);
    }
    break;
  case 'contestedPaper':
    I.see(verifyContestedPaperTabText.judgeDetailsTab.applicantFName);
    I.see(verifyContestedPaperTabText.judgeDetailsTab.respondentFName);
    I.see(verifyContestedPaperTabText.judgeDetailsTab.decreeNisiDate);
    I.see(verifyContestedPaperTabText.judgeDetailsTab.decreeNisiDocument);
    if (eventName === verifyContestedPaperTabText.historyTab.issueApplicationEvent) {
      I.see(verifyContestedPaperTabText.judgeDetailsTab.newApplication);
    }
    break;
  }
}

async function adminNotesTab(caseType, tabName) {
  const I = this;
  I.waitForText(tabName, '5');
  // eslint-disable-next-line default-case
  switch (caseType) {
  case 'consented':
    await I.waitForNavigationToComplete('#mat-tab-label-0-8');
    await I.see(verifyTabText.adminNotesTab.assignToJudgeReason);
    await I.see(verifyTabText.adminNotesTab.issueDate);
    await I.see(verifyTabText.adminNotesTab.assignToJudgeText);
    break;
  case 'contested':
    await I.waitForNavigationToComplete('#mat-tab-label-0-9');
    await I.see(verifyContestedTabText.adminNotesTab.issueDate);
    break;
  case 'contestedPaper':
    await I.waitForNavigationToComplete('#mat-tab-label-0-7');
    await I.see(verifyContestedPaperTabText.adminNotesTab.issueDate);
    break;
  }
}

async function approvedOrderTab(caseType, tabName) {
  const I = this;
  I.waitForText(tabName, '5');
  // eslint-disable-next-line default-case
  switch (caseType) {
  case 'consented':
    await I.waitForNavigationToComplete('div[id="mat-tab-label-0-7"]');
    I.see(verifyTabText.approvedOrderTab.approvedLetter);
    I.see(verifyTabText.approvedOrderTab.consentedAnnexedStamped);
    I.see(verifyTabText.approvedOrderTab.typeOfPensionDocumentTypeStamped);
    break;
  }
}
async function contestedOrderTab(caseType, tabName) {
  const I = this;
  await I.waitForText(tabName, '5');
  // eslint-disable-next-line default-case
  switch (caseType) {
  case 'contested':
    await I.waitForNavigationToComplete('#mat-tab-label-0-10');
    await I.see(verifyContestedTabText.OrdersTab.OrdersLabel);
    await I.see(verifyContestedTabText.OrdersTab.OrderFileName);
    break;
  }
}

async function gateKeepingAllocationsTab(caseType, tabName, eventName) {
  const I = this;
  I.waitForText(tabName, '5');
  // eslint-disable-next-line default-case
  switch (caseType) {
  case 'contested':
    await I.waitForNavigationToComplete('#mat-tab-label-0-8');
    I.see(verifyContestedTabText.gateKeepingAllocationsTab.localCourt);
    if (eventName === verifyContestedTabText.historyTab.issueApplicationEvent) {
      I.see(verifyContestedTabText.gateKeepingAllocationsTab.fastTrackProcedure);
      I.see(verifyContestedTabText.gateKeepingAllocationsTab.dateOfMarriage);
    }
    break;
  case 'contestedPaper':
    await I.waitForNavigationToComplete('#mat-tab-label-0-6');
    await I.see(verifyContestedPaperTabText.gateKeepingAllocationsTab.localCourt);
    await I.see(verifyContestedPaperTabText.gateKeepingAllocationsTab.fastTrackProcedure);
    await I.see(verifyContestedPaperTabText.gateKeepingAllocationsTab.dateOfMarriage);
    break;
  }
}

async function schedulingAndListingTab(caseType, tabName) {
  const I = this;
  I.waitForText(tabName, '5');
  // eslint-disable-next-line default-case
  switch (caseType) {
  case 'contested':
    await I.waitForNavigationToComplete('div[id="mat-tab-label-0-10"]');
    I.see(verifyContestedTabText.schedulingAndListingTab.localCourt);
    I.see(verifyContestedTabText.schedulingAndListingTab.courtFrc);
    break;
  case 'contestedPaper':
    await I.waitForNavigationToComplete('div[id="mat-tab-label-0-8"]');
    I.see(verifyContestedPaperTabText.schedulingAndListingTab.localCourt);
    I.see(verifyContestedPaperTabText.schedulingAndListingTab.courtFrc);
    break;
  }
}

async function consentOrderProcessTab(caseType, tabName) {
  const I = this;
  I.waitForText(tabName, '5');
  await I.waitForNavigationToComplete('div[id="mat-tab-label-0-11"]');
  I.see(verifyContestedTabText.consentOrderProcessTab.applicationFor);
  I.see(verifyContestedTabText.consentOrderProcessTab.mortgageDetails);
  I.see(verifyContestedTabText.consentOrderProcessTab.draftOrderDocument);
  I.see(verifyContestedTabText.consentOrderProcessTab.pensionDocument);
}

function verifyConsentedTabData(caseType, eventName, stateName) {
  const I = this;
  I.historyTab(caseType, verifyTabText.historyTab.tabName, eventName, stateName);
  I.applicantTab(caseType, verifyTabText.applicantTab.tabName);
  I.respondentTab(caseType, verifyTabText.respondentTab.tabName);
  I.divorceTab(caseType, verifyTabText.divorceTab.tabName);
  I.natureOfApplicationTab(caseType, verifyTabText.natureOfApplicationTab.tabName);
  I.authorisationTab(caseType, verifyTabText.authorisationTab.tabName);
  I.caseDocumentsTab(caseType, verifyTabText.caseDocumentsTab.tabName, eventName);
 }

async function verifyContestedTabData(caseType, eventName, stateName) {
  const I = this;
  await I.historyTab(caseType, verifyContestedTabText.historyTab.tabName, eventName, stateName);
  await I.applicantTab(caseType, verifyContestedTabText.applicantTab.tabName);
  await I.respondentTab(caseType, verifyContestedTabText.respondentTab.tabName);
  await I.divorceTab(caseType, verifyContestedTabText.divorceTab.tabName);
  await I.natureOfApplicationTab(caseType, verifyContestedTabText.natureOfApplicationTab.tabName);
  await I.authorisationTab(caseType, verifyContestedTabText.authorisationTab.tabName);
  await I.caseDocumentsTab(caseType, verifyContestedTabText.caseDocumentsTab.tabName, eventName);
  // I.paymentDetailsTab(caseType, verifyContestedTabText.paymentDetailsTab.tabName);
  //TODO-fix-test doesn't click the tab properly
  //I.gateKeepingAllocationsTab(caseType, verifyContestedTabText.gateKeepingAllocationsTab.tabName, eventName);
}

function verifyContestedPaperTabData(caseType, eventName, stateName) {
  const I = this;
  I.historyTab(caseType, verifyContestedPaperTabText.historyTab.tabName, eventName, stateName);
  I.applicantTab(caseType, verifyContestedPaperTabText.applicantTab.tabName);
  I.respondentTab(caseType, verifyContestedPaperTabText.respondentTab.tabName);
  I.divorceTab(caseType, verifyContestedPaperTabText.divorceTab.tabName);
  I.natureOfApplicationTab(caseType, verifyContestedPaperTabText.natureOfApplicationTab.tabName);
  I.caseDocumentsTab(caseType, verifyContestedPaperTabText.caseDocumentsTab.tabName, eventName);
  I.gateKeepingAllocationsTab(caseType, verifyContestedPaperTabText.gateKeepingAllocationsTab.tabName, eventName);
  I.schedulingAndListingTab(caseType, verifyContestedPaperTabText.schedulingAndListingTab.tabName);
}

async function verifyContestedConfidentialTabData(eventName, tabName) {
  const I = this;

  //I.waitForText(tabName, '5');
    switch (eventName) {
    case 'Upload Case Files':
      I.see(verifyContestedTabText.confidentialDocumentsTab.type);
      I.see(verifyContestedTabText.confidentialDocumentsTab.documentUrl);
      I.see(verifyContestedTabText.confidentialDocumentsTab.comment);
      I.see(verifyContestedTabText.confidentialDocumentsTab.fileName);
      break;
    case 'Manage confidential documents':
      I.see(verifyContestedTabText.confidentialDocumentsTab.type);
      I.see(verifyContestedTabText.confidentialDocumentsTab.manageConfDocumentUrl);
      break;
    }

}

async function contestedIntervenersTab(event, tabName) {

  const I = this;
  I.see(verifyContestedTabText.IntervenersTab.name);
  I.see(verifyContestedTabText.IntervenersTab.email);
  I.see(verifyContestedTabText.IntervenersTab.organization);
}

async function schedule1Tab(tabName) {

  const I = this;
  await I.waitForNavigationToComplete('div[id="mat-tab-label-0-2"]');
  I.see(verifyContestedTabText.Schedule1Tab.name);
  I.see(verifyContestedTabText.Schedule1Tab.dob);
}

async function changeOfRepresentativesTab(tabName) {

  const I = this;
  I.see(verifyContestedTabText.ChangeOfRepresentativesTab.tabName);
  I.see(verifyContestedTabText.ChangeOfRepresentativesTab.applicantHeader);
  I.see(verifyContestedTabText.ChangeOfRepresentativesTab.respondentHeader);
  I.see(verifyContestedTabText.ChangeOfRepresentativesTab.applicantParty);
  I.see(verifyContestedTabText.ChangeOfRepresentativesTab.respondentParty);
  I.see(verifyContestedTabText.ChangeOfRepresentativesTab.applicantClientName);
  I.see(verifyContestedTabText.ChangeOfRepresentativesTab.respondentClientName);
  I.see(verifyContestedTabText.ChangeOfRepresentativesTab.applicantUpdatedBy);
  I.see(verifyContestedTabText.ChangeOfRepresentativesTab.respondentUpdatedBy);
  I.see(verifyContestedTabText.ChangeOfRepresentativesTab.applicantUpdatedVia);
  I.see(verifyContestedTabText.ChangeOfRepresentativesTab.respondentUpdatedVia);
  I.see(verifyContestedTabText.ChangeOfRepresentativesTab.applicantOrganisation);
  I.see(verifyContestedTabText.ChangeOfRepresentativesTab.respondentOrganisation);
  I.see(verifyContestedTabText.ChangeOfRepresentativesTab.applicantName);
  I.see(verifyContestedTabText.ChangeOfRepresentativesTab.respondentName);
  I.see(verifyContestedTabText.ChangeOfRepresentativesTab.applicantEmail);
  I.see(verifyContestedTabText.ChangeOfRepresentativesTab.respondentEmail);
}

function verifyManageBarristerEvent(caseType, eventName, stateName) {
  const I = this;
  I.historyTab(caseType, verifyContestedTabText.historyTab.tabName, eventName, stateName);
}

function verifyCaseFlagEvent(caseType, eventName, stateName) {
  const I = this;
  I.historyTab(caseType, verifyContestedTabText.historyTab.tabName, eventName, stateName);
}

function verifyListForInterimHearing() {
  const I = this;
  I.see(verifyContestedTabText.listForInterimHearingTab.tabName);
  I.see(verifyContestedTabText.listForInterimHearingTab.typeOfHearing);
  I.see(verifyContestedTabText.listForInterimHearingTab.timeEstimate);
  I.see(verifyContestedTabText.listForInterimHearingTab.hearingDate);
  I.see(verifyContestedTabText.listForInterimHearingTab.hearingTime);
  I.see(verifyContestedTabText.listForInterimHearingTab.region);
  I.see(verifyContestedTabText.listForInterimHearingTab.FRC);
  I.see(verifyContestedTabText.listForInterimHearingTab.closestCourt);
  I.see(verifyContestedTabText.listForInterimHearingTab.addInfo);
  I.see(verifyContestedTabText.listForInterimHearingTab.uploadDocument);
  I.see(verifyContestedTabText.listForInterimHearingTab.documentName);
}

function verifyGeneralApplicationTab(status) {
  const I = this;
  I.see(verifyContestedTabText.GeneralApplicationsTab.tabName);
  I.see(verifyContestedTabText.GeneralApplicationsTab.tableHeader);
  I.see(verifyContestedTabText.GeneralApplicationsTab.applicationReceivedFrom);
  I.see(verifyContestedTabText.GeneralApplicationsTab.createdBy);
  I.see(verifyContestedTabText.GeneralApplicationsTab.hearingRequired);
  I.see(verifyContestedTabText.GeneralApplicationsTab.timeEstimate);
  I.see(status);
}

module.exports = {
  historyTab,
  applicantTab,
  respondentTab,
  divorceTab,
  natureOfApplicationTab,
  authorisationTab,
  caseDocumentsTab,
  paymentDetailsTab,
  judgeDetailsTab,
  adminNotesTab,
  contestedOrderTab,
  approvedOrderTab,
  gateKeepingAllocationsTab,
  schedulingAndListingTab,
  consentOrderProcessTab,
  verifyConsentedTabData,
  verifyContestedTabData,
  verifyContestedPaperTabData,
  verifyContestedConfidentialTabData,
  contestedIntervenersTab,
  schedule1Tab,
  changeOfRepresentativesTab,
  verifyManageBarristerEvent,
  verifyListForInterimHearing,
  verifyCaseFlagEvent,
  verifyGeneralApplicationTab
};
