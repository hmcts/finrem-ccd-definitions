import { Page, expect, Locator } from "playwright/test";
import { BaseJourneyPage } from "../../BaseJourneyPage";
import { YesNoRadioEnum } from "../../helpers/enums/RadioEnums";

export class CreateCaseCheckYourAnswersPage extends BaseJourneyPage{

    private readonly applicantInRefugeAnswer: Locator;
    private readonly respondentInRefugeAnswer: Locator;
    private readonly netAssetsAnswer: Locator;

    public constructor(page: Page){
        super(page)
        this.applicantInRefugeAnswer = page.getByRole('row', { name: 'Is the Applicant currently a' }).locator('span').nth(1);
        this.respondentInRefugeAnswer = page.getByRole('row', { name: 'Is the Respondent currently a' }).locator('span').nth(1);
        this.netAssetsAnswer = page.getByRole('row', { name: 'Select one' }).locator('span').nth(1);
    }

    async checkApplicantInRefugeQuestion(answer: YesNoRadioEnum) {
        await expect(this.applicantInRefugeAnswer).toHaveText(answer);
    }

    async checkRespondentInRefugeQuestion(answer: YesNoRadioEnum) {
        await expect(this.respondentInRefugeAnswer).toHaveText(answer);
    }

    async checkNetAssetsQuestion(answer: string) {
        await expect(this.netAssetsAnswer).toHaveText(answer);
    }
}
