import { expect, test } from '../../../../fixtures/fixtures.ts';
import config from '../../../../config/config.ts';
import { CommonEvents } from '../../../../config/case-data.ts';
import { ConsentedCaseFactory } from '../../../../data-utils/factory/consented/ConsentedCaseFactory.ts';

const taskName = 'Process Scanned Documents';

const users = [
  {
    name: 'CTSC Admin',
    credentialsEmail: config.ctsc_admin.email,
    credentialsPassword: config.ctsc_admin.password
  },
  {
    name: 'CTSC Team Leader',
    credentialsEmail: config.ctsc_teamleader.email,
    credentialsPassword: config.ctsc_teamleader.password
  }
] as const;

test.describe('Process scanned document tasks', () => {
  for (const user of users) {
    test(
      `${user.name} can see the task`,
      { tag: ['@caseworker'] },
      async ({
        page,
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage
      }) => {
        const caseId =
              await ConsentedCaseFactory.createConsentedCaseUpToApplicationPaymentSubmission();

        await test.step('Attach scanned documents', async () => {
          await manageCaseDashboardPage.visit();
          await loginPage.loginWaitForPath(
            config.caseWorker.email,
            config.caseWorker.password,
            config.manageCaseBaseURL,
            config.loginPaths.worklist
          );

          await manageCaseDashboardPage.navigateToCase(caseId);
          await caseDetailsPage.selectNextStep(
            CommonEvents.attachScannedDocs
          );

          await page.getByRole('button', { name: 'Continue' }).click();
          await page
            .getByRole('group', {
              name: 'Supplementary evidence handled'
            })
            .getByLabel('No')
            .check();
          await page.getByRole('button', { name: 'Continue' }).click();
          await page.getByRole('button', { name: 'Submit' }).click();

          await expect(
            caseDetailsPage.successfulUpdateBanner
          ).toBeVisible();

          await manageCaseDashboardPage.signOut();
        });

        await test.step(
          `Verify the task is visible to ${user.name}`,
          async () => {
            await manageCaseDashboardPage.visit();
            await loginPage.loginWaitForPath(
              user.credentialsEmail,
              user.credentialsPassword,
              config.manageCaseBaseURL,
              config.loginPaths.worklist
            );

            await manageCaseDashboardPage.navigateToCase(caseId);
            await manageCaseDashboardPage.assertTaskVisible(taskName);
            await manageCaseDashboardPage.signOut();
          }
        );
      }
    );
  }
});
