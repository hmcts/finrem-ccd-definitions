import { test } from '../../../../fixtures/fixtures.ts';
import config from '../../../../config/config.ts';
import { DateHelper } from '../../../../data-utils/DateHelper.ts';
import { ConsentedEvents } from '../../../../config/case-data.ts';
import { ConsentedCaseFactory } from '../../../../data-utils/factory/consented/ConsentedCaseFactory.ts';
import { ConsentedEventApi } from '../../../../data-utils/api/consented/ConsentedEventApi.ts';

import type { ManageCaseDashboardPage } from '../../../../pages/ManageCaseDashboardPage.ts';
import type { SigninPage } from '../../../../pages/SigninPage.ts';
import type { TaskCompletionAction } from '../../../../pages/WAtasks/TaskScenario.ts';
import {
  ISSUE_APPLICATION,
  checkIssueApplication,
  checkIssueApplicationUserScenarios
} from './check_issue_application.scenario.ts';

const TASK_NAME = checkIssueApplication.taskName;
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

const createCheckIssueApplicationTaskHWF = async (): Promise<string> => {
  const caseId = await ConsentedCaseFactory
    .createConsentedCaseUpToApplicationPaymentSubmission();

  await ConsentedEventApi.caseWorkerHWFDecisionMade(caseId);
  
  return caseId;
};

const createCheckIssueApplicationTaskFAB = async (): Promise<string> => {
  const caseId = await ConsentedCaseFactory
    .createConsentedCaseUpToApplicationPaymentSubmission();

  await ConsentedEventApi.caseWorkerHwfFeeAccountDebited(caseId);
  
  return caseId;
};

test.describe('Check and Issue Application task tests', () => {
  test.describe.configure({ mode: 'parallel' });

  for (const { user, completionAction } of checkIssueApplicationUserScenarios) {
    test(
      `${user.name} completes the task using ${completionAction}`,
      { tag: ['@waTasks'] },
      async ({
        loginPage,
        manageCaseDashboardPage,
        issueApplicationPage,
        caseDetailsPage,
        taskUiChecks
      }) => {
        const sessionPages = {
          loginPage,
          manageCaseDashboardPage
        };
        const caseId = await createCheckIssueApplicationTaskHWF();

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

          await taskUiChecks.selectTaskNextStep(ISSUE_APPLICATION);
          await issueApplicationPage.navigateContinue();
          await issueApplicationPage.navigateSubmit();
          await caseDetailsPage.checkHasBeenUpdated(ConsentedEvents.issueApplication.listItem);
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
            checkIssueApplication.roles[user.role].unassignedActions
          );
          await taskUiChecks.assignTaskToMe();

          await taskUiChecks.assertOnlyManagementActions(
            checkIssueApplication.roles[user.role].assignedActions
          );
          await taskUiChecks.assertNextStepVisible(ISSUE_APPLICATION);
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

      const sessionPages = {
        loginPage,
        manageCaseDashboardPage
      };
      const caseId = await createCheckIssueApplicationTaskFAB();

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
          checkIssueApplication.roles.teamLeader.unassignedActions
        );
        await manageCaseDashboardPage.navigateToCase(caseId);
        await taskUiChecks.assertTaskUI(
          {
            name: TASK_NAME,
            priority: 'low',
            dueDate: DateHelper.getFormattedDateAfterWorkingDays(5),
            assignedTo: 'Unassigned'
          },
          checkIssueApplication.roles.teamLeader.unassignedActions
        );
        await taskUiChecks.assignTaskToMe();
        await taskUiChecks.assertTaskAndActionsInWorkAllocationTab(
          TASK_NAME,
          'My work',
          caseId,
          checkIssueApplication.roles.teamLeader.assignedActions
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
