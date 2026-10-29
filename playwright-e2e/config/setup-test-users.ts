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

function getIdamSecret(): string {
  const env = getIdamEnvironment();

  if (env === 'demo') {
    return process.env.IDAM_SECRET_DEMO?.trim() || requireEnv('IDAM_SECRET');
  }

  return process.env.IDAM_SECRET_AAT?.trim() || requireEnv('IDAM_SECRET');
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

type SolicitorParty = 'applicant' | 'respondent';

function getSolicitorName(
  party: SolicitorParty,
): { forename: string; surname: string } {
  const isDemo = getIdamEnvironment() === 'demo';

  if (party === 'applicant') {
    return isDemo
      ? { forename: 'Senior', surname: 'Dude' }
      : { forename: 'APP', surname: 'APP' };
  }

  return isDemo
    ? { forename: 'Junior', surname: 'Dude' }
    : { forename: 'RESPONDENT', surname: 'RESPONDENT' };
}

function getApplicantSolicitorId(): string {
  return getIdamEnvironment() === 'demo'
    ? requireEnv('PLAYWRIGHT_APPLICANT_SOLICITOR_ID_DEMO')
    : requireEnv('PLAYWRIGHT_APPLICANT_SOLICITOR_ID');
}

function getRespondentSolicitorId(): string {
  return getIdamEnvironment() === 'demo'
    ? requireEnv('PLAYWRIGHT_RESPONDENT_SOLICITOR_ID_DEMO')
    : requireEnv('PLAYWRIGHT_RESPONDENT_SOLICITOR_ID');
}

function getUsers() {
  return [
    {
      id: getApplicantSolicitorId(),
      email: config.applicant_solicitor.email,
      password: config.applicant_solicitor.password,
      ...getSolicitorName('applicant'),
      roleNames: SOLICITOR_ROLES,
    },
    {
      id: getRespondentSolicitorId(),
      email: config.respondent_solicitor.email,
      password: config.respondent_solicitor.password,
      ...getSolicitorName('respondent'),
      roleNames: SOLICITOR_ROLES,
    },
  ];
}

export async function setupTestUsers(): Promise<void> {
  configureIdamUrls();

  const idamUtils = new IdamUtils();

  try {
    const bearerToken = await idamUtils.generateIdamToken({
      grantType: 'client_credentials',
      clientId: requireEnv('IDAM_CLIENT_ID'),
      clientSecret: getIdamSecret(),
      scope: 'profile roles',
    });

    for (const user of getUsers()) {
      console.log(`Checking IDAM user: ${user.email}`);

      let userExists = false;

      try {
        const existingUser = await idamUtils.getUserInfo({
          id: user.id,
          bearerToken,
        });

        if (existingUser.id !== user.id ||
            existingUser.email.toLowerCase() !== user.email.toLowerCase()) {
          throw new Error(
            `IDAM user mismatch for ${user.email}. ` +
            `Expected ID: ${user.id}, received: ${existingUser.id}. ` +
            `Received email: ${existingUser.email}`,
          );
        }

        userExists = true;

        console.log(
          `IDAM user already exists: ${existingUser.email} (${existingUser.id})`,
        );
      } catch (error) {
        const message =
          error instanceof Error ? error.message : String(error);

        // Only create the user when IDAM confirms they do not exist.
        if (!/Status Code:\s*404\b/i.test(message)) {
          throw error;
        }
      }

      if (userExists) {
        continue;
      }

      console.log(`Creating IDAM user: ${user.email}`);

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

    console.log('IDAM test user setup completed successfully.');
  } finally {
    await idamUtils.dispose();
  }
}
