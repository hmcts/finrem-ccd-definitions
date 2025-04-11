import { type Page, expect, Locator } from '@playwright/test';
import { BaseJourneyPage } from '../../BaseJourneyPage';
import { YesNoRadioEnum } from '../../helpers/enums/RadioEnums';

export class ChildWrittenAgreementPage extends BaseJourneyPage {

    private readonly writtenAgreementHeading: Locator;
    private readonly writtenAgreementRadio: Locator;
    private readonly writtenAgreementStepChildCheckbox: Locator;
    private readonly writtenAgreementChildSupportAgencyCheckbox: Locator;
    private readonly writtenAgreementChildDisabilityCheckbox: Locator
    private readonly writtenAgreementChildEducationCheckbox: Locator;
    private readonly writtenAgreementNonUkResidentCheckBox: Locator;



    public constructor(page: Page) {
        super(page);
        this.writtenAgreementHeading = page.getByRole('heading', { name: 'Has a written agreement been' })
        this.writtenAgreementRadio = page.locator('#benefitForChildrenDecision_radio')
        this.writtenAgreementStepChildCheckbox = page.getByRole('checkbox', { name: 'For a stepchild or step children' });
        this.writtenAgreementChildSupportAgencyCheckbox = page.getByRole('checkbox', { name: 'In addition to child support or maintenance already paid under a Child Support Agency assessment' });
        this.writtenAgreementChildDisabilityCheckbox = page.getByRole('checkbox', { name: 'To meet expenses arising from a child’s disability' })
        this.writtenAgreementChildEducationCheckbox = page.getByRole('checkbox', { name: 'To meet expenses incurred by a child in relation to being educated or training for work' });
        this.writtenAgreementNonUkResidentCheckBox = page.getByRole('checkbox', { name: 'When either the child or the person with care of the child or the absent parent of the child is not habitually resident in the United Kingdom' });
    }

    async selectWrittenAgreement(radioOption: YesNoRadioEnum) {
        await expect(this.writtenAgreementHeading).toBeVisible();
        const radioButton = this.page.locator(`input[type="radio"][name="benefitForChildrenDecisionSchedule"][id$="_${radioOption}"]`);
        await radioButton.scrollIntoViewIfNeeded();
        await radioButton.check();

        // Verify the selected value
        const isNoSelected = await radioButton.isChecked();
        if (radioOption === YesNoRadioEnum.NO && isNoSelected) {
            await this.writtenAgreementStepChildCheckbox.check();
            await this.writtenAgreementChildSupportAgencyCheckbox.check();
            await this.writtenAgreementChildDisabilityCheckbox.check();
            await this.writtenAgreementChildEducationCheckbox.check();
            await this.writtenAgreementNonUkResidentCheckBox.check();
        }
    }
}
