const expect = require('chai').expect;
const { uniqWith } = require('lodash');

const caseTypeTab = Object.assign(require('definitions/consented/json/AuthorisationCaseState/AuthorisationCaseState'), {});

describe('AuthorisationCaseState', () => {
  it('should contain a unique case type, state ID and role (no duplicates) - prod', () => {
    const caseType = Object.assign(caseTypeTab);
    const uniqResult = uniqWith(
      caseType,
      (field1, field2) => {
        return field1.CaseTypeID === field2.CaseTypeID && field1.CaseStateID === field2.CaseStateID
            && field1.UserRole === field2.UserRole;
      }
    );
    expect(uniqResult).to.eql(caseTypeTab);
  });
  it('should contain a unique case type, state ID and role (no duplicates) - nonprod', () => {
    const caseType = Object.assign(caseTypeTab);
    const uniqResult = uniqWith(
      caseType,
      (field1, field2) => {
        return field1.CaseTypeID === field2.CaseTypeID && field1.CaseStateID === field2.CaseStateID
            && field1.UserRole === field2.UserRole;
      }
    );
    expect(uniqResult).to.eql(caseTypeTab);
  });
});
