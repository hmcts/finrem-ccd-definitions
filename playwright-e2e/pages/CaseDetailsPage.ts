import { type Page, expect, Locator } from '@playwright/test';
import { CaseEvent } from '../config/case_events';
import { Tab, TabContentItem } from './components/tab';

export class CaseDetailsPage {

  private readonly page: Page;

  readonly successfulCreationBanner: Locator;
  readonly successfulUpdateBanner: Locator;
  readonly selectNextStepDropDown: Locator
  readonly goButton: Locator;
  readonly closeAndReturnButton: Locator;
  readonly activeCaseFlagOnCase: Locator;

  public constructor(page: Page) {
    this.page = page;
    this.successfulCreationBanner = page.getByText('has been created');
    this.successfulUpdateBanner = page.getByText('has been updated');
    this.selectNextStepDropDown = page.getByLabel('Next step');
    this.goButton = page.getByRole('button', { name: 'Go' })
    this.closeAndReturnButton = page.getByRole('button', { name: 'Close and Return to case' })
    this.activeCaseFlagOnCase = page.getByLabel('Important').locator('div', { hasText: /There (is|are) \d+ active flag[s]? on/, });
  }

  async checkHasBeenCreated() {
    await expect(this.successfulCreationBanner).toBeVisible();
  }

  async selectNextStep(event: CaseEvent) {
    await expect(async () => {
      await this.page.waitForLoadState();
      await this.goButton.isVisible();
      await expect(this.selectNextStepDropDown).toBeVisible();
      await this.selectNextStepDropDown.selectOption(event.listItem);
      await this.goButton.click({ clickCount: 2, delay: 500 });
      await this.page.waitForURL(`**/${event.ccdCallback}/**`);
    }).toPass();
  }

  async checkHasBeenUpdated(event: string) {
    await expect(this.successfulUpdateBanner).toBeVisible();
    await expect(this.successfulUpdateBanner).toContainText(event);
  }

  async assertTabData(tabs: Tab[]) {
    for (const tab of tabs) {
      await this.assertTabHeader(tab.tabName);
      await this.assertTabContent(tab.tabContent);
      if (tab.excludedContent) {
        await this.assertExcludedContent(tab.excludedContent);
      }
    }
  }

  private async assertTabHeader(tabName: string): Promise<void> {
    const tabHeader = this.getTabHeader(tabName);
    await expect(tabHeader).toBeVisible();
    await expect(tabHeader).toBeEnabled();
    await tabHeader.click();
  }

  private async assertTabContent(tabContent: TabContentItem[]): Promise<void> {
    for (const content of tabContent) {
      if (typeof content === 'string') {
        const tabItem = this.getTabContent(content);
        await expect(tabItem).toBeVisible();
      } else {
        const tabItem = this.getTabContent(content.tabItem);
        await tabItem.waitFor();
        await expect(tabItem).toBeVisible();

        const tabValue = tabItem.locator('xpath=../following-sibling::td');
        await expect(tabValue).toHaveText(content.value);
      }
    }
  }

  private async assertExcludedContent(excludedContent: string[]): Promise<void> {
    for (const excluded of excludedContent) {
      const tabItem = this.getTabContent(excluded);
      await expect(tabItem).not.toBeVisible();
    }
  }

  private getTabHeader(tabName: string): Locator {
    return this.page.getByRole('tab', { name: tabName, exact: true });
  }

  private getTabContent(content: string): Locator {
    return this.page.getByText(content, { exact: true });
  }
  async checkActiveCaseFlagOnCase() {
    await expect(this.activeCaseFlagOnCase).toBeVisible();
  }
}

