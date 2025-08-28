import {BaseJourneyPage} from "./BaseJourneyPage.ts";
import {Locator, Page} from "@playwright/test";
import {expect} from "../fixtures/fixtures.ts";

export class NoticeOfChangePage extends BaseJourneyPage {

  private readonly noticeOfChangeButton: Locator;
  private readonly noticeOfChangePageTitle: Locator;
  private readonly onlineCaseReferenceInput: Locator;
  private readonly enterClientsDetailsTitle: Locator;
  private readonly clientFirstNameInput: Locator;
  private readonly clientLastNameInput: Locator;
  private readonly alreadyHasAccessToCaseTitle: Locator;
  private readonly checkAndSubmitTitle: Locator;
  private readonly iConfirmAllDetailsAreCorrectCheckbox: Locator;
  private readonly iServedNoticeOfChangeToEveryPartyCheckbox: Locator;


  public constructor(page: Page) {
    super(page);
    this.noticeOfChangeButton = page.getByRole('link', { name: ' Notice of change ' });
    this.noticeOfChangePageTitle = page.getByRole('heading', { name: 'Notice of change' });
    this.onlineCaseReferenceInput = page.getByLabel('Online case reference number');
    this.alreadyHasAccessToCaseTitle = page.getByRole('heading', { name: 'Your organisation already has access to this case' });
    this.enterClientsDetailsTitle = page.getByRole('heading', { name: `Enter your client's details` });
    this.clientFirstNameInput = page.getByLabel(`Your client's first name and any middle names`);
    this.clientLastNameInput = page.getByLabel(`Your client's last name`);
    this.checkAndSubmitTitle = page.getByRole('heading', { name: 'Check and submit' });
    this.iConfirmAllDetailsAreCorrectCheckbox = page.getByLabel('I confirm all these details are accurate and match what is written on the case.');
    this.iServedNoticeOfChangeToEveryPartyCheckbox = page.getByLabel('I have served notice of this change on every party to the case, including the former legal representative (if there was one).');
  }

  async navigateToNoticeOfChange() {
    await this.page.waitForLoadState();
    await this.noticeOfChangeButton.click();
    await this.noticeOfChangePageTitle.waitFor({ state: 'visible' });
  }

  async enterOnlineCaseReference(caseNumber: string) {
    await this.onlineCaseReferenceInput.waitFor({ state: 'visible' });
    await this.onlineCaseReferenceInput.fill(caseNumber);
  }

  async enterClientsDetails(firstName: string, lastName: string) {
    await this.clientFirstNameInput.waitFor({ state: 'visible' });
    await this.enterClientsDetailsTitle.isVisible();
    await this.clientFirstNameInput.fill(firstName);
    await this.clientLastNameInput.fill(lastName);
  }

  async assertAlreadyHasAccessToCase() {
    await this.alreadyHasAccessToCaseTitle.waitFor({ state: 'visible' });
  }

  async assertErrorMessageClientDetailsShouldExactlyMatch() {
    await this.assertErrorMessage(['Enter the client details exactly as they\'re written on the case, including any mistakes'])
  }

  async assertSummaryList(key: string, value: string) {
    const caseNumberValue = this.page.getByText(key)
      .locator('..')
      .getByText(value);
    await caseNumberValue.waitFor({ state: 'visible' });
    await expect(caseNumberValue).toHaveText(value);
  }

  async assertCheckAndSubmitPage(caseNumber: string, firstName: string, lastName: string) {
    await this.checkAndSubmitTitle.waitFor({ state: 'visible' });
    await this.assertSummaryList('Request', 'Notice of change');
    await this.assertSummaryList('Case number', caseNumber);
    await this.assertSummaryList(`Your client's first name and any middle names`, firstName);
    await this.assertSummaryList(`Your client's last name`, lastName);
  }

  async checkAllCheckboxes() {
    await this.iConfirmAllDetailsAreCorrectCheckbox.check();
    await this.iServedNoticeOfChangeToEveryPartyCheckbox.check();
  }

  async assertNoticeOfChangeSuccessMessage(caseId: string) {
    const successMessage = this.page.getByRole('heading', { name: 'Notice of change successful' });
    await successMessage.waitFor({ state: 'visible' });
    await expect(successMessage).toBeVisible();
    const act = await successMessage.textContent();
    console.log(act);

    await expect(this.page.getByText(String(caseId).replace(/(\d{4})(?=\d)/g, '$1-'))).toBeVisible();

  }


}
