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

  manageOrgBaseURL:
    process.env.XUI_ORG_WEB_URL || `https://manage-org.${env}.platform.hmcts.net`,

  manageOrgAPIBaseURL:
    process.env.MANAGE_ORG_API_BASE_URL || `http://aac-manage-case-assignment-${env}.service.core-compute-${env}.internal`,

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
    email: process.env.PLAYWRIGHT_SOLICITOR_USERNAME || '',
    password: process.env.PLAYWRIGHT_SOLICITOR_PSWD || '',
  },

  applicantCAA: {
    email: process.env.PLAYWRIGHT_APPL_CAA_USERNAME || '',
    password: process.env.PLAYWRIGHT_APPL_CAA_PSWD || '',
  },

  applicant_intervener: {
    email: process.env.PLAYWRIGHT_APPL_INTERVENER_USERNAME || '',
    password: process.env.PLAYWRIGHT_APPL_INTERVENER_PSWD || '',
  },

  applicant_barrister: {
    email: process.env.USERNAME_BARRISTER1 || '',
    password: process.env.PASSWORD_BARRISTER1 || '',
  },

  respondent_solicitor: {
    email: process.env.PLAYWRIGHT_RESPONDENT_SOL_USERNAME || 'fr_respondent_solicitor1@mailinator.com',
    password: process.env.PLAYWRIGHT_RESPONDENT_SOL_PSWD || '',
  },

  respondentCAA: {
    email: process.env.PLAYWRIGHT_RESP_CAA_USERNAME || '',
    password: process.env.PLAYWRIGHT_RESP_CAA_PSWD || '',
  },

  respondent_intervener: {
      email: process.env.PLAYWRIGHT_RESP_INTERVENER_USERNAME || '',
      password: process.env.PLAYWRIGHT_RESP_INTERVENER_PSWD || '',
  },

  respondent_barrister: {
    email: process.env.PLAYWRIGHT_RESP_BARRISTER_USERNAME || '',
    password: process.env.PLAYWRIGHT_RESP_BARRISTER_PSWD || '',
  },

  jurisdiction: {
    familyDivorce: (process.env.CCD_WEB_URL || `https://manage-case.${env}.platform.hmcts.net`) === 'https://manage-case.demo.platform.hmcts.net'
    ? 'Family Divorce - v104-26.1'
    : 'Family Divorce'
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
  },

  loginPaths: {
    cases: 'cases',
    worklist: 'work/my-work/list',
    organisation: 'organisation',
  }

};

type ConfigurationType = typeof configuration;
export default configuration as ConfigurationType;
