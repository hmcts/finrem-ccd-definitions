/* eslint-disable no-invalid-this */
const verifyTabText = require('../../../data/verify-consented-tab-data.json');
const verifyContestedTabText = require('../../../data/verify-contested-tab-data.json');
const verifyContestedPaperTabText = require('../../../data/verify-contested-paper-case-tab-data.json');

async function historyTab(caseType, tabName, eventName, endState) {
  const I = this;
  await I.waitForText(tabName, '30');
  await I.see(eventName);
  await I.see(endState);
}

 async function applicantTab(caseType, tabName) {
  const I = this;
     await I.waitForText(tabName, '30');

  // eslint-disable-next-line default-case
  switch (caseType) {
  case 'consented':
      await I.waitForNavigationToComplete('div[id="mat-tab-label-0-1"]');
      await I.waitForText(tabName, '30');
      await I.see(verifyTabText.applicantTab.applicantLastName);
      await I.see(verifyTabText.applicantTab.applicantsLocalCourt);
      await I.see(verifyTabText.applicantTab.applicantSolicitorName);
      await I.see(verifyTabText.applicantTab.applicantSolicitorFirm);
      await I.see(verifyTabText.applicantTab.applicantEmail);
      await I.see(verifyTabText.applicantTab.applicantEmailCommunication);
    break;
  case 'contested':
      I.waitForNavigationToComplete('div[id="mat-tab-label-0-1"]');
      I.waitForText(tabName, '30');
    I.see(verifyContestedTabText.applicantTab.applicantLastName);
    I.see(verifyContestedTabText.applicantTab.applicantSolicitorName);
    I.see(verifyContestedTabText.applicantTab.applicantSolicitorFirm);
    I.see(verifyContestedTabText.applicantTab.applicantEmail);
    I.see(verifyContestedTabText.applicantTab.applicantEmailCommunication);
    break;
  case 'contestedPaper':
      I.waitForNavigationToComplete('div[id="mat-tab-label-0-1"]');
      I.waitForText(tabName, '30');
    I.see(verifyContestedPaperTabText.applicantTab.applicantLastName);
    I.see(verifyContestedPaperTabText.applicantTab.applicantSolicitorName);
    I.see(verifyContestedPaperTabText.applicantTab.applicantSolicitorFirm);
    I.see(verifyContestedPaperTabText.applicantTab.applicantEmail);
    I.see(verifyContestedPaperTabText.applicantTab.applicationMadeOnPaper);
    break;
  }
}

 async function respondentTab(caseType, tabName) {
  const I = this;

     I.waitForText(tabName, '30');
  // eslint-disable-next-line default-case
  switch (caseType) {
  case 'consented':
      await I.waitForNavigationToComplete('div[id="mat-tab-label-0-2"]');
      await I.waitForText(tabName, '30');
      await I.see(verifyTabText.respondentTab.respondentLastName);
      await I.see(verifyTabText.respondentTab.respondentSolicitorName);
      await I.see(verifyTabText.respondentTab.respondentSolicitorFirm);
      await I.see(verifyTabText.respondentTab.respondentEmail);
      await I.see(verifyTabText.respondentTab.respondentPostCode);
    break;
  case 'contested':
     I.waitForNavigationToComplete('div[id="mat-tab-label-0-3"]');
    I.see(verifyContestedTabText.respondentTab.respondentLastName);
    I.see(verifyContestedTabText.respondentTab.respondentSolicitorName);
    I.see(verifyContestedTabText.respondentTab.respondentSolicitorFirm);
    I.see(verifyContestedTabText.respondentTab.respondentEmail);
    I.see(verifyContestedTabText.respondentTab.respondentPostCode);
    break;
  case 'contestedPaper':
     I.waitForNavigationToComplete('div[id="mat-tab-label-0-3"]');
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
     await I.wait(30);
     await I.waitForText(tabName, '30');
  // eslint-disable-next-line default-case
  switch (caseType) {
  case 'consented':
    await I.waitForNavigationToComplete('div[id="mat-tab-label-0-3"]');
    await I.runAccessibilityTest();
   await I.see(verifyTabText.divorceTab.divorceCaseNumber);
   await I.see(verifyTabText.divorceTab.decreeNisiFileName);
    break;
  case 'contested':
     I.waitForNavigationToComplete('div[id="mat-tab-label-0-2"]');
    I.see(verifyContestedTabText.divorceTab.divorceCaseNumber);
    I.see(verifyContestedTabText.divorceTab.decreeNisiFileName);
    I.see(verifyContestedTabText.divorceTab.applicantsLocalCourt);
    break;
  case 'contestedPaper':
     I.waitForNavigationToComplete('div[id="mat-tab-label-0-2"]');
    I.see(verifyContestedPaperTabText.divorceTab.divorceCaseNumber);
    I.see(verifyContestedPaperTabText.divorceTab.decreeNisiFileName);
    I.see(verifyContestedPaperTabText.divorceTab.applicantsLocalCourt);
    break;
  }
}

 async function natureOfApplicationTab(caseType, tabName) {
     const I = this;
     await I.waitForText(tabName, '30');
     // eslint-disable-next-line default-case
     switch (caseType) {
     case 'consented':
         await I.waitForNavigationToComplete('div[id="mat-tab-label-0-4"]');
         await I.see(verifyTabText.natureOfApplicationTab.applicationFor);
         await I.see(verifyTabText.natureOfApplicationTab.addressDetails);
         await I.see(verifyTabText.natureOfApplicationTab.mortgageDetails);
         await I.see(verifyTabText.natureOfApplicationTab.orderForChildren);
         break;
     case 'contested':
         await I.waitForNavigationToComplete('div[id="mat-tab-label-0-4"]');
         await I.see(verifyContestedTabText.natureOfApplicationTab.applicationFor);
         await I.see(verifyContestedTabText.natureOfApplicationTab.addressDetails);
         await I.see(verifyContestedTabText.natureOfApplicationTab.mortgageDetails);
         await I.see(verifyContestedTabText.natureOfApplicationTab.orderForChildren);
         break;
     case 'contestedPaper':
         I.waitForNavigationToComplete('div[id="mat-tab-label-0-4"]');
         I.see(verifyContestedPaperTabText.natureOfApplicationTab.applicationFor);
         I.see(verifyContestedPaperTabText.natureOfApplicationTab.addressDetails);
         I.see(verifyContestedPaperTabText.natureOfApplicationTab.mortgageDetails);
         I.see(verifyContestedPaperTabText.natureOfApplicationTab.orderForChildren);
         break;
     }
 }

async function authorisationTab(caseType, tabName) {
  const I = this;
  I.waitForText(tabName, '30');
  // eslint-disable-next-line default-case
  switch (caseType) {
  case 'consented':
      await I.waitForNavigationToComplete('div[id="mat-tab-label-0-5"]');
      await I.see(verifyTabText.authorisationTab.solicitorName);
      await I.see(verifyTabText.authorisationTab.solicitorFirm);
      await I.see(verifyTabText.authorisationTab.signedDate);
    break;
  case 'contested':
     I.waitForNavigationToComplete('div[id="mat-tab-label-0-5"]');
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
     await I.waitForText(verifyContestedPaperTabText.historyTab.tabName, 30);
  if (!I.see(tabName)) {
      await I.waitForNavigationToComplete('.mat-tab-header-pagination.mat-tab-header-pagination-after.mat-elevation-z4.mat-ripple')
  }
  I.waitForText(tabName, 30);
  // eslint-disable-next-line default-case
  switch (caseType) {
  case 'consented':
      await  I.waitForNavigationToComplete('div[id="mat-tab-label-0-6"]');
      await I.see(verifyTabText.caseDocumentsTab.draftDocumentName);
      await I.see(verifyTabText.caseDocumentsTab.latestConsentOrderLabel);
      await I.see(verifyTabText.caseDocumentsTab.pensionTypeName);
    if (eventName === verifyTabText.historyTab.issueApplicationEvent) {
        await I.see(verifyTabText.caseDocumentsTab.onlineFormA);
    }
    break;
  case 'contested':
     I.waitForNavigationToComplete('div[id="mat-tab-label-0-6"]');
    if (eventName === verifyContestedTabText.historyTab.assignToJudgeEvent ||
         eventName === verifyContestedTabText.historyTab.consentOrderEvent ||
         eventName === verifyContestedTabText.historyTab.assignToJudgeConsentEvent ||
         eventName === verifyContestedTabText.historyTab.createGeneralApplicationEvent ||
         eventName === verifyContestedTabText.historyTab.submitUploadCaseFilesEvent ||
         eventName === verifyContestedTabText.historyTab.sendOrderEvent) {
      I.see(verifyContestedTabText.caseDocumentsTab.onlineFormA);
    } else {
      I.see(verifyContestedTabText.caseDocumentsTab.draftOnlineFormA);
    }
    if (eventName === verifyContestedTabText.historyTab.createGeneralApplicationEvent) {
      I.see(verifyContestedTabText.caseDocumentsTab.gaApplicationReceivedFrom);
      I.see(verifyContestedTabText.caseDocumentsTab.gaHearingRequired);
      I.see(verifyContestedTabText.caseDocumentsTab.gaLatestApplication);
      I.see(verifyContestedTabText.caseDocumentsTab.gaUploadDraftOrder);
      I.see(verifyContestedTabText.caseDocumentsTab.gaApplicationReceivedFrom);
    }
    break;
  case 'contestedPaper':
     I.waitForNavigationToComplete('div[id="mat-tab-label-0-5"]');
    I.see(verifyContestedPaperTabText.caseDocumentsTab.uploadedOtherDocument);
    I.see(verifyContestedPaperTabText.caseDocumentsTab.uploadedPaperDocumentLabel);
    I.see(verifyContestedPaperTabText.caseDocumentsTab.uploadedPaperDocument);
    break;
  }
}

async function paymentDetailsTab(caseType, tabName) {
  const I = this;
     await I.waitForText(tabName, '30');
  // eslint-disable-next-line default-case
  switch (caseType) {
  case 'consented':
      await I.waitForNavigationToComplete(".mat-tab-header-pagination.mat-tab-header-pagination-after.mat-elevation-z4.mat-ripple");
      await I.waitForNavigationToComplete('div[id="mat-tab-label-0-7"]');
      await I.see(verifyTabText.paymentDetailsTab.hwfNumber);
      await I.see(verifyTabText.paymentDetailsTab.feeCode);
      await I.see(verifyTabText.paymentDetailsTab.amount);
    break;
  case 'contested':
     I.waitForNavigationToComplete('div[id="mat-tab-label-0-7"]');
    I.see(verifyContestedTabText.paymentDetailsTab.hwfNumber);
    I.see(verifyContestedTabText.paymentDetailsTab.feeCode);
    I.see(verifyContestedTabText.paymentDetailsTab.amount);
    break;
  case 'contestedPaper':
     I.waitForNavigationToComplete('div[id="mat-tab-label-0-6"]');
    I.see(verifyContestedPaperTabText.paymentDetailsTab.hwfNumber);
    I.see(verifyContestedPaperTabText.paymentDetailsTab.feeCode);
    I.see(verifyContestedPaperTabText.paymentDetailsTab.amount);
    break;
  }
}
async function judgeDetailsTab(caseType, tabName, eventName) {
  const I = this;
     await I.wait(5);
     await I.waitForText(tabName, '30');
  // eslint-disable-next-line default-case
  switch (caseType) {
  case 'consented':
      await I.waitForNavigationToComplete('div[id="mat-tab-label-0-8"]');
      await I.see(verifyTabText.judgeDetailsTab.applicantFName);
      await I.see(verifyTabText.judgeDetailsTab.respondentFName);
      await I.see(verifyTabText.judgeDetailsTab.decreeNisiDate);
      await I.see(verifyTabText.judgeDetailsTab.decreeNisiDocument);
    if (eventName === verifyTabText.historyTab.issueApplicationEvent) {
        await I.see(verifyTabText.judgeDetailsTab.newApplication);
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
     await I.waitForText(tabName, '30');
  // eslint-disable-next-line default-case
  switch (caseType) {
  case 'consented':
      await I.waitForNavigationToComplete('div[id="mat-tab-label-0-8"]');
      await I.see(verifyTabText.adminNotesTab.assignToJudgeReason);
      await I.see(verifyTabText.adminNotesTab.issueDate);
      await I.see(verifyTabText.adminNotesTab.assignToJudgeText);
    break;
  case 'contested':
     I.waitForNavigationToComplete('div[id="mat-tab-label-0-9"]');
    I.see(verifyContestedTabText.adminNotesTab.issueDate);
    break;
  case 'contestedPaper':
     I.waitForNavigationToComplete('div[id="mat-tab-label-0-7"]');
    I.see(verifyContestedPaperTabText.adminNotesTab.issueDate);
    break;
  }
}

async function approvedOrderTab(caseType, tabName) {
  const I = this;
     await I.waitForText(tabName, '30');
  // eslint-disable-next-line default-case
  switch (caseType) {
  case 'consented':
      await I.waitForNavigationToComplete('div[id="mat-tab-label-0-7"]');
      await I.see(verifyTabText.approvedOrderTab.approvedLetter);
      await I.see(verifyTabText.approvedOrderTab.consentedAnnexedStamped);
      await I.see(verifyTabText.approvedOrderTab.typeOfPensionDocumentTypeStamped);
    break;
  }
}
async function contestedOrderTab(caseType, tabName) {
  const I = this;
     await I.waitForText(tabName, '30');
  // eslint-disable-next-line default-case
  switch (caseType) {
  case 'contested':
     I.waitForNavigationToComplete('div[id="mat-tab-label-0-10"]');
    I.see(verifyContestedTabText.OrdersTab.OrdersLabel);
    I.see(verifyContestedTabText.OrdersTab.OrderFileName);
    break;
  }
}

async function gateKeepingAllocationsTab(caseType, tabName, eventName) {
  const I = this;
    await I.waitForText(tabName, '30');
  // eslint-disable-next-line default-case
  switch (caseType) {
  case 'contested':
     I.waitForNavigationToComplete('div[id="mat-tab-label-0-8"]');
    I.see(verifyContestedTabText.gateKeepingAllocationsTab.localCourt);
    if (eventName === verifyContestedTabText.historyTab.issueApplicationEvent) {
      I.see(verifyContestedTabText.gateKeepingAllocationsTab.fastTrackProcedure);
      I.see(verifyContestedTabText.gateKeepingAllocationsTab.dateOfMarriage);
    }
    break;
  case 'contestedPaper':
     I.waitForNavigationToComplete('div[id="mat-tab-label-0-6"]');
    I.see(verifyContestedPaperTabText.gateKeepingAllocationsTab.localCourt);
    I.see(verifyContestedPaperTabText.gateKeepingAllocationsTab.fastTrackProcedure);
    I.see(verifyContestedPaperTabText.gateKeepingAllocationsTab.dateOfMarriage);
    break;
  }
}

async function schedulingAndListingTab(caseType, tabName) {
  const I = this;
  await I.waitForText(tabName, '30');
  // eslint-disable-next-line default-case
  switch (caseType) {
  case 'contested':
     I.waitForNavigationToComplete('div[id="mat-tab-label-0-10"]');
    I.see(verifyContestedTabText.schedulingAndListingTab.localCourt);
    I.see(verifyContestedTabText.schedulingAndListingTab.courtFrc);
    break;
  case 'contestedPaper':
     I.waitForNavigationToComplete('div[id="mat-tab-label-0-8"]');
    I.see(verifyContestedPaperTabText.schedulingAndListingTab.localCourt);
    I.see(verifyContestedPaperTabText.schedulingAndListingTab.courtFrc);
    break;
  }
}

async function consentOrderProcessTab(caseType, tabName) {
  const I = this;
    await I.waitForText(tabName, '30');
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

function verifyContestedTabData(caseType, eventName, stateName) {
  const I = this;
  I.historyTab(caseType, verifyContestedTabText.historyTab.tabName, eventName, stateName);
  I.applicantTab(caseType, verifyContestedTabText.applicantTab.tabName);
  I.respondentTab(caseType, verifyContestedTabText.respondentTab.tabName);
  I.divorceTab(caseType, verifyContestedTabText.divorceTab.tabName);
  I.natureOfApplicationTab(caseType, verifyContestedTabText.natureOfApplicationTab.tabName);
  I.authorisationTab(caseType, verifyContestedTabText.authorisationTab.tabName);
  I.caseDocumentsTab(caseType, verifyContestedTabText.caseDocumentsTab.tabName, eventName);
  I.paymentDetailsTab(caseType, verifyContestedTabText.paymentDetailsTab.tabName);
  I.gateKeepingAllocationsTab(caseType, verifyContestedTabText.gateKeepingAllocationsTab.tabName, eventName);
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
  verifyContestedPaperTabData
};
