import { Page, expect, Locator } from "playwright/test";
import { BaseJourneyPage } from "../../BaseJourneyPage";

export class CreateCaseSavingYourAnswersPage extends BaseJourneyPage{

    private readonly selectedCourtAddress: Locator;
    private readonly selectedCourtPhone: Locator;
    private readonly selectedCourtEmail: Locator;
    private readonly selectedCourtName: Locator;

    public constructor(page: Page){
        super(page)
        this.selectedCourtAddress = page.locator('ccd-field-read[field_id="consentOrderFRCAddress"]');
        this.selectedCourtPhone = page.locator('ccd-field-read[field_id="consentOrderFRCPhone"]');
        this.selectedCourtEmail = page.locator('ccd-field-read[field_id="consentOrderFRCEmail"]');
        this.selectedCourtName = page.locator('ccd-field-read[field_id="consentOrderFRCName"]');
    }

    // Locator concatenates label and address value.
    async checkSelectedCourtAddress(addressValue: string) {
        const addressLabel: string = "Address"
        await expect(this.selectedCourtAddress).toHaveText(addressLabel + addressValue);
    }

    // Locator concatenates label and value.
    async checkSelectedCourtPhone(phoneValue: string) {
        const phoneLabel: string = "Phone";
        await expect(this.selectedCourtPhone).toHaveText(phoneLabel + phoneValue);
    }

    // Locator concatenates label and value.
    async checkSelectedCourtEmail(emailValue: string) {
        const emailLabel: string = "Email"; 
        await expect(this.selectedCourtEmail).toHaveText(emailLabel + emailValue);
    }

    // Locator concatenates label and value. Court name is uppercase in the picklist, Camel case when displayed to user.
    // Making this check case insensitive. 
    async checkSelectedCourtName(nameValue: string) {
        const nameLabel: string = "Court"
        const caseInsensitiveRegex = new RegExp(`${nameLabel}\\s*${nameValue}`, 'i');
        await expect(this.selectedCourtName).toHaveText(caseInsensitiveRegex);
    }
}
