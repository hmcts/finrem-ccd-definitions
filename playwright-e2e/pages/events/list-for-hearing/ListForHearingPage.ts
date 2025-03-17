import { type Page, expect, Locator } from '@playwright/test';
import { BaseJourneyPage } from "../../BaseJourneyPage";

export class ListForHearingPage extends BaseJourneyPage {

    private readonly listForHearingTitle: Locator;
    private readonly typeOfHearing: Locator;
    private readonly timeEstimate: Locator;
    private readonly hearingDay: Locator;
    private readonly hearingMonth: Locator;
    private readonly hearingYear: Locator;
    private readonly hearingTime: Locator;
    private readonly typeOfHearingHeader: Locator;
    private readonly fastTrackDate: Locator;
    private readonly expressPilotDate: Locator;
    private readonly standardTrackDate: Locator;
    private readonly timeEstimateHeader: Locator;
    private readonly hearingDateHeader: Locator;
    private readonly additionalInformationHeader: Locator;
    private readonly warningsHeader: Locator;
    private readonly expressPilotWarning: Locator;
    private readonly ignoreWarningAndGo: Locator;
    private readonly standardTrackWarning: Locator;
    private readonly fastTrackWarning: Locator;
    private readonly hearingCourtHeading: Locator;
    private readonly courtZoneDropDown: Locator;
    private frcDropDown: Locator;
    private courtListDropDown: Locator


    private readonly courtRegion: string = 'Midlands'
    private readonly courtFrc: string = 'Nottingham'


    public constructor(page: Page) {
        super(page);
        this.listForHearingTitle = page.getByRole('heading', { name: 'List for Hearing' });
        this.typeOfHearingHeader = page.getByText('Type of Hearing')
        this.typeOfHearing = page.getByLabel('Type of Hearing');
        this.timeEstimateHeader = page.getByRole('heading', { name: 'Time Estimate' });
        this.timeEstimate = page.locator('#timeEstimate');
        this.hearingDateHeader = page.getByRole('heading', { name: 'Hearing Date' });
        this.fastTrackDate = page.getByText('Fast Track: Date of the Fast Track hearing must be between 6 and 10 weeks');
        this.expressPilotDate = page.getByText('Express pilot: Date of the express pilot hearing should be between 16 and 20 weeks');
        this.standardTrackDate = page.getByText('Standard Track: Date of the hearing must be between 12 and 16 weeks');
        this.hearingDay = page.getByRole('textbox', { name: 'Day' });
        this.hearingMonth = page.getByRole('textbox', { name: 'Month' });
        this.hearingYear = page.getByRole('textbox', { name: 'Year' });
        this.hearingTime = page.locator('#hearingTime');
        this.additionalInformationHeader = page.getByRole('heading', { name: 'Additional information about' });
        this.warningsHeader = page.getByRole('heading', { name: 'Warnings' });
        this.expressPilotWarning = page.getByText('Date of the express pilot hearing should be between 16 and 20 weeks.');
        this.ignoreWarningAndGo = page.getByRole('button', { name: 'Ignore Warning and Go' });
        this.standardTrackWarning = page.getByText('Date of the hearing must be between 12 and 16 weeks.');
        this.fastTrackWarning = page.getByText('Date of the Fast Track hearing must be between 6 and 10 weeks.');
        this.hearingCourtHeading = page.getByRole('heading', { name: 'Hearing Court' });
        this.courtZoneDropDown = page.locator('#hearing_regionList');
        


    }
    async selectTypeOfHearingDropDown(typeOfHearing: string) {
        expect(this.listForHearingTitle).toBeVisible();
        expect(this.typeOfHearingHeader).toBeVisible();
        await this.typeOfHearing.selectOption(typeOfHearing);
    }

    async enterTimeEstimate(timeEstimate: string) {
        expect(this.timeEstimateHeader).toBeVisible();
        await this.timeEstimate.fill(timeEstimate);
    }

    async enterHearingDate() {
        expect(this.hearingDateHeader).toBeVisible();
        const currentDate = new Date();

        const day = currentDate.getDate().toString().padStart(2, '0'); // Ensure 2-digit format
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
        const year = currentDate.getFullYear().toString();

        await this.hearingDay.fill(day);
        await this.hearingMonth.fill(month);
        await this.hearingYear.fill(year);


    } async verifyHearingDateGuidanceMessages() {
        await expect(this.fastTrackDate).toBeVisible();
        await expect(this.expressPilotDate).toBeVisible();
        await expect(this.standardTrackDate).toBeVisible();

    }

    async enterHearingTime(Time: string) {
        expect(this.hearingTime).toBeVisible();
        await this.hearingTime.fill(Time);

    }

    async selectCourtForHearing(localCourt: string) {
        await expect(this.hearingCourtHeading).toBeVisible();
        await this.courtZoneDropDown.selectOption(this.courtRegion);

        // Correctly format the FRC dropdown locator
        this.frcDropDown = this.page.locator(`#hearing_${this.courtRegion.toLowerCase()}FRCList`);
        await expect(this.frcDropDown).toBeVisible();
        await this.frcDropDown.selectOption(`${this.courtFrc} FRC`);

        // Correctly format the court list dropdown locator
        this.courtListDropDown = this.page.locator(`#hearing_${this.courtFrc.toLowerCase()}CourtList`);
        await expect(this.courtListDropDown).toBeVisible();
        await this.courtListDropDown.selectOption(localCourt);
    }

    async verifyHearingDateWarningMessage(typeOfCase: string) {
        await expect(this.warningsHeader).toBeVisible();

        if (typeOfCase === 'expressPilot') {
            await expect(this.expressPilotWarning).toBeVisible();
        } else if (typeOfCase === 'standardTrack') {
            await expect(this.standardTrackWarning).toBeVisible();
        } else if (typeOfCase === 'fastTrack') {
            await expect(this.fastTrackWarning).toBeVisible();
        } else {
            throw new Error(`Invalid typeOfCase: ${typeOfCase}`);
        }

        await expect(this.ignoreWarningAndGo).toBeVisible();
        await this.ignoreWarningAndGo.click();
    }
}
