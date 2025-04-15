import { type Page, expect, Locator } from '@playwright/test';

export abstract class BaseJourneyPage {
  protected readonly page: Page;

  private readonly continueButton: Locator;
  private readonly previousButton: Locator;
  private readonly confirmButton: Locator;
  private readonly submitButton: Locator
  private readonly cancelHyperlink: Locator;
  private readonly spinner: Locator;

  readonly thereIsAProblemHeader: Locator;
  private readonly fieldIsRequiredErrorMessage: Locator;

  public constructor(page: Page) {
    this.page = page;

    this.submitButton = page.getByRole('button', { name: 'Submit' });
    this.continueButton = page.getByRole('button', { name: 'Continue' });
    this.previousButton = page.getByRole('button', { name: 'Previous' });
    this.confirmButton = page.getByRole('button', { name: 'Confirm' });
    this.cancelHyperlink = page.getByRole('link', { name: 'Cancel' });
    this.spinner = this.page.locator("xuilib-loading-spinner");

    this.thereIsAProblemHeader = page.getByRole('heading', { name: 'There is a problem' });
    // error messages
    this.fieldIsRequiredErrorMessage = page.getByText('Field is required');
  }

  async navigateSubmit() {
    await this.page.waitForLoadState();
    await expect(this.submitButton).toBeVisible();
    await expect(this.submitButton).toBeEnabled();
    await this.wait(100); // if wait is not added, valdation message (such as "the field is required") is not displayed
    await this.submitButton.click();
    await this.waitForSpinner();
  }

  async navigateContinue() {
    await this.page.waitForLoadState();
    await expect(this.continueButton).toBeVisible();
    await expect(this.continueButton).toBeEnabled();
    await this.wait(100); // if wait is not added, valdation message (such as "the field is required") is not displayed
    await this.continueButton.click({ force: true });
    await this.waitForSpinner();
  }

  async navigateConfirm() {
    await this.page.waitForLoadState();
    await expect(this.confirmButton).toBeVisible();
    await expect(this.confirmButton).toBeEnabled();
    await this.confirmButton.click();
    await this.waitForSpinner();
  }

  async navigatePrevious() {
    await this.page.waitForLoadState();
    await expect(this.previousButton).toBeVisible();
    await expect(this.previousButton).toBeEnabled();
    await this.continueButton.click();
    await this.waitForSpinner();
  }

  async navigateCancel() {
    await this.page.waitForLoadState();
    await expect(this.cancelHyperlink).toBeVisible();
    await this.cancelHyperlink.click();
    await this.waitForSpinner();
  }

  async wait(timeout: number) {
    await this.page.waitForTimeout(timeout);
  }

  private async waitForSpinner() {
    await expect
      .poll(
        async () => {
          const spinnerCount = await this.spinner.count();
          return spinnerCount;
        })
      .toBe(0);
  }

  async verifyFieldIsRequiredMessageShown() {
    await expect(this.thereIsAProblemHeader).toBeVisible();
    await expect(this.fieldIsRequiredErrorMessage).toBeVisible();
  }
}
