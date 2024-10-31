import { type Page, Locator } from '@playwright/test';
import { BaseJourneyPage } from '../BaseJourneyPage';
import { CommonActionsHelper } from '../helpers/CommonActionsHelper';

export class ApplicantDetailsPage extends BaseJourneyPage {
    
    private readonly applicantDetailsPrivateRadio: Locator;

    private commonActionsHelper: CommonActionsHelper

    public constructor(page: Page, commonActionsHelper: CommonActionsHelper) {
        super(page);
        this.commonActionsHelper = commonActionsHelper;

        this.applicantDetailsPrivateRadio = page.getByRole('group', { name: 'Keep the Applicant\'s contact' });
    }

    private async selectApplicantDetailsPrivate(keepPrivate: boolean) {
        const radioOption = keepPrivate ? 'Yes' : 'No'; 
        const optionToSelect = this.applicantDetailsPrivateRadio.getByLabel(radioOption)
        await optionToSelect.check();
    }

    async enterApplicantDetailsContested(firstName: string, lastName: string, keepPrivate: boolean){
        await this.commonActionsHelper.enterNames(this.page, firstName, lastName);
        await this.selectApplicantDetailsPrivate(keepPrivate); 
        await this.commonActionsHelper.enterUkAddress(this.page);
    }

    async enterApplicantDetailsConsented(firstName: string, lastName: string){
        await this.commonActionsHelper.enterNames(this.page, firstName, lastName); 
    }
}
