import dotenv from 'dotenv';
dotenv.config();

const env = process.env.ENV || 'aat';

// Data which can be reused across multiple tests.
// Called simply with "import config from '../config';" and then e.g. "config.caseworker.email" in a test.
// Any new data added below will immediately be available wherever config is imported.
const configuration = {

  // URLs
  idamUrl:
    process.env.IDAM_API_URL || `https://idam-api.${env}.platform.hmcts.net`,

  manageCaseBaseURL:
    process.env.CCD_WEB_URL || `https://manage-case.${env}.platform.hmcts.net`,

  run_accessibility: 
    process.env.TESTS_FOR_ACCESSIBILITY || false, 

  judge: {
    email: process.env.USERNAME_JUDGE || '',
    password: process.env.PASSWORD_JUDGE || '',
  },

  caseWorker: {
    email: process.env.USERNAME_CASEWORKER || '',
    password: process.env.PASSWORD_CASEWORKER || '',
  },

  applicant_solicitor: {
    email: process.env.USERNAME_SOLICITOR || '',
    password: process.env.PASSWORD_SOLICITOR || '',
  },

  applicant_solicitor1: {
    email: process.env.USERNAME_SOLICITOR1 || '',
    password: process.env.PASSWORD_SOLICITOR1 || '',
  },

  respondent_solicitor: {
    email: process.env.USERNAME_RESPONDENT_SOLICITOR || 'fr_respondent_solicitor1@mailinator.com'
  },

  jurisdiction: {
    familyDivorce: 'Family Divorce',
  },

  caseType: {
    contested: 'Contested Financial Remedy',
    consented: 'Financial Remedy Consented',
  },
  eventType: {
    formA: 'Form A Application',
    paperCase: 'New Paper Case',
    consentOrder: 'Consent Order Application'
  },

  organisationNames: {
    finRem1Org: 'FinRem-1-Org',
    finRem2Org: 'FinRem-2-Org',
  },
  
  divorceStage: {
    decreeNisi: '1: Decree Nisi',
    decreeAbsolute: '2: Decree Absolute',
    petitionIssued: '3: Petition Issued',
  }

};

type ConfigurationType = typeof configuration;
export default configuration as ConfigurationType;
