import { IdamUtils } from '@hmcts/playwright-common';
import config from './config';

const SOLICITOR_ROLES = [
  'caseworker-divorce-financialremedy-solicitor',
  'caseworker',
  'pui-case-manager',
  'pui-organisation-manager',
  'caseworker-divorce',
  'caseworker-divorce-financialremedy',
  'caseworker-divorce-solicitor',
];

const users = [
  {
    id: '89068764-a612-48bd-a10b-463e9546a0d2',
    email: config.applicant_solicitor.email,
    password: config.applicant_solicitor.password,
    forename: 'APP',
    surname: 'APP',
    roleNames: SOLICITOR_ROLES,
  },
  {
    id: 'c3f32daa-539f-4156-b355-2c246c5fae79',
    email: config.respondent_solicitor.email,
    password: config.respondent_solicitor.password,
    forename: 'RESPONDENT',
    surname: 'RESPONDENT',
    roleNames: SOLICITOR_ROLES,
  },
];

function getIdamEnvironment(): string {
  const runningEnv = process.env.RUNNING_ENV ?? 'aat';

  return runningEnv.startsWith('pr') ? 'aat' : runningEnv;
}

async function deleteUser(email: string): Promise<void> {
  const idamEnvironment = getIdamEnvironment();

  const idamApiUrl =
    process.env.IDAM_API_URL ??
    `https://idam-api.${idamEnvironment}.platform.hmcts.net`;

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

export default async function globalSetup(): Promise<void> {
  const idamUtils = new IdamUtils();

  try {
    const bearerToken = await idamUtils.generateIdamToken({
      grantType: 'client_credentials',
      clientId: process.env.IDAM_CLIENT_ID!,
      clientSecret: process.env.IDAM_SECRET!,
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
