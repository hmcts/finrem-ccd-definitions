const env = process.env.RUNNING_ENV || 'aat';

const configs = {
  aat: {
    DOCUMENT_URL: 'http://dm-store-aat.service.core-compute-aat.internal/documents/f375d421-e9f9-4e18-9067-f1c920559da8',
    DOCUMENT_BINARY_URL: 'http://dm-store-aat.service.core-compute-aat.internal/documents/f375d421-e9f9-4e18-9067-f1c920559da8/binary',
    ORG_ID_1: 'Y707HZM',
    ORG_ID_2: '95V5X7X',
    PBA_NUMBER: 'PBA0089162',
    PBA_ACCOUNT_NAME: 'Bag End',
    JUDGE_NAME: 'Peter Chapman',
    JUDGE_SURNAME: 'Chapman',
    APP_SOL_BUILDING_STREET: '3rd Floor, 65-68 Leadenhall St',
    APP_SOL_TOWN_CITY: 'London',
    APP_SOL_COUNTY: 'Greater London',
    APP_SOL_POSTCODE: 'EC3A 2AD'
  },
  demo: {
    DOCUMENT_URL: 'http://dm-store-demo.service.core-compute-demo.internal/documents/8cf8ec66-a0b4-41de-a9d8-ed6722939e14',
    DOCUMENT_BINARY_URL: 'http://dm-store-demo.service.core-compute-demo.internal/documents/8cf8ec66-a0b4-41de-a9d8-ed6722939e14/binary',
    ORG_ID_1: 'KUOPA4B',
    ORG_ID_2: 'N7GN4FP',
    PBA_NUMBER: 'PBA0090111',
    PBA_ACCOUNT_NAME: 'applicantSolicitorFirm',
    JUDGE_NAME: 'peter fr',
    JUDGE_SURNAME: 'fr',
    APP_SOL_BUILDING_STREET: '131 Regency Square',
    APP_SOL_TOWN_CITY: 'Warrington',
    APP_SOL_COUNTY: 'Cheshire',
    APP_SOL_POSTCODE: 'WA5 0EX'
  }
};
// get the environment variable RUNNING_ENV, default to 'aat' if not set
export const envTestData =
  configs.hasOwnProperty(env)
    ? configs[env as keyof typeof configs]
    : configs.aat;
