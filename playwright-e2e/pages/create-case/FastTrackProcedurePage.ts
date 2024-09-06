import { type Page, Locator } from '@playwright/test';
import { BaseJourneyPage } from '../BaseJourneyPage';

export class FastTrackProcedurePage extends BaseJourneyPage {

    private readonly fastTrackRadio: Locator;
    private readonly fastTrackVaryPeriodicalPaymentOrderCheckBox: Locator;
    private readonly fastTrackForeignMaintenanceCheckbox: Locator;
    private readonly fastTrackOnlyPeriodicalPaymentCheckbox: Locator 
    private readonly fastTrackFinancialProvisionCheckbox: Locator;

    public constructor(page: Page) {
        super(page);
        this.fastTrackRadio = page.locator('#fastTrackDecision_radio')
        this.fastTrackVaryPeriodicalPaymentOrderCheckBox = page.locator('#fastTrackDecisionReason-reason_1');
        this.fastTrackForeignMaintenanceCheckbox = page.locator('#fastTrackDecisionReason-reason_2');
        this.fastTrackOnlyPeriodicalPaymentCheckbox = page.locator('#fastTrackDecisionReason-reason_3');
        this.fastTrackFinancialProvisionCheckbox = page.locator('#fastTrackDecisionReason-reason_4');
    }

    async selectFastTrack(hasFastTrack: boolean) {
        const radioOption = hasFastTrack ? 'Yes' : 'No'; 
        const optionToSelect = this.fastTrackRadio.getByLabel(radioOption);
        await optionToSelect.check();
        if (hasFastTrack) {
            await this.fastTrackVaryPeriodicalPaymentOrderCheckBox.check();
            await this.fastTrackForeignMaintenanceCheckbox.check();
            await this.fastTrackOnlyPeriodicalPaymentCheckbox.check();
            await this.fastTrackFinancialProvisionCheckbox.check(); 
        }
    }
}
