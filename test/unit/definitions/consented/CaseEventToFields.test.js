const { expect, assert } = require('chai');

const { find } = require('lodash');

const caseEvent = Object.assign(require('definitions/consented/json/CaseEvent/CaseEvent'), []);
const caseEventProd = Object.assign(require('definitions/consented/json/CaseEvent/CaseEvent-prod'), []);
const caseEventNonprod = Object.assign(require('definitions/consented/json/CaseEvent/CaseEvent-nonprod'), []);
const caseField = Object.assign(require('definitions/consented/json/CaseField/CaseField'), []);
const caseFieldCommon = Object.assign(require('definitions/common/json/CaseField/CaseField-common'), []);
const caseFieldAll = caseField.concat(caseFieldCommon)
const caseEventToFields = Object.assign(require('definitions/consented/json/CaseEventToFields'), []);

describe('CaseEventToFields', () => {
  it('should contain valid event IDs - nonprod', () => {
    const caseEventAll = caseEventNonprod.concat(caseEvent);

    const errors = [];
    caseEventToFields.forEach(caseEventToFieldsEntry => {
      try {
        expect(find(caseEventAll, ['ID', caseEventToFieldsEntry.CaseEventID])).to.be.an('object');
      } catch (error) {
        errors.push(`Event ID ${caseEventToFieldsEntry.CaseEventID} is not valid`);
      }
    });
    if (errors.length) {
      assert.fail(`Found invalid case IDs - ${errors}`);
    }
  });
  it('should contain valid event IDs - prod', () => {
    const caseEventAll = caseEventProd.concat(caseEvent);

    const errors = [];
    caseEventToFields.forEach(caseEventToFieldsEntry => {
      try {
        expect(find(caseEventAll, ['ID', caseEventToFieldsEntry.CaseEventID])).to.be.an('object');
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
    caseEventToFields.forEach(caseEventToFieldsEntry => {
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
