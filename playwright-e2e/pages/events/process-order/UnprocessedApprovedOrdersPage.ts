import { Locator, Page } from "@playwright/test";
import { BaseJourneyPage } from "../../BaseJourneyPage";

export class UnprocessedApprovedOrdersPage extends BaseJourneyPage {
    private readonly unprocessedApprovedDocuments: Locator;

    public constructor(page: Page) {
        super(page);
        this.unprocessedApprovedDocuments = page.locator('#unprocessedApprovedDocuments');
    }

    async checkOrderIsInUnprocessedApprovedOrders(orderFileName: string) {
        const orderLocator = this.unprocessedApprovedDocuments.getByRole('button', { name: `${orderFileName}` });
        await orderLocator.waitFor({ state: 'visible' });
        return orderLocator;
    }

    async checkOrderIsInUnprocessedHearingOrders(orderFileName: string) {
        const orderLocator = this.page.getByRole('button', { name: `${orderFileName}` });
        await orderLocator.waitFor({ state: 'visible' });
        return orderLocator;
    }
}
