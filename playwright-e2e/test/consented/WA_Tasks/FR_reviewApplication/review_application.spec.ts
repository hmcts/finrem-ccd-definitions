import type {Cookie, Page} from '@playwright/test';
import {test} from '../../../../fixtures/fixtures.ts';
import config from '../../../../config/config.ts';
import {DateHelper} from '../../../../data-utils/DateHelper.ts';
import {ConsentedEvents} from '../../../../config/case-data.ts';
import {ConsentedCaseFactory} from '../../../../data-utils/factory/consented/ConsentedCaseFactory.ts';
import {ConsentedEventApi} from '../../../../data-utils/api/consented/ConsentedEventApi.ts';

import type {ManageCaseDashboardPage} from '../../../../pages/ManageCaseDashboardPage.ts';
import type {SigninPage} from '../../../../pages/SigninPage.ts';
import type {ApproveApplicationPage} from '../../../../pages/events/approve-order/ApproveApplicationPage.ts';
import type {ConsentOrderNotApprovedPage} from '../../../../pages/events/consent-application/ConsentOrderNotApprovedPage.ts';
import type {CaseDetailsPage} from '../../../../pages/CaseDetailsPage.ts';
import type {TaskUiChecks} from '../../../../pages/WAtasks/TaskUiChecks.ts';
import type {TaskCompletionAction} from '../../../../pages/WAtasks/TaskScenario.ts';
import type {TaskManagementAction} from '../../../../pages/WAtasks/TaskTypes.ts';
import type {ReplacementAction} from '../../../../types/replacement-action.ts';
import {
  APPLICATION_NOT_APPROVED,
  APPROVE_APPLICATION,
  CaseState,
  JudgeLoginGroup,
  reassignScenario,
  reviewApplication,
  reviewApplicationUserScenarios,
  UPLOAD_APPROVED_ORDER
} from './review_application.scenario.ts';

const TASK_NAME = reviewApplication.taskName;
// Each case gets its own documents. Approve Application stamps the consent
// order, which fails if another parallel test has attached the shared test
// document to its own case.
const CASE_OPTIONS = { uniqueDocuments: true };

type LoginCredentials = {
    email: string;
    password: string;
};

type SessionPages = {
    loginPage: SigninPage;
    manageCaseDashboardPage: ManageCaseDashboardPage;
};

// The judge's title and surname, typed into the order.
type OrderJudge = {
    judgeTitle: string;
    surname: string;
};

type OutcomePages = {
    approveApplicationPage: ApproveApplicationPage;
    consentOrderNotApprovedPage: ConsentOrderNotApprovedPage;
    caseDetailsPage: CaseDetailsPage;
    taskUiChecks: TaskUiChecks;
};

type ReviewTaskActions = {
    unassignedActions: readonly TaskManagementAction[];
    assignedActions: readonly TaskManagementAction[];
};

// Each group's tests run in one worker, one after another, so a judge's
// session is kept here and reused by their next test instead of logging in
// again. The worker starts with none after a failure.
const savedSessions = new Map<string, Cookie[]>();

const isManageCaseLandingPage = (url: URL): boolean => {
  const landingPaths = [config.loginPaths.cases, config.loginPaths.worklist]
    .map((path) => {return `/${path}`;});
  return url.origin === new URL(config.manageCaseBaseURL).origin
    && landingPaths.includes(url.pathname.replace(/\/+$/, ''));
};

// Opens Manage Case with the judge's saved session. Returns false, with the
// IDAM sign-in page open, if there is no saved session or it has expired.
const resumeSession = async (
  email: string,
  page: Page,
  manageCaseDashboardPage: ManageCaseDashboardPage
): Promise<boolean> => {
  const cookies = savedSessions.get(email);
  if (!cookies) {
    await manageCaseDashboardPage.visit();
    return false;
  }
  // Removes any other judge's session from earlier in the test.
  await page.context().clearCookies();
  await page.context().addCookies(cookies);
  // Opens My work directly: from the site root, Manage Case can return to
  // the page the previous judge was on.
  await page.goto(`${config.manageCaseBaseURL}/${config.loginPaths.worklist}`);
  await page.waitForURL((url) => {
    return isManageCaseLandingPage(url) || url.origin !== new URL(config.manageCaseBaseURL).origin;
  }, { timeout: 30_000 });
  if (isManageCaseLandingPage(new URL(page.url()))) {
    return true;
  }
  savedSessions.delete(email);
  return false;
};

const signIn = async (
  credentials: LoginCredentials,
  page: Page,
  { loginPage, manageCaseDashboardPage }: SessionPages
): Promise<void> => {
  if (await resumeSession(credentials.email, page, manageCaseDashboardPage)) {
    return;
  }
  await loginPage.loginWaitForPath(
    credentials.email,
    credentials.password,
    config.manageCaseBaseURL,
    config.loginPaths.worklist
  );
  savedSessions.set(credentials.email, await page.context().cookies());
};

// Waits until Manage Case has sent the browser to IDAM, so the next judge
// doesn't start before the sign-out has finished.
const signOut = async (
  email: string,
  page: Page,
  manageCaseDashboardPage: ManageCaseDashboardPage
): Promise<void> => {
  savedSessions.delete(email);
  await manageCaseDashboardPage.signOut();
  await page.waitForURL((url) => {
    return url.origin !== new URL(config.manageCaseBaseURL).origin;
  }, { timeout: 30_000 });
};

const loginAndOpenCase = async (
  credentials: LoginCredentials,
  caseId: string,
  page: Page,
  sessionPages: SessionPages
): Promise<void> => {
  await signIn(credentials, page, sessionPages);
  await sessionPages.manageCaseDashboardPage.navigateToCase(caseId);
};

// Creates every case a group needs when the group starts, so only the first
// test waits for its case. A case is created for each test in the group even
// when only some of them run (with -g, or when a worker restarts after a
// failure and the group starts again).
class GroupCases {
  private readonly replacementsByTest = new Map<string, readonly ReplacementAction[]>();
  private readonly cases = new Map<string, Promise<string>>();

  add(testTitle: string, replacements: readonly ReplacementAction[]): void {
    this.replacementsByTest.set(testTitle, replacements);
  }

  // The cases are created one after another, in the order the tests run, so
  // the first test's case is ready first. Creating them all at once caused
  // failed requests to CCD.
  createAll(): void {
    let previous: Promise<unknown> = Promise.resolve();
    for (const testTitle of this.replacementsByTest.keys()) {
      const caseId = previous
        .catch(() => {})
        .then(() => {return this.createCase(testTitle);});
      // The test reports a failure when it waits for the case.
      caseId.catch(() => {});
      this.cases.set(testTitle, caseId);
      previous = caseId;
    }
  }

  take(testTitle: string): Promise<string> {
    const caseId = this.cases.get(testTitle) ?? this.createCase(testTitle);
    this.cases.delete(testTitle);
    return caseId;
  }

  private createCase(testTitle: string): Promise<string> {
    return ConsentedCaseFactory.createConsentedCaseUpToIssueApplication(
      [...this.replacementsByTest.get(testTitle) ?? []],
      CASE_OPTIONS
    );
  }
}

const completeTask = async (
  action: TaskCompletionAction,
  judge: OrderJudge,
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
    await approveApplicationPage.completeApproveApplication({
      subjectToDecreeAbsolute: false,
      servePensionProvider: true,
      pensionProviderResponsibility: 'The Court',
      judgeTitle: judge.judgeTitle,
      judgeName: judge.surname
    });
    await caseDetailsPage.checkHasBeenUpdated(ConsentedEvents.approveApplication.listItem);
    return;

  case UPLOAD_APPROVED_ORDER:
    await taskUiChecks.selectTaskNextStep(UPLOAD_APPROVED_ORDER);
    await approveApplicationPage.completeUploadApprovedOrder({
      subjectToDecreeAbsolute: false,
      servePensionProvider: false,
      judgeTitle: judge.judgeTitle,
      judgeName: judge.surname,
      // A duplicate file name leaves the task open (DFR-5924), so keep it unique.
      fileName: `approved-order-${Date.now()}.pdf`
    });
    await caseDetailsPage.checkHasBeenUpdated(ConsentedEvents.uploadApprovedOrder.listItem);
    return;

  case APPLICATION_NOT_APPROVED:
    await taskUiChecks.selectTaskNextStep(APPLICATION_NOT_APPROVED);
    await consentOrderNotApprovedPage.completeApplicationNotApproved({
      reasons: ['The D81 form is incomplete'],
      judgeTitle: judge.judgeTitle,
      judgeName: judge.surname
    });
    await caseDetailsPage.checkHasBeenUpdated(ConsentedEvents.orderRefusal.listItem);
    return;

  default:
    throw new Error(`Unsupported completion action: ${action}`);
  }
};

// Checks the unassigned task, assigns it to the judge and checks the
// management actions and next steps. The case Tasks tab must be open.
const assertAndAssignReviewTask = async (
  taskUiChecks: TaskUiChecks,
  actions: ReviewTaskActions,
  actionOptions: { checkOthersHidden?: boolean }
): Promise<void> => {
  await taskUiChecks.navigateToTasks();
  await taskUiChecks.assertJudicialTaskUI(
    {
      name: TASK_NAME,
      taskCreated: DateHelper.getFormattedDateAfterWorkingDays(0),
      assignedTo: 'Unassigned'
    },
    actions.unassignedActions,
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

  await taskUiChecks.assertOnlyManagementActions(actions.assignedActions, actionOptions);
  await taskUiChecks.assertNextStepVisible(APPROVE_APPLICATION);
  await taskUiChecks.assertNextStepVisible(UPLOAD_APPROVED_ORDER);
  await taskUiChecks.assertNextStepVisible(APPLICATION_NOT_APPROVED);
};

// Completes the task, then checks the case state (if given) and that the task
// has gone from the case Tasks tab.
const completeAndCheckTaskClosed = async (
  action: TaskCompletionAction,
  judge: OrderJudge,
  expectedState: string | undefined,
  pages: OutcomePages
): Promise<void> => {
  await completeTask(action, judge, pages);
  if (expectedState) {
    await pages.caseDetailsPage.validateCaseState(expectedState);
  }
  await pages.taskUiChecks.navigateToTasks();
  await pages.taskUiChecks.assertTaskNotVisible(TASK_NAME);
};

const scenarioSettings = (scenario: typeof reviewApplicationUserScenarios[number]) => {
  return {
    actionOptions: {
      checkOthersHidden: 'checkOtherActionsHidden' in scenario ? scenario.checkOtherActionsHidden : true
    },
    expectedState: 'expectedState' in scenario ? scenario.expectedState : undefined
  };
};

type Scenario = typeof reviewApplicationUserScenarios[number];

// Approve Application runs on every PR build (@preview), as the main way a
// judge completes the task. Only Amanda Love's scenarios use it.
const testTags = (completionAction: TaskCompletionAction): string[] => {
  return completionAction === APPROVE_APPLICATION ? ['@waTasks', '@preview'] : ['@waTasks'];
};

// First review: the judge completes the Review Application task.
const addFirstReviewTest = (scenario: Scenario, groupCases: GroupCases): void => {
  const { user, completionAction, courtReplacements } = scenario;
  const { actionOptions, expectedState } = scenarioSettings(scenario);
  const title = `${user.name} completes the task using ${completionAction}`;
  groupCases.add(title, courtReplacements);

  test(
    title,
    { tag: testTags(completionAction) },
    async ({
      page,
      loginPage,
      manageCaseDashboardPage,
      approveApplicationPage,
      consentOrderNotApprovedPage,
      caseDetailsPage,
      taskUiChecks
    }) => {
      test.skip(!user.password, 'Set WA_JUDGE_PASSWORD to run judicial WA task tests');
      const outcomePages = { approveApplicationPage, consentOrderNotApprovedPage, caseDetailsPage, taskUiChecks };

      const caseId = await groupCases.take(title);

      await test.step(`${user.name} can see and assign the task`, async () => {
        await loginAndOpenCase(user, caseId, page, { loginPage, manageCaseDashboardPage });
        await assertAndAssignReviewTask(taskUiChecks, reviewApplication.roles[user.role], actionOptions);
      });

      await test.step(
        `${user.name} completes the task using ${completionAction}`,
        async () => {
          await completeAndCheckTaskClosed(completionAction, user, expectedState, outcomePages);
        }
      );
    }
  );
};

const addReassignTest = (groupCases: GroupCases): void => {
  const title = 'Lead judge reassigns their task to another judge';
  groupCases.add(title, reassignScenario.courtReplacements);

  test(
    title,
    { tag: ['@waTasks'] },
    async ({
      page,
      loginPage,
      manageCaseDashboardPage,
      taskUiChecks
    }) => {
      const { leadJudge, recipient } = reassignScenario;
      test.skip(!leadJudge.password, 'Set WA_JUDGE_PASSWORD to run judicial WA task tests');
      test.setTimeout(15 * 60 * 1000);

      const caseId = await groupCases.take(title);

      await test.step('Lead judge assigns the task to themselves', async () => {
        await loginAndOpenCase(leadJudge, caseId, page, { loginPage, manageCaseDashboardPage });
        await assertAndAssignReviewTask(taskUiChecks, reviewApplication.roles.leadJudge, {});
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
        await signOut(leadJudge.email, page, manageCaseDashboardPage);
      });

      await test.step('The task is visible to the new judge', async () => {
        await signIn(recipient, page, { loginPage, manageCaseDashboardPage });
        await taskUiChecks.assertTaskVisibleInWorkAllocationTab(
          TASK_NAME,
          'My work',
          caseId
        );
      });
    }
  );
};

// Re-review: after the judge refuses the application, the order is sent, the
// solicitor responds and the case is assigned back to the judge, which creates
// the Review Application task again. Each scenario then completes the
// re-review task in the same way as the first review.
const addReReviewTest = (scenario: Scenario, groupCases: GroupCases): void => {
  const { user, completionAction, courtReplacements } = scenario;
  const { actionOptions, expectedState } = scenarioSettings(scenario);
  const title = `${user.name} completes the re-review task using ${completionAction}`;
  groupCases.add(title, courtReplacements);

  test(
    title,
    { tag: testTags(completionAction) },
    async ({
      page,
      loginPage,
      manageCaseDashboardPage,
      approveApplicationPage,
      consentOrderNotApprovedPage,
      caseDetailsPage,
      taskUiChecks
    }) => {
      test.skip(!user.password, 'Set WA_JUDGE_PASSWORD to run judicial WA task tests');
      test.setTimeout(10 * 60 * 1000);
      const outcomePages = { approveApplicationPage, consentOrderNotApprovedPage, caseDetailsPage, taskUiChecks };
      const roleActions = reviewApplication.roles[user.role];

      const caseId = await groupCases.take(title);

      // Refused in the UI rather than through the API, because only XUI
      // completes the first Review Application task.
      await test.step(`${user.name} refuses the application on the first review`, async () => {
        await loginAndOpenCase(user, caseId, page, { loginPage, manageCaseDashboardPage });
        await assertAndAssignReviewTask(taskUiChecks, roleActions, actionOptions);
        await completeAndCheckTaskClosed(
          APPLICATION_NOT_APPROVED,
          user,
          CaseState.ConsentOrderNotApproved,
          outcomePages
        );
      });

      await test.step('The refused order is sent and the case is assigned back to the judge', async () => {
        await ConsentedEventApi.returnRefusedOrderToJudge(caseId);
      });

      await test.step(`${user.name} can see and assign the re-review task`, async () => {
        await manageCaseDashboardPage.navigateToCase(caseId);
        await assertAndAssignReviewTask(taskUiChecks, roleActions, actionOptions);
      });

      await test.step(
        `${user.name} completes the re-review task using ${completionAction}`,
        async () => {
          await completeAndCheckTaskClosed(completionAction, user, expectedState, outcomePages);
        }
      );
    }
  );
};

// A judge can only be logged in once at a time. The groups run in parallel,
// and the tests in each group (which share judges) run one after another.
test.describe('Review Application task tests', () => {
  test.describe.configure({ mode: 'parallel' });

  for (const loginGroup of Object.values(JudgeLoginGroup)) {
    test.describe(loginGroup, () => {
      test.describe.configure({ mode: 'default' });

      const groupCases = new GroupCases();
      test.beforeAll(() => {
        groupCases.createAll();
      });

      const scenarios = reviewApplicationUserScenarios
        .filter((scenario) => {return scenario.loginGroup === loginGroup;});

      scenarios
        .filter((scenario) => {return !('reReviewOnly' in scenario && scenario.reReviewOnly);})
        .forEach((scenario) => {addFirstReviewTest(scenario, groupCases);});
      if (reassignScenario.loginGroup === loginGroup) {
        addReassignTest(groupCases);
      }
      scenarios.forEach((scenario) => {addReReviewTest(scenario, groupCases);});
    });
  }
});
