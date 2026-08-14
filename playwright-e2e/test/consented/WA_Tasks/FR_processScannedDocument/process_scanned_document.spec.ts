import { test } from '../../../../fixtures/fixtures.ts';
import config from '../../../../config/config.ts';
import { CommonEvents } from '../../../../config/case-data.ts';
import { DateHelper } from '../../../../data-utils/DateHelper.ts';
import { ConsentedCaseFactory } from '../../../../data-utils/factory/consented/ConsentedCaseFactory.ts';
import type { TaskCompletionAction } from '../../../../pages/WAtasks/TaskScenario.ts';
import {
  ATTACH_SCANNED_DOCUMENT,
  processScannedDocuments,
  processScannedDocumentUserScenarios
} from './process_scanned_documents.scenario.ts';

const TASK_NAME = processScannedDocuments.taskName;
type LoginCredentials = {
    email: string;
    password: string;
};

test.describe('Process scanned document task tests', () => {
  for (const { user, completionAction } of processScannedDocumentUserScenarios) {
    test(
      `${user.name} completes the task using ${completionAction}`,
      { tag: ['@waTasks'] },
      async ({
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage,
        taskUiChecks
      }) => {
        const caseId = await ConsentedCaseFactory
          .createConsentedCaseUpToApplicationPaymentSubmission();

        const openCaseAs = async (
          credentials: LoginCredentials
        ): Promise<void> => {
          await manageCaseDashboardPage.visit();
          await loginPage.loginWaitForPath(
            credentials.email,
            credentials.password,
            config.manageCaseBaseURL,
            config.loginPaths.worklist
          );
          await manageCaseDashboardPage.navigateToCase(caseId);
        };

        const completeTask = async (
          action: TaskCompletionAction
        ): Promise<void> => {
          if (action === 'Mark as done') {
            await taskUiChecks.markTaskAsDone();
            return;
          }

          await taskUiChecks.selectTaskNextStep(ATTACH_SCANNED_DOCUMENT);
          await caseDetailsPage.completeAttachScannedDocumentsEvent(true);
        };

        await test.step('Create the Process Scanned Documents task', async () => {
          await openCaseAs({
            email: config.caseWorker.email,
            password: config.caseWorker.password
          });
          await caseDetailsPage.selectNextStep(CommonEvents.attachScannedDocs);
          await caseDetailsPage.completeAttachScannedDocumentsEvent(false);
          await manageCaseDashboardPage.signOut();
        });

        await test.step(`${user.name} can see and assign the task`, async () => {
          await openCaseAs(user);

          await test.step(
            `${TASK_NAME} is presented in All Work for the team leader`,
            async () => {
              if (user.role === 'teamLeader') {
                await taskUiChecks.assertTaskVisibleInWorkAllocationTab(
                  TASK_NAME,
                  'All work',
                  caseId
                );
                await taskUiChecks.manageTaskFromWorkAllocationTab(
                  TASK_NAME,
                  caseId
                );
                await taskUiChecks.assertGoToTaskVisible(true);
                await taskUiChecks.assertWorkAllocationManagementActions(
                  processScannedDocuments.roles.teamLeader.unassignedActions
                );
              } else {
                await taskUiChecks.assertWorkAllocationTabNotVisible('All work');
              }

              await manageCaseDashboardPage.navigateToCase(caseId);
            }
          );

          await taskUiChecks.assertTaskUI(
            {
              name: TASK_NAME,
              priority: 'low',
              dueDate: DateHelper.getFormattedDateAfterWorkingDays(5),
              assignedTo: 'Unassigned'
            },
            processScannedDocuments.roles[user.role].unassignedActions
          );
          await taskUiChecks.assignTaskToMe();

          await test.step(
            `${TASK_NAME} is presented in My Work once assigned`,
            async () => {
              await taskUiChecks.assertTaskVisibleInWorkAllocationTab(
                TASK_NAME,
                'My work',
                caseId
              );
              await taskUiChecks.manageTaskFromWorkAllocationTab(
                TASK_NAME,
                caseId
              );
              await taskUiChecks.assertGoToTaskVisible(true);
              await taskUiChecks.assertWorkAllocationManagementActions(
                processScannedDocuments.roles[user.role].assignedActions
              );

              await manageCaseDashboardPage.navigateToCase(caseId);
              await taskUiChecks.navigateToTasks();
              await taskUiChecks.assertGoToTaskVisible(false);
            }
          );

          await taskUiChecks.assertOnlyManagementActions(
            processScannedDocuments.roles[user.role].assignedActions
          );
          await taskUiChecks.assertNextStepVisible(ATTACH_SCANNED_DOCUMENT);
        });

        await test.step(
          `${user.name} completes the task using ${completionAction}`,
          async () => {
            await manageCaseDashboardPage.navigateToCase(caseId);
            await taskUiChecks.navigateToTasks();
            await completeTask(completionAction);
            await taskUiChecks.assertTaskNotVisible(TASK_NAME);
          }
        );
      }
    );
  }
});
