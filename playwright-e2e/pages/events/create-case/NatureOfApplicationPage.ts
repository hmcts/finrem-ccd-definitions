import { type Page, Locator } from '@playwright/test';
import { BaseJourneyPage } from '../../BaseJourneyPage';

export class NatureOfApplicationPage extends BaseJourneyPage {

    private readonly natureOfApplicationMaintenance: Locator;
    private readonly natureOfApplicationLumpSum: Locator;
    private readonly natureOfApplicationPropertyAdjustment: Locator;
    private readonly natureOfApplicationPropertySettlement: Locator;
    private readonly natureOfApplicationPeriodicalPayment: Locator;
    private readonly natureOfApplicationPensionSharing: Locator;
    private readonly natureOfApplicationPensionComp: Locator;
    private readonly natureOfApplicationPensionAttachment: Locator;
    private readonly natureOfApplicationPensionCompAttachment: Locator;
    private readonly natureOfApplicationVariationOrder: Locator;
    private readonly interimChildPeriodicalPayments: Locator;

    private readonly consentedPropertyAdjustmentAddress: Locator;
    private readonly consentedPropertyAdjustmentMortgage: Locator;

    public constructor(page: Page) {
        super(page);

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
        this.consentedPropertyAdjustmentAddress = page.getByRole('textbox', { name: 'Address details' });
        this.consentedPropertyAdjustmentMortgage = page.getByRole('textbox', { name: 'Mortgage details' });
        this.interimChildPeriodicalPayments = page.getByRole('checkbox', { name: 'Interim child periodical' });
    }

    async selectNatureOfApplication() {
        // CONTESTED is using natureOfApplicationChecklist
        // CONSENTED is using natureOfApplication2
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
    async selectNatureOfApplicationChildrens() {
        // CONTESTED is using natureOfApplicationChecklist
        // CONSENTED is using natureOfApplication2
        await this.interimChildPeriodicalPayments.check();
        await this.natureOfApplicationLumpSum.check();
        await this.natureOfApplicationPropertySettlement.check();
        await this.natureOfApplicationPeriodicalPayment.check();
        await this.natureOfApplicationVariationOrder.check();
    }

    async addConsentedPropertyAdjustmentDetails() {
        await this.consentedPropertyAdjustmentAddress.fill('1234 Test Street');
        await this.consentedPropertyAdjustmentMortgage.fill('Mortgage details');
    }

    async expressPilotSuitableNatureOfApplications() {
        await this.natureOfApplicationMaintenance.check();
        await this.natureOfApplicationLumpSum.check();
        await this.natureOfApplicationPropertyAdjustment.check();
        await this.natureOfApplicationPropertySettlement.check();
        await this.natureOfApplicationPeriodicalPayment.check();
        await this.natureOfApplicationPensionSharing.check();
        await this.natureOfApplicationPensionComp.check();
        await this.natureOfApplicationPensionAttachment.check();
        await this.natureOfApplicationPensionCompAttachment.check();
    }

    async selectVariationOrderOnly() {
        await this.natureOfApplicationVariationOrder.check();
    }
}
