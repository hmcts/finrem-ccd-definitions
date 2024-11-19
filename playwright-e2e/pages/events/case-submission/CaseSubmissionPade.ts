import { Locator, Page } from '@playwright/test';
import { BaseJourneyPage } from '../../BaseJourneyPage';

export class CaseSubmissionPage extends BaseJourneyPage {

    private readonly closeAndReturnButton: Locator; 

    public constructor(page: Page) {
        super(page);
    
        this.closeAndReturnButton = page.getByRole('button', { name: 'Close and Return to case' })
    }

    async returnToCaseDetails() {
        await this.closeAndReturnButton.click()
    }
}
