import { Locator, Page } from '@playwright/test';
import { BaseJourneyPage } from '../../BaseJourneyPage';

export class CreateFlagPage extends BaseJourneyPage {

    private readonly caseSelector: Locator;
    private readonly applicantSelector: Locator;
    private readonly respondentSelector: Locator;


    public constructor(page: Page) {
        super(page);
        this.caseSelector = page.locator('#flag-location-0');
        this.applicantSelector = page.locator('#flag-location-1');
        this.respondentSelector = page.locator('#flag-location-2');
    }

    async selectCaseForFlag(){
        await this.caseSelector.check();
    }
    async selectApplicantForFlag(){
        await this.applicantSelector.check();
    }
    async selectRespondentForFlag(){
        await this.respondentSelector.check();
    }

}