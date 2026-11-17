import {test} from '../../../../fixtures/fixtures.ts';
import config from '../../../../config/config.ts';
import {DateHelper} from '../../../../data-utils/DateHelper.ts';
import {ConsentedEvents} from '../../../../config/case-data.ts';
import {ConsentedCaseFactory} from '../../../../data-utils/factory/consented/ConsentedCaseFactory.ts';

import type {ManageCaseDashboardPage} from '../../../../pages/ManageCaseDashboardPage.ts';
import type {SigninPage} from '../../../../pages/SigninPage.ts';
import type {ApproveApplicationPage} from '../../../../pages/events/approve-order/ApproveApplicationPage.ts';
import type {ConsentOrderNotApprovedPage} from '../../../../pages/events/consent-application/ConsentOrderNotApprovedPage.ts';
import type {CaseDetailsPage} from '../../../../pages/CaseDetailsPage.ts';
import type {TaskUiChecks} from '../../../../pages/WAtasks/TaskUiChecks.ts';
import type {TaskCompletionAction} from '../../../../pages/WAtasks/TaskScenario.ts';
import {
  APPLICATION_NOT_APPROVED,
  APPROVE_APPLICATION,
  reassignScenario,
  reviewApplication,
  reviewApplicationUserScenarios,
  UPLOAD_APPROVED_ORDER
} from './review_application.scenario.ts';

const TASK_NAME = reviewApplication.taskName;
const JUDGE_TITLE = 'Her Honour Judge';
const JUDGE_SURNAME = 'Love';

type LoginCredentials = {
    email: string;
    password: string;
};

type SessionPages = {
    loginPage: SigninPage;
    manageCaseDashboardPage: ManageCaseDashboardPage;
};

type OutcomePages = {
    approveApplicationPage: ApproveApplicationPage;
    consentOrderNotApprovedPage: ConsentOrderNotApprovedPage;
    caseDetailsPage: CaseDetailsPage;
    taskUiChecks: TaskUiChecks;
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

const completeTask = async (
  action: TaskCompletionAction,
  {
    approveApplicationPage,
    consentOrderNotApprovedPage,
    caseDetailsPage,
    taskUiChecks
  }: OutcomePages
): Promise<void> => {
  switch (action) {
  case 'Mark as done':
    await taskUiChecks.markTaskAsDone();
    return;

  case 'Cancel task':
    await taskUiChecks.cancelTask();
    return;

  case APPROVE_APPLICATION:
    await taskUiChecks.selectTaskNextStep(APPROVE_APPLICATION);
    await approveApplicationPage.selectIsSubjectTo(false);
    await approveApplicationPage.selectIsPensionProvider(true);
    await approveApplicationPage.selectPensionProviderResponsibility('The Court');
    await approveApplicationPage.selectJudge(JUDGE_TITLE);
    await approveApplicationPage.enterJudgeName(JUDGE_SURNAME);
    await approveApplicationPage.navigateContinue();
    await approveApplicationPage.navigateSubmit();
    await caseDetailsPage.checkHasBeenUpdated(ConsentedEvents.approveApplication.listItem);
    return;

  case UPLOAD_APPROVED_ORDER:
    await taskUiChecks.selectTaskNextStep(UPLOAD_APPROVED_ORDER);
    await approveApplicationPage.selectIsSubjectTo(false);
    await approveApplicationPage.selectIsPensionProvider(false);
    await approveApplicationPage.selectJudge(JUDGE_TITLE);
    await approveApplicationPage.enterJudgeName(JUDGE_SURNAME);
    // A duplicate file name leaves the task open (DFR-5924), so keep it unique.
    await approveApplicationPage.uploadConsentOrderFile(`approved-order-${Date.now()}.pdf`);
    await approveApplicationPage.navigateContinue();
    await approveApplicationPage.navigateSubmit();
    await caseDetailsPage.checkHasBeenUpdated(ConsentedEvents.uploadApprovedOrder.listItem);
    return;

  case APPLICATION_NOT_APPROVED:
    await taskUiChecks.selectTaskNextStep(APPLICATION_NOT_APPROVED);
    await consentOrderNotApprovedPage.selectReasonsForRefusal(['The D81 form is incomplete']);
    await consentOrderNotApprovedPage.selectJudge(JUDGE_TITLE);
    await consentOrderNotApprovedPage.enterJudgeName(JUDGE_SURNAME);
    await consentOrderNotApprovedPage.navigateContinue();
    // Draft order preview page
    await consentOrderNotApprovedPage.navigateContinue();
    await consentOrderNotApprovedPage.navigateSubmit();
    await caseDetailsPage.checkHasBeenUpdated(ConsentedEvents.orderRefusal.listItem);
    return;

  default:
    throw new Error(`Unsupported completion action: ${action}`);
  }
};

test.describe('Review Application task tests', () => {
  test.describe.configure({ mode: 'parallel' });

  for (const scenario of reviewApplicationUserScenarios) {
    const { user, completionAction, courtReplacements } = scenario;
    const actionOptions = {
      checkOthersHidden: 'checkOtherActionsHidden' in scenario ? scenario.checkOtherActionsHidden : true
    };
    const expectedState = 'expectedState' in scenario ? scenario.expectedState : undefined;

    test(
      `${user.name} completes the task using ${completionAction}`,
      { tag: ['@waTasks'] },
      async ({
        loginPage,
        manageCaseDashboardPage,
        approveApplicationPage,
        consentOrderNotApprovedPage,
        caseDetailsPage,
        taskUiChecks
      }) => {
        test.skip(!user.password, 'Set WA_JUDGE_PASSWORD to run judicial WA task tests');

        const caseId = await ConsentedCaseFactory
          .createConsentedCaseUpToIssueApplication([...courtReplacements]);

        await test.step(`${user.name} can see and assign the task`, async () => {
          await loginAndOpenCase(user, caseId, { loginPage, manageCaseDashboardPage });
          await taskUiChecks.navigateToTasks();

          await taskUiChecks.assertJudicialTaskUI(
            {
              name: TASK_NAME,
              taskCreated: DateHelper.getFormattedDateAfterWorkingDays(0),
              assignedTo: 'Unassigned'
            },
            reviewApplication.roles[user.role].unassignedActions,
            actionOptions
          );
          // Priority and due date (10 working day SLA) are not shown to judges yet.
          // Uncomment once DFR-5986 has been fixed.
          // await taskUiChecks.assertTaskDetails({
          //   name: TASK_NAME,
          //   priority: 'low',
          //   dueDate: DateHelper.getFormattedDateAfterWorkingDays(reviewApplication.dueInWorkingDays),
          //   assignedTo: 'Unassigned'
          // });
          await taskUiChecks.assignTaskToMe();

          await taskUiChecks.assertOnlyManagementActions(
            reviewApplication.roles[user.role].assignedActions,
            actionOptions
          );
          await taskUiChecks.assertNextStepVisible(APPROVE_APPLICATION);
          await taskUiChecks.assertNextStepVisible(UPLOAD_APPROVED_ORDER);
          await taskUiChecks.assertNextStepVisible(APPLICATION_NOT_APPROVED);
        });

        await test.step(
          `${user.name} completes the task using ${completionAction}`,
          async () => {
            await completeTask(completionAction, {
              approveApplicationPage,
              consentOrderNotApprovedPage,
              caseDetailsPage,
              taskUiChecks
            });
            if (expectedState) {
              await caseDetailsPage.validateCaseState(expectedState);
            }
            await taskUiChecks.navigateToTasks();
            await taskUiChecks.assertTaskNotVisible(TASK_NAME);
          }
        );
      }
    );
  }

  test(
    'Lead judge reassigns their task to another judge',
    { tag: ['@waTasks'] },
    async ({
      loginPage,
      manageCaseDashboardPage,
      taskUiChecks
    }) => {
      const { leadJudge, recipient } = reassignScenario;
      test.skip(!leadJudge.password, 'Set WA_JUDGE_PASSWORD to run judicial WA task tests');
      test.setTimeout(15 * 60 * 1000);

      const caseId = await ConsentedCaseFactory
        .createConsentedCaseUpToIssueApplication([...reassignScenario.courtReplacements]);

      await test.step('Lead judge assigns the task to themselves', async () => {
        await loginAndOpenCase(leadJudge, caseId, { loginPage, manageCaseDashboardPage });
        await taskUiChecks.navigateToTasks();
        await taskUiChecks.assertJudicialTaskUI(
          {
            name: TASK_NAME,
            taskCreated: DateHelper.getFormattedDateAfterWorkingDays(0),
            assignedTo: 'Unassigned'
          },
          reviewApplication.roles.leadJudge.unassignedActions
        );
        // Priority and due date (10 working day SLA) are not shown to judges yet.
        // Uncomment once DFR-5986 has been fixed.
        // await taskUiChecks.assertTaskDetails({
        //   name: TASK_NAME,
        //   priority: 'low',
        //   dueDate: DateHelper.getFormattedDateAfterWorkingDays(reviewApplication.dueInWorkingDays),
        //   assignedTo: 'Unassigned'
        // });
        await taskUiChecks.assignTaskToMe();
        await taskUiChecks.assertTaskAndActionsInWorkAllocationTab(
          TASK_NAME,
          'My work',
          caseId,
          reviewApplication.roles.leadJudge.assignedActions
        );
        await manageCaseDashboardPage.navigateToCase(caseId);
        await taskUiChecks.navigateToTasks();
      });

      await test.step('Lead judge reassigns the task to another judge', async () => {
        await taskUiChecks.reassignTaskToUser(recipient.name, recipient.email, 'Judicial');
        await manageCaseDashboardPage.signOut();
      });

      await test.step('The task is visible to the new judge', async () => {
        await manageCaseDashboardPage.visit();
        await loginPage.loginWaitForPath(
          recipient.email,
          recipient.password,
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
