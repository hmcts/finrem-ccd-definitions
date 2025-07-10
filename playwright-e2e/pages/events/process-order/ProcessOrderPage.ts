import {BaseJourneyPage} from "../../BaseJourneyPage.ts";
import {expect, Locator, Page} from "@playwright/test";
import {CommonActionsHelper} from "../../helpers/CommonActionsHelper.ts";
import { camelCase } from "lodash";

export class ProcessOrderPage extends BaseJourneyPage {
    private readonly commonActionsHelper: CommonActionsHelper;
    private readonly addNewChildBtn: Locator;

    public constructor(page: Page, commonActionsHelper: CommonActionsHelper) {
        super(page);
        this.commonActionsHelper = commonActionsHelper;        
        this.addNewChildBtn = page.getByRole('button', { name: 'Add new' }).first()
    }

    async selectIsAnotherHearingToBeListed(hearing_position: number, isListed: Boolean){
        const radioOption = isListed ? 'Yes' : 'No';
        const optionToSelect = this.page.locator(`#directionDetailsCollection_${hearing_position}_isAnotherHearingYN_radio`).getByLabel(radioOption);
        await optionToSelect.check();
    }

    async enterTimeEstimate(hearing_position: number, duration: string) {
        const timeEstimateInput = this.page.locator(`#directionDetailsCollection_${hearing_position}_timeEstimate`);
        await expect(timeEstimateInput).toBeVisible();
        await timeEstimateInput.fill(duration);
    }

    async enterHearingDate(hearing_position: number, day: string, month: string, year: string) {
        const hearingDateDay = this.page.locator(`#dateOfHearing-day`).nth(hearing_position);
        const hearingDateMonth = this.page.locator(`#dateOfHearing-month`).nth(hearing_position);
        const hearingDateYear = this.page.locator(`#dateOfHearing-year`).nth(hearing_position);

        expect(hearingDateDay).toBeVisible();
        expect(hearingDateMonth).toBeVisible();
        expect(hearingDateYear).toBeVisible();

        await hearingDateDay.fill(day);
        await hearingDateMonth.fill(month);
        await hearingDateYear.fill(year);
    }

    async enterHearingTime(hearing_position: number, time: string) {
        const hearingTimeInput = this.page.locator(`#directionDetailsCollection_${hearing_position}_hearingTime`);
        await expect(hearingTimeInput).toBeVisible();
        await hearingTimeInput.fill(time);
    }

    async selectTypeOfHearing(hearing_position: number, typeOfHearing: string) {
        const typeOfHearingLocator = this.page.locator(`#directionDetailsCollection_${hearing_position}_typeOfHearing`);
        expect(typeOfHearingLocator).toBeVisible();
        await typeOfHearingLocator.selectOption({ label: typeOfHearing });
    }

    async selectCourtForHearing({
        hearing_position = 0,
        courtRegion = "North West",
        courtFrc = "Liverpool",
        localCourt = "CHESTER CIVIL AND FAMILY JUSTICE CENTRE"
    }: {
        hearing_position?: number,
        courtRegion?: string,
        courtRegionCode?: string,
        courtFrc?: string,
        courtFrcCode?: string,
        localCourt?: string
    } = {}) {
        const regionListDropDown = this.page.locator(`#directionDetailsCollection_${hearing_position}_localCourt_region`);
        await expect(regionListDropDown).toBeVisible();
        await regionListDropDown.selectOption(courtRegion);

        const frcDropDown = this.page.locator(`#directionDetailsCollection_${hearing_position}_localCourt_${camelCase(courtRegion)}List`);
        await expect(frcDropDown).toBeVisible();
        await frcDropDown.selectOption(`${courtFrc} FRC`);

        const courtListDropDown = this.page.locator(`#directionDetailsCollection_${hearing_position}_localCourt_${camelCase(courtFrc)}CourtList`);
        await expect(courtListDropDown).toBeVisible();
        await courtListDropDown.selectOption(localCourt);
    }
    
    async addNewNextHearingDetails() {
        await this.addNewChildBtn.click();
    }
}
