import { expect, type Locator, type Page } from '@playwright/test';

export interface HistoryEvent {
  readonly event: string;
  readonly author: string;
  readonly endState: string;
}

export class CaseHistoryPage {

  private readonly page: Page;
  private readonly historyTab: Locator;
  private readonly latestEventLink: Locator;

  public constructor(page: Page) {
    this.page = page;
    this.historyTab = page.getByRole('tab', { name: /^History/ });
    this.latestEventLink = page
      .locator('table.EventLogTable tbody tr')
      .first()
      .locator('a.event-link');
  }

  async validateLatestHistoryEvent(expected: HistoryEvent): Promise<void> {
    await expect(this.historyTab).toBeVisible();
    await this.historyTab.click();
    await expect(this.latestEventLink).toHaveText(expected.event);
    await expect(this.getDetailsValue('Event')).toHaveText(expected.event);
    await expect(this.getDetailsValue('Author')).toHaveText(expected.author);
    await expect(this.getDetailsValue('End state')).toHaveText(expected.endState);
  }

  private getDetailsValue(label: string): Locator {
    return this.page
      .locator('table.EventLogDetails tr')
      .filter({ has: this.page.locator('th').getByText(label, { exact: true }) })
      .locator('td');
  }

}
