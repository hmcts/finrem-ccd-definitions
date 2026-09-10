import { expect, Locator, type Page } from '@playwright/test';
import { FieldDescriptor } from './components/field_descriptor.ts';
import { DateHelper } from '../data-utils/DateHelper.ts';

export abstract class BaseJourneyPage {
  protected readonly page: Page;

  protected readonly continueButton: Locator;
  private readonly previousButton: Locator;
  private readonly confirmButton: Locator;
  private readonly submitButton: Locator;
  private readonly ignoreWarningAndGoButton: Locator;
  private readonly addNewButton: Locator;
  private readonly cancelHyperlink: Locator;
  private readonly spinner: Locator;
  private readonly eventSummaryTextBox: Locator;

  readonly thereIsAProblemHeader: Locator;
  private readonly fieldIsRequiredErrorMessage: Locator;
  private readonly submitAndReturnEventButton: Locator;

  public constructor(page: Page) {
    this.page = page;
    this.submitButton = page.getByRole('button', { name: 'Submit' });
    this.submitAndReturnEventButton = page.getByRole('button', { name: 'Submit' });
    this.continueButton = page.getByRole('button', { name: 'Continue' });
    this.previousButton = page.getByRole('button', { name: 'Previous' });
    this.confirmButton = page.getByRole('button', { name: 'Confirm' });
    this.ignoreWarningAndGoButton = page.getByRole('button', { name: 'Ignore Warning and Go' });
    this.addNewButton = page.getByRole('button', { name: 'Add new' }).nth(0);
    this.cancelHyperlink = page.getByRole('link', { name: 'Cancel' });
    this.spinner = this.page.locator('xuilib-loading-spinner');
    this.eventSummaryTextBox = page.getByRole('textbox', { name: 'Event summary (optional) A' });

    this.thereIsAProblemHeader = page.getByRole('heading', { name: 'There is a problem' });

    // error messages
    this.fieldIsRequiredErrorMessage = page.getByText('Field is required');
  }

  async assertPageHeading(heading: string) {
    const pageHeading = this.page.getByRole('heading', { name: heading });
    await expect(pageHeading).toBeVisible();
  }

  async enterEventSummary(summary: string) {
    await expect(this.eventSummaryTextBox).toBeVisible();
    await this.eventSummaryTextBox.fill(summary);
  }

  async navigateSubmit() {
    await this.page.waitForLoadState('domcontentloaded');
    await this.submitButton.scrollIntoViewIfNeeded();
    await expect(this.submitButton).toBeVisible();
    await expect(this.submitButton).toBeEnabled();

    await this.clickAndWaitForNavigation(this.submitButton);

    const submissionDateAndTime = DateHelper.getCurrentDateTimeFull();
    return submissionDateAndTime;
  }

  /**
   * Same as the usual navigateSubmit, also returns what was sent with the POST.
   * Useful to refer to generated values in follow up test steps.
   *
   * @returns A promise that resolves with the parsed JSON POST body of the `/events` request.
   * @throws body of the `/events` request.
   */
  async navigateSubmitAndReturnEventRequest(): Promise<any> {
    const waitForPost = this.waitForPostRequest(this.page, '/events');

    await expect(this.submitButton).toBeVisible();
    await expect(this.submitButton).toBeEnabled();

    await this.clickAndWaitForNavigation(this.submitButton);

    const rawBody = await waitForPost;

    if (!rawBody) {
      throw new Error('No POST body received');
    }

    const body = JSON.parse(rawBody);
    return body;
  }

  /**
   * Same as the usual navigateSubmit, also returns what was returned from the POST.
   * Useful to refer to generated values in follow up test steps.
   *
   * @returns body of the `/events` response.
   */
  async navigateSubmitAndReturnEventResponse(): Promise<any> {
    const waitForResponse = this.waitForPostResponse(this.page, '/events');

    await this.submitButton.scrollIntoViewIfNeeded();
    await expect(this.submitButton).toBeVisible();
    await expect(this.submitButton).toBeEnabled();

    await this.clickAndWaitForNavigation(this.submitButton);

    const responseBody = await waitForResponse;
    return responseBody;
  }

  public async navigateContinue(
    expectedUrl?: string,
    pageNumber?: number
  ): Promise<void> {
    await this.waitForContinueToBeReady();

    // Keep pageNumber in the signature so existing tests do not need changing.
    void pageNumber;

    /*
     * Continue pages commonly have another Continue button on the following
     * screen. Requiring navigation here prevents this method finishing while
     * the previous page is still transitioning.
     */
    await this.clickAndWaitForNavigation(
      this.continueButton,
      expectedUrl,
      true
    );
  }

  async navigateConfirm() {
    await this.page.waitForLoadState('domcontentloaded');
    await this.confirmButton.scrollIntoViewIfNeeded();
    await expect(this.confirmButton).toBeVisible();
    await expect(this.confirmButton).toBeEnabled();

    await this.clickAndWaitForNavigation(this.confirmButton);
  }

  async navigatePrevious() {
    await this.page.waitForLoadState('domcontentloaded');
    await this.previousButton.scrollIntoViewIfNeeded();
    await expect(this.previousButton).toBeVisible();
    await expect(this.previousButton).toBeEnabled();

    await this.clickAndWaitForNavigation(this.previousButton);
  }

  async navigateIgnoreWarningAndGo() {
    await this.page.waitForLoadState('domcontentloaded');
    await this.ignoreWarningAndGoButton.scrollIntoViewIfNeeded();
    await expect(this.ignoreWarningAndGoButton).toBeVisible();
    await expect(this.ignoreWarningAndGoButton).toBeEnabled();

    await this.clickAndWaitForNavigation(
      this.ignoreWarningAndGoButton,
      undefined,
      false
    );
  }

  async navigateCancel() {
    await this.page.waitForLoadState('domcontentloaded');
    await this.cancelHyperlink.scrollIntoViewIfNeeded();
    await expect(this.cancelHyperlink).toBeVisible();

    await this.clickAndWaitForNavigation(this.cancelHyperlink);
  }

  getAddNewButton(position: number = 0): Locator {
    return this.page.getByRole('button', { name: 'Add new' }).nth(position);
  }

  async navigateAddNew(position: number = 0) {
    const addNewButton = this.getAddNewButton(position);

    await this.page.waitForLoadState('domcontentloaded');
    await addNewButton.scrollIntoViewIfNeeded();
    await expect(addNewButton).toBeVisible();
    await expect(addNewButton).toBeEnabled();

    await addNewButton.click();

    await this.waitForSpinner();
  }

  async navigateIgnoreWarningAndContinue() {
    const ignoreWarningButton = this.page.getByRole(
      'button',
      { name: 'Ignore warning and continue' }
    );

    if (
      await ignoreWarningButton
        .isVisible()
        .catch(() => {return false;})
    ) {
      await ignoreWarningButton.click();
    }
  }

  async wait(timeout: number) {
    await this.page.waitForTimeout(timeout);
  }

  /**
   * Ensures Continue is genuinely ready before attempting to click it.
   */
  private async waitForContinueToBeReady() {
    await this.page.waitForLoadState('domcontentloaded');

    await this.waitForSpinner();

    await this.continueButton.scrollIntoViewIfNeeded();

    await expect(this.continueButton).toBeVisible({
      timeout: 10_000
    });

    await expect(this.continueButton).toBeEnabled({
      timeout: 10_000
    });

    await this.waitForSpinner();
  }

  /**
   * Wait until no visible XUI loading spinner exists.
   *
   * The spinner can appear and disappear very quickly, so we do not require
   * it to become visible first. We simply prevent interaction while one is
   * visible.
   */
  private async waitForSpinner() {
    await expect
      .poll(
        async () => {
          return await this.page
            .locator('xuilib-loading-spinner:visible')
            .count();
        },
        {
          timeout: 15_000
        }
      )
      .toBe(0);
  }

  private async waitForUrlChange(initialUrl: string) {
    await this.page.waitForURL(
      url => {
        return url.toString() !== initialUrl;
      },
      {
        timeout: 30_000
      }
    );
  }

  /**
   * Clicks the supplied button once and waits for the resulting page state.
   *
   * IMPORTANT:
   * We deliberately do not manually retry the click here.
   *
   * A Locator such as:
   *
   *   page.getByRole('button', { name: 'Continue' })
   *
   * is evaluated against the current DOM. If page A and page B both contain
   * a Continue button, manually retrying that locator after page A begins
   * navigating can result in the retry clicking page B's Continue button.
   *
   * Playwright already performs its own actionability waiting when click()
   * is called, so an additional retry loop is unnecessary and can cause
   * double navigation.
   */
  private async clickAndWaitForNavigation(
    button: Locator,
    expectedUrl?: string,
    requireUrlChange: boolean = false
  ) {
    await this.waitForSpinner();

    const initialUrl = this.page.url();

    /*
     * Capture the actual element that exists on THIS page.
     *
     * This is intentional. A normal Playwright Locator is "live" and can
     * resolve to an equivalent button on the next page if the DOM changes.
     * The ElementHandle refers specifically to the current button.
     */
    const buttonHandle = await button.elementHandle();

    if (!buttonHandle) {
      throw new Error(
        `Unable to find navigation button before clicking. Current URL: ${initialUrl}`
      );
    }

    /*
     * Set up URL waiting BEFORE clicking so that a very fast navigation
     * cannot occur between the click and us starting to listen for it.
     */
    let navigationPromise: Promise<void> | undefined;

    if (expectedUrl) {
      navigationPromise = this.page.waitForURL(
        url => {
          const currentUrl = url.toString();

          return (
            currentUrl !== initialUrl &&
            currentUrl.includes(expectedUrl)
          );
        },
        {
          timeout: 30_000
        }
      );
    } else if (requireUrlChange) {
      navigationPromise = this.waitForUrlChange(initialUrl);
    }

    /*
     * Click THIS element once.
     *
     * If navigation replaces the DOM, this ElementHandle cannot suddenly
     * resolve to the Continue button on the next page.
     */
    await buttonHandle.click({
      timeout: 10_000,
      noWaitAfter: true
    });

    /*
     * For Continue we require the URL to change before allowing the caller
     * to perform its next action.
     */
    if (navigationPromise) {
      await navigationPromise;
    }

    /*
     * Navigation may complete before XUI has finished rendering/loading.
     */
    await this.page.waitForLoadState('domcontentloaded');

    await this.waitForSpinner();
  }

  async verifyFieldIsRequiredMessageShown() {
    await expect(this.thereIsAProblemHeader).toBeVisible();
    await expect(this.fieldIsRequiredErrorMessage).toBeVisible();
  }

  /**
   * Waits for a network POST request whose URL includes the specified substring,
   * then returns the request's POST data as a string.
   *
   * @param page - The Playwright Page instance to monitor.
   * @param urlPart - A substring to match against the request URL.
   * @returns A promise that resolves with the POST data string, or null if unavailable.
   */
  private async waitForPostRequest(
    page: Page,
    urlPart: string
  ): Promise<string | null> {
    const request = await page.waitForRequest(request => {
      return (
        request.method() === 'POST' &&
        request.url().includes(urlPart)
      );
    });

    return request.postData();
  }

  /**
   * Waits for a network POST response whose URL includes the specified substring,
   * then returns the parsed JSON response body.
   *
   * @param page - The Playwright Page instance to monitor.
   * @param urlPart - A substring to match against the response URL.
   * @returns The parsed JSON of the matching POST response.
   */
  private async waitForPostResponse(
    page: Page,
    urlPart: string
  ): Promise<any> {
    const response = await page.waitForResponse(res => {
      return (
        res.request().method() === 'POST' &&
        res.url().includes(urlPart)
      );
    });

    return await response.json();
  }

  /**
   * Asserts that each error message in the provided array is visible on the page.
   *
   * @param errorMessages - An array of error message strings to check for visibility.
   * Each message is expected to be present and visible on the current page.
   */
  async assertErrorMessage(errorMessages: string[]) {
    for (const errorMessage of errorMessages) {
      const errorLocators = this.page.getByText(errorMessage);
      const count = await errorLocators.count();

      for (let i = 0; i < count; i++) {
        const errorLocator = errorLocators.nth(i);
        await expect(errorLocator).toBeVisible();
      }
    }
  }

  /**
   * Removes content at the specified position by clicking the "Remove" button
   * and confirming the action.
   *
   * @param position - The index of the "Remove" button to click.
   * Defaults to 0 (the first button).
   */
  async removeContent(position: number = 0) {
    const removeDocumentButton = this.page
      .getByRole('button', { name: 'Remove' })
      .nth(position);

    await expect(removeDocumentButton).toBeVisible();
    await expect(removeDocumentButton).toBeEnabled();

    await removeDocumentButton.click();

    const removeDocumentConfirmButton = this.page.getByRole(
      'button',
      { name: 'Remove' }
    );

    await expect(removeDocumentConfirmButton).toBeVisible();
    await expect(removeDocumentConfirmButton).toBeEnabled();

    await removeDocumentConfirmButton.click();
  }

  /**
   * Asserts that the dropdown contains the expected options.
   *
   * @param options - The expected list of option strings.
   * @param dropDownLocator - The Playwright Locator for the dropdown element.
   */
  async assertDropDownOptionsAreVisible(
    options: string[],
    dropDownLocator: Locator
  ) {
    await expect(dropDownLocator).toBeVisible();

    const optionsInDropDown = (
      await dropDownLocator.locator('option').allTextContents()
    ).filter(opt => {
      return opt.trim() !== '--Select a value--';
    });

    expect(optionsInDropDown.sort()).toEqual(options.sort());
  }

  /**
   * Selects (checks) one or more checkboxes on the page by their accessible labels.
   *
   * This method iterates over the provided array of label strings, finds the checkbox
   * corresponding to each label using Playwright's getByRole with name and exact true,
   * ensures the checkbox is visible and enabled, and then checks it.
   *
   * @param labels - An array of strings, each representing the accessible label
   * of a checkbox to select.
   */
  async selectCheckboxByLabel(labels: string[]) {
    for (const item of labels) {
      const checkbox = this.page.getByRole(
        'checkbox',
        {
          name: item,
          exact: true
        }
      );

      await expect(checkbox).toBeVisible();
      await expect(checkbox).toBeEnabled();

      await checkbox.check();
    }
  }

  /**
   * Validates a list of form fields on the page according to their descriptors.
   *
   * @param fields An array of FieldDescriptor objects describing the fields
   * to validate.
   */
  async validateFields(fields: FieldDescriptor[]) {
    const errors: string[] = [];

    for (const field of fields) {
      try {
        let locator: Locator;

        if (field.locator) {
          locator = this.page.locator(field.locator);
        } else if (field.label) {
          locator = this.page.getByLabel(field.label);
        } else {
          throw new Error(
            'Field must have either label or css selector'
          );
        }

        if (field.position !== undefined) {
          locator = locator.nth(field.position);
        }

        switch (field.type) {
        case 'input':
          await expect(locator).toHaveValue(
            field.expectedValue as string
          );
          break;

        case 'select': {
          const selectedOption = locator.locator('option:checked');

          await expect(selectedOption).toHaveText(
            field.expectedValue as string
          );

          break;
        }

        case 'radio': {
          const radioLocator = locator.getByLabel(
            field.expectedValue as string,
            {
              exact: true
            }
          );

          await expect(radioLocator).toBeChecked();

          break;
        }

        case 'checkbox':
          locator = this.page.getByRole(
            'checkbox',
            {
              name: field.label
            }
          );

          if (field.position !== undefined) {
            locator = locator.nth(field.position);
          }

          if (field.expectedValue) {
            await expect(locator).toBeChecked();
          } else {
            await expect(locator).not.toBeChecked();
          }

          break;

        case 'date': {
          const [year, month, day] = (
            field.expectedValue as string
          ).split('-');

          await expect(
            locator.getByLabel('Day')
          ).toHaveValue(day);

          await expect(
            locator.getByLabel('Month')
          ).toHaveValue(month);

          await expect(
            locator.getByLabel('Year')
          ).toHaveValue(year);

          break;
        }

        case 'file':
          await expect(
            locator.locator('a')
          ).toHaveText(field.expectedValue as string);

          break;

        default:
          throw new Error(
            `Unsupported field type: ${field.type}`
          );
        }
      } catch (error) {
        errors.push(
          `Validation failed for field ${
            field.label || field.locator
          } of type "${field.type}": ${
            error instanceof Error
              ? error.message
              : error
          }`
        );
      }
    }

    if (errors.length > 0) {
      throw new Error(errors.join('\n'));
    }
  }
}
