import { Page, expect, Locator } from "playwright/test";
import { BaseJourneyPage } from "../../BaseJourneyPage";
import { RadioEnum } from "../../helpers/enums/RadioEnum";

export class CreateCaseCheckYourAnswersPage extends BaseJourneyPage{

    private readonly applicantInRefugeAnswer: Locator;

    public constructor(page: Page){
        super(page)
        this.applicantInRefugeAnswer = page.getByRole('row', { name: 'Is the Applicant currently a' }).locator('span').nth(1);
    }

    async checkApplicantInRefugeQuestion(answer: RadioEnum) {
        await expect(this.applicantInRefugeAnswer).toHaveText(answer);
    }
}
