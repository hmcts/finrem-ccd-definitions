import { type Page, expect, Locator } from '@playwright/test';
import { YesNoRadioEnum } from "../../helpers/enums/RadioEnums";
import { CommonActionsHelper } from '../../helpers/CommonActionsHelper';
import {ManageHearingPage} from "../manage-hearings/ManageHearing.ts";

export class UploadApprovedOrderPage extends ManageHearingPage {

    private readonly IsThisFinalOrderQuestion: Locator;
    private readonly DoYouWantToAddHearingQuestion: Locator;
    private readonly courtDayDetails: Locator;
    private readonly courtMonthDetails: Locator;
    private readonly courtYearDetails: Locator;
    private readonly judgeDropDown: Locator;
    private readonly nameOfJudgeField: Locator;
    private readonly uploadApprovedOrderGroup: Locator;
    private readonly firstUploadApprovedOrderField: Locator;
    private readonly secondUploadApprovedOrderField: Locator;
    private readonly firstUploadApprovedOrderAdditionalAttachmentAddNewBtn: Locator;
    private readonly firstUploadApprovedOrderAdditionalAttachmentField: Locator;

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
        this.firstUploadApprovedOrderField = page.locator('#cwApprovedOrderCollection_0_uploadDraftDocument');
        this.secondUploadApprovedOrderField = page.locator('#cwApprovedOrderCollection_1_uploadDraftDocument');
        this.firstUploadApprovedOrderAdditionalAttachmentAddNewBtn = page.locator('#cwApprovedOrderCollection_0_additionalDocuments').getByRole('button', { name: 'Add new' })
        this.firstUploadApprovedOrderAdditionalAttachmentField = page.locator('#cwApprovedOrderCollection_0_additionalDocuments_value');
    }

    async uploadFirstUploadApprovedOrder(documentName: string) {
        const filePayload = await this.commonActionsHelper.createAliasPDFPayload('./playwright-e2e/resources/file/test.pdf', documentName);
        await this.commonActionsHelper.uploadWithRateLimitRetry(this.page, this.firstUploadApprovedOrderField, filePayload);
    }

    async uploadSecondUploadApprovedOrder(documentName: string) {
        const AddNewButton = this.page.getByRole('button', { name: 'Add new' }).nth(2)
        await AddNewButton.click();
        const filePayload = await this.commonActionsHelper.createAliasPDFPayload('./playwright-e2e/resources/file/test.pdf', documentName);
        await this.commonActionsHelper.uploadWithRateLimitRetry(this.page, this.secondUploadApprovedOrderField, filePayload);
    }

    async uploadAdditionalAttachment(documentName: string) {
        await this.firstUploadApprovedOrderAdditionalAttachmentAddNewBtn.click();
        const filePayload = await this.commonActionsHelper.createAliasPDFPayload('./playwright-e2e/resources/file/test.docx', documentName);
        await this.commonActionsHelper.uploadWithRateLimitRetry(this.page, this.firstUploadApprovedOrderAdditionalAttachmentField, filePayload);
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
