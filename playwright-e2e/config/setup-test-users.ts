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

function configureIdamUrls(): string {
  const env = getIdamEnvironment();

  process.env.IDAM_API_URL =
    `https://idam-api.${env}.platform.hmcts.net`;

  process.env.IDAM_WEB_URL =
    `https://idam-web-public.${env}.platform.hmcts.net`;

  process.env.IDAM_TESTING_SUPPORT_URL =
    `https://idam-testing-support-api.${env}.platform.hmcts.net`;

  return env;
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

async function idamUserExists(
  userId: string,
  bearerToken: string,
): Promise<boolean> {
  const url =
    `${requireEnv('IDAM_TESTING_SUPPORT_URL')}/test/idam/users/${encodeURIComponent(userId)}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (response.status === 200) {
    return true;
  }

  if (response.status === 404) {
    return false;
  }

  const body = await response.text();

  throw new Error(
    `Failed checking IDAM user ${userId}. ` +
      `Expected 200 or 404, got ${response.status}. Response: ${body}`,
  );
}

export async function setupTestUsers(): Promise<void> {
  const idamEnv = configureIdamUrls();
  console.log(`IDAM environment: ${idamEnv}`);

  const idamUtils = new IdamUtils();

  try {
    const bearerToken = await idamUtils.generateIdamToken({
      grantType: 'client_credentials',
      clientId: requireEnv('IDAM_CLIENT_ID'),
      clientSecret: getIdamSecret(),
      scope: 'profile roles',
    });

    for (const user of getUsers()) {
      const exists = await idamUserExists(user.id, bearerToken);

      if (exists) {
        console.log(`IDAM user identified: ${user.email} (${user.id})`);
        continue;
      }

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

      console.log(`IDAM user created: ${createdUser.email} (${createdUser.id})`);
    }

    console.log('IDAM test user setup completed successfully.');
  } finally {
    await idamUtils.dispose();
  }
}
