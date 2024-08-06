import { type Page, expect, Locator } from '@playwright/test';

export class formAApplicationPage {
  readonly page: Page;
  readonly continueButton: Locator;
  readonly previousButton: Locator;
  readonly solicitorNameInput: Locator;
  readonly orgSearchInput: Locator;
  readonly orgResultTable: Locator;
  readonly orgResultRow: Locator;
  readonly selectOrgButton: (orgName: string) => Locator;
  readonly orgResultName: Locator;
  readonly referenceInput: Locator;
  readonly solicitorsFirmInput: Locator;
  readonly refNumberInput: Locator;
  readonly postcodeInput: Locator;
  readonly findAddressButton: Locator;
  readonly buildingStreetInput: Locator;
  readonly addressLine2Input: Locator;
  readonly addressLine3Input: Locator;
  readonly townCityInput: Locator;
  readonly countyInput: Locator;
  readonly postcodeZipcodeInput: Locator;
  readonly countryInput: Locator;
  readonly phoneNumberInput: Locator;
  readonly emailInput: Locator;
  readonly dxNumberInput: Locator;
  readonly emailConsentRadio: Locator;
  readonly applicationTypeRadio: Locator;
  readonly matrimonialRadio: Locator;
  readonly divorceNumberInput: Locator;
  readonly divorceDetailsHeader: Locator;
  readonly civilPartnershipNoRadio: Locator;


  public constructor(page: Page) {
    this.page = page;
    this.continueButton = page.getByRole('button', { name: 'Continue' });
    this.previousButton = page.getByRole('button', { name: 'Previous' });
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
    this.postcodeInput = page.getByLabel('Enter a UK postcode');
    this.findAddressButton = page.getByRole('button', { name: 'Find address' });
    this.buildingStreetInput = page.getByLabel('Building and Street');
    this.addressLine2Input = page.getByLabel('Address Line 2');
    this.addressLine3Input = page.getByLabel('Address Line 3');
    this.townCityInput = page.getByLabel('Town or City');
    this.countyInput = page.getByLabel('County');
    this.postcodeZipcodeInput = page.getByLabel('Postcode/Zipcode');
    this.countryInput = page.getByLabel('Country');
    this.phoneNumberInput = page.getByLabel('Phone Number');
    this.emailInput = page.getByLabel('Email');
    this.dxNumberInput = page.getByLabel('DX number (Optional)');
    this.emailConsentRadio = page.locator(
      '#applicantSolicitorConsentForEmails_radio'
    );
    this.matrimonialRadio = page.getByLabel('In connection to matrimonial');
    this.divorceDetailsHeader = page.getByRole('heading', { name: 'Divorce / Dissolution Details' });
    this.divorceNumberInput = page.getByLabel('Divorce / Dissolution Case Number');
    this.civilPartnershipNoRadio = page.getByLabel('No');
    
  }

  async continueApplication() {
    await expect(this.continueButton).toBeVisible();
    await this.continueButton.click();
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

  async enterPhoneNumber(phoneNumber: string) {
    await this.phoneNumberInput.fill(phoneNumber);
  }

  async enterEmailAddress(emailAddress: string) {
    await this.emailInput.fill(emailAddress);
  }

  async emailConsent(consent: boolean) {
    const radioOption = consent ? 'Yes' : 'No';
    const optionToSelect = this.emailConsentRadio.getByLabel(radioOption);
    await optionToSelect.check();
  }
  async matriomnialApplication() {
    await expect(this.matrimonialRadio).toBeVisible();
    await this.matrimonialRadio.check();  
  }
  async divorceDetails (divorceNumber: string) {
    await expect (this.divorceDetailsHeader).toBeVisible();
    await this.divorceNumberInput.fill(divorceNumber);
    await this.civilPartnershipNoRadio.check();
  }
}
