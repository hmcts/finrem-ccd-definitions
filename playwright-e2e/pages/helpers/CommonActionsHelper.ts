import { Page } from "playwright";
import { expect } from "@playwright/test";
import config from "../../config/config";

export class CommonActionsHelper {

    async enterUkAddress(page: Page) {
        await page.getByRole('link', { name: 'I can\'t enter a UK postcode' }).click();
        await page.getByRole('textbox', { name: 'Building and Street'}).fill('test');
        await page.getByRole('textbox', { name: 'Address Line 2'}).fill('test');
        await page.getByRole('textbox', { name: 'Town or City'}).fill('test');
        await page.getByRole('textbox', { name: 'County'}).fill('test');
        await page.getByRole('textbox', { name: 'Postcode/Zipcode'}).fill('test');
        await page.getByRole('textbox', { name: 'Country'}).fill('test');
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
            await expect(cancelUploadLocators[i]).toBeDisabled();
        }
        await page.waitForTimeout(5000);
    }
}
