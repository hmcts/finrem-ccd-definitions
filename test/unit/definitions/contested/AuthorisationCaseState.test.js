const expect = require('chai').expect;
const { uniqWith } = require('lodash');

const caseTypeTab = Object.assign(require('definitions/contested/json/AuthorisationCaseState.json'), {});

describe('AuthorisationCaseState', () => {
  it('should contain a unique case type, state ID and role (no duplicates)', () => {
    const uniqResult = uniqWith(
      caseTypeTab,
      (field1, field2) => {
        return field1.CaseTypeID === field2.CaseTypeID && field1.CaseStateID === field2.CaseStateID
            && field1.UserRole === field2.UserRole;
      }
    );
    expect(uniqResult).to.eql(caseTypeTab);
  });
});
