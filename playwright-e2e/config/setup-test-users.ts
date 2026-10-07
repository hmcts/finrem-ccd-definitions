import { IdamUtils } from '@hmcts/playwright-common';
import config from './config.ts';

const SOLICITOR_ROLES = [
  'caseworker-divorce-financialremedy-solicitor',
  'caseworker',
  'pui-case-manager',
  'pui-organisation-manager',
  'caseworker-divorce',
  'caseworker-divorce-financialremedy',
  'caseworker-divorce-solicitor',
];

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function getIdamEnvironment(): string {
  const runningEnv = process.env.RUNNING_ENV?.trim() || 'aat';

  return runningEnv.startsWith('pr-')
    ? 'aat'
    : runningEnv;
}

function configureIdamUrls(): void {
  const env = getIdamEnvironment();

  process.env.IDAM_API_URL =
    `https://idam-api.${env}.platform.hmcts.net`;

  process.env.IDAM_WEB_URL =
    `https://idam-web-public.${env}.platform.hmcts.net`;

  process.env.IDAM_TESTING_SUPPORT_URL =
    `https://idam-testing-support-api.${env}.platform.hmcts.net`;
}

const users = [
  {
    id: requireEnv('PLAYWRIGHT_SOLICITOR_ID'),
    email: config.applicant_solicitor.email,
    password: config.applicant_solicitor.password,
    forename: 'APP',
    surname: 'APP',
    roleNames: SOLICITOR_ROLES,
  },
  {
    id: requireEnv('PLAYWRIGHT_RESPONDENT_SOL_ID'),
    email: config.respondent_solicitor.email,
    password: config.respondent_solicitor.password,
    forename: 'RESPONDENT',
    surname: 'RESPONDENT',
    roleNames: SOLICITOR_ROLES,
  },
];

async function deleteUser(email: string): Promise<void> {
  const idamApiUrl = requireEnv('IDAM_API_URL');

  const response = await fetch(
    `${idamApiUrl}/testing-support/accounts/${encodeURIComponent(email)}`,
    {
      method: 'DELETE',
    },
  );

  if (response.status === 404) {
    console.log(`IDAM user does not exist, nothing to delete: ${email}`);
    return;
  }

  if (response.status !== 204) {
    const responseBody = await response.text();

    throw new Error(
      `Failed to delete IDAM user ${email}. ` +
        `Expected 204 but received ${response.status}. ` +
        `Response: ${responseBody}`,
    );
  }

  console.log(`Deleted IDAM user: ${email}`);
}

export async function setupTestUsers(): Promise<void> {
  configureIdamUrls();

  const idamUtils = new IdamUtils();

  try {
    const bearerToken = await idamUtils.generateIdamToken({
      grantType: 'client_credentials',
      clientId: requireEnv('IDAM_CLIENT_ID'),
      clientSecret: requireEnv('IDAM_SECRET'),
      scope: 'profile roles',
    });

    for (const user of users) {
      console.log(`Refreshing IDAM user: ${user.email}`);

      await deleteUser(user.email);

      const createdUser = await idamUtils.createUser({
        bearerToken,
        password: user.password,
        user: {
          id: user.id,
          email: user.email,
          forename: user.forename,
          surname: user.surname,
          roleNames: user.roleNames,
        },
      });

      console.log(
        `Created IDAM user: ${createdUser.email} (${createdUser.id})`,
      );
    }

    console.log('IDAM test users refreshed successfully.');
  } finally {
    await idamUtils.dispose();
  }
}
