import { type Page, expect, Locator } from '@playwright/test';
import { BaseJourneyPage } from "../../BaseJourneyPage";

export class AmendApplicationDetailsPage extends BaseJourneyPage {
    private estimatedAssetsLabel: Locator;
    private estimatedAssetsUnder250k: Locator;
    private estimatedAssertsUnder1M: Locator;
    private netValueOfHome: Locator;
    private regionList: Locator;
    private northWestFRCList: Locator;
    private lancashireCourtList: Locator;
    private midlandsFRCList: Locator;
    private birminghamCourtList : Locator;

    public constructor(page: Page) {
        super(page);
        this.estimatedAssetsLabel = this.page.getByText('Please state the current estimated net assets in this case:');
        this.estimatedAssetsUnder250k = this.page.getByLabel('Under £250,000 (this should be total of combined net assets, but excluding pensions)');
        this.estimatedAssertsUnder1M = this.page.getByLabel('Under £1 million');
        this.netValueOfHome = this.page.locator('input[id="netValueOfHome"]');
        this.regionList = this.page.getByLabel('Please state in which Financial Remedies Court Zone the applicant resides');
        this.northWestFRCList = this.page.locator('select[id="northWestFRCList"]');
        this.lancashireCourtList = this.page.locator('select[id="lancashireCourtList"]');
        this.midlandsFRCList = this.page.locator('select[id="midlandsFRCList"]');
        this.birminghamCourtList = this.page.locator('select[id="birminghamCourtList"]');
    }

    async verifyEstimatedAssetsLabelIsVisible() {
        await expect(this.estimatedAssetsLabel).toBeVisible();
    }

    async selectUnder250k() {
        expect(this.estimatedAssetsUnder250k).toBeVisible();
        await this.estimatedAssetsUnder250k.check();
    }

    async selectUnder1M() {
        expect(this.estimatedAssertsUnder1M).toBeVisible();
        await this.estimatedAssertsUnder1M.check();
    }

    async enterEstimatedAssets(value: string) {
        expect(this.netValueOfHome).toBeVisible();
        await this.netValueOfHome.fill(value);
    }

    async verifyDynamicEnrollmentMessageIsVisible() {
        const dynamicEnrollmentMessage = this.page.getByText('Your application has been entered into the Express Financial Remedy Pilot.');
        await expect(dynamicEnrollmentMessage).toBeVisible();
    }

    async verifyDynamicExistingExpressPilotMessageIsVisible() {
        const dynamicEnrollmentMessage = this.page.getByText('Your application will no longer be entered in the Express Financial Remedy Pilot.');
        await expect(dynamicEnrollmentMessage).toBeVisible();
    }

    async selectParticipatingCourt() {  
        await this.regionList.selectOption('North West');
        await this.northWestFRCList.selectOption('Lancashire and Cumbria FRC');
        await this.lancashireCourtList.selectOption('PRESTON DESIGNATED FAMILY COURT');
    }

    async selectNonParticipatingCourt() {  
        await this.regionList.selectOption('Midlands');
        await this.midlandsFRCList.selectOption('Birmingham FRC');
        await this.birminghamCourtList.selectOption('COVENTRY COMBINED COURT CENTRE');
    }

}
