const env = process.env.RUNNING_ENV || 'aat';

const configs = {
  aat: {
    DOCUMENT_URL: 'http://dm-store-aat.service.core-compute-aat.internal/documents/d39e1231-5766-4200-b9ec-fd56fa2e510a',
    DOCUMENT_BINARY_URL: 'http://dm-store-aat.service.core-compute-aat.internal/documents/d39e1231-5766-4200-b9ec-fd56fa2e510a/binary',
    ORG_ID_1: 'Y707HZM',
    ORG_ID_2: '95V5X7X',
    PBA_NUMBER: 'PBA0089162',
    JUDGE_NAME: 'Peter Chapman',
    APP_SOL_BUILDING_STREET: '3rd Floor, 65-68 Leadenhall St',
    APP_SOL_TOWN_CITY: 'London',
    APP_SOL_COUNTY: 'Greater London',
    APP_SOL_POSTCODE: 'EC3A 2AD'
  },
  demo: {
    DOCUMENT_URL: 'http://dm-store-demo.service.core-compute-demo.internal/documents/00345e7e-3516-4722-93a7-21802dac8bb6',
    DOCUMENT_BINARY_URL: 'http://dm-store-demo.service.core-compute-demo.internal/documents/00345e7e-3516-4722-93a7-21802dac8bb6/binary',
    ORG_ID_1: 'KUOPA4B',
    ORG_ID_2: 'N7GN4FP',
    PBA_NUMBER: 'PBA0090111',
    JUDGE_NAME: 'peter fr',
    APP_SOL_BUILDING_STREET: '131 Regency Square',
    APP_SOL_TOWN_CITY: 'Warrington',
    APP_SOL_COUNTY: 'Cheshire',
    APP_SOL_POSTCODE: 'WA5 0EX'
  }
}
// get the environment variable RUNNING_ENV, default to 'aat' if not set
export const envTestData =
  configs.hasOwnProperty(env)
    ? configs[env as keyof typeof configs]
    : configs.aat;
