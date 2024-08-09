/* eslint global-require: "off", max-nested-callbacks: "off" */

const expect = require('chai').expect;
const { uniq } = require('lodash');

const Config = {
  AuthorisationCaseEvent: Object.assign(require('definitions/consented/json/AuthorisationCaseEvent/AuthorisationCaseEvent'), []),
  AuthorisationCaseField: Object.assign(require('definitions/consented/json/AuthorisationCaseField/AuthorisationCaseField'), []),
  AuthorisationCaseState: Object.assign(require('definitions/consented/json/AuthorisationCaseState/AuthorisationCaseState'), []),
  AuthorisationCaseType: Object.assign(require('definitions/consented/json/AuthorisationCaseType/AuthorisationCaseType.json'), []),
  AuthorisationComplexType: Object.assign(require('definitions/consented/json/AuthorisationComplexType/AuthorisationComplexType.json'), []),
  CaseEvent: Object.assign(require('definitions/consented/json/CaseEvent/CaseEvent'), []),
  CaseEventToComplexTypes: Object.assign(require('definitions/consented/json/CaseEventToComplexTypes/CaseEventToComplexTypes.json'), []),
  CaseEventToFields: Object.assign(require('definitions/consented/json/CaseEventToFields/CaseEventToFields'), []),
  CaseField: Object.assign(require('definitions/consented/json/CaseField/CaseField'), []),
  CaseType: Object.assign(require('definitions/consented/json/CaseType'), []),
  CaseTypeTab: Object.assign(require('definitions/consented/json/CaseTypeTab/CaseTypeTab.json'), []),
  ComplexTypes: Object.assign(require('definitions/consented/json/ComplexTypes/ComplexTypes.json'), []),
  FixedLists: Object.assign(require('definitions/consented/json/FixedLists/FixedLists'), []),
  Jurisdiction: Object.assign(require('definitions/consented/json/Jurisdiction'), []),
  SearchInputFields: Object.assign(require('definitions/consented/json/SearchInputFields'), []),
  SearchResultFields: Object.assign(require('definitions/consented/json/SearchResultFields'), []),
  State: Object.assign(require('definitions/consented/json/State'), []),
  UserProfile: Object.assign(require('definitions/consented/json/UserProfile/UserProfile'), []),
  WorkBasketInputFields: Object.assign(require('definitions/consented/json/WorkBasketInputFields'), []),
  WorkBasketResultFields: Object.assign(require('definitions/consented/json/WorkBasketResultFields'), [])
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
