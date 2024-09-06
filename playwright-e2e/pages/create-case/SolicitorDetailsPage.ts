import { type Page, expect, Locator } from '@playwright/test';
import { BaseJourneyPage } from '../BaseJourneyPage';
import { CommonActionsHelper } from '../helpers/CommonActionsHelper';

export class SolicitorDetailsPage extends BaseJourneyPage {
    
    private readonly solicitorNameInput: Locator;
    private readonly orgSearchInput: Locator;
    private readonly orgResultTable: Locator;
    private readonly orgResultRow: Locator;
    private readonly selectOrgButton: (orgName: string) => Locator;
    private readonly orgResultName: Locator;
    private readonly referenceInput: Locator;
    private readonly solicitorsFirmInput: Locator;
    private readonly refNumberInput: Locator;
    private readonly dxNumberInput: Locator;

    private commonActionsHelper: CommonActionsHelper

    public constructor(page: Page, commonActionsHelper: CommonActionsHelper) {
        super(page);
        this.commonActionsHelper = commonActionsHelper;

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

    async enterSolicitorDetails(solicitorName: string, solicitorEmail: string) {
        await this.solicitorNameInput.fill(solicitorName);
        await this.commonActionsHelper.enterPhoneNumber(this.page);
        await this.commonActionsHelper.enterEmailAddress(this.page, solicitorEmail);
    }

    async setEmailConsent() {
        await this.commonActionsHelper.emailConsent(this.page, true);
    }

    async searchForOrganisation(orgName: string) {
        await this.orgSearchInput.fill(orgName);
    }

    async enterSolicitorsAddress(){
        await this.commonActionsHelper.enterUkAddress(this.page);
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
