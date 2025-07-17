import { type Page, expect, Locator } from '@playwright/test';
import { BaseJourneyPage } from "../../BaseJourneyPage";
import { YesNoRadioEnum } from "../../helpers/enums/RadioEnums";

export class GeneralApplicationDirectionsPage extends BaseJourneyPage {
    private readonly isAHearingRequired: Locator;
    private readonly updateApplicationDirectionsHearingRadio: Locator;
    private readonly recitalDetails: Locator;
    private readonly checkRecitalsLabel: Locator;
    private readonly judgeDropdown: Locator;
    private readonly judgeNameLabel: Locator;
    private readonly judgeNameDetails: Locator;
    
    public constructor(page: Page) {
        super(page);
        this.isAHearingRequired = page.locator('#generalApplicationDirectionsHearingRequired');
        this.updateApplicationDirectionsHearingRadio = page.locator('#generalApplicationDirectionsHearingRequired_No');
        this.checkRecitalsLabel = page.getByText('Recitals (Optional)');
        this.recitalDetails = page.locator('#generalApplicationDirectionsRecitals');
        this.judgeDropdown = page.locator('#generalApplicationDirectionsJudgeType');
        this.judgeNameLabel = page.getByLabel('Name of Judge');
        this.judgeNameDetails = page.locator('#generalApplicationDirectionsJudgeName');
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
}
