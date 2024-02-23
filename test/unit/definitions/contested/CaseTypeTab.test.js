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
  it('should contain a unique tab field display order ID field tab ID (no duplicate field order in a tab)', () => {
    tabIds.forEach(tabId => {
      const allFieldsPerTab = filter(caseTypeTab, field => {
        return field.TabID === tabId;
      });
      const uniqResults = uniqWith(
        allFieldsPerTab,
        (field1, field2) => {
          return field1.TabFieldDisplayOrder === field2.TabFieldDisplayOrder;
        }
      );
      expect(uniqResults).to.eql(allFieldsPerTab);
    });
  });
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
    schedule1ChildTab: 3,
    divorceDetailsTab: 4,
    respondentDetailsTab: 5,
    natureOfApplicationTab: 6,
    authorisationTab: 7,
    applicationDocumentsTab: 8,
    applicationDocumentsTab1: 8,
    applicationDocumentsTab2: 8,
    applicationDocumentsTab3: 8,
    applicationDocumentsTab4: 8,
    applicationDocumentsTab5: 8,
    paymentDetailsTab: 9,
    notesTab: 10,
    gatekeepingTab: 11,
    AdminNotes: 12,
    judiciaryOutcomeTab: 13,
    Orders: 14,
    abOrders: 14,
    rsOrders: 14,
    rbOrders: 14,
    caOrders: 14,
    cjOrders: 14,
    schedulingTab: 15,
    schedulingTabAb: 15,
    schedulingTabAs: 15,
    schedulingTabRs: 15,
    schedulingTabRb: 15,
    schedulingTabJudge: 15,
    hiddenTab: 16,
    consentOrderProcessTab1: 17,
    consentOrderProcessTab2: 17,
    consentOrderProcessTab3: 17,
    consentOrderProcessTab4: 17,
    consentOrderProcessTab5: 17,
    consentOrderProcessTab6: 17,
    appDocuments: 18,
    resDocuments: 19,
    'Trial Bundle': 20,
    'Shared Documents': 20,
    sharedDocumentsAb: 20,
    sharedDocumentsRs: 20,
    sharedDocumentsRb: 20,
    sharedDocumentsCa: 20,
    sharedDocumentsCj: 20,
    interimSchedulingTab: 21,
    interimSchedulingTabAs: 21,
    interimSchedulingTabAb: 21,
    interimSchedulingTabRs: 21,
    interimSchedulingTabRb: 21,
    interimSchedulingTabJudge: 21,
    confidentialDocumentsTab: 22,
    'ChangeOfRepresentativesTab-judiciary': 23,
    'ChangeOfRepresentativesTab-courtadmin': 24,
    hearingBundleTab: 25,
    hearingAbBundleTab: 25,
    hearingRsBundleTab: 25,
    hearingRbBundleTab: 25,
    hearingCaBundleTab: 25,
    hearingCjBundleTab: 25,
    fdrDocumentsTab: 26,
    fdrAbDocumentsTab: 26,
    fdrRsDocumentsTab: 26,
    fdrRbDocumentsTab: 26,
    fdrCaDocumentsTab: 26,
    fdrCjDocumentsTab: 26,
    generalApplicationsTab1: 27,
    generalApplicationsTab2: 27,
    generalApplicationsTab3: 27,
    generalApplicationsTab4: 27,
    generalApplicationsTab5: 27,
    generalApplicationsTab6: 27,
    generalApplicationsTab7: 27,
    generalApplicationsTab8: 27,
    generalApplicationsTab9: 27,
    generalApplicationsTab10: 27,
    generalApplicationsTab11: 27,
    generalApplicationsTab12: 27,
    generalApplicationsTab13: 27,
    generalApplicationsTab14: 27,
    caseFlagsTab: 28,
    firstIntervener: 29,
    secondIntervener: 30,
    thirdIntervener: 31,
    fourthIntervener: 32,
    intv1Documents: 33,
    intv2Documents: 34,
    intv3Documents: 35,
    intv4Documents: 36

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
  it.skip('should contain a valid case field IDs', () => {
    const validFields = uniq(map(caseFieldAll, 'ID'));
    const objectsWithInvalidCaseId = filter(caseTypeTab, field => {
      return validFields.indexOf(field.CaseFieldID) === -1;
    });
    expect(objectsWithInvalidCaseId).to.eql([]);
  });
});
