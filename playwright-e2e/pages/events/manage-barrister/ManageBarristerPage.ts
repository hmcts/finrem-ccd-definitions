import { type Page, expect, Locator } from '@playwright/test';
import { BaseJourneyPage } from "../../BaseJourneyPage";
import { CommonActionsHelper } from '../../helpers/CommonActionsHelper';
import { YesNoRadioEnum } from "../../helpers/enums/RadioEnums";

export class ManageBarristerPage extends BaseJourneyPage {

    private readonly updatePartyBarristerChangeRadio: Locator;
    private readonly applicantRadio: Locator;
    private readonly respondentRadio: Locator;

    public constructor(page: Page) {
        super(page);
        this.updatePartyBarristerChangeRadio = page.locator('#updateIncludesRepresentativeChange_radio');

        this.applicantRadio = page.getByRole('radio', { name: 'Applicant' });
        this.respondentRadio = page.getByLabel('Respondent');
    }

    async selectPartyBarristerChange(isSelectPartyBarristerChange: Boolean){
        const radioOption = isSelectPartyBarristerChange ? 'Yes' : 'No'; 
        const optionToSelect = this.updatePartyBarristerChangeRadio.getByLabel(radioOption);
        await optionToSelect.check();
    }

    async checkApplicantRepresented(isConfidential: boolean) {
        await (isConfidential ? this.applicantRadio : this.respondentRadio).check(); 
    }

    async checkRespondentRepresented(isConfidential: boolean) {
        await (isConfidential ? this.applicantRadio : this.respondentRadio).check(); 
    }
}