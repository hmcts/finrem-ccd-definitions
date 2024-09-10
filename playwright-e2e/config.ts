import dotenv from 'dotenv';
dotenv.config();

const env = process.env.ENVIRONMENT || 'aat';

// Data which can be reused across multiple tests.
// Called simply with "import config from '../config';" and then e.g. "config.caseworker.email" in a test.
// Any new data added below will immediately be available wherever config is imported.
const configuration = {

  timeout: 
    process.env.TIMEOUT || 10000,

  run_accessibility: 
    process.env.TESTS_FOR_ACCESSIBILITY || 'true', 

  // URLs
  idamUrl:
    process.env.IDAM_API_URL || `https://idam-api.${env}.platform.hmcts.net`,

  manageCaseBaseURL:
    process.env.MANAGE_CASE_URL || `https://manage-case.${env}.platform.hmcts.net`,

  caseWorker: {
    email: process.env.IDAM_CASEWORKER_USERNAME || '',
    password: process.env.IDAM_CASEWORKER_PASSWORD || '',
  },

  applicant_solicitor: {
    email: process.env.IDAM_SOLICITOR_USERNAME || '',
    password: process.env.IDAM_SOLICITOR_PASSWORD || '',
  },

  respondent_solicitor: {
    email: process.env.RESPONDENT_SOLICITOR_EMAIL || ''
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
  },

  organisationNames: {
    finRem1Org: 'FinRem-1-Org',
    finRem2Org: 'FinRem-2-Org',
  },
  
  divorceStage:{
  decreeNisi: '1: Decree Nisi',
  decreeAbsolute: '2: Decree Absolute',
  petitionIssued: '3: Petition Issued',
}

};

type ConfigurationType = typeof configuration;
export default configuration as ConfigurationType;
