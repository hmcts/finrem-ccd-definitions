import { Locator, Page } from "@playwright/test";
import { BaseJourneyPage } from "../../BaseJourneyPage";

export class UnprocessedApprovedOrdersPage extends BaseJourneyPage {
    private readonly unprocessedApprovedDocuments: Locator;

    public constructor(page: Page) {
        super(page);
        this.unprocessedApprovedDocuments = page.locator('#unprocessedApprovedDocuments');
    }

    async checkOrderIsInUnprocessedApprovedOrders(orderFileName: string) {
        const orderLocator = this.unprocessedApprovedDocuments.getByRole('link', { name: `${orderFileName}` });
        await orderLocator.waitFor({ state: 'visible' });
        return orderLocator;
    }
}
