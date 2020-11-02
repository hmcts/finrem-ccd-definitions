/* eslint-disable no-invalid-this */
const verifyTabText = require('../../../data/verify-consented-tab-data.json');
const verifyContestedTabText = require('../../../data/verify-contested-tab-data.json');
const verifyContestedPaperTabText = require('../../../data/verify-contested-paper-case-tab-data.json');

function historyTab(caseType, tabName, eventName, endState) {
  const I = this;
  I.waitForText(tabName, '10');
  I.click(tabName);
  I.see(eventName);
  I.see(endState);
}

function applicantTab(caseType, tabName) {
  const I = this;
  I.waitForText(tabName, '5');
  I.click(tabName);
  // eslint-disable-next-line default-case
  switch (caseType) {
  case 'consented':
    I.see(verifyTabText.applicantTab.applicantLastName);
    I.see(verifyTabText.applicantTab.applicantsLocalCourt);
    I.see(verifyTabText.applicantTab.applicantSolicitorName);
    I.see(verifyTabText.applicantTab.applicantSolicitorFirm);
    I.see(verifyTabText.applicantTab.applicantEmail);
    I.see(verifyTabText.applicantTab.applicantEmailCommunication);
    break;
  case 'contested':
    I.see(verifyContestedTabText.applicantTab.applicantLastName);
    I.see(verifyContestedTabText.applicantTab.applicantSolicitorName);
    I.see(verifyContestedTabText.applicantTab.applicantSolicitorFirm);
    I.see(verifyContestedTabText.applicantTab.applicantEmail);
    I.see(verifyContestedTabText.applicantTab.applicantEmailCommunication);
    break;
  case 'contestedPaper':
    I.see(verifyContestedPaperTabText.applicantTab.applicantLastName);
    I.see(verifyContestedPaperTabText.applicantTab.applicantSolicitorName);
    I.see(verifyContestedPaperTabText.applicantTab.applicantSolicitorFirm);
    I.see(verifyContestedPaperTabText.applicantTab.applicantEmail);
    I.see(verifyContestedPaperTabText.applicantTab.applicationMadeOnPaper);
    break;
  }
}

function respondentTab(caseType, tabName) {
  const I = this;
  I.waitForText(tabName, '5');
  I.click(tabName);
  // eslint-disable-next-line default-case
  switch (caseType) {
  case 'consented':
    I.see(verifyTabText.respondentTab.respondentLastName);
    I.see(verifyTabText.respondentTab.respondentSolicitorName);
    I.see(verifyTabText.respondentTab.respondentSolicitorFirm);
    I.see(verifyTabText.respondentTab.respondentEmail);
    I.see(verifyTabText.respondentTab.respondentPostCode);
    break;
  case 'contested':
    I.see(verifyContestedTabText.respondentTab.respondentLastName);
    I.see(verifyContestedTabText.respondentTab.respondentSolicitorName);
    I.see(verifyContestedTabText.respondentTab.respondentSolicitorFirm);
    I.see(verifyContestedTabText.respondentTab.respondentEmail);
    I.see(verifyContestedTabText.respondentTab.respondentPostCode);
    break;
  case 'contestedPaper':
    I.see(verifyContestedPaperTabText.respondentTab.respondentLastName);
    I.see(verifyContestedPaperTabText.respondentTab.respondentRepresented);
    I.see(verifyContestedPaperTabText.respondentTab.respondentBuildingName);
    I.see(verifyContestedPaperTabText.respondentTab.respondentEmail);
    I.see(verifyContestedPaperTabText.respondentTab.respondentPostCode);
    break;
  }
}

function divorceTab(caseType, tabName) {
  const I = this;
  I.waitForText(tabName, '5');
  I.click(tabName);
  // eslint-disable-next-line default-case
  switch (caseType) {
  case 'consented':
    I.see(verifyTabText.divorceTab.divorceCaseNumber);
    I.see(verifyTabText.divorceTab.decreeNisiFileName);
    break;
  case 'contested':
    I.see(verifyContestedTabText.divorceTab.divorceCaseNumber);
    I.see(verifyContestedTabText.divorceTab.decreeNisiFileName);
    I.see(verifyContestedTabText.divorceTab.applicantsLocalCourt);
    break;
  case 'contestedPaper':
    I.see(verifyContestedPaperTabText.divorceTab.divorceCaseNumber);
    I.see(verifyContestedPaperTabText.divorceTab.decreeNisiFileName);
    I.see(verifyContestedPaperTabText.divorceTab.applicantsLocalCourt);
    break;
  }
}

function natureOfApplicationTab(caseType, tabName) {
  const I = this;
  I.waitForText(tabName, '5');
  I.click(tabName);
  // eslint-disable-next-line default-case
  switch (caseType) {
  case 'consented':
    I.see(verifyTabText.natureOfApplicationTab.applicationFor);
    I.see(verifyTabText.natureOfApplicationTab.addressDetails);
    I.see(verifyTabText.natureOfApplicationTab.mortgageDetails);
    I.see(verifyTabText.natureOfApplicationTab.orderForChildren);
    break;
  case 'contested':
    I.see(verifyContestedTabText.natureOfApplicationTab.applicationFor);
    I.see(verifyContestedTabText.natureOfApplicationTab.addressDetails);
    I.see(verifyContestedTabText.natureOfApplicationTab.mortgageDetails);
    I.see(verifyContestedTabText.natureOfApplicationTab.orderForChildren);
    break;
  case 'contestedPaper':
    I.see(verifyContestedPaperTabText.natureOfApplicationTab.applicationFor);
    I.see(verifyContestedPaperTabText.natureOfApplicationTab.addressDetails);
    I.see(verifyContestedPaperTabText.natureOfApplicationTab.mortgageDetails);
    I.see(verifyContestedPaperTabText.natureOfApplicationTab.orderForChildren);
    break;
  }
}

function authorisationTab(caseType, tabName) {
  const I = this;
  I.waitForText(tabName, '5');
  I.click(tabName);
  // eslint-disable-next-line default-case
  switch (caseType) {
  case 'consented':
    I.see(verifyTabText.authorisationTab.solicitorName);
    I.see(verifyTabText.authorisationTab.solicitorFirm);
    I.see(verifyTabText.authorisationTab.signedDate);
    break;
  case 'contested':
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
function caseDocumentsTab(caseType, tabName, eventName) {
  const I = this;
  I.waitForText(tabName, '5');
  I.click(tabName);
  // eslint-disable-next-line default-case
  switch (caseType) {
  case 'consented':
    I.see(verifyTabText.caseDocumentsTab.draftDocumentName);
    I.see(verifyTabText.caseDocumentsTab.latestConsentOrderLabel);
    I.see(verifyTabText.caseDocumentsTab.pensionTypeName);
    if (eventName === verifyTabText.historyTab.issueApplicationEvent) {
      I.see(verifyTabText.caseDocumentsTab.onlineFormA);
    }
    break;
  case 'contested':
    I.see(verifyContestedTabText.caseDocumentsTab.UploadDecreeNisiFile);
    if (eventName === verifyContestedTabText.historyTab.assignToJudgeEvent ||
         eventName === verifyContestedTabText.historyTab.consentOrderEvent ||
         eventName === verifyContestedTabText.historyTab.assignToJudgeConsentEvent ||
         eventName === verifyContestedTabText.historyTab.createGeneralApplicationEvent) {
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
    I.see(verifyContestedPaperTabText.caseDocumentsTab.uploadedOtherDocument);
    I.see(verifyContestedPaperTabText.caseDocumentsTab.uploadedDecreeNisiFile);
    I.see(verifyContestedPaperTabText.caseDocumentsTab.uploadedPaperDocument);
    break;
  }
}

function paymentDetailsTab(caseType, tabName) {
  const I = this;
  I.waitForText(tabName, '5');
  I.click(tabName);
  // eslint-disable-next-line default-case
  switch (caseType) {
  case 'consented':
    I.see(verifyTabText.paymentDetailsTab.hwfNumber);
    I.see(verifyTabText.paymentDetailsTab.feeCode);
    I.see(verifyTabText.paymentDetailsTab.amount);
    break;
  case 'contested':
    I.see(verifyContestedTabText.paymentDetailsTab.hwfNumber);
    I.see(verifyContestedTabText.paymentDetailsTab.feeCode);
    I.see(verifyContestedTabText.paymentDetailsTab.amount);
    break;
  case 'contestedPaper':
    I.see(verifyContestedPaperTabText.paymentDetailsTab.hwfNumber);
    I.see(verifyContestedPaperTabText.paymentDetailsTab.feeCode);
    I.see(verifyContestedPaperTabText.paymentDetailsTab.amount);
    break;
  }
}
function judgeDetailsTab(caseType, tabName, eventName) {
  const I = this;
  I.waitForText(tabName, '5');
  I.click(tabName);
  // eslint-disable-next-line default-case
  switch (caseType) {
  case 'consented':
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

function adminNotesTab(caseType, tabName) {
  const I = this;
  I.waitForText(tabName, '5');
  I.click(tabName);
  // eslint-disable-next-line default-case
  switch (caseType) {
  case 'consented':
    I.see(verifyTabText.adminNotesTab.assignToJudgeReason);
    I.see(verifyTabText.adminNotesTab.issueDate);
    I.see(verifyTabText.adminNotesTab.assignToJudgeText);
    break;
  case 'contested':
    I.see(verifyContestedTabText.adminNotesTab.issueDate);
    break;
  case 'contestedPaper':
    I.see(verifyContestedPaperTabText.adminNotesTab.issueDate);
    break;
  }
}

function gateKeepingAllocationsTab(caseType, tabName, eventName) {
  const I = this;
  I.waitForText(tabName, '5');
  I.click(tabName);
  // eslint-disable-next-line default-case
  switch (caseType) {
  case 'contested':
    I.see(verifyContestedTabText.gateKeepingAllocationsTab.localCourt);
    if (eventName === verifyContestedTabText.historyTab.issueApplicationEvent) {
      I.see(verifyContestedTabText.gateKeepingAllocationsTab.fastTrackProcedure);
      I.see(verifyContestedTabText.gateKeepingAllocationsTab.dateOfMarriage);
    }
    break;
  case 'contestedPaper':
    I.see(verifyContestedPaperTabText.gateKeepingAllocationsTab.localCourt);
    I.see(verifyContestedPaperTabText.gateKeepingAllocationsTab.fastTrackProcedure);
    I.see(verifyContestedPaperTabText.gateKeepingAllocationsTab.dateOfMarriage);
    break;
  }
}

function schedulingAndListingTab(caseType, tabName) {
  const I = this;
  I.waitForText(tabName, '5');
  I.click(tabName);
  // eslint-disable-next-line default-case
  switch (caseType) {
  case 'contested':
    I.see(verifyContestedTabText.schedulingAndListingTab.localCourt);
    I.see(verifyContestedTabText.schedulingAndListingTab.courtFrc);
    break;
  case 'contestedPaper':
    I.see(verifyContestedPaperTabText.schedulingAndListingTab.localCourt);
    I.see(verifyContestedPaperTabText.schedulingAndListingTab.courtFrc);
    break;
  }
}

function consentOrderProcessTab(caseType, tabName) {
  const I = this;
  I.waitForText(tabName, '5');
  I.click(tabName);
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
  I.paymentDetailsTab(caseType, verifyTabText.paymentDetailsTab.tabName);
  I.judgeDetailsTab(caseType, verifyTabText.judgeDetailsTab.tabName, eventName);
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
  I.schedulingAndListingTab(caseType, verifyContestedTabText.schedulingAndListingTab.tabName);
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
  gateKeepingAllocationsTab,
  schedulingAndListingTab,
  consentOrderProcessTab,
  verifyConsentedTabData,
  verifyContestedTabData,
  verifyContestedPaperTabData
};
