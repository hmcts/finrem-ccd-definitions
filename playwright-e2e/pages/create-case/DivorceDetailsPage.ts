import { type Page, type Locator, expect } from '@playwright/test';

export class DivorceDetailsPage {
    readonly page: Page;

    readonly divorceNumberInput: Locator;
    readonly divorceDetailsHeader: Locator;
    readonly civilPartnershipNoRadio: Locator;
    readonly marriageDay: Locator;
    readonly marriageMonth: Locator;
    readonly marriageYear: Locator;
    readonly issueDay: Locator;
    readonly issueMonth: Locator;
    readonly issueYear: Locator;
    readonly courtName: Locator;
    readonly divorceStage: Locator;
    readonly uploadPetition: Locator;

    public constructor(page: Page) {
        this.page = page;

        this.divorceDetailsHeader = page.getByRole('heading', { name: 'Divorce / Dissolution Details' });
        this.divorceNumberInput = page.getByLabel('Divorce / Dissolution Case Number');
        this.civilPartnershipNoRadio = page.getByLabel('No');
        this.marriageDay = page.getByRole('group', { name: 'Date of marriage / civil' }).getByLabel('Day');
        this.marriageMonth = page.getByRole('group', { name: 'Date of marriage / civil' }).getByLabel('Month');
        this.marriageYear = page.getByRole('group', { name: 'Date of marriage / civil' }).getByLabel('Year');
        this.issueDay = page.getByRole('group', { name: 'Application Issued Date' }).getByLabel('Day');
        this.issueMonth = page.getByRole('group', { name: 'Application Issued Date' }).getByLabel('Month');
        this.issueYear = page.getByRole('group', { name: 'Application Issued Date' }).getByLabel('Year');
        this.courtName = page.getByLabel('Name of Court / Divorce');
        this.divorceStage = page.getByLabel('What stage has the divorce /');
        this.uploadPetition = page.getByRole('textbox', { name: 'Upload Petition' });
    }

    async enterDivorceDetails (divorceNumber: string, divorceStage: string , ) {
        await expect (this.divorceDetailsHeader).toBeVisible();
        await this.divorceNumberInput.fill(divorceNumber);
        await this.civilPartnershipNoRadio.check();
        await this.marriageDay.fill('1');
        await this.marriageMonth.fill('1');
        await this.marriageYear.fill('1999');
        await this.issueDay.fill('1');
        await this.issueMonth.fill('1');
        await this.issueYear.fill('1999');
        await this.courtName.fill('test');
        await this.divorceStage.selectOption(divorceStage);
        await this.uploadPetition.setInputFiles('./playwright-e2e/data/PETITION FORM A.docx');
        await this.page.waitForTimeout(3000); 
      }
}