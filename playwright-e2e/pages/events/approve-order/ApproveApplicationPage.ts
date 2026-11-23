import { expect, Locator, Page } from '@playwright/test';
import { BaseJourneyPage } from '../../BaseJourneyPage';
import {CommonActionsHelper} from '../../helpers/CommonActionsHelper.ts';

// The order details shared by Approve Application and Upload Approved Order.
export interface ApprovedOrderDetails {
  subjectToDecreeAbsolute: boolean;
  servePensionProvider: boolean;
  // Only asked when servePensionProvider is true, e.g. 'The Court'.
  pensionProviderResponsibility?: string;
  judgeTitle: string;
  judgeName: string;
}

export class ApproveApplicationPage extends BaseJourneyPage {

  private readonly subjectToRadio: Locator;
  private readonly pensionProviderRadio: Locator;
  private readonly judgeDropDown: Locator;
  private readonly judgeNameInput: Locator;
  private readonly uploadConsentOrderFileUpload: Locator;
  private readonly commonActionsHelper: CommonActionsHelper;


  public constructor(page: Page, commonActionsHelper: CommonActionsHelper) {
    super(page);
    this.subjectToRadio = page.locator('#orderDirectionAbsolute_radio');
    this.pensionProviderRadio = page.locator('#servePensionProvider_radio');
    this.judgeDropDown = page.getByLabel('Select Judge');
    this.judgeNameInput = page.locator('#orderDirectionJudgeName');
    this.uploadConsentOrderFileUpload = this.page.locator('#uploadApprovedConsentOrder');
    this.commonActionsHelper = new CommonActionsHelper();
  }

  async selectIsSubjectTo(isSubjectTo: Boolean){
    const radioOption = isSubjectTo ? 'Yes' : 'No'; 
    const optionToSelect = this.subjectToRadio.getByLabel(radioOption);
    await optionToSelect.check();
  }

  async selectIsPensionProvider(isPensionProvider: Boolean){
    const radioOption = isPensionProvider ? 'Yes' : 'No'; 
    const optionToSelect = this.pensionProviderRadio.getByLabel(radioOption);
    await optionToSelect.check();
  }

  async selectJudge(judge: string){
    await this.judgeDropDown.selectOption(judge);
  }

  async selectPensionProviderResponsibility(responsibility: string) {
    const responsibilityRadio = this.page.getByRole('radio', { name: responsibility, exact: true });
    await expect(responsibilityRadio).toBeVisible();
    await responsibilityRadio.check();
  }

  async enterJudgeName(name: string) {
    await expect(this.judgeNameInput).toBeVisible();
    await this.judgeNameInput.fill(name);
  }

  async uploadConsentOrderFile(documentName: string) {
    const filePayload = await this.commonActionsHelper.createAliasPDFPayload('./playwright-e2e/resources/file/test.pdf', documentName);
    await this.commonActionsHelper.uploadWithRateLimitRetry(this.page, this.uploadConsentOrderFileUpload, filePayload);
  }

  // Fills in and submits the Approve Application event.
  async completeApproveApplication(details: ApprovedOrderDetails): Promise<void> {
    await this.fillOrderDetails(details);
    await this.navigateContinue();
    await this.navigateSubmit();
  }

  // Fills in and submits the (consented) Upload Approved Order event.
  async completeUploadApprovedOrder(
    details: ApprovedOrderDetails & { fileName: string }
  ): Promise<void> {
    await this.fillOrderDetails(details);
    await this.uploadConsentOrderFile(details.fileName);
    await this.navigateContinue();
    await this.navigateSubmit();
  }

  private async fillOrderDetails(details: ApprovedOrderDetails): Promise<void> {
    await this.selectIsSubjectTo(details.subjectToDecreeAbsolute);
    await this.selectIsPensionProvider(details.servePensionProvider);
    if (details.servePensionProvider && details.pensionProviderResponsibility) {
      await this.selectPensionProviderResponsibility(details.pensionProviderResponsibility);
    }
    await this.selectJudge(details.judgeTitle);
    await this.enterJudgeName(details.judgeName);
  }

}
