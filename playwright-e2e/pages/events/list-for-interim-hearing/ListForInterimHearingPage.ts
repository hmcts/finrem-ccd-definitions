import { type Page, expect, Locator } from '@playwright/test';
import { BaseJourneyPage } from "../../BaseJourneyPage";
import { CommonActionsHelper } from '../../helpers/CommonActionsHelper';
import { YesNoRadioEnum } from "../../helpers/enums/RadioEnums";

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
    private readonly courtForHearing: Locator;
    private readonly additionalInformation: Locator;
    private readonly chooseOtherDocuments: Locator;
    private readonly uploadOtherDocumentsQuestion: Locator;
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
        this.courtForHearing = page.locator('Court for hearing');
        this.additionalInformation = page.locator('#interimHearingsScreenField_0_interimAdditionalInformationAboutHearing');
        this.chooseOtherDocuments = page.locator('#interimHearingsScreenField_0_interimUploadAdditionalDocument');
        this.uploadOtherDocumentsQuestion = page.locator('#interimHearingsScreenField_0_interimPromptForAnyDocument');
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

    async selectCourtForHearing(court: string) {
        expect(this.courtForHearing).toBeVisible();
        await this.courtForHearing.selectOption({ label: court });
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
}
