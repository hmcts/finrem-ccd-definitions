import { expect, type Locator, type Page } from '@playwright/test';
import {
  taskManagementActions,
  type TaskDetails,
  type TaskManagementAction
} from './TaskTypes.ts';
import {
  WorkAllocationTabsPage,
  type WorkAllocationTab
} from './WorkAllocationTabsPage.ts';

const DEFAULT_REFRESH_ATTEMPTS = 12;
const DEFAULT_REFRESH_INTERVAL = 5_000;

export class TaskUiChecks {

  private readonly page: Page;
  private readonly tasksTab: Locator;
  private readonly activeTasksHeading: Locator;
  private readonly workAllocationPage: WorkAllocationTabsPage;

  public constructor(page: Page) {
    this.page = page;
    this.tasksTab = page.getByRole('tab', { name: 'Tasks', exact: true });
    this.activeTasksHeading = page.getByRole('heading', { name: 'Active tasks', exact: true });
    this.workAllocationPage = new WorkAllocationTabsPage(page);
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

  async assertOnlyManagementActions(
    actions: readonly TaskManagementAction[],
    taskName?: string
  ): Promise<void> {
    const manageSection = this.getManageSection(taskName);

    for (const action of taskManagementActions) {
      const actionLocator = manageSection.getByText(action, { exact: true });

      if (actions.includes(action)) {
        await expect(actionLocator).toBeVisible();
        continue;
      }

      await expect(actionLocator).not.toBeVisible({ timeout: 5_000 });
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
    await this.chooseTaskUser('Assign task', 'Assign', userName, userEmail, taskName);
  }

  async reassignTaskToUser(
    userName: string,
    userEmail: string,
    taskName?: string
  ): Promise<void> {
    await this.chooseTaskUser('Reassign task', 'Reassign', userName, userEmail, taskName);
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
  }

  async assertTaskUI(
    task: TaskDetails,
    actions: readonly TaskManagementAction[]
  ): Promise<void> {
    await this.waitForTaskVisibility(task.name, true);
    await this.assertTaskDetails(task);
    await this.assertOnlyManagementActions(actions, task.name);
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
      } else {
        await this.reloadTasksAndWaitForTaskList();
      }

      if (await taskLocator.isVisible() === shouldBeVisible) {
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
    taskName?: string
  ): Promise<void> {
    const actionLink = this.getManageSection(taskName).getByText(action, { exact: true });

    await expect(actionLink).toBeVisible();
    await actionLink.click();

    const roleTypeOption = this.page.getByRole('radio', {
      name: 'CTSC',
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

  private async reloadTasksAndWaitForTaskList(): Promise<void> {
    const taskListLoaded = this.page.waitForResponse((response) => {
      return response.request().method() === 'POST'
        && response.url().includes('/workallocation/case/task/')
        && response.ok();
    });

    await this.page.reload({ waitUntil: 'domcontentloaded' });
    await this.navigateToTasks();
    await taskListLoaded;
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
