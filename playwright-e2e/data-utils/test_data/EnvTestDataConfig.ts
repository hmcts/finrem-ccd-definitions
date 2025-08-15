const env = process.env.RUNNING_ENV || 'aat';

const configs = {
  aat: {
    DOCUMENT_URL: 'http://dm-store-aat.service.core-compute-aat.internal/documents/1011d179-4d65-420b-85d7-2c6387016a31',
    DOCUMENT_BINARY_URL: 'http://dm-store-aat.service.core-compute-aat.internal/documents/1011d179-4d65-420b-85d7-2c6387016a31/binary',
    ORG_ID_1: 'Y707HZM',
    ORG_ID_2: '95V5X7X',
    PBA_NUMBER: 'PBA0089162'
  },
  demo: {
    DOCUMENT_URL: 'http://dm-store-demo.service.core-compute-demo.internal/documents/63cabb81-f3fd-48c8-bdba-d5155b1332e9',
    DOCUMENT_BINARY_URL: 'http://dm-store-demo.service.core-compute-demo.internal/documents/63cabb81-f3fd-48c8-bdba-d5155b1332e9/binary',
    ORG_ID_1: 'KUOPA4B',
    ORG_ID_2: 'N7GN4FP',
    PBA_NUMBER: 'PBA0090111'
  }
}
// get the environment variable RUNNING_ENV, default to 'aat' if not set
export const envTestData =
  configs.hasOwnProperty(env)
    ? configs[env as keyof typeof configs]
    : configs.aat;
