const expect = require('chai').expect;
const { differenceWith } = require('lodash');

const CaseType = Object.assign(require('definitions/contested/json/CaseType/CaseType.json'), []);
const AuthorisationCaseType = Object.assign(require('definitions/contested/json/AuthorisationCaseType/AuthorisationCaseType.json'), []);
const AuthorisationCaseTypeSACNonProd = Object.assign(
  require('definitions/contested/json/AuthorisationCaseType/AuthorisationCaseType-shareACase-nonprod.json'), []);
const State = Object.assign(require('definitions/contested/json/State/State.json'), []);
const AuthorisationCaseState = Object.assign(
  require('definitions/contested/json/AuthorisationCaseState/AuthorisationCaseState.json'), []);
const AuthorisationCaseStateSACNonProd = Object.assign(
  require('definitions/contested/json/AuthorisationCaseState/AuthorisationCaseState-shareACase-nonprod.json'), []);
const AuthorisationCaseStateSACProd = Object.assign(
  require('definitions/contested/json/AuthorisationCaseState/AuthorisationCaseState-shareACase-prod.json'), []);
const AuthorisationCaseStateAll = AuthorisationCaseState
  .concat(AuthorisationCaseStateSACProd).concat(AuthorisationCaseStateSACNonProd);
const AuthorisationCaseTypeAll = AuthorisationCaseType.concat(AuthorisationCaseTypeSACNonProd);

const MINIMUM_READ_PERMISSIONS = /C?RU?D?/;
const EXCLUDED_STATES = ['SOTAgreementPayAndSubmitRequired', 'Rejected', 'Withdrawn', 'DNisRefused', 'solicitorAwaitingPaymentConfirmation'];

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
      const authStatesForCaseType = AuthorisationCaseStateAll.filter(byCaseType(caseType));
      const authRolesForCaseType = AuthorisationCaseTypeAll.filter(byCaseType(caseType));
      const statesForCaseType = State.filter(byCaseType(caseType));

      statesForCaseType.forEach(stateEntry => {
        if (EXCLUDED_STATES.includes(stateEntry.ID)) {
          return;
        }
        const authForState = authStatesForCaseType.filter(byStateName(stateEntry));
        if (authForState.length !== authRolesForCaseType.length) {
          const missingAuthCount = authRolesForCaseType.length - authForState.length;
          const diffAuthStates = differenceWith(authRolesForCaseType, authForState, (userRoleEntry, authStateEntry) => {
            return authStateEntry.UserRole === userRoleEntry.UserRole;
          }).map(mapErrorArray(caseType));
          console.log(`Missing ${missingAuthCount} authorisations for state: ${stateEntry.ID}`);
          console.dir(diffAuthStates);
        }
        expect(authForState.length).to.eql(authRolesForCaseType.length);
        authForState.forEach(checkPerms);
      });
    });
  });
});
