import { test } from '../../../../fixtures/fixtures.ts';
import config from '../../../../config/config.ts';
import { DateHelper } from '../../../../data-utils/DateHelper.ts';
import { ConsentedCaseFactory } from '../../../../data-utils/factory/consented/ConsentedCaseFactory.ts';
import type { ManageCaseDashboardPage } from '../../../../pages/ManageCaseDashboardPage.ts';
import type { SigninPage } from '../../../../pages/SigninPage.ts';
import type { TaskCompletionAction } from '../../../../pages/WAtasks/TaskScenario.ts';
import {
  AMEND_FINAL_ORDER,
  processApprovedOrder,
  processApprovedOrderUserScenarios
} from './process_approved_order.scenario.ts';
import {TaskName} from '../../../../pages/WAtasks/TaskTypes.ts';
import {ConsentedEventApi} from '../../../../data-utils/api/consented/ConsentedEventApi.ts';

const TASK_NAME = processApprovedOrder.taskName;
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
    config.loginPaths.cases
  );
  await manageCaseDashboardPage.navigateToCase(caseId);
};

test.describe('Process approve order task tests', () => {
  test.describe.configure({ mode: 'parallel' });

  for (const { user, completionAction } of processApprovedOrderUserScenarios) {
    test(
      `${user.name} performs the ${completionAction} action`,
      { tag: completionAction === AMEND_FINAL_ORDER ? ['@waTasks', '@preview'] : ['@waTasks'] },
      async ({
        loginPage,
        manageCaseDashboardPage,
        amendFinalOrderPage,
        taskUiChecks
      }) => {
        const sessionPages = {
          loginPage,
          manageCaseDashboardPage
        };
        const caseId = await ConsentedCaseFactory
          .createConsentedCaseUpToApplicationPaymentSubmission();

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

          await taskUiChecks.selectTaskNextStep(AMEND_FINAL_ORDER);
          await amendFinalOrderPage.completeAmendFinalOrderEvent();
        };

        await test.step(`${user.name} can see and assign the task`, async () => {
          await loginAndOpenCase(user, caseId, sessionPages);
          await taskUiChecks.closeTask(TaskName.CheckHelpWithFees, 'Mark as done');
          await ConsentedEventApi.caseworkerUploadApprovedOrder(caseId);
          await taskUiChecks.closeTask(TaskName.CheckAndIssueApplication, 'Mark as done');

          await taskUiChecks.assertTaskUI(
            {
              name: TASK_NAME,
              priority: 'low',
              dueDate: DateHelper.getFormattedDateAfterWorkingDays(5),
              assignedTo: 'Unassigned'
            },
            processApprovedOrder.roles[user.role].unassignedActions
          );
          await taskUiChecks.assignTaskToMe();

          await taskUiChecks.assertOnlyManagementActions(
            processApprovedOrder.roles[user.role].assignedActions
          );
          await taskUiChecks.assertNextStepVisible(AMEND_FINAL_ORDER);
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
      const caseId = await ConsentedCaseFactory
        .createConsentedCaseUpToApplicationPaymentSubmission();
      await taskUiChecks.closeTask(TaskName.CheckHelpWithFees, 'Mark as done');
      await ConsentedEventApi.caseworkerUploadApprovedOrder(caseId);
      await taskUiChecks.closeTask(TaskName.CheckAndIssueApplication, 'Mark as done');

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
          processApprovedOrder.roles.teamLeader.unassignedActions
        );
        await manageCaseDashboardPage.navigateToCase(caseId);
        await taskUiChecks.assertTaskUI(
          {
            name: TASK_NAME,
            priority: 'low',
            dueDate: DateHelper.getFormattedDateAfterWorkingDays(5),
            assignedTo: 'Unassigned'
          },
          processApprovedOrder.roles.teamLeader.unassignedActions
        );
        await taskUiChecks.assignTaskToMe();
        await taskUiChecks.assertTaskAndActionsInWorkAllocationTab(
          TASK_NAME,
          'My work',
          caseId,
          processApprovedOrder.roles.teamLeader.assignedActions
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
          config.loginPaths.cases
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
