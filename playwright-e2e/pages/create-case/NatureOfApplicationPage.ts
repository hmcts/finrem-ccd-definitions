import { type Page, Locator } from '@playwright/test';

export class NatureOfApplicationPage {
    readonly page: Page;

    readonly natureOfApplicationMaintenance: Locator;
    readonly natureOfApplicationLumpSum: Locator;
    readonly natureOfApplicationPropertyAdjustment: Locator;
    readonly natureOfApplicationPropertySettlement: Locator;
    readonly natureOfApplicationPeriodicalPayment: Locator;
    readonly natureOfApplicationPensionSharing: Locator;
    readonly natureOfApplicationPensionComp: Locator;
    readonly natureOfApplicationPensionAttachment: Locator;
    readonly natureOfApplicationPensionCompAttachment: Locator;
    readonly natureOfApplicationVariationOrder: Locator;

    public constructor(page: Page) {
        this.page = page

        this.natureOfApplicationMaintenance = page.getByRole('checkbox', { name: 'Maintenance Pending Suit' });
        this.natureOfApplicationLumpSum = page.getByRole('checkbox', { name: 'Lump Sum Order' });
        this.natureOfApplicationPropertyAdjustment = page.getByRole('checkbox', { name: 'Property Adjustment Order' });
        this.natureOfApplicationPropertySettlement = page.getByRole('checkbox', { name: 'A settlement or a transfer of property for the benefit of the child(ren)' });
        this.natureOfApplicationPeriodicalPayment = page.getByRole('checkbox', { name: 'Periodical Payment Order' });
        this.natureOfApplicationPensionSharing = page.getByRole('checkbox', { name: 'Pension Sharing Order' });
        this.natureOfApplicationPensionComp = page.getByRole('checkbox', { name: 'Pension Compensation Sharing Order' });
        this.natureOfApplicationPensionAttachment = page.getByRole('checkbox', { name: 'Pension Attachment Order' });
        this.natureOfApplicationPensionCompAttachment = page.getByRole('checkbox', { name: 'Pension Compensation Attachment Order' });
        this.natureOfApplicationVariationOrder = page.getByRole('checkbox', { name: 'Variation Order' });
    }
    
    async selectNatureOfApplication() {
        await this.natureOfApplicationMaintenance.check();
        await this.natureOfApplicationLumpSum.check();
        await this.natureOfApplicationPropertyAdjustment.check();
        await this.natureOfApplicationPropertySettlement.check();
        await this.natureOfApplicationPeriodicalPayment.check();
        await this.natureOfApplicationPensionSharing.check();
        await this.natureOfApplicationPensionComp.check();
        await this.natureOfApplicationPensionAttachment.check();
        await this.natureOfApplicationPensionCompAttachment.check();
        await this.natureOfApplicationVariationOrder.check();
    }
}