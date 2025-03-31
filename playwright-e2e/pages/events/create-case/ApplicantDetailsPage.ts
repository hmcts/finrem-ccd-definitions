import { type Page, Locator } from '@playwright/test';
import { BaseJourneyPage } from '../../BaseJourneyPage';
import { CommonActionsHelper } from '../../helpers/CommonActionsHelper';
import { YesNoRadioEnum } from '../../helpers/enums/RadioEnums';

export class ApplicantDetailsPage extends BaseJourneyPage {

    private readonly applicantDetailsPrivateRadio: Locator;
    private readonly applicantInRefugeRadio: Locator;

    private commonActionsHelper: CommonActionsHelper

    public constructor(page: Page, commonActionsHelper: CommonActionsHelper) {
        super(page);
        this.commonActionsHelper = commonActionsHelper;

        this.applicantDetailsPrivateRadio = page.getByRole('group', { name: 'Keep the Applicant\'s contact' });
        this.applicantInRefugeRadio = page.getByRole('group', { name: 'Is the Applicant currently a' });
    }

    private async selectApplicantDetailsPrivate(keepPrivate: boolean) {
        const radioOption = keepPrivate ? 'Yes' : 'No';
        const optionToSelect = this.applicantDetailsPrivateRadio.getByLabel(radioOption)
        await optionToSelect.check();
    }

    private async selectApplicantInRefuge(applicantInRefuge: YesNoRadioEnum) {
        await this.applicantInRefugeRadio.getByLabel(applicantInRefuge).check();
    }

    async enterApplicantDetailsContested(firstName: string, lastName: string, keepPrivate: boolean, applicantInRefuge: YesNoRadioEnum){
        await this.commonActionsHelper.enterNames(this.page, firstName, lastName);
        await this.selectApplicantDetailsPrivate(keepPrivate);
        await this.selectApplicantInRefuge(applicantInRefuge);
        await this.commonActionsHelper.enterUkAddress(this.page);
    }

    async enterApplicantDetailsConsented(firstName: string, lastName: string){
        await this.commonActionsHelper.enterNames(this.page, firstName, lastName);
    }
}
