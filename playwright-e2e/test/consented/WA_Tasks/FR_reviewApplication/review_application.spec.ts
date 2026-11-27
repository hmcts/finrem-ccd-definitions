import {test} from '../../../../fixtures/fixtures.ts';
import {ConsentedEventApi} from '../../../../data-utils/api/consented/ConsentedEventApi.ts';
import {
  actionOptions,
  APPLICATION_NOT_APPROVED,
  CaseState,
  createReviewApplicationCase,
  firstReviewScenarios,
  JudgeLoginGroup,
  reassignScenario,
  reReviewScenarios,
  reviewApplication,
  scenarioTags,
  scenarioTitle
} from './review_application.scenario.ts';

const TASK_NAME = reviewApplication.taskName;
const SKIP_REASON = 'Set the WA_JUDGE_*_USERNAME emails and WA_JUDGE_PASSWORD (WA_JUDGE_PASSWORD_DEMO on Demo) to run judicial WA task tests';

// A judge can only be logged in once at a time. The groups run in parallel,
// and the tests in each group (which share judges) run one after another.
test.describe('Review Application task tests', () => {
  test.describe.configure({ mode: 'parallel' });

  for (const loginGroup of Object.values(JudgeLoginGroup)) {
    test.describe(loginGroup, () => {
      test.describe.configure({ mode: 'default' });

      // First review: the judge completes the Review Application task.
      for (const scenario of firstReviewScenarios(loginGroup)) {
        const { user, completionAction, expectedState } = scenario;

        test(
          scenarioTitle(scenario, 'Review Application task'),
          { tag: scenarioTags(scenario) },
          async ({ judgeSession, reviewApplicationTask }) => {
            test.skip(!user.email || !user.password, SKIP_REASON);

            const caseId = await test.step('Create an issued case at the judge\'s court', async () => {
              return createReviewApplicationCase(scenario.courtReplacements);
            });

            await test.step(`${user.name} can see and assign the task`, async () => {
              await judgeSession.signInAndOpenCase(user, caseId);
              await reviewApplicationTask.assertAndAssign(reviewApplication.roles[user.role], actionOptions(scenario));
            });

            await test.step(`${user.name} completes the task using ${completionAction}`, async () => {
              await reviewApplicationTask.completeAndCheckClosed(completionAction, user, expectedState);
            });
          }
        );
      }

      if (reassignScenario.loginGroup === loginGroup) {
        test(
          'Lead judge reassigns their task to another judge',
          { tag: ['@waTasks'] },
          async ({ judgeSession, reviewApplicationTask, taskUiChecks, manageCaseDashboardPage }) => {
            const { leadJudge, recipient } = reassignScenario;
            test.skip(!leadJudge.email || !recipient.email || !leadJudge.password, SKIP_REASON);

            const caseId = await test.step('Create an issued case at the judges\' court', async () => {
              return createReviewApplicationCase(reassignScenario.courtReplacements);
            });

            await test.step(`${leadJudge.name} assigns the task to themselves`, async () => {
              await judgeSession.signInAndOpenCase(leadJudge, caseId);
              await reviewApplicationTask.assertAndAssign(reviewApplication.roles.leadJudge);
              await taskUiChecks.assertTaskAndActionsInWorkAllocationTab(
                TASK_NAME,
                'My work',
                caseId,
                reviewApplication.roles.leadJudge.assignedActions
              );
            });

            await test.step(`${leadJudge.name} reassigns the task to ${recipient.name}`, async () => {
              await manageCaseDashboardPage.navigateToCase(caseId);
              await taskUiChecks.navigateToTasks();
              await taskUiChecks.reassignTaskToUser(recipient.name, recipient.email, 'Judicial');
              await judgeSession.signOut();
            });

            await test.step(`The task is in ${recipient.name}'s My work`, async () => {
              await judgeSession.signIn(recipient);
              await taskUiChecks.assertTaskVisibleInWorkAllocationTab(TASK_NAME, 'My work', caseId);
            });
          }
        );
      }

      // Re-review: after the judge refuses the application, the order is sent,
      // the solicitor responds and the case is assigned back to the judge,
      // which creates the Review Application task again.
      for (const scenario of reReviewScenarios(loginGroup)) {
        const { user, completionAction, expectedState } = scenario;

        test(
          scenarioTitle(scenario, 're-review task'),
          { tag: scenarioTags(scenario) },
          async ({ judgeSession, reviewApplicationTask, manageCaseDashboardPage }) => {
            test.skip(!user.email || !user.password, SKIP_REASON);
            const roleActions = reviewApplication.roles[user.role];

            const caseId = await test.step('Create an issued case at the judge\'s court', async () => {
              return createReviewApplicationCase(scenario.courtReplacements);
            });

            // Refused in the UI rather than through the API, because only XUI
            // completes the first Review Application task.
            await test.step(`${user.name} refuses the application on the first review`, async () => {
              await judgeSession.signInAndOpenCase(user, caseId);
              await reviewApplicationTask.assertAndAssign(roleActions, actionOptions(scenario));
              await reviewApplicationTask.completeAndCheckClosed(
                APPLICATION_NOT_APPROVED,
                user,
                CaseState.ConsentOrderNotApproved
              );
            });

            await test.step('The refused order is sent and the case is assigned back to the judge', async () => {
              await ConsentedEventApi.returnRefusedOrderToJudge(caseId);
            });

            await test.step(`${user.name} can see and assign the re-review task`, async () => {
              await manageCaseDashboardPage.navigateToCase(caseId);
              await reviewApplicationTask.assertAndAssign(roleActions, actionOptions(scenario));
            });

            await test.step(`${user.name} completes the re-review task using ${completionAction}`, async () => {
              await reviewApplicationTask.completeAndCheckClosed(completionAction, user, expectedState);
            });
          }
        );
      }
    });
  }
});
