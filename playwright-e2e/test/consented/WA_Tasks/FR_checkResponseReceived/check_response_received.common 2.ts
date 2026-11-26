import { expect, test } from '../../../../fixtures/fixtures.ts';
import config from '../../../../config/config.ts';
import { CommonEvents, ConsentedEvents, type CaseEvent } from '../../../../config/case-data.ts';
import { DateHelper } from '../../../../data-utils/DateHelper.ts';
import { ConsentedCaseFactory } from '../../../../data-utils/factory/consented/ConsentedCaseFactory.ts';
import { ConsentedEventApi } from '../../../../data-utils/api/consented/ConsentedEventApi.ts';
import type { CloseCasePage } from '../../../../pages/events/close-case/CloseCasePage.ts';
import type { CreateGeneralEmailPage } from '../../../../pages/events/create-general-email/CreateGeneralEmailPage.ts';
import type { CreateGeneralLetterPage } from '../../../../pages/events/create-general-letter/CreateGeneralLetterPage.ts';
import type { ListForHearingPage } from '../../../../pages/events/list-for-hearing/ListForHearingPage.ts';
import type { CaseDetailsPage } from '../../../../pages/CaseDetailsPage.ts';
import type { CaseHistoryPage } from '../../../../pages/CaseHistoryPage.ts';
import type { CaseListPage } from '../../../../pages/CaseListPage.ts';
import type { ManageCaseDashboardPage } from '../../../../pages/ManageCaseDashboardPage.ts';
import type { SigninPage } from '../../../../pages/SigninPage.ts';
import type { TaskUiChecks } from '../../../../pages/WAtasks/TaskUiChecks.ts';
import type {
  TaskDetails,
  TaskManagementAction
} from '../../../../pages/WAtasks/TaskTypes.ts';
import {
  CONSENTED_CASE_TYPE,
  GENERAL_EMAIL_BODY,
  GENERAL_LETTER_ADDRESSEE,
  GENERAL_LETTER_BODY,
  INFORMATION_RECEIVED_CCD_STATE,
  INFORMATION_RECEIVED_STATE,
  NEXT_STEPS,
  TASK_COMPLETED_REFRESH_ATTEMPTS,
  TASK_CREATING_EVENT,
  TASK_PRIORITY,
  UNASSIGNED,
  checkResponseReceived,
  completionEvents,
  finalHearingDetails
} from './check_response_received.scenario.ts';

export interface CheckResponseReceivedUser {
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly historyAuthor: string;
  readonly checksAllWork: boolean;
}

export interface TaskPerson {
  readonly searchName: string;
  readonly email: string;
}

export interface TaskAssignee extends TaskPerson {
  readonly assignedToName: string;
}

export type ManageTaskAction = Extract<TaskManagementAction, 'Cancel task' | 'Mark as done' | 'Reassign task'>;

type ClosingTaskAction = Exclude<ManageTaskAction, 'Reassign task'>;

export interface CheckResponseReceivedManageTaskUser extends CheckResponseReceivedUser, TaskAssignee {
  readonly role: keyof typeof checkResponseReceived.roles;
  readonly manageActions: readonly ManageTaskAction[];
  readonly assignTask?: {
    readonly unauthorisedPerson: TaskPerson;
    readonly assignee: TaskAssignee;
  };
}

type SessionPages = {
  loginPage: SigninPage;
  manageCaseDashboardPage: ManageCaseDashboardPage;
};

type TaskPages = SessionPages & {
  taskUiChecks: TaskUiChecks;
};

type CheckPages = TaskPages & {
  caseDetailsPage: CaseDetailsPage;
  caseListPage: CaseListPage;
};

type EventPages = {
  closeCasePage: CloseCasePage;
  createGeneralEmailPage: CreateGeneralEmailPage;
  createGeneralLetterPage: CreateGeneralLetterPage;
  listForHearingPage: ListForHearingPage;
};

const TASK_NAME = checkResponseReceived.taskName;
const TEST_DETAILS = { tag: ['@waTasks', '@preview'] };
const TEST_TIMEOUT = 6 * 60 * 1000;

const createCheckResponseReceivedTask = async (): Promise<string> => {
  const caseId = await ConsentedCaseFactory.createConsentedCaseUpToAwaitingInformation();
  const state = await ConsentedEventApi.solicitorUploadDocument(caseId);

  expect(state).toBe(INFORMATION_RECEIVED_CCD_STATE);
  return caseId;
};

const describeWithNewCasePerTest = (
  title: string,
  defineTests: (caseId: () => string) => void
): void => {
  test.describe(title, () => {
    test.describe.configure({ mode: 'parallel', retries: 0, timeout: TEST_TIMEOUT });

    let caseId: string;

    test.beforeEach(async () => {
      caseId = await createCheckResponseReceivedTask();
    });

    defineTests(() => {
      return caseId;
    });
  });
};

const loginAndOpenCase = async (
  user: CheckResponseReceivedUser,
  caseId: string,
  { loginPage, manageCaseDashboardPage }: SessionPages
): Promise<void> => {
  await test.step(`${user.name} logs in and opens the case`, async () => {
    await manageCaseDashboardPage.visit();
    await loginPage.loginWaitForPath(
      user.email,
      user.password,
      config.manageCaseBaseURL,
      config.loginPaths.worklist
    );
    await manageCaseDashboardPage.navigateToCase(caseId);
  });
};

const completeEvent = async (
  user: CheckResponseReceivedUser,
  event: CaseEvent,
  pages: EventPages
): Promise<void> => {
  switch (event.ccdCallback) {
  case CommonEvents.createGeneralEmail.ccdCallback:
    await pages.createGeneralEmailPage.enterReceipientEmail(config.respondent_solicitor.email);
    await pages.createGeneralEmailPage.enterBodyOfEmail(GENERAL_EMAIL_BODY);
    await pages.createGeneralEmailPage.navigateContinue();
    await pages.createGeneralEmailPage.navigateSubmit();
    return;
  case ConsentedEvents.createGeneralLetter.ccdCallback:
    await pages.createGeneralLetterPage.selectAddressee(GENERAL_LETTER_ADDRESSEE);
    await pages.createGeneralLetterPage.enterCreatedBy(user.name);
    await pages.createGeneralLetterPage.enterLetterBody(GENERAL_LETTER_BODY);
    await pages.createGeneralLetterPage.navigateContinue();
    await pages.createGeneralLetterPage.navigateContinue();
    await pages.createGeneralLetterPage.navigateSubmit();
    return;
  case ConsentedEvents.listForHearing.ccdCallback:
    await pages.listForHearingPage.addHearing(finalHearingDetails());
    await pages.listForHearingPage.navigateContinue();
    await pages.listForHearingPage.navigateSubmit();
    return;
  case CommonEvents.closeCase.ccdCallback:
    await pages.closeCasePage.enterCloseDate();
    await pages.closeCasePage.navigateSubmit();
    await pages.closeCasePage.navigateSubmit();
    return;
  default:
    await pages.closeCasePage.navigateSubmit();
  }
};

const runTaskCreationChecks = async (
  user: CheckResponseReceivedUser,
  caseId: string,
  pages: CheckPages
): Promise<void> => {
  const { caseDetailsPage, caseListPage, taskUiChecks } = pages;
  const totalChecks = user.checksAllWork ? 6 : 5;

  await loginAndOpenCase(user, caseId, pages);

  await test.step(`Check 1 of ${totalChecks}: the case is in ${INFORMATION_RECEIVED_STATE}`, async () => {
    await caseDetailsPage.validateCaseState(INFORMATION_RECEIVED_STATE);
  });

  await test.step(`Check 2 of ${totalChecks}: the Tasks tab has exactly one ${TASK_NAME} task`, async () => {
    await taskUiChecks.assertTaskCount(TASK_NAME, 1);
  });

  await test.step(`${user.name} assigns the task to themselves`, async () => {
    await taskUiChecks.assignTaskToMe(TASK_NAME);
  });

  await test.step(`Check 3 of ${totalChecks}: Next steps lists the ${NEXT_STEPS.length} expected events`, async () => {
    await taskUiChecks.assertNextSteps(TASK_NAME, NEXT_STEPS);
  });

  await test.step(`Check 4 of ${totalChecks}: the case is shown in the Case list`, async () => {
    await caseListPage.assertCaseVisible(caseId, CONSENTED_CASE_TYPE, INFORMATION_RECEIVED_STATE);
  });

  await test.step(`Check 5 of ${totalChecks}: the task is shown in My work`, async () => {
    await taskUiChecks.assertTaskVisibleInWorkAllocationTab(TASK_NAME, 'My work', caseId);
  });

  if (user.checksAllWork) {
    await test.step(`Check 6 of ${totalChecks}: the task is shown in All work`, async () => {
      await taskUiChecks.assertTaskVisibleInWorkAllocationTab(TASK_NAME, 'All work', caseId);
    });
  }
};

const taskDetails = (assignedTo: string): TaskDetails => {
  return {
    name: TASK_NAME,
    priority: TASK_PRIORITY,
    dueDate: DateHelper.getFormattedDateAfterWorkingDays(checkResponseReceived.dueInWorkingDays),
    assignedTo
  };
};

const checkTaskCard = async (
  taskUiChecks: TaskUiChecks,
  assignedTo: string,
  actions: readonly TaskManagementAction[],
  title: string
): Promise<void> => {
  await test.step(`${title}: Priority ${TASK_PRIORITY}, ${assignedTo}, only ${actions.join(', ')}`, async () => {
    await taskUiChecks.assertTaskUI(taskDetails(assignedTo), actions);
  });
};

const closeTaskAndCheckRemoved = async (
  user: CheckResponseReceivedUser,
  action: ClosingTaskAction,
  { taskUiChecks, caseHistoryPage }: { taskUiChecks: TaskUiChecks; caseHistoryPage: CaseHistoryPage }
): Promise<void> => {
  await test.step(`${user.name} clicks ${action} and confirms`, async () => {
    if (action === 'Cancel task') {
      await taskUiChecks.cancelTask(TASK_NAME);
      return;
    }

    await taskUiChecks.markTaskAsDone(TASK_NAME);
  });

  await test.step(`The ${TASK_NAME} task is no longer shown`, async () => {
    await taskUiChecks.assertTaskNotVisible(TASK_NAME, TASK_COMPLETED_REFRESH_ATTEMPTS);
  });

  await test.step(
    `The case is still in ${INFORMATION_RECEIVED_STATE}, with ${TASK_CREATING_EVENT.event} still the latest History event`,
    async () => {
      await caseHistoryPage.validateLatestHistoryEvent(TASK_CREATING_EVENT);
    }
  );
};

export const describeCheckResponseReceivedTests = (user: CheckResponseReceivedUser): void => {
  describeWithNewCasePerTest(`${TASK_NAME} task tests – ${user.name}`, (caseId) => {
    const shownIn = user.checksAllWork ? 'Case list, My work and All work' : 'Case list and My work';

    test(
      `Solicitor upload creates one ${TASK_NAME} task, with the expected Next steps, shown in ${shownIn}`,
      TEST_DETAILS,
      async ({ loginPage, manageCaseDashboardPage, caseDetailsPage, caseListPage, taskUiChecks }) => {
        await runTaskCreationChecks(user, caseId(), {
          loginPage,
          manageCaseDashboardPage,
          caseDetailsPage,
          caseListPage,
          taskUiChecks
        });
      }
    );

    for (const { event, expectedState } of completionEvents) {
      test(
        `${user.name} completes the task with ${event.listItem}`,
        TEST_DETAILS,
        async ({
          loginPage,
          manageCaseDashboardPage,
          caseDetailsPage,
          caseHistoryPage,
          taskUiChecks,
          closeCasePage,
          createGeneralEmailPage,
          createGeneralLetterPage,
          listForHearingPage
        }) => {
          await loginAndOpenCase(user, caseId(), { loginPage, manageCaseDashboardPage });

          await test.step(`${user.name} assigns the task to themselves`, async () => {
            await taskUiChecks.assertTaskVisible(TASK_NAME);
            await taskUiChecks.assignTaskToMe(TASK_NAME);
          });

          await test.step(`${user.name} completes ${event.listItem} from Next steps`, async () => {
            await taskUiChecks.selectTaskNextStep(event.listItem);
            await completeEvent(user, event, {
              closeCasePage,
              createGeneralEmailPage,
              createGeneralLetterPage,
              listForHearingPage
            });
            await caseDetailsPage.checkHasBeenUpdated(event.listItem);
          });

          await test.step(
            `History shows ${event.listItem} by ${user.historyAuthor}, ending in ${expectedState}`,
            async () => {
              await caseHistoryPage.validateLatestHistoryEvent({
                event: event.listItem,
                author: user.historyAuthor,
                endState: expectedState
              });
            }
          );

          await test.step(`The ${TASK_NAME} task is completed`, async () => {
            await taskUiChecks.assertTaskNotVisible(TASK_NAME, TASK_COMPLETED_REFRESH_ATTEMPTS);
          });
        }
      );
    }
  });
};

export const describeCheckResponseReceivedManageTaskTests = (
  user: CheckResponseReceivedManageTaskUser
): void => {
  const { unassignedActions, assignedActions } = checkResponseReceived.roles[user.role];
  const { assignTask } = user;
  const assignRoutes = assignTask ? ['Assign to me', 'Assign task'] as const : ['Assign to me'] as const;

  describeWithNewCasePerTest(`${TASK_NAME} task manage actions – ${user.name}`, (caseId) => {
    if (unassignedActions.includes('Cancel task')) {
      test(
        `${user.name} cancels the ${TASK_NAME} task before it is assigned`,
        TEST_DETAILS,
        async ({ loginPage, manageCaseDashboardPage, caseHistoryPage, taskUiChecks }) => {
          await loginAndOpenCase(user, caseId(), { loginPage, manageCaseDashboardPage });
          await checkTaskCard(taskUiChecks, UNASSIGNED, unassignedActions, 'The task is shown');
          await closeTaskAndCheckRemoved(user, 'Cancel task', { taskUiChecks, caseHistoryPage });
        }
      );
    }

    for (const route of assignRoutes) {
      const assignsToOtherUser = route === 'Assign task' && assignTask !== undefined;
      const firstAssignee: TaskAssignee = assignsToOtherUser ? assignTask.assignee : user;
      const reassignee: TaskAssignee = assignsToOtherUser || !assignTask ? user : assignTask.assignee;
      const routeTitle = assignsToOtherUser
        ? `cannot assign the task to ${assignTask.unauthorisedPerson.searchName}, assigns it to ${firstAssignee.searchName}`
        : 'assigns the task to themselves';

      for (const action of user.manageActions) {
        const actionTitle = action === 'Reassign task'
          ? `reassigns it to ${reassignee.searchName}, then unassigns it`
          : `closes it with ${action}`;

        test(
          `${user.name} ${routeTitle} and ${actionTitle}`,
          TEST_DETAILS,
          async ({ loginPage, manageCaseDashboardPage, caseHistoryPage, taskUiChecks }) => {
            await loginAndOpenCase(user, caseId(), { loginPage, manageCaseDashboardPage });
            await checkTaskCard(taskUiChecks, UNASSIGNED, unassignedActions, 'The task is shown');

            if (assignsToOtherUser) {
              const { unauthorisedPerson } = assignTask;

              await test.step(`Assign task to ${unauthorisedPerson.searchName} is refused as not authorised`, async () => {
                await taskUiChecks.assignTaskToUser(unauthorisedPerson.searchName, unauthorisedPerson.email, TASK_NAME);
                await taskUiChecks.assertPersonNotAuthorised();
                await manageCaseDashboardPage.navigateToCase(caseId());
              });

              await checkTaskCard(taskUiChecks, UNASSIGNED, unassignedActions, 'The task is unchanged');

              await test.step(`${user.name} assigns the task to ${firstAssignee.searchName}`, async () => {
                await taskUiChecks.assignTaskToUser(firstAssignee.searchName, firstAssignee.email, TASK_NAME);
              });
            } else {
              await test.step(`${user.name} clicks Assign to me`, async () => {
                await taskUiChecks.assignTaskToMe(TASK_NAME);
              });
            }

            await checkTaskCard(taskUiChecks, firstAssignee.assignedToName, assignedActions, 'The task is assigned');

            if (action !== 'Reassign task') {
              await closeTaskAndCheckRemoved(user, action, { taskUiChecks, caseHistoryPage });
              return;
            }

            await test.step(`${user.name} reassigns the task to ${reassignee.searchName}`, async () => {
              await taskUiChecks.reassignTaskToUser(reassignee.searchName, reassignee.email, 'CTSC', TASK_NAME);
            });

            await checkTaskCard(taskUiChecks, reassignee.assignedToName, assignedActions, 'The task is reassigned');

            await test.step(`${user.name} unassigns the task`, async () => {
              await taskUiChecks.unassignTask(TASK_NAME);
            });

            await checkTaskCard(taskUiChecks, UNASSIGNED, unassignedActions, 'The task is unassigned again');
          }
        );
      }
    }
  });
};
