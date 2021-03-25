const expect = require('chai').expect;
const assert = require('chai').assert;
const { uniq, uniqWith, map, filter } = require('lodash');

const caseTypeTab = Object.assign(require('definitions/contested/json/CaseTypeTab/CaseTypeTab.json'), {});
const caseField = Object.assign(require('definitions/contested/json/CaseField/CaseField'), {});
const caseFieldCommon = Object.assign(require('definitions/common/json/CaseField/CaseField-common'), []);
const caseFieldAll = caseField.concat(caseFieldCommon);
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
  it('should contain a proper sequence for TabFieldDisplayOrder with no gaps', () => {
    tabIds.forEach(tabId => {
      const allFieldsPerTab = filter(caseTypeTab, field => {
        return field.TabID === tabId;
      });
      const allTabFieldDisplayOrderNumbers = map(allFieldsPerTab, field => {
        return field.TabFieldDisplayOrder;
      }).sort((a, b) => {
        return a - b;
      });
      for (let i = 1; i < allTabFieldDisplayOrderNumbers.length; i++) {
        if (allTabFieldDisplayOrderNumbers[i] - allTabFieldDisplayOrderNumbers[i - 1] !== 1) {
          assert.fail(`Missing/unordered TabFieldDisplayOrder sequence number in TabID ${tabId} - expected ${allTabFieldDisplayOrderNumbers[i - 1] + 1} but got ${allTabFieldDisplayOrderNumbers[i]}`);
        }
      }
    });
  });

  const expected = {
    historyTab: 1,
    applicantDetailsTab: 2,
    divorceDetailsTab: 3,
    respondentDetailsTab: 4,
    natureOfApplicationTab: 5,
    authorisationTab: 6,
    applicationDocumentsTab: 7,
    paymentDetailsTab: 8,
    notesTab: 9,
    gatekeepingTab: 11,
    AdminNotes: 12,
    judiciaryOutcomeTab: 13,
    Orders: 14,
    schedulingTab: 15,
    hiddenTab: 16,
    consentOrderProcessTab: 17,
    'Applicant Documents': 18,
    'Respondent Documents': 19
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
      'applicantDetailsTab',
      'divorceDetailsTab',
      'respondentDetailsTab',
      'natureOfApplicationTab',
      'authorisationTab',
      'applicationDocumentsTab',
      'paymentDetailsTab',
      'notesTab',
      'gatekeepingTab',
      'AdminNotes',
      'judiciaryOutcomeTab',
      'Orders',
      'schedulingTab',
      'hiddenTab',
      'ApplicantAddressConfidential-solicitor',
      'ApplicantAddressConfidential-courtadmin',
      'ApplicantAddressConfidential-judiciary',
      'RespondentAddressConfidential-solicitor',
      'RespondentAddressConfidential-courtadmin',
      'RespondentAddressConfidential-judiciary',
      'consentOrderProcessTab',
      'Applicant Documents',
      'Respondent Documents'
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
