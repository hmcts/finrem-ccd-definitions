import { type Page, expect, Locator } from '@playwright/test';

export abstract class BaseJourneyPage {
    protected readonly page: Page;

    private readonly continueButton: Locator;
    private readonly previousButton: Locator;
    private readonly confirmButton: Locator;
    private readonly submitButton: Locator;
    private readonly ignoreWarningAndGoButton: Locator;
    private readonly addNewButton: Locator;
    private readonly cancelHyperlink: Locator;
    private readonly spinner: Locator;

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

        await this.wait(100);
        await this.submitButton.click();
        await this.waitForSpinner();

        const rawBody = await waitForPost;
        if (!rawBody) throw new Error('No POST body received');

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

        await expect(this.submitButton).toBeVisible();
        await expect(this.submitButton).toBeEnabled();

        await this.wait(100);
        await this.submitButton.click();
        await this.waitForSpinner();

        const responseBody = await waitForResponse;
        return responseBody;
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
        await this.previousButton.click();
        await this.waitForSpinner();
    }

    async navigateIgnoreWarningAndGo() {
        await this.page.waitForLoadState();
        await expect(this.ignoreWarningAndGoButton).toBeVisible();
        await expect(this.ignoreWarningAndGoButton).toBeEnabled();
        await this.ignoreWarningAndGoButton.click();
        await this.waitForSpinner();
    }

    async navigateCancel() {
        await this.page.waitForLoadState();
        await expect(this.cancelHyperlink).toBeVisible();
        await this.cancelHyperlink.click();
        await this.waitForSpinner();
    }

    async navigateAddNew() {
        await this.page.waitForLoadState();
        await expect(this.addNewButton).toBeVisible();
        await expect(this.addNewButton).toBeEnabled();
        await this.addNewButton.click();
        await this.waitForSpinner();
    }

    async navigateIgnoreWarningAndContinue() {
        const ignoreWarningButton = this.page.getByRole('button', { name: 'Ignore warning and continue' });
        if (await ignoreWarningButton.isVisible().catch(() => false)) {
            await ignoreWarningButton.click();
        }
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

    /**
     * Waits for a network POST request whose URL includes the specified substring,
     * then returns the request's POST data as a string.
     *
     * @param page - The Playwright Page instance to monitor.
     * @param urlPart - A substring to match against the request URL.
     * @returns A promise that resolves with the POST data string, or null if unavailable.
     */
    private async waitForPostRequest(page: Page, urlPart: string): Promise<string | null> {
        const request = await page.waitForRequest(request =>
          request.method() === 'POST' && request.url().includes(urlPart)
        );
        return request.postData();
    }

    /**
     * Waits for a network POST response whose URL includes the specified substring,
     * then returns the parsed JSON response body.
     *
     * @param page - The Playwright Page instance to monitor.
     * @param urlPart - A substring to match against the response URL.
     * @returns A promise that resolves with the parsed JSON of the matching POST response.
     */
    private async waitForPostResponse(page: Page, urlPart: string): Promise<any> {
        const response = await page.waitForResponse(res =>
          res.request().method() === 'POST' && res.url().includes(urlPart)
        );
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
     * Removes content at the specified position by clicking the "Remove" button and confirming the action.
     *
     * @param position - The index of the "Remove" button to click. Defaults to 0 (the first button).
     */
    async removeContent(position: number = 0) {
        const removeDocumentButton = this.page.getByRole("button", { name: "Remove" }).nth(position);
        await expect(removeDocumentButton).toBeVisible();
        await expect(removeDocumentButton).toBeEnabled();
        await removeDocumentButton.click();

        const removeDocumentConfirmButton = this.page.getByRole("button", { name: "Remove" })
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
    async assertDropDownOptionsAreVisible(options: string[], dropDownLocator: Locator) {
        await expect(dropDownLocator).toBeVisible();
        const optionsInDropDown = (await dropDownLocator.locator('option').allTextContents())
            .filter(opt => opt.trim() !== '--Select a value--');
        expect(optionsInDropDown.sort()).toEqual(options.sort());
    }
}
