import {expect, Locator, Page} from "@playwright/test";
import {Table, TableRowItem} from "../components/table.ts";


export class CheckYourAnswersPage {
    private readonly page: Page;
    private readonly checkYourAnswersTitle: Locator;
    private readonly checkYourAnswersTable: Locator;

    public constructor(page: Page) {
        this.page = page;
        this.checkYourAnswersTitle = page.getByRole('heading', { name: 'Check your answers' });
        this.checkYourAnswersTable = page.locator("table[aria-describedby='check your answers table']");
    }

    async assertCheckYourAnswersPage(table: Table) {
        await this.page.waitForLoadState('load');
        await expect(this.checkYourAnswersTitle).toBeVisible();
        await expect(this.checkYourAnswersTable).toBeVisible();

        // Helper to normalize cell values
        const normalize = (val: string) => val.replace(/[\n\t]/g, '').trim();

        // Get all rows from the main table, including those in nested tables
        const allRows = await this.checkYourAnswersTable.locator('tr').all();

        // Build an array of [cell1, cell2] for each visible row, normalized
        const actualRows: [string, string][] = [];
        for (const row of allRows) {
            if(!await row.isVisible()) {
                continue; // Skip rows that are not visible
            }
            const cells = await row.locator('th, td').allTextContents();
            if (cells.length >= 2) {
                actualRows.push([normalize(cells[0]), normalize(cells[1])]);
            }
        }

        // Collect all assertion failures
        const errors: string[] = [];

        // Validate each expected row
        for (const expected of table.rows) {
            if (typeof expected === 'string') {
                // For string rows, check if any cell in col1 or col2 matches exactly
                const expectedNorm = normalize(expected);
                const found = actualRows.some(([col1, col2]) => col1 === expectedNorm || col2 === expectedNorm);
                if (!found) {
                    errors.push(`Row with value "${expected}" not found in any column`);
                }
            } else {
                // For object rows, check col1 and col2 match
                const cellItemNorm = normalize(expected.cellItem);
                const valueNorm = normalize(expected.value);
                const found = actualRows.some(
                    ([col1, col2]) => col1 === cellItemNorm && col2 === valueNorm
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