import { type Page, expect, Locator } from '@playwright/test';
import { BaseJourneyPage } from "../../BaseJourneyPage";
import { CommonActionsHelper } from '../../helpers/CommonActionsHelper';
import { YesNoRadioEnum } from "../../helpers/enums/RadioEnums.ts";

export class UploadApprovedOrderPage extends BaseJourneyPage {
    static selectHearing(arg0: boolean) {
        throw new Error('Method not implemented.');
    }

    private readonly firstUploadApprovedOrderField: Locator;
    private readonly firstUploadApprovedOrderFieldErrorMessageLocator: Locator;
    private readonly commonActionsHelper: CommonActionsHelper;
    private readonly uploadApprovedOrderGroup: Locator;
    private readonly judgeDropDown: Locator;
    private readonly nameOfJudgeField: Locator;
    private readonly courtDayDetails: Locator;
    private readonly courtMonthDetails: Locator;
    private readonly courtYearDetails: Locator;
    private readonly additionalHearingDetailsGroup: Locator;
    
    private readonly firstFinalOrderField: Locator;
    private readonly firstIsAnotherHearingField: Locator;
    private readonly firstTimeEstimateField: Locator;
    private readonly firstHearingTimeField: Locator;
    private readonly firstHearingDateFieldDay: Locator;
    private readonly firstHearingDateFieldMonth: Locator;
    private readonly firstHearingDateFieldYear: Locator;
    private readonly firstHearingCourtZoneDropDown: Locator;
    private readonly firstHearingTypeDropDown: Locator;

    private static readonly DOCUMENT_FORMAT_ERROR_MESSAGE = "Document format is not supported";
    
    public constructor(page: Page, commonActionsHelper: CommonActionsHelper) {
        super(page);
        this.commonActionsHelper = commonActionsHelper;
        this.firstUploadApprovedOrderField = page.locator('#uploadHearingOrder_0_uploadDraftDocument');
        this.firstUploadApprovedOrderFieldErrorMessageLocator = page.locator('label:has-text("Upload Approved Order")').locator(`xpath=following-sibling::*[contains(text(), "${UploadApprovedOrderPage.DOCUMENT_FORMAT_ERROR_MESSAGE}")]`);      

        this.uploadApprovedOrderGroup = page.locator(`div[id$='uploadHearingOrder']`);
        this.judgeDropDown = page.getByLabel('Select Judge');
        this.nameOfJudgeField = page.getByLabel('Name of Judge');

        this.courtDayDetails = page.locator('#orderApprovedDate-day');
        this.courtMonthDetails = page.locator('#orderApprovedDate-month');
        this.courtYearDetails = page.locator('#orderApprovedDate-year');

        this.additionalHearingDetailsGroup = page.locator(`div[id$='hearingDirectionDetailsCollection']`);
        this.firstFinalOrderField = page.locator('#hearingDirectionDetailsCollection_0_isThisFinalYN');
        this.firstIsAnotherHearingField = page.locator('#hearingDirectionDetailsCollection_0_isAnotherHearingYN');
        this.firstTimeEstimateField = page.locator('#hearingDirectionDetailsCollection_0_timeEstimate');
        this.firstHearingTimeField = page.locator('#hearingDirectionDetailsCollection_0_hearingTime');
        this.firstHearingDateFieldDay = page.locator('#dateOfHearing-day');
        this.firstHearingDateFieldMonth = page.locator('#dateOfHearing-month');
        this.firstHearingDateFieldYear = page.locator('#dateOfHearing-year');
        this.firstHearingCourtZoneDropDown = page.locator('#hearingDirectionDetailsCollection_0_localCourt_region');
        this.firstHearingTypeDropDown = page.locator('#hearingDirectionDetailsCollection_0_typeOfHearing');
    }

    private async uploadFile(locator: Locator, errorLocator: Locator, uploadFilePath: string, success: boolean): Promise<void> {
        const addNewButton = this.uploadApprovedOrderGroup.getByRole('button', { name: 'Add new' });
        await addNewButton.click();

        await this.commonActionsHelper.uploadWithRateLimitRetry(this.page, locator, uploadFilePath, 5, 5000);
        if (success) {
            await expect(errorLocator).toBeHidden();
        } else {
            await expect(errorLocator).toBeVisible();
        }
    }

    async uploadFirstUploadApprovedOrder(uploadFilePath: string = './playwright-e2e/resources/file/test.pdf', success: boolean = true): Promise<void> {
        await this.uploadFile(this.firstUploadApprovedOrderField, this.firstUploadApprovedOrderFieldErrorMessageLocator, uploadFilePath, success);
    }

    async selectJudge(judge: string) {
        await this.judgeDropDown.selectOption(judge); 
    }

    async addNewAdditionalHearingDetails() {
        const addNewButton = this.additionalHearingDetailsGroup.getByRole('button', { name: 'Add new' });
        await addNewButton.click();
    }

    async enterJudgeName(text: string) {
        await expect(this.nameOfJudgeField).toBeVisible();
        await this.nameOfJudgeField.fill(text);
    }

    async enterCourtOrderDate(day: string, month: string, year: string) {
        await this.courtDayDetails.fill(day);
        await this.courtMonthDetails.fill(month);
        await this.courtYearDetails.fill(year);
        await this.blurCourtOrderDateInput();
    }

    async selectFirstFinalOrder(yesOrNo: YesNoRadioEnum) {
        const optionsToSelect = this.firstFinalOrderField.getByLabel(yesOrNo);
        await optionsToSelect.check();
    }

    async selectFirstIsAnotherHearing(yesOrNo: YesNoRadioEnum) {
        const optionsToSelect = this.firstIsAnotherHearingField.getByLabel(yesOrNo);
        await optionsToSelect.check();
    }

    async enterFirstTimeEstimate(timeEstimate: string) {
        await this.firstTimeEstimateField.fill(timeEstimate);
    }

    async enterFirstHearingTime(hearingTime: string) {
        await this.firstHearingTimeField.fill(hearingTime);
    }

    async blurCourtOrderDateInput() {
        await this.courtDayDetails.blur();
        await this.courtMonthDetails.blur();
        await this.courtYearDetails.blur();
    }

    async enterHearingDate(day: string, month: string, year: string) {
        await this.firstHearingDateFieldDay.fill(day);
        await this.firstHearingDateFieldMonth.fill(month);
        await this.firstHearingDateFieldYear.fill(year);
    }

    private readonly courtRegion: string = 'Midlands'
    private readonly courtFrc: string = 'Birmingham'

    async selectCourtZoneDropDown(localCourt: string) {
        await this.firstHearingCourtZoneDropDown.selectOption(this.courtRegion);
        const frcDropDown = this.page.locator(`#hearingDirectionDetailsCollection_0_localCourt_${this.courtRegion.toLowerCase()}List`);
        await expect(frcDropDown).toBeVisible();
        await frcDropDown.selectOption(`${this.courtFrc} FRC`);
        const courtListDropDown = this.page.locator(`#hearingDirectionDetailsCollection_0_localCourt_${this.courtFrc.toLowerCase()}CourtList`);
        await expect(courtListDropDown).toBeVisible();
        await courtListDropDown.selectOption(localCourt);
    }

    async selectFirstHearingType(hearingType: string) {
        await this.firstHearingTypeDropDown.selectOption(hearingType);
    }
}
