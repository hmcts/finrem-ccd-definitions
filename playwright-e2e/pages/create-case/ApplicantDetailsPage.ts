import { type Page, Locator } from '@playwright/test';

export class ApplicantDetailsPage {
    readonly page: Page;

    readonly applicantDetailsPrivateRadio: Locator;

    public constructor(page: Page) {
        this.page = page

        this.applicantDetailsPrivateRadio = page.getByRole('group', { name: 'Keep the Applicant\'s contact' });
    }

    async selectApplicantDetailsPrivate(keepPrivate: boolean) {
        const radioOption = keepPrivate ? 'Yes' : 'No'; 
        const optionToSelect = this.applicantDetailsPrivateRadio.getByLabel(radioOption)
        await optionToSelect.check();
    }
}