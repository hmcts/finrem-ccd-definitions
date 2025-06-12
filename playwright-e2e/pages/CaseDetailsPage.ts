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

    /**
     * Asserts that each item in the provided tab content array is visible and, if applicable, contains the expected value.
     *
     * The function supports both string and object tab content items. For string items, it checks visibility.
     * For object items, it checks both visibility and that the corresponding value cell contains the expected text.
     *
     * The `tabItemCount` record is used to track the number of times each unique tab item key has been processed.
     * This allows the function to correctly select the nth visible instance of a tab item when the same label appears multiple times,
     * ensuring assertions are made against the correct DOM element.
     * Tab array items should be in right order, as they are displayed in the UI.
     */
    private async assertTabContent(tabContent: TabContentItem[]): Promise<void> {
        const tabItemCount: Record<string,number> = {};
        for (const content of tabContent) {
            let tabKey: string;
            let position: number;

            if (typeof content === 'string') {
                tabKey = content;
            } else {
                tabKey = content.tabItem;
            }

            position = tabItemCount[tabKey] ?? 0;
            tabItemCount[tabKey] = position + 1;

            if (typeof content === 'string') {
                // Handle string content
                const tabItem = await this.getVisibleTabContent(content, position);
                await expect(tabItem).toBeVisible();
            } else {
                // Handle object content with tabItem and value
                const tabItem = await this.getVisibleTabContent(content.tabItem, position);
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

    private async getVisibleTabContent(content: string, position: number = 0): Promise<Locator> {
        const locator = this.page.getByText(content, { exact: true });
        const count = await locator.count();

        if (count === 1 && position === 0) {
            return locator;
        }

        for (let i = 0; i < count; i++) {
            const element = locator.nth(i);
            if (await element.isVisible() && i === position) {
                return element;
            }
        }
        throw new Error(`No visible element found for content: ${content} at position: ${position}`);
    }

    async checkActiveCaseFlagOnCase() {
        await expect(this.activeCaseFlagOnCase).toBeVisible();
    }
    async checkNoActiveCaseFlagOnCase() {
        await expect(this.activeCaseFlagOnCase).not.toBeVisible();
    }
}

