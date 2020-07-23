const expect = require('chai').expect;
const { uniqWith } = require('lodash');

const authorisationCaseField = Object.assign(require('definitions/contested/json/AuthorisationCaseField/AuthorisationCaseField'), {});

describe('AuthorisationCaseField', () => {
  it('should contain a unique case type, field ID and role (no duplicates)', () => {
    const uniqResult = uniqWith(
      authorisationCaseField,
      (field1, field2) => {
        return field1.CaseTypeID === field2.CaseTypeID && field1.CaseFieldID === field2.CaseFieldID
            && field1.UserRole === field2.UserRole;
      }
    );
    expect(uniqResult).to.eql(authorisationCaseField);
  });
});
