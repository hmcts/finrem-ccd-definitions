import { type Page, expect, Locator } from '@playwright/test';
import { BaseJourneyPage } from "../../BaseJourneyPage";
import { CommonActionsHelper } from '../../helpers/CommonActionsHelper';
import { YesNoRadioEnum } from "../../helpers/enums/RadioEnums";
import { PayloadHelper } from '../../../functional/helpers/PayloadHelper';

export class ListForInterimHearingPage extends BaseJourneyPage {
    private readonly courtRegion: string = 'Midlands'
    private readonly courtFrc: string = 'Nottingham'
    private readonly addNew: Locator;
    private readonly typeOfHearing: Locator;
    private readonly hearingTimeEstimate: Locator;
    private readonly hearingDateDay: Locator;
    private readonly hearingDateMonth: Locator;
    private readonly hearingDateYear: Locator;
    private readonly hearingTime: Locator;
    private readonly additionalInformation: Locator;
    private readonly uploadOtherDocumentFiles: Locator;
    private readonly uploadOtherDocumentsQuestion: Locator;
    private readonly regionListDropDown: Locator;
    private frcDropDown: Locator;
    private courtListDropDown: Locator
    private readonly commonActionsHelper: CommonActionsHelper;
    
    public constructor(page: Page, commonActionsHelper: CommonActionsHelper) {
        super(page);
        this.commonActionsHelper = commonActionsHelper;
        this.addNew = page.getByRole('button', { name: 'Add new' });
        this.typeOfHearing = page.locator('#interimHearingsScreenField_0_interimHearingType');
        this.hearingTimeEstimate = page.locator('#interimHearingsScreenField_0_interimHearingTimeEstimate');
        this.hearingDateDay = page.locator('#interimHearingDate-day').nth(0);
        this.hearingDateMonth = page.locator('#interimHearingDate-month').nth(0);
        this.hearingDateYear = page.locator('#interimHearingDate-year').nth(0);
        this.hearingTime = page.locator('#interimHearingsScreenField_0_interimHearingTime');
        this.additionalInformation = page.locator('#interimHearingsScreenField_0_interimAdditionalInformationAboutHearing');
        this.uploadOtherDocumentFiles = page.locator('#interimHearingsScreenField_0_interimUploadAdditionalDocument');
        this.uploadOtherDocumentsQuestion = page.locator('#interimHearingsScreenField_0_interimPromptForAnyDocument');
        this.regionListDropDown = page.locator('#interimHearingsScreenField_0_interim_regionList');
        this.courtZoneDropDown = page.locator('#hearing_regionList');
    }
    
    async clickAddNew() {
        expect(this.addNew).toBeVisible();
        await this.addNew.click();
    }

    async selectTypeOfHearing(typeOfHearing: string) {
        expect(this.typeOfHearing).toBeVisible();
        await this.typeOfHearing.selectOption({ label: typeOfHearing });
    }

    async enterTimeEstimate(duration: string) {
        expect(this.hearingTimeEstimate).toBeVisible();
        await this.hearingTimeEstimate.fill(duration);
    }

    async enterHearingDate(day: string, month: string, year: string) {
        expect(this.hearingDateDay).toBeVisible();
        expect(this.hearingDateMonth).toBeVisible();
        expect(this.hearingDateYear).toBeVisible();
        await this.hearingDateDay.fill(day);
        await this.hearingDateMonth.fill(month);
        await this.hearingDateYear.fill(year);
    }

    async enterHearingTime(time: string) {
        expect(this.hearingTime).toBeVisible();
        await this.hearingTime.fill(time);
    }

    async selectCourtForHearing(localCourt: string) {
        await expect(this.regionListDropDown).toBeVisible();
        await this.regionListDropDown.selectOption(this.courtRegion);

        this.frcDropDown = this.page.locator(`#interimHearingsScreenField_0_interim_${this.courtRegion.toLowerCase()}FRCList`);
        await expect(this.frcDropDown).toBeVisible();
        await this.frcDropDown.selectOption(`${this.courtFrc} FRC`);

        this.courtListDropDown = this.page.locator(`#interimHearingsScreenField_0_interim_${this.courtFrc.toLowerCase()}CourtList`);
        await expect(this.courtListDropDown).toBeVisible();
        await this.courtListDropDown.selectOption(localCourt);
    }


    async enterAdditionalInformationAboutHearing() {    
        expect(this.additionalInformation).toBeVisible();
        await this.additionalInformation.fill('Additional information about the hearing');
    }

    async whetherToUploadOtherDocuments(yesOrNo: YesNoRadioEnum) {     
        expect(this.uploadOtherDocumentsQuestion).toBeVisible();
        const optionToSelect = this.uploadOtherDocumentsQuestion.getByLabel(yesOrNo);
        await optionToSelect.check();
    }

    async uploadOtherDocuments(docFilename: string) {
        await expect(this.uploadOtherDocumentFiles).toBeVisible();
        const filePayload = await PayloadHelper.createAliasPDFPayload('./playwright-e2e/data/test.pdf', docFilename);
        await this.uploadOtherDocumentFiles.setInputFiles(filePayload);
        await this.commonActionsHelper.waitForAllUploadsToBeCompleted(this.page);
    }
}
