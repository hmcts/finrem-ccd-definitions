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
  readonly marriageDay: Locator;
  readonly marriageMonth: Locator;
  readonly marriageYear: Locator;
  readonly issueDay: Locator;
  readonly issueMonth: Locator;
  readonly issueYear: Locator;
  readonly courtName: Locator;
  readonly divorceStage: Locator;
  readonly uploadPetition: Locator;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly cantEnterPostcode: Locator;
  readonly applicantDetailsPrivateNo: Locator;
  readonly respondentRepresentedRadio: Locator;
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
    this.buildingStreetInput = page.getByRole('textbox', { name: 'Building and Street'});
    this.addressLine2Input = page.getByRole('textbox', { name: 'Address Line 2'});
    this.addressLine3Input = page.getByRole('textbox', { name: 'Address Line 3'}); 
    this.townCityInput = page.getByRole('textbox', { name: 'Town or City'}); 
    this.countyInput =  page.getByRole('textbox', { name: 'County'});  
    this.postcodeZipcodeInput = page.getByRole('textbox', { name: 'Postcode/Zipcode'}); 
    this.countryInput = page.getByRole('textbox', { name: 'Country'});
    this.phoneNumberInput =  page.getByRole('textbox', { name: 'Phone Number'}); 
    this.emailInput =  page.getByRole('textbox', { name: 'Email'}); 
    this.dxNumberInput = page.getByRole('textbox', { name: 'DX number (Optional)'});  
    this.emailConsentRadio = page.locator(
      '#applicantSolicitorConsentForEmails_radio'
    );
    this.matrimonialRadio = page.getByLabel('In connection to matrimonial');
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
    this.firstName = page.getByLabel('Current First and Middle names');
    this.lastName = page.getByLabel('Current Last Name');
    this.cantEnterPostcode = page.getByRole('link', { name: 'I can\'t enter a UK postcode' });
    this.applicantDetailsPrivateNo = page.getByRole('group', { name: 'Keep the Applicant\'s contact' }).getByLabel('No');
    this.respondentRepresentedRadio = page.locator(
      '#respondentRepresented_radio'
    );
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

  async UKaddress() {
    await this.cantEnterPostcode.click();
    await this.buildingStreetInput.fill('test')
    await this.addressLine2Input.fill('test')
    await this.townCityInput.fill('test')
    await this.countyInput.fill('test')
    await this.postcodeZipcodeInput.fill('test')
    await this.countryInput.fill('test');
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

  async matrimonialApplication() {
    await expect(this.matrimonialRadio).toBeVisible();
    await this.matrimonialRadio.check();  
  }

  async divorceDetails (divorceNumber: string, divorceStage: string , ) {
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

  async applicantDetails() {
    await this.firstName.fill('app');
    await this.lastName.fill('app');
    await this.UKaddress()
    await this.applicantDetailsPrivateNo.check();
  }

  async respondentDetails() {
    await this.firstName.click();
    await this.firstName.fill('resp');
    await this.lastName.fill('resp');
  }

  async respondentRepresented(represented: boolean) {
    const radioOption = represented ? 'Yes' : 'No'; 
    const optionToSelect = this.respondentRepresentedRadio.getByLabel(radioOption);
    if(represented) {
      await optionToSelect.check();
      await this.solicitorsFirmInput.fill('Test Firm');
      await this.UKaddress()
    }
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
