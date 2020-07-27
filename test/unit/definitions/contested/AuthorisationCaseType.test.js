const expect = require('chai').expect;
const { uniqWith } = require('lodash');

const caseTypeTab = Object.assign(require('definitions/contested/json/AuthorisationCaseType/AuthorisationCaseType.json'), {});

describe('AuthorisationCaseType', () => {
  it('should contain a unique case type and role (no duplicates)', () => {
    const uniqResult = uniqWith(
      caseTypeTab,
      (field1, field2) => {
        return field1.CaseTypeID === field2.CaseTypeID && field1.UserRole === field2.UserRole;
      }
    );
    expect(uniqResult).to.eql(caseTypeTab);
  });
});
