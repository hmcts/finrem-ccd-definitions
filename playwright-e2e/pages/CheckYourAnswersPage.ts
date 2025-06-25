import {expect, Locator, Page} from "@playwright/test";
import {Table, TableRowItem} from "./components/table.ts";

export class CheckYourAnswersPage {
    private readonly page: Page;
    private readonly checkYourAnswersTitle: Locator;
    private readonly checkYourAnswersTable: Locator;

    public constructor(page: Page) {
        this.page = page;
        this.checkYourAnswersTitle = page.getByRole('heading', { name: 'Check your answers' });
        this.checkYourAnswersTable = page.locator("table[aria-describedby='check your answers table']");
    }

    /**
     * Validates that the "Check Your Answers" page displays the expected table data.
     *
     * This method waits for the page and table to be visible, then compares the actual
     * table rows against the provided expected data. The expected data can include:
     * - Strings: to match any cell in a row.
     * - Objects with `cellItem` and `value` properties: to match both columns in a row.
     * - Objects with `rowType: 'label-value-adjacent'`: to match a label row immediately followed by a value row.
     * All cell values are normalized by trimming whitespace and removing newlines/tabs before comparison.
     *
     * @param table The expected table data, structured as an array of rows (strings or objects).
     * @throws Error If any expected row is not found in the actual table.
     */
    async assertCheckYourAnswersPage(table: Table) {
        await this.page.waitForLoadState('load');
        await this.checkYourAnswersTitle.waitFor({ state: 'visible' });

        await expect(this.checkYourAnswersTitle).toBeVisible();
        await expect(this.checkYourAnswersTable).toBeVisible();

        // Helper to normalize cell values
        const normalize = (val: string) => val.replace(/[\n\t]/g, '').trim();

        // Get all rows from the main table, including those in nested tables
        const allRows = await this.checkYourAnswersTable.locator('tr').all();

        // Build an array of [cell1, cell2] for each visible row, normalized
        const actualRows: string[][] = [];
        for (const row of allRows) {
            if (!await row.isVisible()) continue;
            const cells = await row.locator('th, td').allTextContents();
            actualRows.push(cells.map(cell => normalize(cell)));
        }
        // Collect all assertion failures
        const errors: string[] = [];

        // Validate each expected row
        for (const expected of table.rows) {
            if (typeof expected === 'string') {
                // For string rows, check if any cell in col1 or col2 matches exactly
                const expectedNorm = normalize(expected);
                const found = actualRows
                    .some(([cellItem, cellValue]) => cellItem === expectedNorm || cellValue === expectedNorm);
                if (!found) {
                    errors.push(`Row with value "${expected}" not found in any column`);
                }
            } else if (expected.rowType === 'label-value-adjacent') {
                let found = false;
                for (let i = 0; i < actualRows.length - 1; i++) {
                    const labelRow = actualRows[i];
                    const valueRow = actualRows[i + 1];
                    if (
                        labelRow.includes(normalize(expected.cellItem)) &&
                        valueRow.includes(normalize(expected.value as string))
                    ) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    errors.push(`Adjacent rows with label "${expected.cellItem}" and value "${expected.value}" not found`);
                }
            } else {
                // For object rows, check col1 and col2 match
                const cellItemNorm = normalize(expected.cellItem);
                const valueNorm = normalize(expected.value);
                const found = actualRows.some(
                    ([cellItem, cellValue]) => cellItem === cellItemNorm && cellValue === valueNorm
                );
                if (!found) {
                    errors.push(`Row with "${expected.cellItem}" and "${expected.value}" not found`);
                }
            }
        }

        if (errors.length > 0) {
            throw new Error('Check your answers table validation failed:\n' + errors.join('\n'));
        }
    }
}
