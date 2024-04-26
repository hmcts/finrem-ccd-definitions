const expect = require('chai').expect;
const assert = require('chai').assert;
const { uniq, uniqWith, map, filter } = require('lodash');

const caseTypeTab = Object.assign(require('definitions/consented/json/CaseTypeTab/CaseTypeTab.json'), {});
const caseField = Object.assign(require('definitions/consented/json/CaseField/CaseField'), []);
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
    "state": 1,
    "CaseHistoryViewer": 1,
    "ApplicantAddressConfidential-solicitor": 2,
    "ApplicantAddressConfidential-courtadmin": 2,
    "ApplicantAddressConfidential-judiciary": 2,
    "RespondentAddressConfidential-solicitor": 3,
    "RespondentAddressConfidential-courtadmin": 3,
    "RespondentAddressConfidential-judiciary": 3,
    "applicantDetails": 4,
    "respondentDetails": 5,
    "divorceDetails": 6,
    "applicationDetails": 7,
    "authorisation": 8,
    "CaseDetails": 9,
    "Approved Order": 10,
    "PaymentDetails": 11,
    "PaymentHistory": 12,
    "AdminNotes": 13,
    "CaseOrder": 14,
    "Orders": 15,
    "Notes": 16,
    "Judge": 17,
    "ChangeOfRepresentativesTab-judiciary": 18,
    "ChangeOfRepresentativesTab-courtadmin": 19,
    "scheduleAndListingHearingTab": 20,
    "caseFlagsTab": 21
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
      'CaseHistoryViewer',
      'state',
      'ApplicantAddressConfidential-solicitor',
      'ApplicantAddressConfidential-courtadmin',
      'ApplicantAddressConfidential-judiciary',
      'RespondentAddressConfidential-solicitor',
      'RespondentAddressConfidential-courtadmin',
      'RespondentAddressConfidential-judiciary',
      'applicantDetails',
      'respondentDetails',
      'divorceDetails',
      'applicationDetails',
      'authorisation',
      'CaseDetails',
      'Approved Order',
      'PaymentDetails',
      'PaymentHistory',
      'AdminNotes',
      'CaseOrder',
      'Orders',
      'Notes',
      'Judge',
      'ChangeOfRepresentativesTab-judiciary',
      'ChangeOfRepresentativesTab-courtadmin',
      'scheduleAndListingHearingTab',
      'caseFlagsTab'
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
