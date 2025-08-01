import fs from "fs";
import { Page } from "playwright";
import {expect, Locator} from "@playwright/test";
import config from "../../config/config";

export class CommonActionsHelper {

    async enterUkAddress(
        page: Page,
        address?: {
            buildingAndStreet?: string;
            addressLine2?: string;
            townOrCity?: string;
            county?: string;
            postcodeOrZipcode?: string;
            country?: string;
        }
    ) {
        await page.getByRole('link', { name: 'I can\'t enter a UK postcode' }).click();
        await page.getByRole('textbox', { name: 'Building and Street'}).fill(address?.buildingAndStreet ?? 'test');
        await page.getByRole('textbox', { name: 'Address Line 2'}).fill(address?.addressLine2 ?? 'test');
        await page.getByRole('textbox', { name: 'Town or City'}).fill(address?.townOrCity ?? 'test');
        await page.getByRole('textbox', { name: 'County'}).fill(address?.county ?? 'test');
        await page.getByRole('textbox', { name: 'Postcode/Zipcode'}).fill(address?.postcodeOrZipcode ?? 'test');
        await page.getByRole('textbox', { name: 'Country'}).fill(address?.country ?? 'test');
    }

    async enterPhoneNumber(page: Page) {
        await page.getByRole('textbox', { name: 'Phone Number'}).fill('07111111111');
    }

    async enterEmailAddress(page: Page, emailAddress: string) {
        await page.getByRole('textbox', { name: 'Email'}).fill(emailAddress);
    }
    
    async emailConsent(page: Page, caseType: String, consent: boolean) {
        const radioOption = consent ? 'Yes' : 'No';
        if (caseType == config.caseType.contested) {
            const optionToSelect = page.locator(
                '#applicantSolicitorConsentForEmails_radio'
            ).getByLabel(radioOption);
            await optionToSelect.check();
        } else if (caseType == config.caseType.consented) {
            const optionToSelect = page.locator(
               '#solicitorAgreeToReceiveEmails_radio'
            ).getByLabel(radioOption);
            await optionToSelect.check();
        }
    }

    async enterNames(page: Page, fistName: string, lastName: string) {
        await page.getByLabel('Current First and Middle names').click();
        await page.getByLabel('Current First and Middle names').fill(fistName);
        await page.getByLabel('Current Last Name').fill(lastName);
    }

    async waitForAllUploadsToBeCompleted(page: Page) {
        const cancelUploadLocators = await page.getByText('Cancel upload').all();
        for (let i = 0; i < cancelUploadLocators.length; i++) {
            await expect(cancelUploadLocators[i]).toBeDisabled({ timeout: 15000 });
        }
        const uploadingSpan = await page.locator('span', { hasText: 'Uploading...' }).all();
        for (let i = 0; i < uploadingSpan.length; i++) {
            await expect(uploadingSpan[i]).toBeHidden({ timeout: 10000 });
        }
    }

    /** 
     * Creates a payload object for a PDF file with a new alias name.
     * Can be passed to the setInputFiles method of a locator.
     *
     * @param filePath - The path to the original PDF file.
     * @param newFilename - The new name to assign to the PDF file in the payload.
     * @returns An object containing the new filename, pdf MIME type, and file buffer.
     */
    async createAliasPDFPayload(filePath: string, newFilename: string) {
    const fileBuffer = fs.readFileSync(filePath);
        return {
            name: newFilename,
            mimeType: "application/pdf",
            buffer: fileBuffer,
        };
    }

    async uploadWithRateLimitRetry(
        page: Page,
        uploadField: Locator,
        fileToUpload: { name: string; mimeType: string; buffer: Buffer<ArrayBuffer> } | string,
        maxRetries: number = 5,
        waitMs: number = 5000
    ) {
        for (let attempt = 0; attempt < maxRetries; attempt++) {
            await uploadField.setInputFiles(fileToUpload);

            await this.waitForAllUploadsToBeCompleted(page);

            // Check for rate limit error in a preceding span sibling
            const errorLocator = uploadField.locator(
                'xpath=../preceding-sibling::span[contains(text(), "Your request was rate limited. Please wait a few seconds before retrying your document upload")]'
            );
            const isErrorVisible = await errorLocator.isVisible({ timeout: 2000 });

            if (!isErrorVisible) {
                return; // Success
            }
            if (attempt < maxRetries - 1) {
                await page.waitForTimeout(waitMs);
            } else {
                throw new Error('Rate limit error persists after retries');
            }
        }
    }

    async enterDate(element: Locator, date: {year: string, month: string, day: string}) {
        const day = element.locator(`input[id*='-day']`);
        const month = element.locator(`input[id*='-month']`);
        const year = element.locator(`input[id*='-year']`);

        await expect(day).toBeVisible();
        await expect(month).toBeVisible();
        await expect(year).toBeVisible();

        await day.fill(date.day);
        await month.fill(date.month);
        await year.fill(date.year);
    }
}
