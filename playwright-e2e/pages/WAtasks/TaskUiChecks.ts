import { expect, type Locator, type Page } from '@playwright/test';

export interface TaskDetails {
  name: string;
  priority: string;
  dueDate: string;
  assignedTo: string;
}

export type TaskManagementAction =
    'Assign task'
    | 'Reassign task'
    | 'Cancel task'
    | 'Assign to me'
    | 'Mark as done'
    | 'Unassign task';

export type TaskUserRole = 'admin' | 'teamLeader';

const actionDetails: Record<
    TaskManagementAction,
    { label: RegExp }
> = {
  'Assign task': { label: /^Assign task$/ },
  'Reassign task': { label: /^Reassign task$/ },
  'Cancel task': { label: /^Cancel task$/ },
  'Assign to me': { label: /^Assign to me$/ },
  'Mark as done': { label: /^Mark as done$/ },
  'Unassign task': { label: /^Unassign task$/ }
};

const managementActions = Object.keys(actionDetails) as TaskManagementAction[];

export class TaskUiChecks {

  private readonly page: Page;
  private readonly tasksTab: Locator;
  private readonly activeTasksHeading: Locator;

  public constructor(page: Page) {
    this.page = page;
    this.tasksTab = page.getByRole('tab', { name: 'Tasks', exact: true });
    this.activeTasksHeading = page.getByRole('heading', { name: 'Active tasks', exact: true });
  }

  async navigateToTasks(): Promise<void> {
    await expect(this.tasksTab).toBeVisible();
    await this.tasksTab.click();
    await expect(this.activeTasksHeading).toBeVisible();
  }

  async assertTaskVisible(taskName: string): Promise<void> {
    const escapedTaskName = taskName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const taskLocator = this.page.getByText(new RegExp(escapedTaskName, 'i')).first();
    const maxAttempts = 12;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      await this.navigateToTasks();

      if (await taskLocator.isVisible()) {
        return;
      }

      if (attempt < maxAttempts) {
        await this.page.waitForTimeout(5_000);
        await this.page.reload({ waitUntil: 'domcontentloaded' });
      }
    }

    throw new Error(
      `"${taskName}" was not visible after ${maxAttempts} refresh attempts`
    );
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

  async assertManagementActions(
    actions: TaskManagementAction[] = [
      'Assign task',
      'Cancel task',
      'Assign to me'
    ]
  ): Promise<void> {
    const manageSection = this.getManageSection();

    for (const action of actions) {
      const actionLocator = manageSection.getByText(
        actionDetails[action].label
      );

      await expect(actionLocator).toBeVisible();
    }
  }

  async assertOnlyManagementActions(
    actions: TaskManagementAction[]
  ): Promise<void> {
    await this.assertManagementActions(actions);
    const manageSection = this.getManageSection();

    for (const action of managementActions) {
      if (!actions.includes(action)) {
        await expect(
          manageSection.getByText(actionDetails[action].label)
        ).not.toBeVisible({
          timeout: 5_000
        });
      }
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
      actionDetails['Mark as done'].label
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

  async assertTaskNotVisible(taskName: string): Promise<void> {
    const taskLocator = this.page.getByText(taskName, { exact: true });
    const maxAttempts = 12;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      await this.navigateToTasks();

      if (!(await taskLocator.isVisible())) {
        return;
      }

      if (attempt < maxAttempts) {
        await this.page.waitForTimeout(5_000);
        await this.page.reload({ waitUntil: 'domcontentloaded' });
      }
    }

    throw new Error(
      `"${taskName}" was still visible after ${maxAttempts} refresh attempts`
    );
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
    userRole: TaskUserRole
  ): Promise<void> {
    await this.assertTaskDetails(task);
    await this.assertOnlyManagementActions(
      userRole === 'teamLeader'
        ? ['Assign task', 'Cancel task', 'Assign to me']
        : ['Assign to me']
    );
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