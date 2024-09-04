import { type Page, Locator } from '@playwright/test';

export class FastTrackProcedurePage {
    readonly page: Page;

    readonly fastTrackRadio: Locator;
    readonly fastTrackVaryPeriodicalPaymentOrderCheckBox: Locator;
    readonly fastTrackForeignMaintenanceCheckbox: Locator;
    readonly fastTrackOnlyPeriodicalPaymentCheckbox: Locator 
    readonly fastTrackFinancialProvisionCheckbox: Locator;

    public constructor(page: Page) {
        this.page = page

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