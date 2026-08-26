import { test } from '../../../../fixtures/fixtures.ts';
import config from '../../../../config/config.ts';
import { DateHelper } from '../../../../data-utils/DateHelper.ts';
import { ConsentedCaseFactory } from '../../../../data-utils/factory/consented/ConsentedCaseFactory.ts';
import { ConsentedEventApi } from '../../../../data-utils/api/consented/ConsentedEventApi.ts';
import type { ManageCaseDashboardPage } from '../../../../pages/ManageCaseDashboardPage.ts';
import type { SigninPage } from '../../../../pages/SigninPage.ts';
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

type SessionPages = {
  loginPage: SigninPage;
  manageCaseDashboardPage: ManageCaseDashboardPage;
};

const loginAndOpenCase = async (
  credentials: LoginCredentials,
  caseId: string,
  { loginPage, manageCaseDashboardPage }: SessionPages
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

const createProcessScannedDocumentTask = async (): Promise<string> => {
  const caseId = await ConsentedCaseFactory
    .createConsentedCaseUpToApplicationPaymentSubmission();

  await ConsentedEventApi.caseWorkerAttachScannedDocuments(caseId, false);

  return caseId;
};

test.describe('Process scanned document task tests', () => {
  test.describe.configure({ mode: 'parallel' });

  for (const { user, completionAction } of processScannedDocumentUserScenarios) {
    test(
      `${user.name} completes the task using ${completionAction}`,
      { tag: ['@waTasks'] },
      async ({
        loginPage,
        manageCaseDashboardPage,
        attachScannedDocumentsPage,
        taskUiChecks
      }) => {
        const sessionPages = {
          loginPage,
          manageCaseDashboardPage
        };
        const caseId = await createProcessScannedDocumentTask();

        const completeTask = async (
          action: TaskCompletionAction
        ): Promise<void> => {
          if (action === 'Mark as done') {
            await taskUiChecks.markTaskAsDone();
            return;
          }

          if (action === 'Cancel task') {
            await taskUiChecks.cancelTask();
            return;
          }

          await taskUiChecks.selectTaskNextStep(ATTACH_SCANNED_DOCUMENT);
          await attachScannedDocumentsPage.completeAttachScannedDocumentsEvent(true);
        };

        await test.step(`${user.name} can see and assign the task`, async () => {
          await loginAndOpenCase(user, caseId, sessionPages);

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

          await taskUiChecks.assertOnlyManagementActions(
            processScannedDocuments.roles[user.role].assignedActions
          );
          await taskUiChecks.assertNextStepVisible(ATTACH_SCANNED_DOCUMENT);
        });

        await test.step(
          `${user.name} completes the task using ${completionAction}`,
          async () => {
            await completeTask(completionAction);
            await taskUiChecks.assertTaskNotVisible(TASK_NAME);
          }
        );
      }
    );
  }

  test(
    'CTSC Team Leader reassigns their task to CTSC Admin',
    { tag: ['@waTasks'] },
    async ({
      loginPage,
      manageCaseDashboardPage,
      taskUiChecks
    }) => {
      test.setTimeout(15 * 60 * 1000);

      const sessionPages = {
        loginPage,
        manageCaseDashboardPage
      };
      const caseId = await createProcessScannedDocumentTask();

      await test.step('Team Leader assigns the task to themselves', async () => {
        await loginAndOpenCase(
          config.ctsc_teamleader,
          caseId,
          sessionPages
        );
        await taskUiChecks.assertTaskAndActionsInWorkAllocationTab(
          TASK_NAME,
          'All work',
          caseId,
          processScannedDocuments.roles.teamLeader.unassignedActions
        );
        await manageCaseDashboardPage.navigateToCase(caseId);
        await taskUiChecks.assertTaskUI(
          {
            name: TASK_NAME,
            priority: 'low',
            dueDate: DateHelper.getFormattedDateAfterWorkingDays(5),
            assignedTo: 'Unassigned'
          },
          processScannedDocuments.roles.teamLeader.unassignedActions
        );
        await taskUiChecks.assignTaskToMe();
        await taskUiChecks.assertTaskAndActionsInWorkAllocationTab(
          TASK_NAME,
          'My work',
          caseId,
          processScannedDocuments.roles.teamLeader.assignedActions
        );
        await manageCaseDashboardPage.navigateToCase(caseId);
        await taskUiChecks.navigateToTasks();
      });

      await test.step('Team Leader reassigns their task to CTSC Admin', async () => {
        await taskUiChecks.reassignTaskToUser(
          'CTSC Admin',
          config.ctsc_admin.email
        );
        await manageCaseDashboardPage.signOut();
      });

      await test.step('The task is visible to CTSC Admin', async () => {
        await manageCaseDashboardPage.visit();
        await loginPage.loginWaitForPath(
          config.ctsc_admin.email,
          config.ctsc_admin.password,
          config.manageCaseBaseURL,
          config.loginPaths.worklist
        );
        await taskUiChecks.assertTaskVisibleInWorkAllocationTab(
          TASK_NAME,
          'My work',
          caseId
        );
      });
    }
  );
});
