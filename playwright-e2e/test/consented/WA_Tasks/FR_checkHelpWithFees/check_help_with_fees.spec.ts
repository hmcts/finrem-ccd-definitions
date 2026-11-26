import { test } from '../../../../fixtures/fixtures.ts';
import config from '../../../../config/config.ts';
import { DateHelper } from '../../../../data-utils/DateHelper.ts';
import { ConsentedEvents } from '../../../../config/case-data.ts';
import { ConsentedCaseFactory } from '../../../../data-utils/factory/consented/ConsentedCaseFactory.ts';
import { YesNoRadioEnum } from '../../../../pages/helpers/enums/RadioEnums.ts';
import { applicationCaseSubmissionHWF } from '../../../../pages/helpers/PaymentSubmissionHelper.ts';
import { APPLICATION_FEE, ORDER_SUMMARY } from '../../test_data/payment_fees.ts';

import type { ManageCaseDashboardPage } from '../../../../pages/ManageCaseDashboardPage.ts';
import type { SigninPage } from '../../../../pages/SigninPage.ts';
import type { TaskUiChecks } from '../../../../pages/WAtasks/TaskUiChecks.ts';
import type { TaskManagementAction } from '../../../../pages/WAtasks/TaskTypes.ts';
import {
  assignedToOtherActions,
  CaseState,
  checkHelpWithFees,
  completionEvents,
  ctscAdmin,
  ctscTeamLeader,
  NEXT_STEPS,
  PRIORITY,
  workAllocationColumns
} from './check_help_with_fees.scenario.ts';

const TASK_NAME = checkHelpWithFees.taskName;

type LoginCredentials = {
  email: string;
  password: string;
};

type SessionPages = {
  loginPage: SigninPage;
  manageCaseDashboardPage: ManageCaseDashboardPage;
};

const login = async (
  credentials: LoginCredentials,
  { loginPage, manageCaseDashboardPage }: SessionPages,
  landingPath: string = config.loginPaths.worklist
): Promise<void> => {
  await manageCaseDashboardPage.visit();
  await loginPage.loginWaitForPath(
    credentials.email,
    credentials.password,
    config.manageCaseBaseURL,
    landingPath
  );
};

const loginAndOpenCase = async (
  credentials: LoginCredentials,
  caseId: string,
  sessionPages: SessionPages,
  landingPath?: string
): Promise<void> => {
  await login(credentials, sessionPages, landingPath);
  await sessionPages.manageCaseDashboardPage.navigateToCase(caseId);
};

const assertUnassignedTask = async (
  taskUiChecks: TaskUiChecks,
  actions: readonly TaskManagementAction[]
): Promise<void> => {
  await taskUiChecks.assertTaskUI(
    {
      name: TASK_NAME,
      priority: PRIORITY,
      dueDate: DateHelper.getFormattedDateAfterWorkingDays(checkHelpWithFees.dueInWorkingDays),
      assignedTo: 'Unassigned'
    },
    actions
  );
};

// Case Submission with Help With Fees selected moves the case to Awaiting HWF
// Decision, which creates the task.
const createCaseWithTask = (): Promise<string> => {
  return ConsentedCaseFactory.createConsentedCaseUpToApplicationPaymentSubmission();
};

test.describe('Check Help With Fees task tests', () => {
  test.describe.configure({ mode: 'parallel' });

  test(
    'Solicitor submits with Help With Fees, then CTSC Admin assigns the task and marks it as done',
    { tag: ['@waTasks', '@preview'] },
    async ({
      loginPage,
      manageCaseDashboardPage,
      caseDetailsPage,
      solicitorAuthPage,
      helpWithFeesPage,
      orderSummaryPage,
      caseSubmissionPage,
      checkYourAnswersPage,
      taskUiChecks
    }) => {
      test.setTimeout(10 * 60 * 1000);
      const sessionPages = { loginPage, manageCaseDashboardPage };
      const caseId = await ConsentedCaseFactory.createConsentedCase();

      await test.step('Solicitor runs Case Submission with Help With Fees', async () => {
        await loginAndOpenCase(
          config.applicant_solicitor,
          caseId,
          sessionPages,
          config.loginPaths.cases
        );
        await applicationCaseSubmissionHWF(
          caseDetailsPage,
          solicitorAuthPage,
          helpWithFeesPage,
          orderSummaryPage,
          caseSubmissionPage,
          checkYourAnswersPage,
          {
            caseEvent: ConsentedEvents.applicationPaymentSubmission,
            hasHelpWithFees: YesNoRadioEnum.YES,
            hwfCode: 'HWF123123',
            reference: 'Reference',
            amount: APPLICATION_FEE.amount,
            feeCode: APPLICATION_FEE.code,
            feeType: APPLICATION_FEE.type
          },
          ORDER_SUMMARY
        );
        // The helper ends on the Payment details tab, which doesn't show the state.
        await manageCaseDashboardPage.navigateToCase(caseId);
        await caseDetailsPage.validateCaseState(CaseState.AwaitingHWFDecision);
        await manageCaseDashboardPage.signOut();
      });

      await test.step('CTSC Admin sees the unassigned task and has no All work', async () => {
        await loginAndOpenCase(ctscAdmin, caseId, sessionPages);
        await assertUnassignedTask(taskUiChecks, checkHelpWithFees.roles.admin.unassignedActions);
        await taskUiChecks.assertWorkAllocationTabNotAvailable('All work');
      });

      await test.step('CTSC Admin assigns the task and sees the next steps', async () => {
        await taskUiChecks.assignTaskToMe();
        await taskUiChecks.assertOnlyManagementActions(checkHelpWithFees.roles.admin.assignedActions);
        for (const nextStep of NEXT_STEPS) {
          await taskUiChecks.assertNextStepVisible(nextStep);
        }
        await taskUiChecks.assertTaskRowInWorkAllocationTab(
          TASK_NAME,
          'My work',
          caseId,
          workAllocationColumns,
          checkHelpWithFees.roles.admin.assignedActions
        );
      });

      await test.step('Mark as done closes the task and leaves the case state unchanged', async () => {
        await manageCaseDashboardPage.navigateToCase(caseId);
        await taskUiChecks.navigateToTasks();
        await taskUiChecks.markTaskAsDone();
        await taskUiChecks.assertTaskNotVisible(TASK_NAME);
        await manageCaseDashboardPage.navigateToCase(caseId);
        await caseDetailsPage.validateCaseState(CaseState.AwaitingHWFDecision);
      });
    }
  );

  test(
    'Task actions for each user and task state, with Assign, Unassign and Cancel',
    { tag: ['@waTasks'] },
    async ({ loginPage, manageCaseDashboardPage, caseDetailsPage, taskUiChecks }) => {
      test.setTimeout(15 * 60 * 1000);
      const sessionPages = { loginPage, manageCaseDashboardPage };
      const caseId = await createCaseWithTask();

      const reopenTasks = async (): Promise<void> => {
        await manageCaseDashboardPage.navigateToCase(caseId);
        await taskUiChecks.navigateToTasks();
      };

      await test.step('Team Leader: unassigned task in All work and the case, then assigned to them', async () => {
        await login(ctscTeamLeader, sessionPages);
        await taskUiChecks.assertTaskRowInWorkAllocationTab(
          TASK_NAME,
          'All work',
          caseId,
          workAllocationColumns,
          checkHelpWithFees.roles.teamLeader.unassignedActions
        );
        await manageCaseDashboardPage.navigateToCase(caseId);
        await assertUnassignedTask(taskUiChecks, checkHelpWithFees.roles.teamLeader.unassignedActions);
        await taskUiChecks.assignTaskToMe();
        await taskUiChecks.assertOnlyManagementActions(checkHelpWithFees.roles.teamLeader.assignedActions);
        await manageCaseDashboardPage.signOut();
      });

      await test.step('CTSC Admin: task assigned to another user (Team Leader)', async () => {
        await loginAndOpenCase(ctscAdmin, caseId, sessionPages);
        await taskUiChecks.assertTaskVisible(TASK_NAME);
        await taskUiChecks.assertNotUnassigned();
        await taskUiChecks.assertOnlyManagementActions(
          assignedToOtherActions.admin.visible,
          { notChecked: assignedToOtherActions.admin.notChecked }
        );
        await manageCaseDashboardPage.signOut();
      });

      await test.step('Team Leader: Unassign, then Assign the task to CTSC Admin', async () => {
        await loginAndOpenCase(ctscTeamLeader, caseId, sessionPages);
        await taskUiChecks.navigateToTasks();
        await taskUiChecks.unassignTask();
        await reopenTasks();
        await taskUiChecks.assertAssignedTo('Unassigned');

        await taskUiChecks.assignTaskToUser('CTSC Admin', ctscAdmin.email);
        await reopenTasks();
        await taskUiChecks.assertNotUnassigned();
        await taskUiChecks.assertOnlyManagementActions(
          assignedToOtherActions.teamLeader.visible,
          { notChecked: assignedToOtherActions.teamLeader.notChecked }
        );
        await manageCaseDashboardPage.signOut();
      });

      await test.step('CTSC Admin: the assigned task is in My work', async () => {
        await login(ctscAdmin, sessionPages);
        await taskUiChecks.assertTaskRowInWorkAllocationTab(
          TASK_NAME,
          'My work',
          caseId,
          workAllocationColumns,
          checkHelpWithFees.roles.admin.assignedActions
        );
        await manageCaseDashboardPage.signOut();
      });

      await test.step('Team Leader: Cancel closes the task and leaves the case state unchanged', async () => {
        await loginAndOpenCase(ctscTeamLeader, caseId, sessionPages);
        await taskUiChecks.navigateToTasks();
        await taskUiChecks.cancelTask();
        await taskUiChecks.assertTaskNotVisible(TASK_NAME);
        await manageCaseDashboardPage.navigateToCase(caseId);
        await caseDetailsPage.validateCaseState(CaseState.AwaitingHWFDecision);
      });
    }
  );

  test(
    'Each Next steps event completes the task and moves the case to the right state',
    { tag: ['@waTasks'] },
    async ({ loginPage, manageCaseDashboardPage, caseDetailsPage, taskUiChecks }) => {
      test.setTimeout(10 * 60 * 1000);
      // One case per event, because each event completes the task.
      const caseIds = await Promise.all(completionEvents.map(() => {return createCaseWithTask();}));

      await login(ctscAdmin, { loginPage, manageCaseDashboardPage });

      for (const [index, { event, expectedState }] of completionEvents.entries()) {
        await test.step(`${event} moves the case to ${expectedState}`, async () => {
          await manageCaseDashboardPage.navigateToCase(caseIds[index]);
          await taskUiChecks.assertTaskVisible(TASK_NAME);
          await taskUiChecks.assignTaskToMe();
          await taskUiChecks.submitEventFromTask(event);
          await caseDetailsPage.checkHasBeenUpdated(event);
          await caseDetailsPage.validateCaseState(expectedState);
          await taskUiChecks.assertTaskNotVisible(TASK_NAME);
        });
      }
    }
  );

  test(
    'No task is created when the case is submitted with a fee account',
    { tag: ['@waTasks'] },
    async ({ loginPage, manageCaseDashboardPage, caseDetailsPage, taskUiChecks }) => {
      const caseId = await ConsentedCaseFactory.createConsentedCaseSubmittedWithFeeAccount();

      await loginAndOpenCase(ctscAdmin, caseId, { loginPage, manageCaseDashboardPage });
      await caseDetailsPage.validateCaseState(CaseState.ApplicationSubmitted);
      await taskUiChecks.assertTaskNeverAppears(TASK_NAME);
    }
  );
});
