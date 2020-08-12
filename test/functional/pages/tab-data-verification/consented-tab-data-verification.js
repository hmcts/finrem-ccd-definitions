/* eslint-disable no-invalid-this */
const verifyTabText = require('../../../data/verify-tab-data.json');

function historyTab(tabName, eventName, endState) {
  const I = this;
  I.waitForText(tabName, '5');
  I.click(tabName);
  if (eventName === 'Case Submission') {
    I.see(endState);
  }
}

function applicantTab(tabName) {
  const I = this;
  I.waitForText(tabName, '5');
  I.click(tabName);
  I.see(verifyTabText.applicantTab.applicantLastName);
  I.see(verifyTabText.applicantTab.applicantsLocalCourt);
  I.see(verifyTabText.applicantTab.applicantSolicitorName);
  I.see(verifyTabText.applicantTab.applicantSolicitorFirm);
  I.see(verifyTabText.applicantTab.applicantEmail);
  I.see(verifyTabText.applicantTab.applicantEmailCommunication);
}

function respondentTab(tabName) {
  const I = this;
  I.waitForText(tabName, '5');
  I.click(tabName);
  I.see(verifyTabText.respondentTab.respondentLastName);
  I.see(verifyTabText.respondentTab.respondentSolicitorName);
  I.see(verifyTabText.respondentTab.respondentSolicitorFirm);
  I.see(verifyTabText.respondentTab.respondentEmail);
  I.see(verifyTabText.respondentTab.respondentPostCode);
}

function divorceTab(tabName) {
  const I = this;
  I.waitForText(tabName, '5');
  I.click(tabName);
  I.see(verifyTabText.divorceTab.divorceCaseNumber);
  I.see(verifyTabText.divorceTab.decreeNisiFileName);
}

function natureOfApplicationTab(tabName) {
  const I = this;
  I.waitForText(tabName, '5');
  I.click(tabName);
  I.see(verifyTabText.natureOfApplicationTab.applicationFor);
  I.see(verifyTabText.natureOfApplicationTab.addressDetails);
  I.see(verifyTabText.natureOfApplicationTab.mortgageDetails);
  I.see(verifyTabText.natureOfApplicationTab.orderForChildren);
}

function authorisationTab(tabName) {
  const I = this;
  I.waitForText(tabName, '5');
  I.click(tabName);
  I.see(verifyTabText.authorisationTab.solicitorName);
  I.see(verifyTabText.authorisationTab.solicitorFirm);
  I.see(verifyTabText.authorisationTab.signedDate);
}
function caseDocumentsTab(tabName) {
  const I = this;
  I.waitForText(tabName, '5');
  I.click(tabName);
  I.see(verifyTabText.caseDocumentsTab.draftDocumentName);
  I.see(verifyTabText.caseDocumentsTab.latestConsentOrderLabel);
  I.see(verifyTabText.caseDocumentsTab.pensionTypeName);
}

function paymentDetailsTab(tabName) {
  const I = this;
  I.waitForText(tabName, '5');
  I.click(tabName);
  I.see(verifyTabText.paymentDetailsTab.hwfNumber);
  I.see(verifyTabText.paymentDetailsTab.feeCode);
  I.see(verifyTabText.paymentDetailsTab.amount);
}
function judgeDetailsTab(tabName) {
  const I = this;
  I.waitForText(tabName, '5');
  I.click(tabName);
  I.see(verifyTabText.judgeDetailsTab.applicantFName);
  I.see(verifyTabText.judgeDetailsTab.respondentFName);
  I.see(verifyTabText.judgeDetailsTab.decreeNisiDate);
  I.see(verifyTabText.judgeDetailsTab.decreeNisiDocument);
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
  judgeDetailsTab
};