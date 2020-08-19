/* eslint-disable no-invalid-this */
const verifyTabText = require('../../../data/verify-consented-tab-data.json');
const verifyContestedTabText = require('../../../data/verify-contested-tab-data.json');

function historyTab(caseType, tabName, eventName, endState) {
  const I = this;
  I.waitForText(tabName, '5');
  I.click(tabName);
  I.see(eventName);
  I.see(endState);
}

function applicantTab(caseType, tabName) {
  const I = this;
  I.waitForText(tabName, '5');
  I.click(tabName);
  if (caseType === 'consented') {
    I.see(verifyTabText.applicantTab.applicantLastName);
    I.see(verifyTabText.applicantTab.applicantsLocalCourt);
    I.see(verifyTabText.applicantTab.applicantSolicitorName);
    I.see(verifyTabText.applicantTab.applicantSolicitorFirm);
    I.see(verifyTabText.applicantTab.applicantEmail);
    I.see(verifyTabText.applicantTab.applicantEmailCommunication);
  }
  if (caseType === 'contested') {
    I.see(verifyContestedTabText.applicantTab.applicantLastName);
    I.see(verifyContestedTabText.applicantTab.applicantSolicitorName);
    I.see(verifyContestedTabText.applicantTab.applicantSolicitorFirm);
    I.see(verifyContestedTabText.applicantTab.applicantEmail);
    I.see(verifyContestedTabText.applicantTab.applicantEmailCommunication);
  }
}

function respondentTab(caseType, tabName) {
  const I = this;
  I.waitForText(tabName, '5');
  I.click(tabName);
  if (caseType === 'consented') {
    I.see(verifyTabText.respondentTab.respondentLastName);
    I.see(verifyTabText.respondentTab.respondentSolicitorName);
    I.see(verifyTabText.respondentTab.respondentSolicitorFirm);
    I.see(verifyTabText.respondentTab.respondentEmail);
    I.see(verifyTabText.respondentTab.respondentPostCode);
  }
  if (caseType === 'contested') {
    I.see(verifyContestedTabText.respondentTab.respondentLastName);
    I.see(verifyContestedTabText.respondentTab.respondentSolicitorName);
    I.see(verifyContestedTabText.respondentTab.respondentSolicitorFirm);
    I.see(verifyContestedTabText.respondentTab.respondentEmail);
    I.see(verifyContestedTabText.respondentTab.respondentPostCode);
  }
}

function divorceTab(caseType, tabName) {
  const I = this;
  I.waitForText(tabName, '5');
  I.click(tabName);
  if (caseType === 'consented') {
    I.see(verifyTabText.divorceTab.divorceCaseNumber);
    I.see(verifyTabText.divorceTab.decreeNisiFileName);
  }
  if (caseType === 'contested') {
    I.see(verifyContestedTabText.divorceTab.divorceCaseNumber);
    I.see(verifyContestedTabText.divorceTab.decreeNisiFileName);
    I.see(verifyContestedTabText.divorceTab.applicantsLocalCourt);
  }
}

function natureOfApplicationTab(caseType, tabName) {
  const I = this;
  I.waitForText(tabName, '5');
  I.click(tabName);
  if (caseType === 'consented') {
    I.see(verifyTabText.natureOfApplicationTab.applicationFor);
    I.see(verifyTabText.natureOfApplicationTab.addressDetails);
    I.see(verifyTabText.natureOfApplicationTab.mortgageDetails);
    I.see(verifyTabText.natureOfApplicationTab.orderForChildren);
  }
  if (caseType === 'contested') {
    I.see(verifyContestedTabText.natureOfApplicationTab.applicationFor);
    I.see(verifyContestedTabText.natureOfApplicationTab.addressDetails);
    I.see(verifyContestedTabText.natureOfApplicationTab.mortgageDetails);
    I.see(verifyContestedTabText.natureOfApplicationTab.orderForChildren);
  }
}

function authorisationTab(caseType, tabName) {
  const I = this;
  I.waitForText(tabName, '5');
  I.click(tabName);
  if (caseType === 'consented') {
    I.see(verifyTabText.authorisationTab.solicitorName);
    I.see(verifyTabText.authorisationTab.solicitorFirm);
    I.see(verifyTabText.authorisationTab.signedDate);
  }
  if (caseType === 'contested') {
    I.see(verifyContestedTabText.authorisationTab.solicitorName);
    I.see(verifyContestedTabText.authorisationTab.solicitorFirm);
    I.see(verifyContestedTabText.authorisationTab.signedDate);
  }
}
function caseDocumentsTab(caseType, tabName, eventName) {
  const I = this;
  I.waitForText(tabName, '5');
  I.click(tabName);
  if (caseType === 'consented') {
    I.see(verifyTabText.caseDocumentsTab.draftDocumentName);
    I.see(verifyTabText.caseDocumentsTab.latestConsentOrderLabel);
    I.see(verifyTabText.caseDocumentsTab.pensionTypeName);
    if (eventName === verifyTabText.historyTab.issueApplicationEvent) {
      I.see(verifyTabText.caseDocumentsTab.onlineFormA);
    }
  }
  if (caseType === 'contested') {
    I.see(verifyContestedTabText.caseDocumentsTab.UploadDecreeNisiFile);
    if (eventName === verifyContestedTabText.historyTab.assignToJudgeEvent) {
      I.see(verifyContestedTabText.caseDocumentsTab.onlineFormA);
    } else {
      I.see(verifyContestedTabText.caseDocumentsTab.draftOnlineFormA);
    }
  }
}

function paymentDetailsTab(caseType, tabName) {
  const I = this;
  I.waitForText(tabName, '5');
  I.click(tabName);
  if (caseType === 'consented') {
    I.see(verifyTabText.paymentDetailsTab.hwfNumber);
    I.see(verifyTabText.paymentDetailsTab.feeCode);
    I.see(verifyTabText.paymentDetailsTab.amount);
  }
  if (caseType === 'contested') {
    I.see(verifyContestedTabText.paymentDetailsTab.hwfNumber);
    I.see(verifyContestedTabText.paymentDetailsTab.feeCode);
    I.see(verifyContestedTabText.paymentDetailsTab.amount);
  }
}
function judgeDetailsTab(caseType, tabName, eventName) {
  const I = this;
  I.waitForText(tabName, '5');
  I.click(tabName);
  if (caseType === 'consented') {
    I.see(verifyTabText.judgeDetailsTab.applicantFName);
    I.see(verifyTabText.judgeDetailsTab.respondentFName);
    I.see(verifyTabText.judgeDetailsTab.decreeNisiDate);
    I.see(verifyTabText.judgeDetailsTab.decreeNisiDocument);
    if (eventName === verifyTabText.historyTab.issueApplicationEvent) {
      I.see(verifyTabText.judgeDetailsTab.newApplication);
    }
  }
  if (caseType === 'contested') {
    I.see(verifyContestedTabText.judgeDetailsTab.applicantFName);
    I.see(verifyContestedTabText.judgeDetailsTab.respondentFName);
    I.see(verifyContestedTabText.judgeDetailsTab.decreeNisiDate);
    I.see(verifyContestedTabText.judgeDetailsTab.decreeNisiDocument);
    if (eventName === verifyContestedTabText.historyTab.issueApplicationEvent) {
      I.see(verifyContestedTabText.judgeDetailsTab.newApplication);
    }
  }
}

function adminNotesTab(caseType, tabName) {
  const I = this;
  I.waitForText(tabName, '5');
  I.click(tabName);
  if (caseType === 'consented') {
    I.see(verifyTabText.adminNotesTab.assignToJudgeReason);
    I.see(verifyTabText.adminNotesTab.issueDate);
    I.see(verifyTabText.adminNotesTab.assignToJudgeText);
  }
  if (caseType === 'contested') {
    I.see(verifyContestedTabText.adminNotesTab.issueDate);
  }
}

function gateKeepingAllocationsTab(caseType, tabName, eventName) {
  const I = this;
  I.waitForText(tabName, '5');
  I.click(tabName);
  if (caseType === 'contested') {
    I.see(verifyContestedTabText.gateKeepingAllocationsTab.localCourt);
    if (eventName === verifyContestedTabText.historyTab.issueApplicationEvent) {
      I.see(verifyContestedTabText.gateKeepingAllocationsTab.fastTrackProcedure);
      I.see(verifyContestedTabText.gateKeepingAllocationsTab.dateOfMarriage);
    }
  }
}

function schedulingAndListingTab(caseType, tabName) {
  const I = this;
  I.waitForText(tabName, '5');
  I.click(tabName);
  if (caseType === 'contested') {
    I.see(verifyContestedTabText.schedulingAndListingTab.localCourt);
    I.see(verifyContestedTabText.schedulingAndListingTab.courtFrc);
  }
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
  schedulingAndListingTab
};
