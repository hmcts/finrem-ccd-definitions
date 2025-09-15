import { type Page, expect, Locator } from '@playwright/test';
import { GeneralApplicationDirectionsPage } from '../general-application-directions/GeneralApplicationDirectionsPage';
import { YesNoRadioEnum } from "../../helpers/enums/RadioEnums";
import { CommonActionsHelper } from '../../helpers/CommonActionsHelper';
import { GeneralApplicationDirectionsMHPage } from '../general-application-directions/GeneralApplicationDirectionsMHPage';

export class UploadApprovedOrderMHPage extends GeneralApplicationDirectionsMHPage {

    private readonly IsThisFinalOrderQuestion: Locator;
    private readonly DoYouWantToAddHearingQuestion: Locator;
    private readonly courtDayDetails: Locator;
    private readonly courtMonthDetails: Locator;
    private readonly courtYearDetails: Locator;
    private readonly judgeDropDown: Locator;
    private readonly nameOfJudgeField: Locator;
    private readonly uploadApprovedOrderGroup: Locator;
    private readonly firstUploadApprovedOrderField: Locator;


    public constructor(page: Page, commonActionsHelper: CommonActionsHelper) {
        super(page, commonActionsHelper);

        this.IsThisFinalOrderQuestion = page.getByRole('group', { name: 'Is this the final order?' });
        this.DoYouWantToAddHearingQuestion = page.getByRole('group', { name: 'Do you want to add a hearing?' })
        this.uploadApprovedOrderGroup = page.locator(`div[id$='uploadHearingOrder']`);
        this.courtDayDetails = page.locator('#orderApprovedDate-day');
        this.courtMonthDetails = page.locator('#orderApprovedDate-month');
        this.courtYearDetails = page.locator('#orderApprovedDate-year');
        this.judgeDropDown = page.getByLabel('Select Judge');
        this.nameOfJudgeField = page.getByLabel('Name of Judge');
        this.firstUploadApprovedOrderField = page.locator('#uploadHearingOrder_0_uploadDraftDocument');
    }

    async uploadFirstUploadApprovedOrder(documentName: string) {
        const addNewButton = this.uploadApprovedOrderGroup.getByRole('button', { name: 'Add new' });
        await addNewButton.click();

        const filePayload = await this.commonActionsHelper.createAliasPDFPayload('./playwright-e2e/resources/file/test.pdf', documentName);
        await this.commonActionsHelper.uploadWithRateLimitRetry(this.page, this.firstUploadApprovedOrderField, filePayload);
    }

    async selectJudge(judge: string) {
        await this.judgeDropDown.selectOption(judge);
    }

    async enterJudgeName(text: string) {
        await expect(this.nameOfJudgeField).toBeVisible();
        await this.nameOfJudgeField.fill(text);
    }

    async enterCourtOrderDate(day: string, month: string, year: string) {
        await this.courtDayDetails.fill(day);
        await this.courtMonthDetails.fill(month);
        await this.courtYearDetails.fill(year);
        //await this.blurCourtOrderDateInput();
    }


    async selectIsThisFinalOrder(answer: YesNoRadioEnum): Promise<void> {
        expect(this.IsThisFinalOrderQuestion).toBeVisible();
        await this.IsThisFinalOrderQuestion.getByLabel(answer).click();
    }

    async selectDoYouWantToAddHearing(answer: YesNoRadioEnum): Promise<void> {
        expect(this.DoYouWantToAddHearingQuestion).toBeVisible();
        await this.DoYouWantToAddHearingQuestion.getByLabel(answer).click();
    }
}
