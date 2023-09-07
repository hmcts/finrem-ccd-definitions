const expect = require('chai').expect;
const { differenceWith } = require('lodash');

const CaseType = Object.assign(require('definitions/consented/json/CaseType'), []);
const AuthorisationCaseType = Object.assign(require('definitions/consented/json/AuthorisationCaseType/AuthorisationCaseType.json'), []);
const State = Object.assign(require('definitions/consented/json/State'), []);
const AuthorisationCaseState = Object.assign(require('definitions/consented/json/AuthorisationCaseState/AuthorisationCaseState'), []);

const MINIMUM_READ_PERMISSIONS = /C?R?U?D?/;

function byCaseType(caseType) {
  return entry => {
    return entry.CaseTypeID === caseType;
  };
}

function byStateName(stateEntry) {
  return stateAuth => {
    return stateAuth.CaseStateID === stateEntry.ID;
  };
}

function mapErrorArray(caseType) {
  return entry => {
    return {
      UserRole: entry.UserRole,
      CaseType: caseType
    };
  };
}

function checkPerms(entry) {
  expect(entry.CRUD).to.match(MINIMUM_READ_PERMISSIONS);
}

describe('UserRole authorisations for CaseState', () => {
  it('should allow minimum R access for all Case States per User Role', () => {
    // iterate each case type
    // get all state auths for case type
    // get all roles for case type
    // get all states for case type
    // for each state
    // ensure each role has auth 'R' minimum
    CaseType.forEach(caseTypeEntry => {
      const caseType = caseTypeEntry.ID;
      const authStatesForCaseType = AuthorisationCaseState.filter(byCaseType(caseType));
      const authRolesForCaseType = AuthorisationCaseType.filter(byCaseType(caseType));
      const statesForCaseType = State.filter(byCaseType(caseType));

      statesForCaseType.forEach(stateEntry => {
        const authForState = authStatesForCaseType.filter(byStateName(stateEntry));
        if (authForState.length !== authRolesForCaseType.length) {
          const missingAuthCount = authRolesForCaseType.length - authForState.length;
          const diffAuthStates = differenceWith(authRolesForCaseType, authForState, (userRoleEntry, authStateEntry) => {
            return authStateEntry.UserRole === userRoleEntry.UserRole;
          }).map(mapErrorArray(caseType));
          console.log(`Missing ${missingAuthCount} authorisations for state: ${stateEntry.ID}`);
          console.dir(diffAuthStates);
        }
        authForState.forEach(checkPerms);
      });
    });
  });
});
