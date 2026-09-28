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
      try {
        const existingUser = await idamUtils.getUserInfo({
          id: user.id,
          bearerToken,
        });

        console.log(
          `IDAM user already exists: ${existingUser.email} (${existingUser.id})`,
        );
      } catch {
        console.log(
          `IDAM user ${user.email} not found. Recreating with ID ${user.id}`,
        );

        await idamUtils.createUser({
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

        console.log(`Created IDAM user: ${user.email}`);
      }
    }
  } finally {
    await idamUtils.dispose();
  }
}
