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
    | 'Cancel'
    | 'Assign to me'
    | 'Mark as done'
    | 'Unassign task';

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
    ],
    taskAssigned = false
  ): Promise<void> {
    for (const action of actions) {
      if (
        taskAssigned &&
          (action === 'Assign task' || action === 'Assign to me')
      ) {
        continue;
      }

      const actionDetails: Record<
          TaskManagementAction,
          {
            selector: string;
            label: RegExp;
          }
      > = {
        'Assign task': {
          selector: '#action_assign',
          label: /^Assign task$/
        },
        'Reassign task': {
          selector: '#action_reassign',
          label: /^Reassign task$/
        },
        'Cancel task': {
          selector: '#action_cancel',
          label: /^Cancel task$/
        },
        Cancel: {
          selector: '#action_cancel',
          label: /^Cancel(?: task)?$/
        },
        'Assign to me': {
          selector: '#action_claim',
          label: /^Assign to me$/
        },
        'Mark as done': {
          selector: '#action_complete',
          label: /^Mark as done$/
        },
        'Unassign task': {
          selector: '#action_unclaim',
          label: /^Unassign task$/
        }
      };

      const { selector, label } = actionDetails[action];
      const actionLocator = this.page.locator(selector);

      await expect(actionLocator).toBeVisible();
      await expect(actionLocator).toHaveText(label);
    }
  }

  async assignTaskToMe(): Promise<void> {
    const assignToMeLink = this.page.locator('#action_claim');

    await expect(assignToMeLink).toBeVisible();
    await assignToMeLink.click();
    await expect(assignToMeLink).not.toBeVisible();
  }

  async markTaskAsDone(): Promise<void> {
    const markAsDoneLink = this.page.locator('#action_complete');

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
    const maxAttempts = 3;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      await this.navigateToTasks();

      if (!(await taskLocator.isVisible())) {
        return;
      }

      if (attempt < maxAttempts) {
        await this.page.reload({ waitUntil: 'domcontentloaded' });
      }
    }

    await expect(
      taskLocator,
      `"${taskName}" was still visible after ${maxAttempts} attempts`
    ).not.toBeVisible();
  }

  async assertAssignedTaskActions(userRole?: string): Promise<void> {
    const actions: TaskManagementAction[] = ['Mark as done'];

    if (userRole === 'CTSC Team Leader') {
      actions.push('Reassign task', 'Unassign task', 'Cancel');
    }

    await this.assertManagementActions(actions, true);
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
    userRole: string
  ): Promise<void> {
    await this.assertTaskDetails(task);
    await this.assertManagementActions(['Assign to me']);

    const teamLeaderActions: TaskManagementAction[] = ['Assign task', 'Cancel task'];
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