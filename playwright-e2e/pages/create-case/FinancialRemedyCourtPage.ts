import { type Page, expect, Locator } from '@playwright/test';

export class FinancialRemedyCourtPage {
    readonly page: Page;

    readonly courtZoneDropDown: Locator;
    frcDropDown: Locator; 
    courtListDropDown: Locator
    readonly highJudgeRadio: Locator;
    readonly highCourtJudgeReasonTxtBox: Locator;
    readonly specialFacilitiesTxtBox: Locator;
    readonly specialArrangementsTxtBox: Locator; 
    readonly applicantHomeCourtRadio: Locator;
    readonly reasonForHomeCourtTxtBox: Locator;
    readonly frcReasonTxtBox: Locator;
   

    readonly courtRegion: string = 'Midlands'
    readonly courtFrc: string = 'Nottingham'
    readonly localCourt: string = 'CHESTERFIELD COUNTY COURT'


    public constructor(page: Page) {
        this.page = page; 

        this.courtZoneDropDown = page.locator('#regionList');
        this.highJudgeRadio = page.locator('#allocatedToBeHeardAtHighCourtJudgeLevel_radio');
        this.highCourtJudgeReasonTxtBox = page.locator('#allocatedToBeHeardAtHighCourtJudgeLevelText')
        this.specialFacilitiesTxtBox = page.locator('#specialAssistanceRequired');
        this.specialArrangementsTxtBox = page.locator('#specificArrangementsRequired'); 
        this.applicantHomeCourtRadio = page.locator('#isApplicantsHomeCourt_radio');
        this.frcReasonTxtBox = page.locator('#reasonForFRCLocation');
        this.reasonForHomeCourtTxtBox = page.locator('#reasonForLocalCourt');
    }

    async selectCourtZoneDropDown() {
        await this.courtZoneDropDown.selectOption(this.courtRegion);

        this.frcDropDown = this.page.locator(`#${this.courtRegion.toLowerCase()}FRCList`);
        await expect(this.frcDropDown).toBeVisible();
        await this.frcDropDown.selectOption(`${this.courtFrc} FRC`);

        this.courtListDropDown = this.page.locator(`#${this.courtFrc.toLowerCase()}CourtList`);
        await expect(this.courtListDropDown).toBeVisible();
        await this.courtListDropDown.selectOption(this.localCourt);
    }

    async selectHighCourtJudgeLevel(isHighCourtJudgeLevel: boolean) {
        const radioOption = isHighCourtJudgeLevel ? 'Yes' : 'No'; 
        const optionToSelect = this.highJudgeRadio.getByLabel(radioOption);
        await optionToSelect.check();
        if(isHighCourtJudgeLevel) {
            await expect(this.highCourtJudgeReasonTxtBox).toBeVisible();
            await this.highCourtJudgeReasonTxtBox.fill('Reason')
        }
    }

    async enterSpecialFacilities(){
        await this.specialFacilitiesTxtBox.fill("Special facilities")
    }

    async enterSpecialArrangements() {
        await this.specialArrangementsTxtBox.fill("Special Arrangements")
    }

    async selectShouldNotProceedApplicantHomeCourt(notApplicantHomeCourt: boolean) {
        const radioOption = notApplicantHomeCourt ? 'Yes' : 'No'; 
        const optionToSelect = this.applicantHomeCourtRadio.getByLabel(radioOption);
        await optionToSelect.check();
        if(notApplicantHomeCourt) {
            await expect(this.reasonForHomeCourtTxtBox).toBeVisible();
            await this.reasonForHomeCourtTxtBox.fill('Reason')
        }
    }

    async enterFrcReason() {
        await this.frcReasonTxtBox.fill("FRC Reason")
    }



}