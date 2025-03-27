import { type Page, expect, Locator } from '@playwright/test';
import { BaseJourneyPage } from "../../BaseJourneyPage";

export class GiveAllocationDirectionsPage extends BaseJourneyPage {
    private alteringCourtImpactExpressPilotCaseWarning: Locator
    
    public constructor(page: Page) {
        super(page);
        this.alteringCourtImpactExpressPilotCaseWarning = page.getByText('Altering the court may impact this case proceeding in the Express Pilot')
    }
    
    async verifyExistenceOfExpressPilotWarningMessage() {
        await expect(this.alteringCourtImpactExpressPilotCaseWarning).toBeVisible();
    }
}
