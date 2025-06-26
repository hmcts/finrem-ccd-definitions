import { type Page, expect, Locator } from '@playwright/test';
import { BaseJourneyPage } from "../../BaseJourneyPage";
import { YesNoRadioEnum } from "../../helpers/enums/RadioEnums";

export class ManageBarristerPage extends BaseJourneyPage {

    private readonly updatePartyBarristerChangeRadio: Locator;
    private readonly applicantRadio: Locator;
    private readonly respondentRadio: Locator;
    private readonly manageBarristerAddNewButton: Locator;
    private readonly checkBarristerFirstNameLabel: Locator;
    private readonly barristerFirstNameDetails: Locator;
    private readonly checkBarristerEmailLabel: Locator;
    private readonly barristerEmailDetails: Locator;
    private readonly checkBarristerOrganisationLabel: Locator;
    private readonly barristerOrganisationDetails: Locator;

    public constructor(page: Page) {
        super(page);
        this.updatePartyBarristerChangeRadio = page.locator('#updateIncludesRepresentativeChange_radio');

        this.applicantRadio = page.getByRole('radio', { name: 'Applicant' });
        this.respondentRadio = page.getByLabel('Respondent');
        this.manageBarristerAddNewButton = page.locator('button.button.write-collection-add-item__top');

        this.checkBarristerFirstNameLabel = page.getByText('Full name');
        this.barristerFirstNameDetails = page.locator('#appBarristerCollection_0_name');
        this.checkBarristerEmailLabel = page.getByText('Email');
        this.barristerEmailDetails = page.locator('#appBarristerCollection_0_email');
        this.checkBarristerOrganisationLabel = page.getByText('Search for an organisation');
        this.barristerOrganisationDetails = page.locator('#search-org-text');

        
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

    async clickAddNew(): Promise<void> {
       await this.manageBarristerAddNewButton.click();
    }

    async specifyBarristerFirstName(text: string) {
        await expect(this.checkBarristerFirstNameLabel).toBeVisible();
        await this.barristerFirstNameDetails.fill(text);
    }

    async specifyBarristerEmail(text: string) {
        await expect(this.checkBarristerEmailLabel).toBeVisible();
        await this.barristerEmailDetails.fill(text);
    }

    async specifyBarristerOrganisation(text: string) {
        await expect(this.checkBarristerOrganisationLabel).toBeVisible();
        await this.barristerOrganisationDetails.fill(text);
    }
}