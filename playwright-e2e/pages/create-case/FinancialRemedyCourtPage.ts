import { type Page, expect, Locator } from '@playwright/test';

export class FinancialRemedyCourtPage {
    readonly page: Page;

    readonly courtZoneDropDown: Locator;
    frcDropDown: Locator; 
    courtListDropDown: Locator
    readonly highJudgeRadio: Locator;
    readonly specialFacilitiesTxtBox: Locator;
    readonly specialArrangementsTxtBox: Locator; 
    readonly shouldNotProceedRadio: Locator;
    readonly frcReasonTxtBox: Locator;

    readonly courtRegion: string = 'Midlands'
    readonly courtFrc: string = 'Nottingham'
    readonly localCourt: string = 'CHESTERFIELD COUNTY COURT'


    public constructor(page: Page) {
        this.page = page; 

        this.courtZoneDropDown = page.locator('#regionList');
        this.highJudgeRadio = page.locator('#');
        this.specialFacilitiesTxtBox = page.locator('#');
        this.specialArrangementsTxtBox = page.locator('#'); 
        this.shouldNotProceedRadio = page.locator('#');
        this.frcReasonTxtBox = page.locator('#');
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



}