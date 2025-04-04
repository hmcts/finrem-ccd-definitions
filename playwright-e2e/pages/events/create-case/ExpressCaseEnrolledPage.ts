import { type Page } from '@playwright/test';
import { BaseJourneyPage } from '../../BaseJourneyPage';
import { ExpressHelper } from '../../helpers/ExpressHelper';

export class ExpressCaseEnrolledPage extends BaseJourneyPage {

    public constructor(page: Page) {
        super(page);
    }

    async checkLinkResolves() {
        const helper = new ExpressHelper(this.page);
        await helper.checkLinkResolves();
    }

}
