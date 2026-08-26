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

    await expect(this.activeTasksHeading).toBeVisible();
    await expect(taskHeading).toBeVisible();
    await this.assertLabelAndValue('Priority', task.priority);
    await this.assertLabelAndValue('Due date', task.dueDate);
    await this.assertLabelAndValue('Assigned to', task.assignedTo);
    await expect(this.page.getByText('Manage', { exact: true })).toBeVisible();
  }

  async assertOnlyManagementActions(
    actions: readonly TaskManagementAction[]
  ): Promise<void> {
    const manageSection = this.getManageSection();

    for (const action of taskManagementActions) {
      const actionLocator = manageSection.getByText(action, { exact: true });

      if (actions.includes(action)) {
        await expect(actionLocator).toBeVisible();
        continue;
      }

      await expect(actionLocator).not.toBeVisible({ timeout: 5_000 });
    }
  }

  async assignTaskToMe(): Promise<void> {
    const assignToMeLink = this.page.locator('#action_claim');

    await expect(assignToMeLink).toBeVisible();
    await assignToMeLink.click();
    await expect(assignToMeLink).not.toBeVisible();
  }

  async markTaskAsDone(): Promise<void> {
    const markAsDoneLink = this.getManageSection().getByText(
      'Mark as done',
      { exact: true }
    );

    await expect(markAsDoneLink).toBeVisible();
    await markAsDoneLink.click();

    const confirmationButton = this.page.getByRole('button', {
      name: 'Mark as done',
      exact: true
    });

    await expect(confirmationButton).toBeVisible();
    await confirmationButton.click();
  }

  async cancelTask(): Promise<void> {
    const cancelTaskLink = this.getManageSection().getByText(
      'Cancel task',
      { exact: true }
    );

    await expect(cancelTaskLink).toBeVisible();
    await cancelTaskLink.click();

    const confirmationButton = this.page.getByRole('button', {
      name: 'Cancel task',
      exact: true
    });

    await expect(confirmationButton).toBeVisible();
    await confirmationButton.click();
  }

  async reassignTaskToUser(
    userName: string,
    userEmail: string
  ): Promise<void> {
    const reassignTaskLink = this.getManageSection().getByText(
      'Reassign task',
      { exact: true }
    );

    await expect(reassignTaskLink).toBeVisible();
    await reassignTaskLink.click();

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

    const reassignButton = this.page.getByRole('button', {
      name: 'Reassign',
      exact: true
    });

    await expect(reassignButton).toBeEnabled();
    await reassignButton.click();
  }

  async assertTaskNotVisible(taskName: string): Promise<void> {
    await this.waitForTaskVisibility(taskName, false);
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

  async assertNextStepVisible(nextStep: string): Promise<void> {
    await this.assertLabelAndValue('Next steps', nextStep);
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
    await this.assertOnlyManagementActions(actions);
  }

  private async waitForTaskVisibility(
    taskName: string,
    shouldBeVisible: boolean
  ): Promise<void> {
    const taskLocator = this.getTaskLocator(taskName);

    for (let attempt = 1; attempt <= DEFAULT_REFRESH_ATTEMPTS; attempt++) {
      await this.navigateToTasks();

      if (await taskLocator.isVisible() === shouldBeVisible) {
        return;
      }

      if (attempt < DEFAULT_REFRESH_ATTEMPTS) {
        await this.page.waitForTimeout(DEFAULT_REFRESH_INTERVAL);
        await this.page.reload({ waitUntil: 'domcontentloaded' });
      }
    }

    const actualState = shouldBeVisible ? 'not visible' : 'still visible';
    throw new Error(
      `"${taskName}" was ${actualState} after `
      + `${DEFAULT_REFRESH_ATTEMPTS} refresh attempts`
    );
  }

  private getTaskLocator(taskName: string): Locator {
    const escapedTaskName = taskName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return this.page
      .getByText(new RegExp(`^${escapedTaskName}$`, 'i'))
      .first();
  }

  private async assertLabelAndValue(label: string, value: string): Promise<void> {
    const labelLocator = this.page.getByText(label, { exact: true });

    await expect(labelLocator).toBeVisible();
    await expect(this.page.getByText(value, { exact: true })).toBeVisible();
  }

  private getManageSection(): Locator {
    return this.page
      .locator('dt')
      .filter({ hasText: /^Manage$/ })
      .locator('xpath=following-sibling::dd[1]');
  }

}
