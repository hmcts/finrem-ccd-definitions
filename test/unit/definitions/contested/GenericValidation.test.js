/* eslint global-require: "off", max-nested-callbacks: "off" */

const expect = require('chai').expect;
const { uniq } = require('lodash');

const Config = {
  AuthorisationCaseEvent: Object.assign(require('definitions/contested/json/AuthorisationCaseEvent/AuthorisationCaseEvent'), []),
  AuthorisationCaseField: Object.assign(require('definitions/contested/json/AuthorisationCaseField/AuthorisationCaseField'), []),
  AuthorisationCaseState: Object.assign(require('definitions/contested/json/AuthorisationCaseState'), []),
  AuthorisationCaseType: Object.assign(require('definitions/contested/json/AuthorisationCaseType'), []),
  AuthorisationComplexType: Object.assign(require('definitions/contested/json/AuthorisationComplexType'), []),
  CaseEvent: Object.assign(require('definitions/contested/json/CaseEvent.json'), []),
  CaseEventToComplexTypes: Object.assign(require('definitions/contested/json/CaseEventToComplexTypes'), []),
  CaseEventToFields: Object.assign(require('definitions/contested/json/CaseEventToFields.json'), []),
  CaseField: Object.assign(require('definitions/contested/json/CaseField/CaseField'), []),
  CaseType: Object.assign(require('definitions/contested/json/CaseType'), []),
  CaseTypeTab: Object.assign(require('definitions/contested/json/CaseTypeTab/CaseTypeTab'), []),
  ComplexTypes: Object.assign(require('definitions/contested/json/ComplexTypes'), []),
  FixedLists: Object.assign(require('definitions/contested/json/FixedLists'), []),
  Jurisdiction: Object.assign(require('definitions/contested/json/Jurisdiction'), []),
  SearchInputFields: Object.assign(require('definitions/contested/json/SearchInputFields'), []),
  SearchResultFields: Object.assign(require('definitions/contested/json/SearchResultFields'), []),
  State: Object.assign(require('definitions/contested/json/State/State.json'), []),
  UserProfile: Object.assign(require('definitions/contested/json/UserProfile'), []),
  WorkBasketInputFields: Object.assign(require('definitions/contested/json/WorkBasketInputFields'), []),
  WorkBasketResultFields: Object.assign(require('definitions/contested/json/WorkBasketResultFields'), [])
};

describe('For each config sheet', () => {
  it('should have unique rows', () => {
    Object.keys(Config).forEach(sheetName => {
      const originalContent = Config[sheetName];
      const uniqueList = uniq(originalContent);
      expect(uniqueList.length).to.eq(originalContent.length);
    });
  });

  it('should not have any special characters, tabs or line breaks in any of the priority user fields', () => {
    const accepted = /^[\w|*|\-|.|[|\]]+$/;
    const priorityUserFields = ['CaseFieldID', 'CaseStateID', 'ID', 'CaseEventID'];
    Object.keys(Config).forEach(sheetName => {
      const content = Config[sheetName];
      content.forEach(row => {
        priorityUserFields.forEach(field => {
          const cellValue = row[field];
          if (cellValue && !cellValue.match(accepted)) {
            console.log(`Cell ${field} value in sheet ${sheetName} has unexpected characters for value ${cellValue}.`);
            expect(cellValue.toString()).to.match(accepted);
          }
        });
      });
    });
  });
});
