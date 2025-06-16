import { type Page, expect, Locator } from '@playwright/test';
import { BaseJourneyPage } from '../../BaseJourneyPage';
import { YesNoRadioEnum } from "../../helpers/enums/RadioEnums";

export class UpdateContactDetailsPage extends BaseJourneyPage {

    private readonly updateIncludesRepresentativeChangeRadio: Locator;
    private readonly applicantInRefugeAnswer: Locator;
    private readonly applicantInRefugeRadio: Locator;
    private readonly respondentInRefugeAnswer: Locator;
    private readonly respondentInRefugeRadio: Locator;
    private readonly applicantRadio: Locator;
    private readonly respondentRadio: Locator;
    private readonly checkSolicitorNameLabel: Locator;
    private readonly solicitorNameDetails: Locator;
    private readonly applicantFirstNameDetails: Locator;
    private readonly checkApplicantFirstNameLabel: Locator;

    public constructor(page: Page) {
        super(page);
        this.updateIncludesRepresentativeChangeRadio = page.locator('#updateIncludesRepresentativeChange_radio');
        this.applicantInRefugeAnswer = page.getByRole('row', { name: 'Is the Applicant currently a resident in a refuge?' }).locator('span').nth(1);
        this.applicantInRefugeRadio = page.locator('#applicantInRefugeQuestion_radio');

        this.respondentInRefugeAnswer = page.getByRole('row', { name: 'Is the Respondent currently a resident in a refuge?' }).locator('span').nth(1);
        this.respondentInRefugeRadio = page.locator('#respondentInRefugeQuestion_radio');

        this.applicantRadio = page.getByRole('radio', { name: 'Applicant' });
        this.respondentRadio = page.getByLabel('Respondent');
        this.checkSolicitorNameLabel = page.getByText('Solicitor’s name');
        this.solicitorNameDetails = page.locator('#solicitorName');
        this.checkApplicantFirstNameLabel = page.getByText('Current First and Middle names');
        this.applicantFirstNameDetails = page.locator('#applicantFMName');
    }

    async selectUpdateIncludesRepresentativeChange(isUpdateIncludesRepresentativeChange: Boolean){
        const radioOption = isUpdateIncludesRepresentativeChange ? 'Yes' : 'No'; 
        const optionToSelect = this.updateIncludesRepresentativeChangeRadio.getByLabel(radioOption);
        await optionToSelect.check();
    }

    async checkApplicantInRefugeQuestion(answer: YesNoRadioEnum) {
        await expect(this.applicantInRefugeAnswer).toHaveText(answer);
    }

    async selectApplicantInRefuge(applicantInRefugeRadio: Boolean){
        const radioOption = applicantInRefugeRadio ? 'Yes' : 'No'; 
        const optionToSelect = this.applicantInRefugeRadio.getByLabel(radioOption);
        await optionToSelect.check();
    }

    async checkRespondentInRefugeQuestion(answer: YesNoRadioEnum) {
        await expect(this.respondentInRefugeAnswer).toHaveText(answer);
    }

    async selectRespondentInRefuge(respondentInRefugeRadio: Boolean){
        const radioOption = respondentInRefugeRadio ? 'Yes' : 'No'; 
        const optionToSelect = this.respondentInRefugeRadio.getByLabel(radioOption);
        await optionToSelect.check();
    }
    async checkApplicantRepresented(isConfidential: boolean) {
    await (isConfidential ? this.applicantRadio : this.respondentRadio).check(); 
  }
    async specifySolicitorName(text: string) {
    await expect(this.checkSolicitorNameLabel).toBeVisible();
    await this.solicitorNameDetails.fill(text);
  }
    async specifyApplicantFirstName(text: string) {
    await expect(this.checkApplicantFirstNameLabel).toBeVisible();
    await this.applicantFirstNameDetails.fill(text);
  }
}
