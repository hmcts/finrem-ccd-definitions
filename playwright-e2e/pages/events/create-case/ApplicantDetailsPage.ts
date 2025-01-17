import { type Page, Locator } from '@playwright/test';
import { BaseJourneyPage } from '../../BaseJourneyPage';
import { CommonActionsHelper } from '../../helpers/CommonActionsHelper';
import { RadioEnum } from '../../helpers/enums/RadioEnum';

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

    // When Refuge is neither YES or NO, then checkbox remains blank as question optional.
    // Assign required Refuge values to constants (they resolve as undefined when accessed directly)
    private async selectApplicantInRefuge(applicantInRefuge: RadioEnum) {
        await this.applicantInRefugeRadio.getByLabel(applicantInRefuge).check();
    }

    async enterApplicantDetailsContested(firstName: string, lastName: string, keepPrivate: boolean, applicantInRefuge: RadioEnum){
        await this.commonActionsHelper.enterNames(this.page, firstName, lastName);
        await this.selectApplicantDetailsPrivate(keepPrivate);
        await this.selectApplicantInRefuge(applicantInRefuge);
        await this.commonActionsHelper.enterUkAddress(this.page);
    }

    async enterApplicantDetailsConsented(firstName: string, lastName: string){
        await this.commonActionsHelper.enterNames(this.page, firstName, lastName);
    }
}
