import { type Page, expect, Locator } from '@playwright/test';
import { BaseJourneyPage } from '../../BaseJourneyPage';
import { YesNoRadioEnum } from "../../helpers/enums/RadioEnums";

export class UpdateContactDetailsPage extends BaseJourneyPage {

    private readonly updateIncludesRepresentativeChangeRadio: Locator;
    private readonly applicantInRefugeAnswer: Locator;
    private readonly applicantInRefugeRadio: Locator;
    private readonly respondentInRefugeAnswer: Locator;
    private readonly respondentInRefugeRadio: Locator;

    public constructor(page: Page) {
        super(page);
        this.updateIncludesRepresentativeChangeRadio = page.locator('#updateIncludesRepresentativeChange_radio');
        this.applicantInRefugeAnswer = page.getByRole('row', { name: 'Is the Applicant currently a resident in a refuge?' }).locator('span').nth(1);
        this.applicantInRefugeRadio = page.locator('#applicantInRefugeQuestion_radio');

        this.respondentInRefugeAnswer = page.getByRole('row', { name: 'Is the Respondent currently a resident in a refuge?' }).locator('span').nth(1);
        this.respondentInRefugeRadio = page.locator('#respondentInRefugeQuestion_radio');
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
}
