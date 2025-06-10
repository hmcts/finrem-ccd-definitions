import { type Page, expect, Locator } from '@playwright/test';
import { BaseJourneyPage } from "../../BaseJourneyPage";
import { CommonActionsHelper } from '../../helpers/CommonActionsHelper';
import { YesNoRadioEnum } from "../../helpers/enums/RadioEnums";

export class ListForInterimHearingPage extends BaseJourneyPage {
    private readonly courtRegion: string = 'Midlands'
    private readonly courtFrc: string = 'Nottingham'
    private readonly commonActionsHelper: CommonActionsHelper;
    
    /**
     * Constructor for ListForInterimHearingPage
     * Differs from other pages as locators are initiased in each method.
     * This is because the locators are dynamic and change based on the number of interim hearings added.
     * @param {Page} page - The Playwright page object
     * @param {CommonActionsHelper} commonActionsHelper - Common actions helper instance
     */
    public constructor(page: Page, commonActionsHelper: CommonActionsHelper) {
        super(page);
        this.commonActionsHelper = commonActionsHelper;
    }

    async selectTypeOfHearing(hearing_position: number, typeOfHearing: string) {
        const typeOfHearingLocator = this.page.locator(`#interimHearingsScreenField_${hearing_position}_interimHearingType`);
        expect(typeOfHearingLocator).toBeVisible();
        await typeOfHearingLocator.selectOption({ label: typeOfHearing });
    }

    async enterTimeEstimate(hearing_position: number, duration: string) {
        const hearingTimeEstimate = this.page.locator(`#interimHearingsScreenField_${hearing_position}_interimHearingTimeEstimate`);
        expect(hearingTimeEstimate).toBeVisible();
        await hearingTimeEstimate.fill(duration);
    }

    async enterHearingDate(hearing_position: number, day: string, month: string, year: string) {
        const hearingDateDay = this.page.locator(`#interimHearingDate-day`).nth(hearing_position);
        const hearingDateMonth = this.page.locator(`#interimHearingDate-month`).nth(hearing_position);
        const hearingDateYear = this.page.locator(`#interimHearingDate-year`).nth(hearing_position);

        expect(hearingDateDay).toBeVisible();
        expect(hearingDateMonth).toBeVisible();
        expect(hearingDateYear).toBeVisible();

        await hearingDateDay.fill(day);
        await hearingDateMonth.fill(month);
        await hearingDateYear.fill(year);
    }

    async enterHearingTime(hearing_position: number, time: string) {
        const hearingTime = this.page.locator(`#interimHearingsScreenField_${hearing_position}_interimHearingTime`);
        expect(hearingTime).toBeVisible();
        await hearingTime.fill(time);
    }

    async selectCourtForHearing(hearing_position: number, localCourt: string) {
        const regionListDropDown = this.page.locator(`#interimHearingsScreenField_${hearing_position}_interim_regionList`);
        await expect(regionListDropDown).toBeVisible();
        await regionListDropDown.selectOption(this.courtRegion);

        const frcDropDown = this.page.locator(`#interimHearingsScreenField_${hearing_position}_interim_${this.courtRegion.toLowerCase()}FRCList`);
        await expect(frcDropDown).toBeVisible();
        await frcDropDown.selectOption(`${this.courtFrc} FRC`);

        const courtListDropDown = this.page.locator(`#interimHearingsScreenField_${hearing_position}_interim_${this.courtFrc.toLowerCase()}CourtList`);
        await expect(courtListDropDown).toBeVisible();
        await courtListDropDown.selectOption(localCourt);
    }

    async enterAdditionalInformationAboutHearing(hearing_position: number, information: string) {
        const additionalInformation = this.page.locator(`#interimHearingsScreenField_${hearing_position}_interimAdditionalInformationAboutHearing`);
        expect(additionalInformation).toBeVisible();
        await additionalInformation.fill(information);
    }

    async whetherToUploadOtherDocuments(hearing_position: number, yesOrNo: YesNoRadioEnum) {
        const uploadOtherDocumentsQuestion = this.page.locator(`#interimHearingsScreenField_${hearing_position}_interimPromptForAnyDocument`);
        expect(uploadOtherDocumentsQuestion).toBeVisible();
        const optionToSelect = uploadOtherDocumentsQuestion.getByLabel(yesOrNo);
        await optionToSelect.check();
    }

    async uploadOtherDocuments(hearing_position: number, docFilename: string) {
        const uploadOtherDocumentFiles = this.page.locator(`#interimHearingsScreenField_${hearing_position}_interimUploadAdditionalDocument`);
        await expect(uploadOtherDocumentFiles).toBeVisible();
        const filePayload = await this.commonActionsHelper.createAliasPDFPayload('./playwright-e2e/data/test.pdf', docFilename);
        await uploadOtherDocumentFiles.setInputFiles(filePayload);
        await this.commonActionsHelper.waitForAllUploadsToBeCompleted(this.page);
    }
}
