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
    'caseFileViewTab-courtadmin': 2,
    'caseFileViewTab-judiciary': 2,
    'caseFileViewTab-solicitor': 2,
    'ApplicantAddressConfidential-solicitor': 3,
    'ApplicantAddressConfidential-courtadmin': 3,
    'ApplicantAddressConfidential-judiciary': 3,
    'RespondentAddressConfidential-solicitor': 4,
    'RespondentAddressConfidential-courtadmin': 4,
    'RespondentAddressConfidential-judiciary': 4,
    applicantDetailsTab: 5,
    schedule1ChildTab: 6,
    divorceDetailsTab: 7,
    respondentDetailsTab: 8,
    natureOfApplicationTab: 9,
    authorisationTab: 10,
    applicationDocumentsTab: 11,
    applicationDocumentsTab1: 11,
    applicationDocumentsTab2: 11,
    applicationDocumentsTab3: 11,
    applicationDocumentsTab4: 11,
    applicationDocumentsTab5: 11,
    paymentDetailsTab: 12,
    notesTab: 13,
    gatekeepingTab: 14,
    AdminNotes: 15,
    judiciaryOutcomeTab: 16,
    'DraftOrders-courtadmin': 17,
    'DraftOrders-judiciary': 17,
    Orders: 17,
    abOrders: 17,
    rsOrders: 17,
    rbOrders: 17,
    caOrders: 17,
    cjOrders: 17,
    schedulingTab: 18,
    schedulingTabAb: 18,
    schedulingTabAs: 18,
    schedulingTabRs: 18,
    schedulingTabRb: 18,
    schedulingTabJudge: 18,
    hiddenTab: 19,
    consentOrderProcessTab1: 20,
    consentOrderProcessTab2: 20,
    consentOrderProcessTab3: 20,
    consentOrderProcessTab4: 20,
    consentOrderProcessTab5: 20,
    consentOrderProcessTab6: 20,
    appDocuments: 21,
    resDocuments: 22,
    'Trial Bundle': 23,
    'Shared Documents': 23,
    sharedDocumentsAb: 23,
    sharedDocumentsRs: 23,
    sharedDocumentsRb: 23,
    sharedDocumentsCa: 23,
    sharedDocumentsCj: 23,
    interimSchedulingTab: 24,
    interimSchedulingTabAs: 24,
    interimSchedulingTabAb: 24,
    interimSchedulingTabRs: 24,
    interimSchedulingTabRb: 24,
    interimSchedulingTabJudge: 24,
    confidentialDocumentsTab: 25,
    'ChangeOfRepresentativesTab-judiciary': 26,
    'ChangeOfRepresentativesTab-courtadmin': 27,
    hearingBundleTab: 28,
    hearingAbBundleTab: 28,
    hearingRsBundleTab: 28,
    hearingRbBundleTab: 28,
    hearingCaBundleTab: 28,
    hearingCjBundleTab: 28,
    fdrDocumentsTab: 29,
    fdrAbDocumentsTab: 29,
    fdrRsDocumentsTab: 29,
    fdrRbDocumentsTab: 29,
    fdrCaDocumentsTab: 29,
    fdrCjDocumentsTab: 29,
    generalApplicationsTab1: 30,
    generalApplicationsTab2: 30,
    generalApplicationsTab3: 30,
    generalApplicationsTab4: 30,
    generalApplicationsTab5: 30,
    generalApplicationsTab6: 30,
    generalApplicationsTab7: 30,
    generalApplicationsTab8: 30,
    generalApplicationsTab9: 30,
    generalApplicationsTab10: 30,
    generalApplicationsTab11: 30,
    generalApplicationsTab12: 30,
    generalApplicationsTab13: 30,
    generalApplicationsTab14: 30,
    caseFlagsTab: 31,
    firstIntervener: 32,
    secondIntervener: 33,
    thirdIntervener: 34,
    fourthIntervener: 35,
    intv1Documents: 36,
    intv2Documents: 37,
    intv3Documents: 38,
    intv4Documents: 39
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
      'caseFileViewTab-courtadmin',
      'caseFileViewTab-judiciary',
      'caseFileViewTab-solicitor',
      'ApplicantAddressConfidential-solicitor',
      'ApplicantAddressConfidential-courtadmin',
      'ApplicantAddressConfidential-judiciary',
      'RespondentAddressConfidential-solicitor',
      'RespondentAddressConfidential-courtadmin',
      'RespondentAddressConfidential-judiciary',
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
      'DraftOrders-courtadmin',
      'DraftOrders-judiciary',
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
