import { test } from '../../../../fixtures/fixtures.ts';
import config from '../../../../config/config.ts';
import { CommonEvents } from '../../../../config/case-data.ts';
import { DateHelper } from '../../../../data-utils/DateHelper.ts';
import { ConsentedCaseFactory } from '../../../../data-utils/factory/consented/ConsentedCaseFactory.ts';
import type {
  TaskManagementAction,
  TaskUserRole
} from '../../../../pages/WAtasks/TaskUiChecks.ts';

const TASK_NAME = 'Process Scanned Documents';
const ATTACH_SCANNED_DOCUMENT = 'Attach scanned document';

const users = {
  admin: {
    role: 'admin',
    name: 'CTSC Admin',
    email: config.ctsc_admin.email,
    password: config.ctsc_admin.password
  },
  teamLeader: {
    role: 'teamLeader',
    name: 'CTSC Team Leader',
    email: config.ctsc_teamleader.email,
    password: config.ctsc_teamleader.password
  }
} as const satisfies Record<
    TaskUserRole,
    {
        role: TaskUserRole;
        name: string;
        email: string;
        password: string;
    }
>;

const completionActions = [
  'Mark as done',
  ATTACH_SCANNED_DOCUMENT
] as const;

type CompletionAction = typeof completionActions[number];
type TestUser = {
    role: TaskUserRole;
    name: string;
    email: string;
    password: string;
};

const scenarios = Object.values(users).flatMap(user => {
  return completionActions.map(completionAction => {
    return { user, completionAction };
  });
});

const assignedActions: Record<TaskUserRole, TaskManagementAction[]> = {
  admin: ['Cancel task', 'Mark as done'],
  teamLeader: [
    'Cancel task',
    'Mark as done',
    'Reassign task',
    'Unassign task'
  ]
};

test.describe('Process scanned document task tests', () => {
  for (const { user, completionAction } of scenarios) {
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

        const openCaseAs = async (testUser: TestUser): Promise<void> => {
          await manageCaseDashboardPage.visit();
          await loginPage.loginWaitForPath(
            testUser.email,
            testUser.password,
            config.manageCaseBaseURL,
            config.loginPaths.worklist
          );
          await manageCaseDashboardPage.navigateToCase(caseId);
        };

        const completeTask = async (
          action: CompletionAction
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
            role: 'admin',
            name: 'Caseworker',
            email: config.caseWorker.email,
            password: config.caseWorker.password
          });
          await caseDetailsPage.selectNextStep(CommonEvents.attachScannedDocs);
          await caseDetailsPage.completeAttachScannedDocumentsEvent(false);
          await manageCaseDashboardPage.signOut();
        });

        await test.step(`${user.name} can see and assign the task`, async () => {
          await openCaseAs(user);
          await taskUiChecks.assertTaskVisible(TASK_NAME);
          await taskUiChecks.assertTaskUI(
            {
              name: TASK_NAME,
              priority: 'low',
              dueDate: DateHelper.getFormattedDateAfterWorkingDays(5),
              assignedTo: 'Unassigned'
            },
            user.role
          );
          await taskUiChecks.assignTaskToMe();
          await taskUiChecks.assertOnlyManagementActions(
            assignedActions[user.role]
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