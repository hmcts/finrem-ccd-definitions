import { type Page, expect, Locator } from '@playwright/test';
import { YesNoRadioEnum } from '../../helpers/enums/RadioEnums';
import { UpdateContactDetailsPage } from '../update-contact-details/UpdateContactDetailsPage';

export class StopRepresentingClientPage extends UpdateContactDetailsPage {

  private readonly consentToStopRepresentingText: Locator;
  private readonly consentToStopRepresentingRadio: Locator;
  private readonly applicantDetailsPrivateRadio: Locator;
  private readonly respondentDetailsPrivateRadio: Locator;
  private readonly judicialApprovalQuestionText: Locator;
  private readonly judicialApprovalQuestionRadio: Locator;
  private readonly missingClientOrJudicialApprovalError: Locator;
  private readonly areYouSureYouWishToStopRepresentingText: Locator;


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
  
  async consentToStopRepresentingClient(answer: YesNoRadioEnum){
    await expect(this.consentToStopRepresentingText).toBeVisible();
    const radioOption = answer === YesNoRadioEnum.YES ? 'Yes' : 'No'; 
    const radio = this.consentToStopRepresentingRadio.getByLabel(radioOption, { exact: true });
    await radio.check();
  }

  async selectJudicialApprovalQuestion(answer: YesNoRadioEnum){
    await expect(this.judicialApprovalQuestionText).toBeVisible();
    const radioOption = answer === YesNoRadioEnum.YES ? 'Yes' : 'No'; 
    const radio = this.judicialApprovalQuestionRadio.getByLabel(radioOption, { exact: true });
    await radio.check();
  }

  async assertMissingClientOrJudicialApprovalError(){
    await expect(this.missingClientOrJudicialApprovalError).toBeVisible();
  }

  async assertAreYouSureYouWishToStopRepresentingText(){
    await expect(this.areYouSureYouWishToStopRepresentingText).toBeVisible();
  }
}

