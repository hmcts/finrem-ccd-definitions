import { type Page, expect, Locator } from '@playwright/test';
import { CaseEvent } from '../config/case-data';
import { Tab, TabContentItem } from './components/tab';

export class CaseDetailsPage {

    private readonly page: Page;

    readonly successfulCreationBanner: Locator;
    readonly successfulUpdateBanner: Locator;
    readonly selectNextStepDropDown: Locator;
    readonly goButton: Locator;
    readonly closeAndReturnButton: Locator;
    readonly activeCaseFlagOnCase: Locator;

    public constructor(page: Page) {
        this.page = page;
        this.successfulCreationBanner = page.getByText('has been created');
        this.successfulUpdateBanner = page.getByText('has been updated');
        this.selectNextStepDropDown = page.getByLabel('Next step');
        this.goButton = page.getByRole('button', { name: 'Go' });
        this.closeAndReturnButton = page.getByRole('button', { name: 'Close and Return to case' });
        this.activeCaseFlagOnCase = page.getByLabel('Important').locator('div', { hasText: /There (is|are) \d+ active flag[s]? on/, });
    }

    async checkHasBeenCreated() {
        await expect(this.successfulCreationBanner).toBeVisible();
    }

    async selectNextStep(event: CaseEvent) {
        await expect(async () => {
            await this.page.waitForLoadState();
            const go=this.goButton.isVisible();
            await this.goButton.isVisible();
            console.log(go);
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
                // Handle string content
                const tabItem = await this.getVisibleTabContent(content);
                await expect(tabItem).toBeVisible();
            } else {
                // Handle object content with tabItem and value
                const tabItem = await this.getVisibleTabContent(content.tabItem);
                await expect(tabItem).toBeVisible();

                // Refine the locator to uniquely identify the corresponding <td>
                const tabValue = tabItem.locator('xpath=../following-sibling::td').filter({
                    hasText: content.value,
                });
                await expect(tabValue).toHaveText(content.value);
            }
        }
    }

    private async assertExcludedContent(excludedContent: string[]): Promise<void> {
        for (const excluded of excludedContent) {
            const tabItem = this.page.getByText(excluded, { exact: true }); // Locate the element directly
            await expect(tabItem).not.toBeVisible(); // Assert that it is not visible
        }
    }

    private getTabHeader(tabName: string): Locator {
        return this.page.getByRole('tab', { name: tabName, exact: true });
    }

    private async getVisibleTabContent(content: string): Promise<Locator> {
        const locator = this.page.getByText(content, { exact: true });
        const count = await locator.count();

        if (count === 1) {
            return locator;
        }

        for (let i = 0; i < count; i++) {
            const element = locator.nth(i);
            if (await element.isVisible()) {
                return element;
            }
        }
        throw new Error(`No visible element found for content: ${content}`);
    }

    async checkActiveCaseFlagOnCase() {
        await expect(this.activeCaseFlagOnCase).toBeVisible();
    }
    async checkNoActiveCaseFlagOnCase() {
        await expect(this.activeCaseFlagOnCase).not.toBeVisible();
    }
}

