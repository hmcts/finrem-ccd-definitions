/* eslint-disable no-invalid-this */
const verifyTabText = require('../../../data/verify-consented-tab-data.json');
const verifyContestedTabText = require('../../../data/verify-contested-tab-data.json');
const verifyConsentedTabText = require('../../../data/verify-consented-tab-data.json');
const verifyContestedPaperTabText = require('../../../data/verify-contested-paper-case-tab-data.json');

async function historyTab(caseType, tabName, eventName, endState) {
  const I = this;
  await I.waitForText(tabName, '30');
  await I.see(eventName);
  await I.see(endState);
}

async function applicantTab(caseType, tabName) {
  const I = this;
  await I.retry(3).waitForText(tabName, '90');
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
    await I.waitForNavigationToComplete('#mat-tab-label-0-2');
    await I.see(verifyContestedTabText.applicantTab.applicantLastName);
    await I.see(verifyContestedTabText.applicantTab.applicantSolicitorName);
    await I.see(verifyContestedTabText.applicantTab.applicantSolicitorFirm);
    await I.see(verifyContestedTabText.applicantTab.applicantEmail);
    await I.see(verifyContestedTabText.applicantTab.applicantEmailCommunication);
    break;
  case 'contestedPaper':
    await I.wait(3);
    await I.waitForNavigationToComplete('#mat-tab-label-0-2');
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
  await I.retry(3).waitForText(tabName, '90');
  // eslint-disable-next-line default-case
  switch (caseType) {
  case 'consented':
    await I.waitForNavigationToComplete('#mat-tab-label-0-2');
    await I.see(verifyTabText.respondentTab.respondentLastName);
    await I.see(verifyTabText.respondentTab.respondentSolicitorName);
    await I.see(verifyTabText.respondentTab.respondentSolicitorFirm);
    await I.see(verifyTabText.respondentTab.respondentEmail);
    await I.see(verifyTabText.respondentTab.respondentPostCode);
    break;
  case 'contested':
    await I.waitForNavigationToComplete('#mat-tab-label-0-4');
    await I.see(verifyContestedTabText.respondentTab.respondentLastName);
    await I.see(verifyContestedTabText.respondentTab.respondentSolicitorName);
    await I.see(verifyContestedTabText.respondentTab.respondentSolicitorFirm);
    await I.see(verifyContestedTabText.respondentTab.respondentEmail);
    await I.see(verifyContestedTabText.respondentTab.respondentPostCode);
    break;
  case 'contestedPaper':
    await I.waitForNavigationToComplete('#mat-tab-label-0-4');
    await I.see(verifyContestedPaperTabText.respondentTab.respondentLastName);
    await I.see(verifyContestedPaperTabText.respondentTab.respondentRepresented);
    await I.see(verifyContestedPaperTabText.respondentTab.respondentBuildingName);
    await I.see(verifyContestedPaperTabText.respondentTab.respondentEmail);
    await I.see(verifyContestedPaperTabText.respondentTab.respondentPostCode);
    break;
  }
}

async function divorceTab(caseType, tabName) {
  const I = this;
  await I.waitForText(tabName, '5');
  // eslint-disable-next-line default-case
  switch (caseType) {
  case 'consented':
    await I.waitForNavigationToComplete('#mat-tab-label-0-3');
    await I.see(verifyTabText.divorceTab.divorceCaseNumber);
    await I.see(verifyTabText.divorceTab.decreeNisiFileName);
    break;
  case 'contested':
    await I.waitForNavigationToComplete('#mat-tab-label-0-3');
    await I.see(verifyContestedTabText.divorceTab.divorceCaseNumber);
    await I.see(verifyContestedTabText.divorceTab.decreeNisiFileName);
    await I.see(verifyContestedTabText.divorceTab.applicantsLocalCourt);
    break;
  case 'contestedPaper':
    await I.waitForNavigationToComplete('#mat-tab-label-0-3');
    await I.see(verifyContestedPaperTabText.divorceTab.divorceCaseNumber);
    await I.see(verifyContestedPaperTabText.divorceTab.decreeNisiFileName);
    await I.see(verifyContestedPaperTabText.divorceTab.applicantsLocalCourt);
    break;
  }
}

async function natureOfApplicationTab(caseType, tabName) {
  const I = this;
  await I.waitForText(tabName, '5');
  // eslint-disable-next-line default-case
  switch (caseType) {
  case 'consented':
    await I.waitForNavigationToComplete('#mat-tab-label-0-4');
    await I.see(verifyTabText.natureOfApplicationTab.applicationFor1);
    await I.see(verifyTabText.natureOfApplicationTab.applicationFor2);
    await I.see(verifyTabText.natureOfApplicationTab.addressDetails);
    await I.see(verifyTabText.natureOfApplicationTab.mortgageDetails);
    await I.see(verifyTabText.natureOfApplicationTab.orderForChildren);
    break;
  case 'contested':
    await I.waitForNavigationToComplete('#mat-tab-label-0-5');
    await I.see(verifyContestedTabText.natureOfApplicationTab.applicationFor1);
    await I.see(verifyContestedTabText.natureOfApplicationTab.applicationFor2);
    await I.see(verifyContestedTabText.natureOfApplicationTab.addressDetails);
    await I.see(verifyContestedTabText.natureOfApplicationTab.mortgageDetails);
    await I.see(verifyContestedTabText.natureOfApplicationTab.orderForChildren);
    break;
  case 'contestedPaper':
    await I.waitForNavigationToComplete('#mat-tab-label-0-5');
    await I.see(verifyContestedPaperTabText.natureOfApplicationTab.applicationFor1);
    await I.see(verifyContestedPaperTabText.natureOfApplicationTab.applicationFor2);
    await I.see(verifyContestedPaperTabText.natureOfApplicationTab.addressDetails);
    await I.see(verifyContestedPaperTabText.natureOfApplicationTab.mortgageDetails);
    await I.see(verifyContestedPaperTabText.natureOfApplicationTab.orderForChildren);
    break;
  }
}

async function authorisationTab(caseType, tabName) {
  const I = this;
  await I.waitForText(tabName, '5');
  // eslint-disable-next-line default-case
  switch (caseType) {
  case 'consented':
    await I.waitForNavigationToComplete('#mat-tab-label-0-5');
    await I.see(verifyTabText.authorisationTab.solicitorName);
    await I.see(verifyTabText.authorisationTab.solicitorFirm);
    await I.see(verifyTabText.authorisationTab.signedDate);
    break;
  case 'contested':
    await I.waitForNavigationToComplete('#mat-tab-label-0-6');
    await I.see(verifyContestedTabText.authorisationTab.solicitorName);
    await I.see(verifyContestedTabText.authorisationTab.solicitorFirm);
    await I.see(verifyContestedTabText.authorisationTab.signedDate);
    break;
  case 'contestedPaper':
    await I.see(verifyContestedPaperTabText.authorisationTab.solicitorName);
    await I.see(verifyContestedPaperTabText.authorisationTab.solicitorFirm);
    await I.see(verifyContestedPaperTabText.authorisationTab.signedDate);
    break;
  }
}
/* eslint-disable */
async function caseDocumentsTab(caseType, tabName, eventName) {
  const I = this;
  await I.retry(3).waitForText(verifyContestedPaperTabText.historyTab.tabName, 30);
  // if (!I.see(tabName)) {
  //   await I.waitForNavigationToComplete('.mat-tab-header-pagination.mat-tab-header-pagination-after.mat-elevation-z4.mat-ripple')
  // }
  await I.retry(3).waitForText(tabName, '90');
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
    await I.waitForNavigationToComplete('#mat-tab-label-0-7');
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
    await I.waitForNavigationToComplete('#mat-tab-label-0-6');
    await I.see(verifyContestedPaperTabText.caseDocumentsTab.uploadedOtherDocument);
    await I.see(verifyContestedPaperTabText.caseDocumentsTab.uploadedPaperDocumentLabel);
    await I.see(verifyContestedPaperTabText.caseDocumentsTab.uploadedPaperDocument);
    break;
  }
}

async function paymentDetailsTab(caseType, tabName) {
  const I = this;
  await I.retry(3).waitForText(tabName, '90');
  // eslint-disable-next-line default-case
  switch (caseType) {
  case 'consented':
    //await I.waitForNavigationToComplete(".mat-tab-header-pagination.mat-tab-header-pagination-after.mat-elevation-z4.mat-ripple");
    await I.waitForNavigationToComplete('#mat-tab-label-0-7');
    await I.see(verifyTabText.paymentDetailsTab.hwfNumber);
    await I.see(verifyTabText.paymentDetailsTab.feeCode);
    await I.see(verifyTabText.paymentDetailsTab.amount);
    break;
  case 'contested':
    await I.waitForNavigationToComplete('#mat-tab-label-0-8');
    await I.see(verifyContestedTabText.paymentDetailsTab.hwfNumber);
    await I.see(verifyContestedTabText.paymentDetailsTab.feeCode);
    await I.see(verifyContestedTabText.paymentDetailsTab.amount);
    break;
  case 'contestedPaper':
    await I.waitForNavigationToComplete('#mat-tab-label-0-7');
    await I.see(verifyContestedPaperTabText.paymentDetailsTab.hwfNumber);
    await I.see(verifyContestedPaperTabText.paymentDetailsTab.feeCode);
    await I.see(verifyContestedPaperTabText.paymentDetailsTab.amount);
    break;
  }
}
async function judgeDetailsTab(caseType, tabName, eventName) {
  const I = this;
  await I.wait(5);
  await I.retry(3).waitForText(tabName, '90');
  // eslint-disable-next-line default-case
  switch (caseType) {
  case 'consented':
    await I.waitForNavigationToComplete('div[id="mat-tab-label-0-8"]');
    await I.see(verifyTabText.judgeDetailsTab.applicantFName);
    await I.see(verifyTabText.judgeDetailsTab.respondentFName);
    await I.see(verifyTabText.judgeDetailsTab.decreeNisiDate);
    await I.see(verifyTabText.judgeDetailsTab.decreeNisiDocument);
    if (eventName === verifyTabText.historyTab.issueApplicationEvent) {
      I.see(verifyTabText.judgeDetailsTab.newApplication);
    }
    break;
  case 'contested':
    await I.see(verifyContestedTabText.judgeDetailsTab.applicantFName);
    await I.see(verifyContestedTabText.judgeDetailsTab.respondentFName);
    await I.see(verifyContestedTabText.judgeDetailsTab.decreeNisiDate);
    await I.see(verifyContestedTabText.judgeDetailsTab.decreeNisiDocument);
    if (eventName === verifyContestedTabText.historyTab.issueApplicationEvent) {
      await I.see(verifyContestedTabText.judgeDetailsTab.newApplication);
    }
    break;
  case 'contestedPaper':
    await I.see(verifyContestedPaperTabText.judgeDetailsTab.applicantFName);
    await I.see(verifyContestedPaperTabText.judgeDetailsTab.respondentFName);
    await I.see(verifyContestedPaperTabText.judgeDetailsTab.decreeNisiDate);
    await I.see(verifyContestedPaperTabText.judgeDetailsTab.decreeNisiDocument);
    if (eventName === verifyContestedPaperTabText.historyTab.issueApplicationEvent) {
      await I.see(verifyContestedPaperTabText.judgeDetailsTab.newApplication);
    }
    break;
  }
}

async function adminNotesTab(caseType, tabName) {
  const I = this;
  await I.waitForText(tabName, '5');
  // eslint-disable-next-line default-case
  switch (caseType) {
  case 'consented':
    await I.waitForNavigationToComplete('#mat-tab-label-0-8');
    await I.see(verifyTabText.adminNotesTab.assignToJudgeReason);
    await I.see(verifyTabText.adminNotesTab.issueDate);
    await I.see(verifyTabText.adminNotesTab.assignToJudgeText);
    break;
  case 'contested':
    await I.waitForNavigationToComplete('#mat-tab-label-0-10');
    await I.see(verifyContestedTabText.adminNotesTab.issueDate);
    break;
  case 'contestedPaper':
    await I.waitForNavigationToComplete('#mat-tab-label-0-8');
    await I.see(verifyContestedPaperTabText.adminNotesTab.issueDate);
    break;
  }
}

async function approvedOrderTab(caseType, tabName) {
  const I = this;
  await I.waitForText(tabName, '5');
  // eslint-disable-next-line default-case
  switch (caseType) {
  case 'consented':
    //await I.waitForNavigationToComplete('div[id="mat-tab-label-0-7"]');
    await I.clickTab('Approved Order');
    await I.see(verifyTabText.approvedOrderTab.approvedLetter);
    await I.see(verifyTabText.approvedOrderTab.consentedAnnexedStamped);
    await I.see(verifyTabText.approvedOrderTab.typeOfPensionDocumentTypeStamped);
    break;
  }
}
async function contestedOrderTab(caseType, tabName) {
  const I = this;
  await I.waitForText(tabName, '5');
  // eslint-disable-next-line default-case
  switch (caseType) {
  case 'contested':
    await I.waitForNavigationToComplete('#mat-tab-label-0-11');
    await I.see(verifyContestedTabText.OrdersTab.OrdersLabel);
    await I.see(verifyContestedTabText.OrdersTab.OrderFileName);
    break;
  }
}

async function gateKeepingAllocationsTab(caseType, tabName, eventName) {
  const I = this;
  await I.waitForText(tabName, '5');
  // eslint-disable-next-line default-case
  switch (caseType) {
  case 'contested':
    await I.waitForNavigationToComplete('#mat-tab-label-0-9');
    await I.see(verifyContestedTabText.gateKeepingAllocationsTab.localCourt);
    if (eventName === verifyContestedTabText.historyTab.issueApplicationEvent) {
      await I.see(verifyContestedTabText.gateKeepingAllocationsTab.fastTrackProcedure);
      await I.see(verifyContestedTabText.gateKeepingAllocationsTab.dateOfMarriage);
    }
    break;
  case 'contestedPaper':
    await I.waitForNavigationToComplete('#mat-tab-label-0-7');
    await I.see(verifyContestedPaperTabText.gateKeepingAllocationsTab.localCourt);
    await I.see(verifyContestedPaperTabText.gateKeepingAllocationsTab.fastTrackProcedure);
    await I.see(verifyContestedPaperTabText.gateKeepingAllocationsTab.dateOfMarriage);
    break;
  }
}

async function schedulingAndListingTab(caseType, tabName) {
  const I = this;
  await I.waitForText(tabName, '5');
  // eslint-disable-next-line default-case
  switch (caseType) {
  case 'contested':
    await I.waitForNavigationToComplete('div[id="mat-tab-label-0-11"]');
    await I.see(verifyContestedTabText.schedulingAndListingTab.localCourt);
    await I.see(verifyContestedTabText.schedulingAndListingTab.courtFrc);
    break;
  case 'contestedPaper':
    await I.waitForNavigationToComplete('div[id="mat-tab-label-0-9"]');
    await I.see(verifyContestedPaperTabText.schedulingAndListingTab.localCourt);
    await I.see(verifyContestedPaperTabText.schedulingAndListingTab.courtFrc);
    break;
  }
}

async function consentOrderProcessTab(caseType, tabName) {
  const I = this;
  await I.waitForText(tabName, '5');
  await I.waitForNavigationToComplete('div[id="mat-tab-label-0-11"]');
  await I.see(verifyContestedTabText.consentOrderProcessTab.applicationFor);
  await I.see(verifyContestedTabText.consentOrderProcessTab.mortgageDetails);
  await I.see(verifyContestedTabText.consentOrderProcessTab.draftOrderDocument);
  await I.see(verifyContestedTabText.consentOrderProcessTab.pensionDocument);
}

async function verifyConsentedTabData(caseType, eventName, stateName) {
  const I = this;
  await I.historyTab(caseType, verifyTabText.historyTab.tabName, eventName, stateName);
  await I.applicantTab(caseType, verifyTabText.applicantTab.tabName);
  await I.respondentTab(caseType, verifyTabText.respondentTab.tabName);
  await I.divorceTab(caseType, verifyTabText.divorceTab.tabName);
  await I.natureOfApplicationTab(caseType, verifyTabText.natureOfApplicationTab.tabName);
  await I.authorisationTab(caseType, verifyTabText.authorisationTab.tabName);
  await I.caseDocumentsTab(caseType, verifyTabText.caseDocumentsTab.tabName, eventName);
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

async function verifyContestedPaperTabData(caseType, eventName, stateName) {
  const I = this;
  await I.historyTab(caseType, verifyContestedPaperTabText.historyTab.tabName, eventName, stateName);
  await I.applicantTab(caseType, verifyContestedPaperTabText.applicantTab.tabName);
  await I.respondentTab(caseType, verifyContestedPaperTabText.respondentTab.tabName);
  await I.divorceTab(caseType, verifyContestedPaperTabText.divorceTab.tabName);
  await I.natureOfApplicationTab(caseType, verifyContestedPaperTabText.natureOfApplicationTab.tabName);
  await I.caseDocumentsTab(caseType, verifyContestedPaperTabText.caseDocumentsTab.tabName, eventName);
  await I.gateKeepingAllocationsTab(caseType, verifyContestedPaperTabText.gateKeepingAllocationsTab.tabName, eventName);
  //TODO-fix-test doesn't click the tab properly
  //await I.schedulingAndListingTab(caseType, verifyContestedPaperTabText.schedulingAndListingTab.tabName);
}

async function verifyContestedConfidentialTabData(eventName, tabName) {
  const I = this;

  //I.waitForText(tabName, '5');
    switch (eventName) {
    case 'Upload Case Files':
      await I.see(verifyContestedTabText.confidentialDocumentsTab.type);
      await I.see(verifyContestedTabText.confidentialDocumentsTab.documentUrl);
      await I.see(verifyContestedTabText.confidentialDocumentsTab.comment);
      await I.see(verifyContestedTabText.confidentialDocumentsTab.fileName);
      break;
    case 'Manage confidential documents':
      await I.see(verifyContestedTabText.confidentialDocumentsTab.type);
      await I.see(verifyContestedTabText.confidentialDocumentsTab.manageConfDocumentUrl);
      break;
    }

}

async function schedule1Tab(tabName) {

  const I = this;
  //await I.waitForNavigationToComplete('div[id="mat-tab-label-0-2"]');
  //Removing navigation to schedule 1 tab as instead navigating directly to the url
  await I.see(verifyContestedTabText.Schedule1Tab.name);
  await I.see(verifyContestedTabText.Schedule1Tab.dob);
}

async function changeOfRepresentativesTab(tabName) {

  const I = this;
  await I.see(verifyContestedTabText.ChangeOfRepresentativesTab.tabName);
  await I.see(verifyContestedTabText.ChangeOfRepresentativesTab.applicantHeader);
  await I.see(verifyContestedTabText.ChangeOfRepresentativesTab.respondentHeader);
  await I.see(verifyContestedTabText.ChangeOfRepresentativesTab.applicantParty);
  await I.see(verifyContestedTabText.ChangeOfRepresentativesTab.respondentParty);
  await I.see(verifyContestedTabText.ChangeOfRepresentativesTab.applicantClientName);
  await I.see(verifyContestedTabText.ChangeOfRepresentativesTab.respondentClientName);
  await I.see(verifyContestedTabText.ChangeOfRepresentativesTab.applicantUpdatedBy);
  await I.see(verifyContestedTabText.ChangeOfRepresentativesTab.respondentUpdatedBy);
  await I.see(verifyContestedTabText.ChangeOfRepresentativesTab.applicantUpdatedVia);
  await I.see(verifyContestedTabText.ChangeOfRepresentativesTab.respondentUpdatedVia);
  await I.see(verifyContestedTabText.ChangeOfRepresentativesTab.applicantOrganisation);
  await I.see(verifyContestedTabText.ChangeOfRepresentativesTab.respondentOrganisation);
  await I.see(verifyContestedTabText.ChangeOfRepresentativesTab.applicantName);
  await I.see(verifyContestedTabText.ChangeOfRepresentativesTab.respondentName);
  await I.see(verifyContestedTabText.ChangeOfRepresentativesTab.applicantEmail);
  await I.see(verifyContestedTabText.ChangeOfRepresentativesTab.respondentEmail);
}

async function verifyManageBarristerEvent(caseType, eventName, stateName) {
  const I = this;
  await I.historyTab(caseType, verifyContestedTabText.historyTab.tabName, eventName, stateName);
}

async function verifyCaseFlagEvent(caseType, eventName, stateName) {
  const I = this;
  switch (caseType) {
    case 'consented':
      await I.historyTab(caseType, verifyConsentedTabText.historyTab.tabName, eventName, stateName);
      break;
    case 'contested':
      await I.historyTab(caseType, verifyContestedTabText.historyTab.tabName, eventName, stateName);
      break;
  }
}

async function verifyListForInterimHearing() {
  const I = this;
  await I.clickTab(verifyContestedTabText.listForInterimHearingTab.tabName);
  I.wait('5');
  I.waitForText(verifyContestedTabText.listForInterimHearingTab.typeOfHearing, '10')
  await I.see(verifyContestedTabText.listForInterimHearingTab.tabName);
  await I.see(verifyContestedTabText.listForInterimHearingTab.typeOfHearing);
  await I.see(verifyContestedTabText.listForInterimHearingTab.timeEstimate);
  await I.see(verifyContestedTabText.listForInterimHearingTab.hearingDate);
  await I.see(verifyContestedTabText.listForInterimHearingTab.hearingTime);
  await I.see(verifyContestedTabText.listForInterimHearingTab.region);
  await I.see(verifyContestedTabText.listForInterimHearingTab.FRC);
  await I.see(verifyContestedTabText.listForInterimHearingTab.closestCourt);
  await I.see(verifyContestedTabText.listForInterimHearingTab.addInfo);
  await I.see(verifyContestedTabText.listForInterimHearingTab.uploadDocument);
  await I.see(verifyContestedTabText.listForInterimHearingTab.documentName);
}

async function verifyGeneralApplicationTab(status) {
  const I = this;
  await I.see(verifyContestedTabText.GeneralApplicationsTab.tabName);
  await I.see(verifyContestedTabText.GeneralApplicationsTab.tableHeader);
  await I.see(verifyContestedTabText.GeneralApplicationsTab.applicationReceivedFrom);
  await I.see(verifyContestedTabText.GeneralApplicationsTab.createdBy);
  await I.see(verifyContestedTabText.GeneralApplicationsTab.hearingRequired);
  await I.see(verifyContestedTabText.GeneralApplicationsTab.timeEstimate);
  await I.see(status);
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
  schedule1Tab,
  changeOfRepresentativesTab,
  verifyManageBarristerEvent,
  verifyListForInterimHearing,
  verifyCaseFlagEvent,
  verifyGeneralApplicationTab
};
