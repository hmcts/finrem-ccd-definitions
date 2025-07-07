import { type Page, expect, Locator } from '@playwright/test';
import { BaseJourneyPage } from "../../BaseJourneyPage";
import { YesNoRadioEnum } from "../../helpers/enums/RadioEnums";
import { camelCase } from "lodash";

export class GeneralApplicationDirectionsPage extends BaseJourneyPage {
    private readonly isAHearingRequired: Locator;
    private readonly hearingTime: Locator;
    private readonly hearingTimeEstimate: Locator;
    private readonly additionalInformation: Locator;
    
    public constructor(page: Page) {
        super(page);
        this.isAHearingRequired = page.locator('#generalApplicationDirectionsHearingRequired');
        this.hearingTime = this.page.locator(`#generalApplicationDirectionsHearingTime`);
        this.hearingTimeEstimate = this.page.locator(`#generalApplicationDirectionsHearingTimeEstimate`);
        this.additionalInformation = this.page.locator(`#generalApplicationDirectionsAdditionalInformation`);
    }

    async chooseWhetherAHearingIsRequired(whetherAHearingIsRequired: YesNoRadioEnum) {
        await this.isAHearingRequired.getByLabel(whetherAHearingIsRequired).check();
    }

    async enterHearingDate(day: string, month: string, year: string) {
        const hearingDateDay = this.page.locator(`#generalApplicationDirectionsHearingDate-day`);
        const hearingDateMonth = this.page.locator(`#generalApplicationDirectionsHearingDate-month`);
        const hearingDateYear = this.page.locator(`#generalApplicationDirectionsHearingDate-year`);

        await expect(hearingDateDay).toBeVisible();
        await expect(hearingDateMonth).toBeVisible();
        await expect(hearingDateYear).toBeVisible();

        await hearingDateDay.fill(day);
        await hearingDateMonth.fill(month);
        await hearingDateYear.fill(year);
    }

    async enterHearingTime(time: string) {
        await expect(this.hearingTime).toBeVisible();
        await this.hearingTime.fill(time);
    }

    async enterTimeEstimate(duration: string) {
        await expect(this.hearingTimeEstimate).toBeVisible();
        await this.hearingTimeEstimate.fill(duration);
    }
    
    async selectCourtForHearing(courtRegion: string = "London", courtFrc: string = "London FRC",
                                localCourt: string = "BROMLEY COUNTY COURT AND FAMILY COURT") {
        const regionListDropDown = this.page.locator(`#generalApplicationDirections_regionList`);
        await expect(regionListDropDown).toBeVisible();
        await regionListDropDown.selectOption(courtRegion);

        const frcDropDown = this.page
            .locator(`#generalApplicationDirections_${camelCase(courtRegion)}FRCList`);
        await expect(frcDropDown).toBeVisible();
        await frcDropDown.selectOption(`${courtFrc}`);

        // Select the local court from the visible dropdown
        const courtListDropDown = this.page.locator(
            `xpath=//select[starts-with(@id, "generalApplicationDirections_") and contains(@id, "CourtList") and not(ancestor::div[@hidden])]`
        );
        await expect(courtListDropDown).toBeVisible();
        await courtListDropDown.selectOption(localCourt);
    }

    async enterAdditionalInformationAboutHearing(information: string = "Whatever information is required for the hearing") {
        await expect(this.additionalInformation).toBeVisible();
        await this.additionalInformation.fill(information);
    }
}
