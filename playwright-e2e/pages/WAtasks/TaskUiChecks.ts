import { expect, type Locator, type Page } from '@playwright/test';
import {
  taskManagementActions,
  type TaskDetails,
  type TaskManagementAction, TaskName, TaskCompletionEventName
} from './TaskTypes.ts';
import {
  WorkAllocationTabsPage,
  type WorkAllocationTab
} from './WorkAllocationTabsPage.ts';

const DEFAULT_REFRESH_ATTEMPTS = 12;
const DEFAULT_REFRESH_INTERVAL = 5_000;
const TASK_LIST_RESPONSE_TIMEOUT = 5 * 60 * 1000;

export class TaskUiChecks {

  private readonly page: Page;
  private readonly tasksTab: Locator;
  private readonly activeTasksHeading: Locator;
  private readonly workAllocationPage: WorkAllocationTabsPage;
  private readonly callbackError: Locator;

  public constructor(page: Page) {
    this.page = page;
    this.tasksTab = page.getByRole('tab', { name: 'Tasks', exact: true });
    this.activeTasksHeading = page.getByRole('heading', { name: 'Active tasks', exact: true });
    this.workAllocationPage = new WorkAllocationTabsPage(page);
    this.callbackError = page.getByRole('group', { name: 'The callback data failed validation' });
  }

  async navigateToTasks(): Promise<void> {
    await expect(this.tasksTab).toBeVisible();
    await this.tasksTab.click();
    await expect(this.activeTasksHeading).toBeVisible();
  }

  async assertTaskDetails(task: TaskDetails): Promise<void> {
    const taskHeading = this.page.getByText(task.name, { exact: true });
    const taskCard = this.getTaskCard(task.name);

    await expect(this.activeTasksHeading).toBeVisible();
    await expect(taskHeading).toBeVisible();
    await this.assertLabelAndValue('Priority', task.priority, taskCard);
    await this.assertLabelAndValue('Due date', task.dueDate, taskCard);
    await this.assertLabelAndValue('Assigned to', task.assignedTo, taskCard);
    await expect(taskCard.getByText('Manage', { exact: true })).toBeVisible();
  }

  async assertAssignedTo(assignedTo: string): Promise<void> {
    await this.assertLabelAndValue('Assigned to', assignedTo);
  }

  async assertNotUnassigned(): Promise<void> {
    await expect(this.page.getByText('Assigned to', { exact: true })).toBeVisible();
    await expect(this.page.getByText('Unassigned', { exact: true })).not.toBeVisible();
  }

  /**
   * Asserts the expected actions are shown. By default every other action must be
   * hidden; pass checkOthersHidden: false to only check the expected ones.
   */
  async assertOnlyManagementActions(
    actions: readonly TaskManagementAction[],
    {
      checkOthersHidden = true,
      notChecked = [],
      taskName
    }: {
      checkOthersHidden?: boolean;
      notChecked?: readonly TaskManagementAction[];
      taskName?: string;
    } = {}
  ): Promise<void> {
    const manageSection = this.getManageSection(taskName);

    for (const action of taskManagementActions) {
      if (notChecked.includes(action)) {
        continue;
      }

      const actionLocator = manageSection.getByText(action, { exact: true });

      if (actions.includes(action)) {
        await expect(actionLocator).toBeVisible();
        continue;
      }

      if (checkOthersHidden) {
        await expect(actionLocator).not.toBeVisible({ timeout: 5_000 });
      }
    }
  }

  async assignTaskToMe(taskName?: string): Promise<void> {
    const assignToMeLink = this.getTaskScope(taskName).locator('#action_claim');

    await expect(assignToMeLink).toBeVisible();
    await assignToMeLink.click();
    await expect(assignToMeLink).not.toBeVisible();
  }

  async markTaskAsDone(taskName?: string): Promise<void> {
    await this.confirmManageAction('Mark as done', 'Mark as done', taskName);
  }

  async cancelTask(taskName?: string): Promise<void> {
    await this.confirmManageAction('Cancel task', 'Cancel task', taskName);
  }

  async unassignTask(taskName?: string): Promise<void> {
    await this.confirmManageAction('Unassign task', 'Unassign', taskName);
  }

  async assignTaskToUser(
    userName: string,
    userEmail: string,
    taskName?: string
  ): Promise<void> {
    await this.chooseTaskUser('Assign task', 'Assign', userName, userEmail, 'CTSC', taskName);
  }

  async reassignTaskToUser(
    userName: string,
    userEmail: string,
    roleType: 'CTSC' | 'Judicial' = 'CTSC',
    taskName?: string
  ): Promise<void> {
    await this.chooseTaskUser('Reassign task', 'Reassign', userName, userEmail, roleType, taskName);
  }

  async assertPersonNotAuthorised(): Promise<void> {
    await expect(this.page.getByRole('heading', {
      name: 'The person you selected is not authorised to perform this task. Select back to search again.',
      exact: true
    })).toBeVisible();
  }

  async assertTaskNotVisible(
    taskName: string,
    refreshAttempts: number = DEFAULT_REFRESH_ATTEMPTS
  ): Promise<void> {
    await this.waitForTaskVisibility(taskName, false, refreshAttempts);
  }

  // For negative checks: the task must stay absent for the whole window, so a
  // task that WA creates a little late still fails the test.
  async assertTaskNeverAppears(
    taskName: string,
    windowMs: number = 60_000
  ): Promise<void> {
    const taskLocator = this.getTaskLocator(taskName);
    const deadline = Date.now() + windowMs;

    while (true) {
      await this.navigateToTasks();
      await expect(taskLocator).not.toBeVisible();

      if (Date.now() >= deadline) {
        return;
      }

      await this.page.waitForTimeout(DEFAULT_REFRESH_INTERVAL);
      await this.page.reload({ waitUntil: 'domcontentloaded' });
    }
  }

  async assertTaskRowInWorkAllocationTab(
    taskName: string,
    tabName: WorkAllocationTab,
    caseId: string | number,
    columns: Readonly<Record<string, string | RegExp>>,
    actions: readonly TaskManagementAction[]
  ): Promise<void> {
    const task = await this.workAllocationPage.findTask(
      tabName,
      { taskName, caseId }
    );

    await task.expectColumnValues(columns);
    await task.expectManagementActions(actions);
  }

  async assertWorkAllocationTabNotAvailable(tabName: WorkAllocationTab): Promise<void> {
    await this.workAllocationPage.expectTabNotAvailable(tabName);
  }

  async assertTaskVisible(taskName: string): Promise<void> {
    await this.waitForTaskVisibility(taskName, true);
  }

  async assertTaskCount(taskName: string, expectedCount: number): Promise<void> {
    await this.waitForTaskVisibility(taskName, true);
    await expect(this.page.getByText(taskName, { exact: true })).toHaveCount(expectedCount);
  }

  async assertTaskVisibleInWorkAllocationTab(
    taskName: string,
    tabName: WorkAllocationTab,
    caseId: string | number
  ): Promise<void> {
    await this.workAllocationPage.findTask(tabName, { taskName, caseId });
  }

  async assertTaskAndActionsInWorkAllocationTab(
    taskName: string,
    tabName: WorkAllocationTab,
    caseId: string | number,
    actions: readonly TaskManagementAction[]
  ): Promise<void> {
    const task = await this.workAllocationPage.findTask(
      tabName,
      { taskName, caseId }
    );

    await task.expectManagementActions(actions);
  }

  async assertNextSteps(taskName: string, nextSteps: readonly string[]): Promise<void> {
    const nextStepLinks = this.getTaskCard(taskName)
      .locator('dt')
      .filter({ hasText: /^Next steps$/ })
      .locator('xpath=following-sibling::dd[1]')
      .getByRole('link');

    await expect(nextStepLinks).toHaveText([...nextSteps]);
  }

  async assertNextStepVisible(nextStep: string): Promise<void> {
    await this.assertLabelAndLink('Next steps', nextStep);
  }

  async selectTaskNextStep(nextStep: string): Promise<void> {
    const nextStepLink = this.page.getByRole('link', {
      name: nextStep,
      exact: true
    });

    await expect(nextStepLink).toBeVisible();
    await nextStepLink.click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.assertEventStarted(nextStep);
  }

  // Manage Case only opens the event page (/trigger/) once the event's
  // about-to-start callback has passed. If the callback fails it shows an error
  // on the case page instead, so fail straight away rather than waiting for
  // the event's fields until the test times out.
  private async assertEventStarted(nextStep: string): Promise<void> {
    await expect.poll(async () => {
      return this.page.url().includes('/trigger/') || await this.callbackError.isVisible();
    }, { message: `${nextStep} did not open`, timeout: 60_000 }).toBe(true);
    if (await this.callbackError.isVisible()) {
      throw new Error(`${nextStep} could not start: ${await this.callbackError.innerText()}`);
    }
  }

  async assertTaskUI(
    task: TaskDetails,
    actions: readonly TaskManagementAction[]
  ): Promise<void> {
    await this.waitForTaskVisibility(task.name, true);
    await this.assertTaskDetails(task);
    await this.assertOnlyManagementActions(actions, { taskName: task.name });
  }

  // Judicial users see "Task created" in the case Tasks tab, not Priority or Due date.
  async assertJudicialTaskUI(
    task: { name: string; taskCreated: string; assignedTo: string },
    actions: readonly TaskManagementAction[],
    options: { checkOthersHidden?: boolean } = {}
  ): Promise<void> {
    await this.waitForTaskVisibility(task.name, true);
    await expect(this.activeTasksHeading).toBeVisible();
    await expect(this.page.getByText(task.name, { exact: true })).toBeVisible();
    await this.assertLabelAndValue('Task created', task.taskCreated);
    await this.assertLabelAndValue('Assigned to', task.assignedTo);
    await this.assertOnlyManagementActions(actions, options);
  }

  async closeTask(taskName: TaskName, action: TaskManagementAction): Promise<void> {
    await this.waitForTaskVisibility(taskName, true);
    await this.assignTaskToMe();
    if (action === 'Mark as done') {
      await this.markTaskAsDone();
    }
    else if (action === 'Cancel task') {
      await this.cancelTask();
    }
    await this.assertTaskNotVisible(taskName);
  }

  async submitTask(taskName: TaskName, completionEventName: TaskCompletionEventName): Promise<void> {
    // TODO: add check for more pages
    await this.waitForTaskVisibility(taskName, true);
    await this.assignTaskToMe();
    await this.submitEventFromTask(completionEventName);
    await this.assertTaskNotVisible(taskName);
  }

  // Runs a task's Next steps event that has no input pages, only Submit.
  async submitEventFromTask(eventName: string): Promise<void> {
    await this.selectTaskNextStep(eventName);
    await this.selectButton('Submit');
  }

  private async selectButton(buttonName: string): Promise<void> {
    const button = this.page.getByRole('button', { name: buttonName });
    await button.scrollIntoViewIfNeeded();
    await expect(button).toBeVisible();
    await expect(button).toBeEnabled();
    await button.click({ force: true });
  }

  private async waitForTaskVisibility(
    taskName: string,
    shouldBeVisible: boolean,
    refreshAttempts: number = DEFAULT_REFRESH_ATTEMPTS
  ): Promise<void> {
    const taskLocator = this.getTaskLocator(taskName);

    for (let attempt = 1; attempt <= refreshAttempts; attempt++) {
      if (shouldBeVisible) {
        await this.navigateToTasks();

        if (await taskLocator.isVisible()) {
          return;
        }
      } else if (!await this.isTaskInTaskList(taskName)) {
        return;
      }

      if (attempt < refreshAttempts) {
        await this.page.waitForTimeout(DEFAULT_REFRESH_INTERVAL);

        if (shouldBeVisible) {
          await this.page.reload({ waitUntil: 'domcontentloaded' });
        }
      }
    }

    const actualState = shouldBeVisible ? 'not visible' : 'still visible';
    throw new Error(
      `"${taskName}" was ${actualState} after `
      + `${refreshAttempts} refresh attempts`
    );
  }

  private async confirmManageAction(
    action: TaskManagementAction,
    confirmationButtonName: string,
    taskName?: string
  ): Promise<void> {
    const actionLink = this.getManageSection(taskName).getByText(action, { exact: true });

    await expect(actionLink).toBeVisible();
    await actionLink.click();

    const confirmationButton = this.page.getByRole('button', {
      name: confirmationButtonName,
      exact: true
    });

    await expect(confirmationButton).toBeVisible();
    await confirmationButton.click();
    await expect(confirmationButton).not.toBeVisible();
  }

  private async chooseTaskUser(
    action: TaskManagementAction,
    confirmationButtonName: string,
    userName: string,
    userEmail: string,
    roleType: 'CTSC' | 'Judicial',
    taskName?: string
  ): Promise<void> {
    const actionLink = this.getManageSection(taskName).getByText(action, { exact: true });

    await expect(actionLink).toBeVisible();
    await actionLink.click();

    const roleTypeOption = this.page.getByRole('radio', {
      name: roleType,
      exact: true
    });

    await expect(roleTypeOption).toBeVisible();
    await roleTypeOption.check();
    await this.page.getByRole('button', {
      name: 'Continue',
      exact: true
    }).click();

    const personSearch = this.page
      .getByText('Type the name of the person and select them.', {
        exact: true
      })
      .locator('xpath=following::input[1]');

    await expect(personSearch).toBeVisible();
    await personSearch.fill(userName);

    const userOption = this.page.getByRole('option').filter({
      hasText: userEmail
    });

    await expect(userOption).toBeVisible();
    await userOption.click();

    const continueButton = this.page.getByRole('button', {
      name: 'Continue',
      exact: true
    });

    if (await continueButton.isVisible()) {
      await continueButton.click();
    }

    const confirmationButton = this.page.getByRole('button', {
      name: confirmationButtonName,
      exact: true
    });

    await expect(confirmationButton).toBeEnabled();
    await confirmationButton.click();
    await expect(confirmationButton).not.toBeVisible();
  }

  private async isTaskInTaskList(taskName: string): Promise<boolean> {
    const { body, url } = await this.reloadTasksAndWaitForTaskList();
    const tasks: unknown = Array.isArray(body)
      ? body
      : (body as { tasks?: unknown } | null)?.tasks;

    if (!Array.isArray(tasks)) {
      throw new Error(`Unexpected task list response from ${url}`);
    }

    const taskTitles = tasks.flatMap((task: { name?: unknown; task_title?: unknown } | null) => {
      return [task?.name, task?.task_title].filter((title): title is string => {
        return typeof title === 'string';
      });
    });

    if (tasks.length > 0 && taskTitles.length === 0) {
      throw new Error(`Task list response from ${url} has no task names`);
    }

    return taskTitles.some((title) => {
      return title.toLowerCase() === taskName.toLowerCase();
    });
  }

  private async reloadTasksAndWaitForTaskList(): Promise<{ body: unknown; url: string }> {
    const reloadStartedAt = Date.now();
    let body: unknown;
    const taskListResponse = this.page.waitForResponse(async (response) => {
      if (response.request().method() !== 'POST'
        || !response.url().includes('/workallocation/case/task/')
        || !response.ok()
        || response.request().timing().startTime < reloadStartedAt) {
        return false;
      }

      body = await response.json().catch(() => {
        return undefined;
      });
      return body !== undefined;
    }, { timeout: TASK_LIST_RESPONSE_TIMEOUT });

    await this.page.reload({ waitUntil: 'domcontentloaded' });
    await this.navigateToTasks();
    const response = await taskListResponse;
    return { body, url: response.url() };
  }

  private getTaskLocator(taskName: string): Locator {
    const escapedTaskName = taskName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return this.page
      .getByText(new RegExp(`^${escapedTaskName}$`, 'i'))
      .first();
  }

  private async assertLabelAndValue(
    label: string,
    value: string,
    scope: Page | Locator = this.page
  ): Promise<void> {
    const labelLocator = scope.getByText(label, { exact: true });

    await expect(labelLocator).toBeVisible();
    await expect(scope.getByText(value, { exact: true })).toBeVisible();
  }

  // Added to differentiate event link locator inside task tab from Next Steps eg:Issue Application
  private async assertLabelAndLink(label: string, link: string): Promise<void> {
    const labelLocator = this.page.getByText(label, { exact: true });

    await expect(labelLocator).toBeVisible();
    await expect(this.page.getByRole('link', { name: link, exact: true })).toBeVisible();  
  }

  private getTaskCard(taskName: string): Locator {
    return this.page
      .getByText(taskName, { exact: true })
      .locator('xpath=following::dl[1]');
  }

  private getTaskScope(taskName?: string): Page | Locator {
    return taskName ? this.getTaskCard(taskName) : this.page;
  }

  private getManageSection(taskName?: string): Locator {
    return this.getTaskScope(taskName)
      .locator('dt')
      .filter({ hasText: /^Manage$/ })
      .locator('xpath=following-sibling::dd[1]');
  }

}
