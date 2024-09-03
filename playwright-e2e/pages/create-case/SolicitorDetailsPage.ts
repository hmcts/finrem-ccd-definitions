import { type Page, expect, Locator } from '@playwright/test';

export class SolicitorDetailsPage {
    readonly page: Page;
    readonly solicitorNameInput: Locator;
    readonly orgSearchInput: Locator;
    readonly orgResultTable: Locator;
    readonly orgResultRow: Locator;
    readonly selectOrgButton: (orgName: string) => Locator;
    readonly orgResultName: Locator;
    readonly referenceInput: Locator;
    readonly solicitorsFirmInput: Locator;
    readonly refNumberInput: Locator;
    readonly dxNumberInput: Locator;

    public constructor(page: Page) {
        this.page = page;

        this.solicitorNameInput = page.getByLabel('Solicitor’s name');
        this.orgSearchInput = page.getByLabel('You can only search for');
        this.orgResultTable = page.locator('table#organisation-table');
        this.orgResultRow = page.locator('table#organisation-table tr');
        this.selectOrgButton = (orgName: string) =>
          this.page.locator(
            `table#organisation-table tr td.td-select a[title^="Select the organisation ${orgName}"]`
          );
        this.orgResultName = page.getByRole('heading', { name: 'FinRem-1-Org' });
        this.referenceInput = page.getByLabel('Reference (Optional)');
        this.solicitorsFirmInput = page.getByLabel('Solicitor’s firm');
        this.refNumberInput = page.getByLabel('Your reference number');
        
        this.dxNumberInput = page.getByRole('textbox', { name: 'DX number (Optional)'});  
    }

    async enterSolicitorName(solicitorName: string) {
        await this.solicitorNameInput.fill(solicitorName);
    }

    async searchForOrganisation(orgName: string) {
        await this.orgSearchInput.fill(orgName);
    }

    async selectOrganisation(orgName: string) {
        await this.orgSearchInput.fill(orgName);
        await expect(this.orgResultTable).toBeVisible();
        const selectButton = this.selectOrgButton(orgName);
        await selectButton.click();
    }

    async enterSolicitorsFirm(){
        await this.solicitorsFirmInput.fill('firm');
    }

}