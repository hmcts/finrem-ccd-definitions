import { Page } from 'playwright';
import { BaseJourneyPage } from '../../BaseJourneyPage';

export class OrderSummaryPage extends BaseJourneyPage {
    public constructor(page: Page) {
        super(page);
    }
}
