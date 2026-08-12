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

const completionActions = [
  'Mark as done',
  'Attach scanned document'
] as const;

const dueDate = new Date();
let workingDaysAdded = 0;

while (workingDaysAdded < 5) {
  dueDate.setDate(dueDate.getDate() + 1);

  const day = dueDate.getDay();
  const isWeekend = day === 0 || day === 6;

  if (!isWeekend) {
    workingDaysAdded++;
  }
}

const formattedDueDate = dueDate.toLocaleDateString('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
});

test.describe('Process scanned document task tests', () => {
  for (const user of users) {
    for (const completionAction of completionActions) {
      test(
        `${user.name} completes the task using ${completionAction}`,
        { tag: ['@waTasks'] },
        async ({
          page,
          loginPage,
          manageCaseDashboardPage,
          caseDetailsPage,
          taskUiChecks
        }) => {
          const caseId =
                        await ConsentedCaseFactory
                          .createConsentedCaseUpToApplicationPaymentSubmission();

          await test.step(
            'Create the Process Scanned Documents task',
            async () => {
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

              await page
                .getByRole('button', { name: 'Continue' })
                .click();

              await page
                .getByRole('group', {
                  name: 'Supplementary evidence handled'
                })
                .getByLabel('No')
                .check();

              await page
                .getByRole('button', { name: 'Continue' })
                .click();

              await page
                .getByRole('button', { name: 'Submit' })
                .click();

              await expect(
                caseDetailsPage.successfulUpdateBanner
              ).toBeVisible();

              await manageCaseDashboardPage.signOut();
            }
          );

          await test.step(
            `${user.name} can see and assign the task`,
            async () => {
              await manageCaseDashboardPage.visit();

              await loginPage.loginWaitForPath(
                user.credentialsEmail,
                user.credentialsPassword,
                config.manageCaseBaseURL,
                config.loginPaths.worklist
              );

              await manageCaseDashboardPage.navigateToCase(caseId);
              await taskUiChecks.assertTaskVisible(taskName);

              await taskUiChecks.assertTaskUI(
                {
                  name: taskName,
                  priority: 'low',
                  dueDate: formattedDueDate,
                  assignedTo: 'Unassigned'
                },
                user.name
              );

              await taskUiChecks.assignTaskToMe();
              await taskUiChecks.assertAssignedTaskActions(user.name);

              await taskUiChecks.assertNextStepVisible(
                'Attach scanned document'
              );
            }
          );

          await test.step(
            `${user.name} completes the task using ${completionAction}`,
            async () => {
              await manageCaseDashboardPage.navigateToCase(caseId);
              await taskUiChecks.navigateToTasks();
              if (completionAction === 'Mark as done') {
                await taskUiChecks.markTaskAsDone();
              } else {
                await taskUiChecks.selectTaskNextStep(
                  'Attach scanned document'
                );

                await page
                  .getByRole('button', { name: 'Continue' })
                  .click();

                await page
                  .getByRole('group', {
                    name: 'Supplementary evidence handled'
                  })
                  .getByLabel('Yes')
                  .check();

                await page
                  .getByRole('button', { name: 'Continue' })
                  .click();

                await page
                  .getByRole('button', { name: 'Submit' })
                  .click();

                await expect(
                  caseDetailsPage.successfulUpdateBanner
                ).toBeVisible();
              }

              await taskUiChecks.assertTaskNotVisible(taskName);
            }
          );
        }
      );
    }
  }
});