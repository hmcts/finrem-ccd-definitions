import {expect, Locator, type Page} from '@playwright/test';
import {YesNoRadioEnum} from "../../helpers/enums/RadioEnums";
import {ManageHearingPage} from "../manage-hearings/ManageHearing.ts";
import {CommonActionsHelper} from "../../helpers/CommonActionsHelper.ts";

export class GeneralApplicationDirectionsPage extends ManageHearingPage {
    private readonly isAHearingRequired: Locator;
    private readonly updateApplicationDirectionsHearingRadio: Locator;
    private readonly recitalDetails: Locator;
    private readonly checkRecitalsLabel: Locator;
    private readonly judgeDropdown: Locator;
    private readonly judgeNameLabel: Locator;
    private readonly judgeNameDetails: Locator;
    private readonly courtDayDetails: Locator;
    private readonly courtMonthDetails: Locator;
    private readonly courtYearDetails: Locator;
    private readonly checkJudgeDirectionsLabel: Locator;
    private readonly judgeDirectionsDetails: Locator;
    private readonly additionalInformation: Locator;

    public constructor(page: Page, commonActionsHelper: CommonActionsHelper) {
        super(page, commonActionsHelper);
        this.isAHearingRequired = page.locator('#generalApplicationDirectionsHearingRequired');
        this.updateApplicationDirectionsHearingRadio = page.locator('#generalApplicationDirectionsHearingRequired_No');
        this.checkRecitalsLabel = page.getByText('Recitals (Optional)');
        this.recitalDetails = page.locator('#generalApplicationDirectionsRecitals');
        this.judgeDropdown = page.locator('#generalApplicationDirectionsJudgeType');
        this.judgeNameLabel = page.getByLabel('Name of Judge');
        this.judgeNameDetails = page.locator('#generalApplicationDirectionsJudgeName');
        this.courtDayDetails = page.locator('#generalApplicationDirectionsCourtOrderDate-day');
        this.courtMonthDetails = page.locator('#generalApplicationDirectionsCourtOrderDate-month');
        this.courtYearDetails = page.locator('#generalApplicationDirectionsCourtOrderDate-year');
        this.checkJudgeDirectionsLabel = page.getByText('Directions from the Judge');
        this.judgeDirectionsDetails = page.locator('#generalApplicationDirectionsTextFromJudge');
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
}
