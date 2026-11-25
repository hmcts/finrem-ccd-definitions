import { expect, type Locator, type Page, type Response } from '@playwright/test';
import {
  taskManagementActions,
  type TaskManagementAction
} from './TaskTypes.ts';

export type WorkAllocationTab = 'All work' | 'My work';

export interface WorkAllocationTaskIdentity {
  readonly caseId: string | number;
  readonly taskName: string;
}

interface WorkAllocationSearchStrategy {
  readonly paginated: boolean;
  readonly refreshAttempts: number;
  readonly refreshInterval: number;
}

const RENDER_TIMEOUT = 5_000;
const TASK_LIST_RESPONSE_TIMEOUT = 5 * 60 * 1000;
const searchStrategies: Readonly<Record<
  WorkAllocationTab,
  WorkAllocationSearchStrategy
>> = {
  'My work': {
    paginated: true,
    refreshAttempts: 6,
    refreshInterval: 2_000
  },
  'All work': {
    paginated: true,
    refreshAttempts: 12,
    refreshInterval: 5_000
  }
};

export class WorkAllocationTask {

  public constructor(
    private readonly page: Page,
    private readonly taskLink: Locator
  ) {}

  async expectManagementActions(
    expectedActions: readonly TaskManagementAction[]
  ): Promise<void> {
    const taskRow = this.taskLink.locator('xpath=ancestor::tr[1]');
    const manageButton = taskRow.getByRole('button', {
      name: 'Manage',
      exact: true
    });

    await expect(manageButton).toBeVisible();
    await expect(async () => {
      if (await manageButton.getAttribute('aria-expanded') !== 'true') {
        await manageButton.click();
      }
      await expect(manageButton).toHaveAttribute('aria-expanded', 'true', {
        timeout: RENDER_TIMEOUT
      });
    }).toPass({ timeout: 30_000 });

    for (const action of taskManagementActions) {
      const actionLocator = this.page.getByText(action, { exact: true });

      if (expectedActions.includes(action)) {
        await expect(actionLocator).toBeVisible();
      } else {
        await expect(actionLocator).not.toBeVisible({ timeout: 5_000 });
      }
    }
  }

  // Checks cells in the task's row by column heading, e.g. { 'Case name': /Baggins/ }.
  async expectColumnValues(
    expected: Readonly<Record<string, string | RegExp>>
  ): Promise<void> {
    const taskRow = this.taskLink.locator('xpath=ancestor::tr[1]');
    const headings = (await taskRow
      .locator('xpath=ancestor::table[1]//thead//th')
      .allInnerTexts())
      .map((heading) => {return heading.trim();});

    for (const [column, value] of Object.entries(expected)) {
      const index = headings.findIndex((heading) => {return heading === column;});

      if (index < 0) {
        throw new Error(
          `Column "${column}" not found. Columns: ${headings.join(', ')}`
        );
      }

      await expect(taskRow.locator('td').nth(index)).toContainText(value);
    }
  }
}

export class WorkAllocationTabsPage {

  public constructor(private readonly page: Page) {}

  async findTask(
    tabName: WorkAllocationTab,
    identity: WorkAllocationTaskIdentity
  ): Promise<WorkAllocationTask> {
    const tab = this.getTab(tabName);

    await expect(tab).toBeVisible();
    const taskListLoaded = this.waitForTaskList();
    await tab.click();
    await taskListLoaded;

    const taskLink = this.getTaskLink(identity);
    const strategy = searchStrategies[tabName];

    for (let attempt = 1; attempt <= strategy.refreshAttempts; attempt++) {
      const found = strategy.paginated
        ? await this.findAcrossPages(taskLink)
        : await this.findOnCurrentPage(taskLink);

      if (found) {
        return new WorkAllocationTask(this.page, taskLink);
      }

      if (attempt < strategy.refreshAttempts) {
        await this.page.waitForTimeout(strategy.refreshInterval);
        await this.page.reload({ waitUntil: 'domcontentloaded' });
      }
    }

    throw new Error(
      `"${identity.taskName}" for case ${identity.caseId} was not visible `
      + `in ${tabName} after ${strategy.refreshAttempts} refresh attempts`
    );
  }

  async expectTabNotAvailable(tabName: WorkAllocationTab): Promise<void> {
    // Wait for the navigation to render before checking the tab is missing.
    await expect(this.page.locator('a.hmcts-primary-navigation__link').first()).toBeVisible();
    await expect(this.getTab(tabName)).toHaveCount(0);
  }

  private waitForTaskList(): Promise<Response> {
    return this.page.waitForResponse((response) => {
      return response.request().method() === 'POST'
        && new URL(response.url()).pathname === '/workallocation/task'
        && response.ok();
    }, { timeout: TASK_LIST_RESPONSE_TIMEOUT });
  }

  private getTab(tabName: WorkAllocationTab): Locator {
    return this.page
      .locator('a.hmcts-primary-navigation__link')
      .filter({ hasText: new RegExp(`^\\s*${tabName}\\s*$`, 'i') });
  }

  private getTaskLink(identity: WorkAllocationTaskIdentity): Locator {
    const caseId = String(identity.caseId).replace(/\D/g, '');

    return this.page
      .locator(`a[href$="/${caseId}/tasks"]`)
      .filter({
        hasText: new RegExp(`^\\s*${identity.taskName}\\s*$`, 'i')
      });
  }

  private async findOnCurrentPage(taskLink: Locator): Promise<boolean> {
    try {
      await taskLink.waitFor({ state: 'visible', timeout: RENDER_TIMEOUT });
      return true;
    } catch {
      return false;
    }
  }

  private async goToFirstPage(): Promise<void> {
    const previousPage = this.page.locator('[aria-label="Previous page"]');

    while (await previousPage.isVisible()) {
      await previousPage.click();
      await this.page.waitForLoadState('domcontentloaded');
    }
  }

  private async findAcrossPages(taskLink: Locator): Promise<boolean> {
    await this.goToFirstPage();

    while (true) {
      if (await this.findOnCurrentPage(taskLink)) {
        return true;
      }

      const nextPage = this.page.locator('[aria-label="Next page"]');

      if (!await nextPage.isVisible()) {
        return false;
      }

      await nextPage.click();
      await this.page.waitForLoadState('domcontentloaded');
    }
  }
}
