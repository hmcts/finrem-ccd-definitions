const { expect, assert } = require('chai');

const { find } = require('lodash');

const caseEvent = Object.assign(require('definitions/contested/json/CaseEvent/CaseEvent.json'), []);
const caseField = Object.assign(require('definitions/contested/json/CaseField/CaseField'), []);
const caseFieldCommon = Object.assign(require('definitions/common/json/CaseField/CaseField-common'), []);
const caseFieldAll = caseField.concat(caseFieldCommon)
const caseEventToFeilds = Object.assign(require('definitions/contested/json/CaseEventToFields/CaseEventToFields.json'), []);

describe('CaseEventToFields', () => {
  it('should contain valid event IDs', () => {
    const errors = [];
    caseEventToFeilds.forEach(caseEventToFieldsEntry => {
      try {
        expect(find(caseEvent, ['ID', caseEventToFieldsEntry.CaseEventID])).to.be.an('object');
      } catch (error) {
        errors.push(`Event ID ${caseEventToFieldsEntry.CaseEventID} is not valid`);
      }
    });
    if (errors.length) {
      assert.fail(`Found invalid case IDs - ${errors}`);
    }
  });
  it('should contain valid field IDs', () => {
    const errors = [];
    caseEventToFeilds.forEach(caseEventToFieldsEntry => {
      try {
        expect(find(caseFieldAll, ['ID', caseEventToFieldsEntry.CaseFieldID])).to.be.an('object');
      } catch (error) {
        errors.push(`Field ID ${caseEventToFieldsEntry.CaseFieldID} is not valid`);
      }
    });
    if (errors.length) {
      assert.fail(`Found invalid field IDs - ${errors}`);
    }
  });
});
