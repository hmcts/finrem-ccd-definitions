import { type Page, expect, Locator } from '@playwright/test';
import { BaseJourneyPage } from '../../BaseJourneyPage';
import { CommonActionsHelper } from '../../helpers/CommonActionsHelper';

export class SendOrderPage extends BaseJourneyPage {
  private readonly commonActionsHelper: CommonActionsHelper;
  private readonly uploadLabel: Locator;
  private readonly uploadInput: Locator;
  private readonly caseStateButton: Locator;
  private readonly caseStateDropdown: Locator;
  private readonly includeSupportingDocQuestionCheckbox: Locator;

  public constructor(page: Page, commonActionsHelper: CommonActionsHelper) {
    super(page);
    this.commonActionsHelper = commonActionsHelper;
    this.uploadLabel = page.getByText('Please upload any additional document (Optional');
    this.uploadInput = page.locator('#additionalDocument'); 
    this.caseStateButton = page.locator('#sendOrderPostStateOption');
    this.caseStateDropdown = page.locator('#sendOrderPostStateOption'); 
    this.includeSupportingDocQuestionCheckbox = page.getByRole('checkbox', { name: 'Yes' });

  }

  async selectSendApprovedOrder(position: number = 0) {
    const radio = this.page.locator(`#ordersToSend_value_${position}_documentToShare_Yes`);
    await radio.check();
  }

  async includeSupportingDocQuestion() {
    expect(this.includeSupportingDocQuestionCheckbox).toBeVisible();
    await this.includeSupportingDocQuestionCheckbox.check();
  }

  async selectSupportingDocument(orderPosition: number = 1, attachmentPosition: number = 0) {
    const radio = this.page.locator(
      `#ordersToSend_value_${orderPosition}_attachmentsToShare_${attachmentPosition}_documentToShare_Yes`
    );
    await expect(radio).toBeVisible();
    await radio.check();
  }

  async whoShouldReceiveOrder(partyNames: string[] = ['Applicant - Frodo Baggins', 'Respondent - Smeagol Gollum']) {
    for (const name of partyNames) {
      const checkbox = this.page.getByRole('checkbox', { name });
      await expect(checkbox).toBeVisible();
      await expect(checkbox).toBeChecked();
    }
  }

  // Upload a document
  async uploadDocument(filePath: string) {
    await expect(this.uploadLabel).toBeVisible();
    await this.uploadInput.setInputFiles(filePath);;
  }

  async clickCaseStateButton(): Promise<void> {
    await this.caseStateButton.click();
  }

  async selectCaseState(state: string): Promise<void> {
    await this.caseStateDropdown.selectOption({ label: state });
  }
}
