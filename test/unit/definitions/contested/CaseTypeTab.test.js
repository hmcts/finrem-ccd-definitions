const expect = require('chai').expect;
const { uniq, uniqWith, map, filter } = require('lodash');

const caseTypeTab = Object.assign(require('definitions/contested/json/CaseTypeTab/CaseTypeTab.json'), {});
const caseField = Object.assign(require('definitions/contested/json/CaseField/CaseField'), {});
const caseFieldCommon = Object.assign(require('definitions/common/json/CaseField/CaseField-common'), []);
const caseFieldProd = Object.assign(require('definitions/contested/json/CaseField/CaseField-prod'), []);
const caseFieldAll = caseField.concat(caseFieldCommon, caseFieldProd);
const tabIds = uniq(map(caseTypeTab, 'TabID'));

describe('CaseTypeTab', () => {
  it('should contain a unique case field ID per tab ID (no duplicate field in a tab)', () => {
    const uniqResult = uniqWith(
      caseTypeTab,
      (field1, field2) => {
        return field1.TabID === field2.TabID && field1.CaseFieldID === field2.CaseFieldID;
      }
    );
    expect(uniqResult).to.eql(caseTypeTab);
  });
  //  it('should contain a unique tab field display order ID field tab ID (no duplicate field order in a tab)', () => {
  //    tabIds.forEach(tabId => {
  //      const allFieldsPerTab = filter(caseTypeTab, field => {
  //        return field.TabID === tabId;
  //      });
  //      const uniqResults = uniqWith(
  //        allFieldsPerTab,
  //        (field1, field2) => {
  //          return field1.TabFieldDisplayOrder === field2.TabFieldDisplayOrder;
  //        }
  //      );
  //      expect(uniqResults).to.eql(allFieldsPerTab);
  //    });
  //  });
  // it('should contain a proper sequence for TabFieldDisplayOrder with no gaps', () => {
  //   tabIds.forEach(tabId => {
  //     const allFieldsPerTab = filter(caseTypeTab, field => {
  //       return field.TabID === tabId;
  //     });
  //     const allTabFieldDisplayOrderNumbers = map(allFieldsPerTab, field => {
  //       return field.TabFieldDisplayOrder;
  //     }).sort((a, b) => {
  //       return a - b;
  //     });
  //     for (let i = 1; i < allTabFieldDisplayOrderNumbers.length; i++) {
  //       if (allTabFieldDisplayOrderNumbers[i] - allTabFieldDisplayOrderNumbers[i - 1] !== 1) {
  //         assert.fail(`Missing/unordered TabFieldDisplayOrder sequence number in TabID ${tabId} - expected ${allTabFieldDisplayOrderNumbers[i - 1] + 1} but got ${allTabFieldDisplayOrderNumbers[i]}`);
  //       }
  //     }
  //   });
  // });

  const expected = {
    state: 1,
    historyTab: 1,
    applicantDetailsTab: 2,
    caseFileViewTab: 3,
    schedule1ChildTab: 4,
    divorceDetailsTab: 5,
    respondentDetailsTab: 6,
    natureOfApplicationTab: 7,
    authorisationTab: 8,
    applicationDocumentsTab: 9,
    applicationDocumentsTab1: 9,
    applicationDocumentsTab2: 9,
    applicationDocumentsTab3: 9,
    applicationDocumentsTab4: 9,
    applicationDocumentsTab5: 9,
    paymentDetailsTab: 10,
    notesTab: 11,
    gatekeepingTab: 12,
    AdminNotes: 13,
    judiciaryOutcomeTab: 14,
    Orders: 15,
    abOrders: 15,
    rsOrders: 15,
    rbOrders: 15,
    caOrders: 15,
    cjOrders: 15,
    schedulingTab: 16,
    schedulingTabAb: 16,
    schedulingTabAs: 16,
    schedulingTabRs: 16,
    schedulingTabRb: 16,
    schedulingTabJudge: 16,
    hiddenTab: 17,
    consentOrderProcessTab1: 18,
    consentOrderProcessTab2: 18,
    consentOrderProcessTab3: 18,
    consentOrderProcessTab4: 18,
    consentOrderProcessTab5: 18,
    consentOrderProcessTab6: 18,
    appDocuments: 19,
    resDocuments: 20,
    'Trial Bundle': 21,
    'Shared Documents': 21,
    sharedDocumentsAb: 21,
    sharedDocumentsRs: 21,
    sharedDocumentsRb: 21,
    sharedDocumentsCa: 21,
    sharedDocumentsCj: 21,
    interimSchedulingTab: 22,
    interimSchedulingTabAs: 22,
    interimSchedulingTabAb: 22,
    interimSchedulingTabRs: 22,
    interimSchedulingTabRb: 22,
    interimSchedulingTabJudge: 22,
    confidentialDocumentsTab: 23,
    'ChangeOfRepresentativesTab-judiciary': 24,
    'ChangeOfRepresentativesTab-courtadmin': 25,
    hearingBundleTab: 26,
    hearingAbBundleTab: 26,
    hearingRsBundleTab: 26,
    hearingRbBundleTab: 26,
    hearingCaBundleTab: 26,
    hearingCjBundleTab: 26,
    fdrDocumentsTab: 27,
    fdrAbDocumentsTab: 27,
    fdrRsDocumentsTab: 27,
    fdrRbDocumentsTab: 27,
    fdrCaDocumentsTab: 27,
    fdrCjDocumentsTab: 27,
    generalApplicationsTab1: 28,
    generalApplicationsTab2: 28,
    generalApplicationsTab3: 28,
    generalApplicationsTab4: 28,
    generalApplicationsTab5: 28,
    generalApplicationsTab6: 28,
    generalApplicationsTab7: 28,
    generalApplicationsTab8: 28,
    generalApplicationsTab9: 28,
    generalApplicationsTab10: 28,
    generalApplicationsTab11: 28,
    generalApplicationsTab12: 28,
    generalApplicationsTab13: 28,
    generalApplicationsTab14: 28,
    caseFlagsTab: 29,
    firstIntervener: 30,
    secondIntervener: 31,
    thirdIntervener: 32,
    fourthIntervener: 33,
    intv1Documents: 34,
    intv2Documents: 35,
    intv3Documents: 36,
    intv4Documents: 37

  };
  tabIds.forEach(tabId => {
    it(`all ${tabId} fields should have the expected tab order ${expected[tabId]}`, () => {
      const allTabFields = uniq(filter(caseTypeTab, field => {
        return field.TabID === tabId;
      }));
      const allTabOrders = uniq(map(allTabFields, 'TabDisplayOrder'));
      expect(allTabOrders).to.eql([expected[tabId]]);
    });
  });

  it('should contain a valid Tab IDs', () => {
    expect(tabIds).to.eql([
      'historyTab',
      'state',
      'applicantDetailsTab',
      'caseFileViewTab',
      'schedule1ChildTab',
      'divorceDetailsTab',
      'respondentDetailsTab',
      'natureOfApplicationTab',
      'authorisationTab',
      'applicationDocumentsTab',
      'applicationDocumentsTab1',
      'applicationDocumentsTab2',
      'applicationDocumentsTab3',
      'applicationDocumentsTab4',
      'applicationDocumentsTab5',
      'paymentDetailsTab',
      'notesTab',
      'gatekeepingTab',
      'AdminNotes',
      'judiciaryOutcomeTab',
      'Orders',
      'abOrders',
      'rsOrders',
      'rbOrders',
      'caOrders',
      'cjOrders',
      'schedulingTab',
      'schedulingTabAb',
      'schedulingTabAs',
      'schedulingTabRs',
      'schedulingTabRb',
      'schedulingTabJudge',
      'hiddenTab',
      'ApplicantAddressConfidential-solicitor',
      'ApplicantAddressConfidential-courtadmin',
      'ApplicantAddressConfidential-judiciary',
      'RespondentAddressConfidential-solicitor',
      'RespondentAddressConfidential-courtadmin',
      'RespondentAddressConfidential-judiciary',
      'consentOrderProcessTab1',
      'consentOrderProcessTab2',
      'consentOrderProcessTab3',
      'consentOrderProcessTab4',
      'consentOrderProcessTab5',
      'consentOrderProcessTab6',
      'appDocuments',
      'resDocuments',
      'Trial Bundle',
      'Shared Documents',
      'sharedDocumentsAb',
      'sharedDocumentsRs',
      'sharedDocumentsRb',
      'sharedDocumentsCa',
      'sharedDocumentsCj',
      'interimSchedulingTab',
      'interimSchedulingTabAs',
      'interimSchedulingTabAb',
      'interimSchedulingTabRs',
      'interimSchedulingTabRb',
      'interimSchedulingTabJudge',
      'confidentialDocumentsTab',
      'ChangeOfRepresentativesTab-judiciary',
      'ChangeOfRepresentativesTab-courtadmin',
      'hearingBundleTab',
      'hearingAbBundleTab',
      'hearingRsBundleTab',
      'hearingRbBundleTab',
      'hearingCaBundleTab',
      'hearingCjBundleTab',
      'fdrDocumentsTab',
      'fdrAbDocumentsTab',
      'fdrRsDocumentsTab',
      'fdrRbDocumentsTab',
      'fdrCaDocumentsTab',
      'fdrCjDocumentsTab',
      'generalApplicationsTab1',
      'generalApplicationsTab2',
      'generalApplicationsTab3',
      'generalApplicationsTab4',
      'generalApplicationsTab5',
      'generalApplicationsTab6',
      'generalApplicationsTab7',
      'generalApplicationsTab8',
      'generalApplicationsTab9',
      'generalApplicationsTab10',
      'generalApplicationsTab11',
      'generalApplicationsTab12',
      'generalApplicationsTab13',
      'generalApplicationsTab14',
      'caseFlagsTab',
      'firstIntervener',
      'secondIntervener',
      'thirdIntervener',
      'fourthIntervener',
      'intv1Documents',
      'intv2Documents',
      'intv3Documents',
      'intv4Documents'

    ]);
  });
  it('should contain a valid case field IDs', () => {
    const validFields = uniq(map(caseFieldAll, 'ID'));
    const objectsWithInvalidCaseId = filter(caseTypeTab, field => {
      return validFields.indexOf(field.CaseFieldID) === -1;
    });
    expect(objectsWithInvalidCaseId).to.eql([]);
  });
});
