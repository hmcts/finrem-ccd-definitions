import { type Page, Locator } from '@playwright/test';
import { BaseJourneyPage } from "../../BaseJourneyPage";
import { YesNoRadioEnum } from "../../helpers/enums/RadioEnums";

export class GeneralApplicationDirectionsPage extends BaseJourneyPage {
    private readonly isAHearingRequired: Locator;
    
    public constructor(page: Page) {
        super(page);
        this.isAHearingRequired = page.locator('#generalApplicationDirectionsHearingRequired')
    }

    async chooseWhetherAHearingIsRequired(whetherAHearingIsRequired: YesNoRadioEnum) {
        await this.isAHearingRequired.getByLabel(whetherAHearingIsRequired).check();
      }
}
