import { BaseJourneyPage } from '../../BaseJourneyPage';
import {expect, Locator, Page} from "@playwright/test";

export class OrderSummaryPage extends BaseJourneyPage {
    private readonly orderSummaryTitle: Locator;
    private readonly orderSummaryTable: Locator;
    private readonly paymentMethodLabel: Locator;
    private readonly feeReferenceLabel: Locator;
    private readonly feeAccountNumberLabel: Locator;

    public constructor(page: Page) {
        super(page);
        this.orderSummaryTitle = page.getByText('Order summary' );
        this.orderSummaryTable = page.locator(`table[aria-describedby='order summary table']`);
        this.paymentMethodLabel = page.locator('#paymentMethodPBA');
        this.feeReferenceLabel = page.locator('#solicitorReferenceLabel');
        this.feeAccountNumberLabel = page.locator('#pbaFeeAccountNumber');
    }

    async assertOrderSummaryPage() {
        await this.page.waitForLoadState('load');
        await expect(this.orderSummaryTitle).toBeVisible();
        await expect(this.orderSummaryTable).toBeVisible();
    }

    async assertPaymentDetails(paymentMethod: string, feeAccountNumber: string, feeReference: string) {
        await expect(this.paymentMethodLabel).toHaveText(`Payment Method: ${paymentMethod}`);
        await expect(this.feeReferenceLabel).toHaveText(`Your fee reference: ${feeReference}`);
        await expect(this.feeAccountNumberLabel).toHaveText(`Fee account number: ${feeAccountNumber}`);
    }

    async assertOrderSummaryTable(rows: string[][] = [
        ['FEE0229', 'Application for a financial order', '£313.00'],
        ['', 'Total', '£313.00']
    ]) {
        await expect(this.orderSummaryTable).toBeVisible();
        const tableHeaders = ['Code', 'Description', 'Amount'];
        for (const header of tableHeaders) {
            await expect(this.orderSummaryTable.getByRole('cell', { name: header })).toBeVisible();
        }

        const tableRows = this.orderSummaryTable.locator('tbody tr');
        const rowCount = await tableRows.count();
        for (let i = 0; i < rowCount; i++) {
            const row = tableRows.nth(i);
            const cells = await row.locator('td').allTextContents();
            const expectedRow = rows[i];
            for (let j = 0; j < expectedRow.length; j++) {
                expect(cells[j]).toBe(expectedRow[j]);
            }
        }

    }
}
