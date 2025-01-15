import { type Page, expect, Locator } from '@playwright/test';
import { CaseEvent } from '../config/case_events';
import { Tab } from './components/tab';

export class CaseDetailsPage {

    private readonly page: Page;

    readonly successfulCreationBanner: Locator;
    readonly successfulUpdateBanner: Locator;
    readonly selectNextStepDropDown: Locator
    readonly goButton: Locator;
    readonly closeAndReturnButton: Locator; 

    public constructor(page: Page){
        this.page = page;
        this.successfulCreationBanner = page.getByText('has been created');
        this.successfulUpdateBanner = page.getByText('has been updated');
        this.selectNextStepDropDown = page.getByLabel('Next step');
        this.goButton = page.getByRole('button', { name: 'Go' })
        this.closeAndReturnButton = page.getByRole('button', { name: 'Close and Return to case' })
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
            await this.goButton.click({clickCount:2,delay:500}); 
            await this.page.waitForURL(`**/${event.ccdCallback}/**`);
        }).toPass();
    }

    async checkHasBeenUpdated(event: string) {
        await expect(this.successfulUpdateBanner).toBeVisible();
        await expect(this.successfulUpdateBanner).toContainText(event);
    }

  async assertTabData(tabs: Tab[]) {
    for (const tab of tabs) {
      const tabHeader = this.getTabHeader(tab.tabName);
      await expect(tabHeader).toBeVisible();
      await tabHeader.click();

      for (const content of tab.tabContent) {
        if (typeof content === 'string') {
          // Handle string content
          const tabItem = this.getTabContent(content);
          await expect(tabItem).toBeVisible();
        } else {
          // Handle TabContent object
          const tabItem = this.getTabContent(content.tabItem);
          await expect(tabItem).toBeVisible();

          // Traverse to the sibling <td> and assert it contains value
          const tabValue = tabItem.locator('xpath=../following-sibling::td');
          await expect(tabValue).toHaveText(content.value);
        }
      }
    }
  }

  private getTabHeader(tabName: string): Locator {
    return this.page.getByRole('tab', { name: tabName, exact: true });
  }

  private getTabContent(content: string): Locator {
    return this.page.getByText(content, { exact: true });
  }
}
