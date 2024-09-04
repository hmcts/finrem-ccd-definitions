import { type Page, Locator } from '@playwright/test';

export class WrittenAgreementPage {
    readonly page: Page;

    readonly writtenAgreementRadio: Locator;
    readonly writtenAgreementStepChildCheckbox: Locator;
    readonly writtenAgreementChildSupportAgencyCheckbox: Locator;
    readonly writtenAgreementChildDisabilityCheckbox: Locator 
    readonly writtenAgreementChildEducationCheckbox: Locator;
    readonly writtenAgreementNonUkResidentCheckBox: Locator;


    public constructor(page: Page) {
        this.page = page

        this.writtenAgreementRadio = page.locator('#benefitForChildrenDecision_radio')
        this.writtenAgreementStepChildCheckbox = page.getByRole('checkbox', { name: 'For a stepchild or step children'});
        this.writtenAgreementChildSupportAgencyCheckbox = page.getByRole('checkbox', { name: 'In addition to child support or maintenance already paid under a Child Support Agency assessment'});
        this.writtenAgreementChildDisabilityCheckbox = page.getByRole('checkbox', { name: 'To meet expenses arising from a child’s disability'}) 
        this.writtenAgreementChildEducationCheckbox = page.getByRole('checkbox', { name: 'To meet expenses incurred by a child in relation to being educated or training for work'});
        this.writtenAgreementNonUkResidentCheckBox = page.getByRole('checkbox', { name: 'When either the child or the person with care of the child or the absent parent of the child is not habitually resident in the United Kingdom'});
    }

    async selectWrittenAgreement(hasWrittenAgreement: boolean) {
        const radioOption = hasWrittenAgreement ? 'Yes' : 'No'; 
        const optionToSelect = this.writtenAgreementRadio.getByLabel(radioOption);
        await optionToSelect.check();
        if (!hasWrittenAgreement) {
            await this.writtenAgreementStepChildCheckbox.check();
            await this.writtenAgreementChildSupportAgencyCheckbox.check();
            await this.writtenAgreementChildDisabilityCheckbox.check();
            await this.writtenAgreementChildEducationCheckbox.check(); 
            await this.writtenAgreementNonUkResidentCheckBox.check();
        }
    }
}