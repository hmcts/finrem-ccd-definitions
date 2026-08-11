import { expect, type Locator, type Page } from '@playwright/test';

export interface TaskDetails {
    name: string;
    priority: string;
    dueDate: string;
    assignedTo: string;
}

export type TaskManagementAction = 'Assign task' | 'Cancel task' | 'Assign to me';

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
    const escapedTaskName = taskName.replace(
      /[.*+?^${}()|[\]\\]/g,
      '\\$&'
    );
    const taskNameRegex = new RegExp(escapedTaskName, 'i');
    const taskLocator = this.page.getByText(taskNameRegex).first();
    const maxAttempts = 3;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      await this.navigateToTasks();

      if (await taskLocator.isVisible()) {
        return;
      }

      if (attempt < maxAttempts) {
        await this.page.reload({ waitUntil: 'domcontentloaded' });
      }
    }

    await expect(
      taskLocator,
      `"${taskName}" was not visible after ${maxAttempts} attempts`
    ).toBeVisible();
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
    for (const action of actions) {
      const actionLocator = action === 'Assign task'
        ? this.page.locator('#action_assign')
        : action === 'Cancel task'
          ? this.page.locator('#action_cancel')
          : this.page.locator('#action_claim');

      await expect(actionLocator).toBeVisible();
    }
  }

  async assertTaskUI(
    task: TaskDetails,
    userRole: string
  ): Promise<void> {
    await this.assertTaskDetails(task);
    await this.assertManagementActions(['Assign to me']);

    const teamLeaderActions: TaskManagementAction[] = [
      'Assign task',
      'Cancel task'
    ];

    if (userRole === 'CTSC Team Leader') {
      await this.assertManagementActions(teamLeaderActions);
      return;
    }

    await expect(this.page.locator('#action_assign')).not.toBeVisible();
    await expect(this.page.locator('#action_cancel')).not.toBeVisible();
  }

  private async assertLabelAndValue(label: string, value: string): Promise<void> {
    const labelLocator = this.page.getByText(label, { exact: true });

    await expect(labelLocator).toBeVisible();
    await expect(this.page.getByText(value, { exact: true })).toBeVisible();
  }
}