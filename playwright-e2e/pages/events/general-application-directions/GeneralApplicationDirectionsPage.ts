import { type Page, expect, Locator } from '@playwright/test';
import { BaseJourneyPage } from "../../BaseJourneyPage";
import { YesNoRadioEnum } from "../../helpers/enums/RadioEnums";
import { camelCase } from "lodash";

export class GeneralApplicationDirectionsPage extends BaseJourneyPage {
    private readonly isAHearingRequired: Locator;
    private readonly updateApplicationDirectionsHearingRadio: Locator;
    private readonly recitalDetails: Locator;
    private readonly checkRecitalsLabel: Locator;
    private readonly judgeDropdown: Locator;
    private readonly judgeNameLabel: Locator;
    private readonly judgeNameDetails: Locator;
    private readonly courtDayLabel: Locator;
    private readonly courtDayDetails: Locator;
    private readonly courtMonthDetails: Locator;
    private readonly courtYearDetails: Locator;
    private readonly checkJudgeDirectionsLabel: Locator;
    private readonly judgeDirectionsDetails: Locator;
    private readonly hearingTime: Locator;
    private readonly hearingTimeEstimate: Locator;
    private readonly additionalInformation: Locator;

    public constructor(page: Page) {
        super(page);
        this.isAHearingRequired = page.locator('#generalApplicationDirectionsHearingRequired');
        this.updateApplicationDirectionsHearingRadio = page.locator('#generalApplicationDirectionsHearingRequired_No');
        this.checkRecitalsLabel = page.getByText('Recitals (Optional)');
        this.recitalDetails = page.locator('#generalApplicationDirectionsRecitals');
        this.judgeDropdown = page.locator('#generalApplicationDirectionsJudgeType');
        this.judgeNameLabel = page.getByLabel('Name of Judge');
        this.judgeNameDetails = page.locator('#generalApplicationDirectionsJudgeName');
        this.courtDayLabel = page.getByText('Court order date');
        this.courtDayDetails = page.locator('#generalApplicationDirectionsCourtOrderDate-day');
        this.courtMonthDetails = page.locator('#generalApplicationDirectionsCourtOrderDate-month');
        this.courtYearDetails = page.locator('#generalApplicationDirectionsCourtOrderDate-year');
        this.checkJudgeDirectionsLabel = page.getByText('Directions from the Judge');
        this.judgeDirectionsDetails = page.locator('#generalApplicationDirectionsTextFromJudge');
        this.hearingTime = this.page.locator(`#generalApplicationDirectionsHearingTime`);
        this.hearingTimeEstimate = this.page.locator(`#generalApplicationDirectionsHearingTimeEstimate`);
        this.additionalInformation = this.page.locator(`#generalApplicationDirectionsAdditionalInformation`);
    }

    async chooseWhetherAHearingIsRequired(whetherAHearingIsRequired: YesNoRadioEnum) {
        await this.isAHearingRequired.getByLabel(whetherAHearingIsRequired).check();
    }

    async selectGeneralApplicationDirectionsHearing() {
        await this.updateApplicationDirectionsHearingRadio.check();
    }

    async enterRecitals(text: string) {
        await expect(this.checkRecitalsLabel).toBeVisible();
        await this.recitalDetails.fill(text);
    }

    async selectJudge(judge: string): Promise<void> {
        await this.judgeDropdown.waitFor({ state: 'visible' });
        await this.judgeDropdown.selectOption({ label: judge });
    }

    async enterJudgeName(text: string) {
        await expect(this.judgeNameLabel).toBeVisible();
        await this.judgeNameDetails.fill(text);
    }

    async enterCourtOrderDate(day: string, month: string, year: string) {
        await this.courtDayDetails.fill(day);
        await this.courtMonthDetails.fill(month);
        await this.courtYearDetails.fill(year);
    }

    async enterDirectionFromJudge(text: string) {
        await expect(this.checkJudgeDirectionsLabel).toBeVisible();
        await this.judgeDirectionsDetails.fill(text);
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
            'select[id^="generalApplicationDirections_"][id*="CourtList"]:not(:where(div[hidden] *))'
        );
        await expect(courtListDropDown).toBeVisible();
        await courtListDropDown.selectOption(localCourt);
    }

    async enterAdditionalInformationAboutHearing(information: string = "Whatever information is required for the hearing") {
        await expect(this.additionalInformation).toBeVisible();
        await this.additionalInformation.fill(information);
    }
}
