import { type Page, expect, Locator } from '@playwright/test';
import { YesNoRadioEnum } from '../../helpers/enums/RadioEnums';
import { UpdateContactDetailsPage } from '../update-contact-details/UpdateContactDetailsPage';
import { p } from '../../../../playwright-report/trace/assets/defaultSettingsView-BEpdCv1S';

export class StopRepresentingClientPage extends UpdateContactDetailsPage {

  private readonly consentToStopRepresentingText: Locator;
  private readonly consentToStopRepresentingRadio: Locator;
  private readonly applicantDetailsPrivateRadio: Locator;
  private readonly respondentDetailsPrivateRadio: Locator;
  private readonly judicialApprovalQuestionText: Locator;
  private readonly judicialApprovalQuestionRadio: Locator;
  private readonly missingClientOrJudicialApprovalError: Locator;
  private readonly areYouSureYouWishToStopRepresentingText: Locator;
  private readonly clientServiceAddressPostcodeTextBox: Locator;
  private readonly clientFindAddressButton: Locator;
  private  readonly clientAddressDropdown: Locator;
  private readonly extraClientAddressPostcodeTextBox: Locator;
  private readonly extraClientFindAddressButton: Locator;
  private  readonly extraClientAddressDropdown: Locator;

  public constructor(page: Page) {
    super(page);
    this.consentToStopRepresentingText = page.getByText('Does your client consent to');
    this.consentToStopRepresentingRadio = page.getByRole('group', { name: 'Does your client consent to' });
    this.applicantDetailsPrivateRadio = page.getByRole('group', { name: 'Keep the Applicant\'s contact' });
    this.respondentDetailsPrivateRadio = page.getByRole('group', { name: 'Keep the Respondent\'s contact' });
    this.judicialApprovalQuestionText = page.getByText('Do you have judicial approval');
    this.judicialApprovalQuestionRadio = page.getByRole('group', { name: 'Do you have judicial approval' });
    this.missingClientOrJudicialApprovalError = page.getByText('You cannot stop representing');
    this.areYouSureYouWishToStopRepresentingText = page.getByText('Are you sure you wish to stop');
    this.clientServiceAddressPostcodeTextBox = page.locator('#clientAddressForService_clientAddressForService_postcodeInput');
    this.clientFindAddressButton = page.locator('#clientAddressForService_clientAddressForService_postcodeLookup').getByRole('button', { name: 'Find address' });
    this.clientAddressDropdown = page.locator('#clientAddressForService_clientAddressForService_addressList');
    this.extraClientAddressPostcodeTextBox = page.locator('#extraClientAddr1_extraClientAddr1_postcodeInput');
    this.extraClientFindAddressButton = page.locator('#extraClientAddr1_extraClientAddr1_postcodeLookup').getByRole('button', { name: 'Find address' });
    this.extraClientAddressDropdown = page.locator('#extraClientAddr1_extraClientAddr1_addressList');

  }

  async selectApplicantDetailsPrivate(keepPrivate: YesNoRadioEnum) {
    const radioOption = keepPrivate === YesNoRadioEnum.YES ? 'Yes' : 'No'; 
    const optionToSelect = this.applicantDetailsPrivateRadio.getByLabel(radioOption);
    await optionToSelect.check();
  }

  async selectRespondentDetailsPrivate(keepPrivate: YesNoRadioEnum) {
    const radioOption = keepPrivate === YesNoRadioEnum.YES ? 'Yes' : 'No'; 
    const optionToSelect = this.respondentDetailsPrivateRadio.getByLabel(radioOption);
    await optionToSelect.check();
  }

  async selectIntervenerDetailsPrivate(keepPrivate: YesNoRadioEnum, intervenerNumber: number = 1) {
    const groupName = `Keep the Intervener ${intervenerNumber}'s`;
    const intervenerDetailsPrivateRadio = this.page.getByRole('group', { name: groupName });
    const radioOption = keepPrivate === YesNoRadioEnum.YES ? 'Yes' : 'No';
    const optionToSelect = intervenerDetailsPrivateRadio.getByLabel(radioOption);
    await optionToSelect.check();
  }

  async consentToStopRepresentingClient(answer: YesNoRadioEnum) {
    await expect(this.consentToStopRepresentingText).toBeVisible();
    const radioOption = answer === YesNoRadioEnum.YES ? 'Yes' : 'No';
    const radio = this.consentToStopRepresentingRadio.getByLabel(radioOption, { exact: true });
    await radio.check();
  }

  async selectJudicialApprovalQuestion(answer: YesNoRadioEnum) {
    await expect(this.judicialApprovalQuestionText).toBeVisible();
    const radioOption = answer === YesNoRadioEnum.YES ? 'Yes' : 'No';
    const radio = this.judicialApprovalQuestionRadio.getByLabel(radioOption, { exact: true });
    await radio.check();
  }

  async assertMissingClientOrJudicialApprovalError() {
    await expect(this.missingClientOrJudicialApprovalError).toBeVisible();
  }

  async assertAreYouSureYouWishToStopRepresentingText(){
    await expect(this.areYouSureYouWishToStopRepresentingText).toBeVisible();
  }

  async enterAddressForUser(postcode: string, address: string): Promise<void> {
    expect(this.clientServiceAddressPostcodeTextBox).toBeVisible();
    await this.clientServiceAddressPostcodeTextBox.fill(postcode);
    await this.clientFindAddressButton.click();
    await expect(this.clientAddressDropdown).toBeVisible();
    await this.clientAddressDropdown.selectOption({ label: address });
  }

  async enterAddressForExtraClient(postcode: string, address: string): Promise<void> {
    expect(this.extraClientAddressPostcodeTextBox).toBeVisible();
    await this.extraClientAddressPostcodeTextBox.fill(postcode);
    await this.extraClientFindAddressButton.click();
    await expect(this.extraClientAddressDropdown).toBeVisible();
    await this.extraClientAddressDropdown.selectOption({ label: address });
  }
}