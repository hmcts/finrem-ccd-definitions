import { type Page, expect, Locator } from '@playwright/test';
import { CaseEvent } from '../config/case-data';
import { Tab, TabContentItem } from './components/tab';
import {FileTree} from "./components/case_file_view_tree.ts";

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

    /**
     * Returns the `Locator` for the nth visible element matching the given text content.
     *
     * @param content - The exact text to match in the DOM.
     * @param position - The zero-based index of the visible element to return (default is 0).
     * @returns A Playwright `Locator` for the requested visible element.
     * @throws Error if no visible element is found at the specified position.
     *
     * Logic:
     * 1. Finds all elements matching the exact text.
     * 2. If only one match and position is 0, returns it directly.
     * 3. Otherwise, iterates through all matches, counting only those that are visible.
     * 4. Returns the element at the requested visible position.
     * 5. Throws an error if the requested visible position does not exist.
     */
    private async getVisibleTabContent(content: string, position: number = 0): Promise<Locator> {
        const locator = this.page.getByText(content, { exact: true });
        const count = await locator.count();

        if (count === 1 && position === 0) {
            return locator;
        }

        let visibleIndex = 0;
        for (let i = 0; i < count; i++) {
            const element = locator.nth(i);
            if (await element.isVisible()) {
                if (visibleIndex === position) {
                    return element;
                }
                visibleIndex++;
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

    async assertTabNotPresent(tabName: string): Promise<void> {
        const tabHeader = this.getTabHeader(tabName);
        await expect(tabHeader).not.toBeVisible();
    }


    async validateFileTree(
        tree: FileTree,
        parentPath: string[] = [],
        parentLocator: Locator | null = null,
        errors: string[] = []
    ) {
        const heading = this.page.getByRole('heading', { name: 'Case file', level: 2 });
        if (!(await heading.isVisible())) {
            const caseFileViewButton = this.page.getByRole('tab', { name: 'Case File View', exact: false });
            await caseFileViewButton.click();
            await expect(heading).toBeVisible();
        }
        for (const node of tree) {
            const currentPath = [...parentPath, node.label];
            if (node.type === 'folder') {
                try {
                    const folderLocator = (parentLocator ?? this.page).locator('.node__name--folder', { hasText: node.label });
                    await folderLocator.click();
                    const folderNode = folderLocator.locator('xpath=ancestor::cdk-nested-tree-node[1]');
                    await expect(folderNode).toHaveAttribute('aria-expanded', 'true');
                    if (node.children && node.children.length > 0) {
                        await this.validateFileTree(node.children, currentPath, folderNode, errors);
                    }
                } catch (e) {
                    errors.push(`Folder not found or not clickable: ${currentPath.join(' / ')}\n${e}`);
                }
            } else if (node.type === 'file') {
                try {
                    const fileLocator = (parentLocator ?? this.page).locator('.node-name-document', { hasText: node.label });
                    await expect(fileLocator).toBeVisible();
                    await fileLocator.click();
                    if (node.contentSnippets) {
                        for (const snippet of node.contentSnippets) {
                            try {
                                const pdfContainer = this.page.locator(`.pdfViewer`);
                                const pdfTextLocator = pdfContainer.locator('span[role="presentation"]', { hasText: snippet });
                                const containerHandle = await pdfContainer.elementHandle();
                                const snippetHandle = await pdfTextLocator.elementHandle();
                                if (containerHandle && snippetHandle) {
                                    await this.page.evaluate(
                                        ([container, element]) => {
                                            (element as HTMLElement).scrollIntoView({ block: 'center' });
                                        },
                                        [containerHandle, snippetHandle]
                                    );
                                }
                                await expect(pdfTextLocator).toBeVisible();
                            } catch (e) {
                                errors.push(`Snippet not found in file "${node.label}" in folder "${parentPath.join(' / ')}": ${snippet}\n${e}`);
                            }
                        }
                    }
                } catch (e) {
                    errors.push(`File not found or not visible: ${currentPath.join(' / ')}\n${e}`);
                }
            }
        }
        if (parentPath.length === 0 && errors.length > 0) {
            throw new Error('File tree validation errors:\n' + errors.join('\n\n'));
        }
    }

}
