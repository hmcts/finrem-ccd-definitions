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
    'ApplicantAddressConfidential-solicitor': 2,
    'RespondentAddressConfidential-solicitor': 3,
    applicantDetailsTab: 4,
    schedule1ChildTab: 5,
    divorceDetailsTab: 6,
    respondentDetailsTab: 7,
    natureOfApplicationTab: 8,
    authorisationTab: 9,
    applicationDocumentsTab: 10,
    applicationDocumentsTab1: 10,
    applicationDocumentsTab2: 10,
    applicationDocumentsTab3: 10,
    applicationDocumentsTab4: 10,
    applicationDocumentsTab5: 10,
    paymentDetailsTab: 11,
    notesTab: 12,
    gatekeepingTab: 13,
    AdminNotes: 14,
    judiciaryOutcomeTab: 15,
    Orders: 16,
    abOrders: 16,
    rsOrders: 16,
    rbOrders: 16,
    caOrders: 16,
    cjOrders: 16,
    schedulingTab: 17,
    schedulingTabAb: 17,
    schedulingTabAs: 17,
    schedulingTabRs: 17,
    schedulingTabRb: 17,
    schedulingTabJudge: 17,
    hiddenTab: 18,
    consentOrderProcessTab1: 19,
    consentOrderProcessTab2: 19,
    consentOrderProcessTab3: 19,
    consentOrderProcessTab4: 19,
    consentOrderProcessTab5: 19,
    consentOrderProcessTab6: 19,
    appDocuments: 20,
    resDocuments: 21,
    'Trial Bundle': 22,
    'Shared Documents': 22,
    sharedDocumentsAb: 22,
    sharedDocumentsRs: 22,
    sharedDocumentsRb: 22,
    sharedDocumentsCa: 22,
    sharedDocumentsCj: 22,
    interimSchedulingTab: 23,
    interimSchedulingTabAs: 23,
    interimSchedulingTabAb: 23,
    interimSchedulingTabRs: 23,
    interimSchedulingTabRb: 23,
    interimSchedulingTabJudge: 23,
    confidentialDocumentsTab: 24,
    'ChangeOfRepresentativesTab-judiciary': 25,
    'ChangeOfRepresentativesTab-courtadmin': 26,
    hearingBundleTab: 27,
    hearingAbBundleTab: 27,
    hearingRsBundleTab: 27,
    hearingRbBundleTab: 27,
    hearingCaBundleTab: 27,
    hearingCjBundleTab: 27,
    fdrDocumentsTab: 28,
    fdrAbDocumentsTab: 28,
    fdrRsDocumentsTab: 28,
    fdrRbDocumentsTab: 28,
    fdrCaDocumentsTab: 28,
    fdrCjDocumentsTab: 28,
    generalApplicationsTab1: 29,
    generalApplicationsTab2: 29,
    generalApplicationsTab3: 29,
    generalApplicationsTab4: 29,
    generalApplicationsTab5: 29,
    generalApplicationsTab6: 29,
    generalApplicationsTab7: 29,
    generalApplicationsTab8: 29,
    generalApplicationsTab9: 29,
    generalApplicationsTab10: 29,
    generalApplicationsTab11: 29,
    generalApplicationsTab12: 29,
    generalApplicationsTab13: 29,
    generalApplicationsTab14: 29,
    caseFlagsTab: 30,
    firstIntervener: 31,
    secondIntervener: 32,
    thirdIntervener: 33,
    fourthIntervener: 34,
    intv1Documents: 35,
    intv2Documents: 36,
    intv3Documents: 37,
    intv4Documents: 38
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
  it('should contain a valid case field IDs', () => {
    const validFields = uniq(map(caseFieldAll, 'ID'));
    const objectsWithInvalidCaseId = filter(caseTypeTab, field => {
      return validFields.indexOf(field.CaseFieldID) === -1;
    });
    expect(objectsWithInvalidCaseId).to.eql([]);
  });
});
