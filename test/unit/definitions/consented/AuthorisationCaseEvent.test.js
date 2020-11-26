const expect = require('chai').expect;
const { uniqWith } = require('lodash');

const caseTypeTab = Object.assign(require('definitions/consented/json/AuthorisationCaseEvent/AuthorisationCaseEvent'), {});

describe('AuthorisationCaseEvent', () => {
  it('should contain a unique case type, case event ID and role (no duplicates) - prod ', () => {
    const uniqResult = uniqWith(
      caseTypeTab,
      (field1, field2) => {
        return field1.CaseTypeID === field2.CaseTypeID && field1.CaseEventID === field2.CaseEventID
            && field1.UserRole === field2.UserRole;
      }
    );
    expect(uniqResult).to.eql(caseTypeTab);
  });
  it('should contain a unique case type, case event ID and role (no duplicates) - nonprod ', () => {
    const caseType = Object.assign(caseTypeTab);
    const uniqResult = uniqWith(
      caseType,
      (field1, field2) => {
        return field1.CaseTypeID === field2.CaseTypeID && field1.CaseEventID === field2.CaseEventID
            && field1.UserRole === field2.UserRole;
      }
    );
    expect(uniqResult).to.eql(caseTypeTab);
  });
});
