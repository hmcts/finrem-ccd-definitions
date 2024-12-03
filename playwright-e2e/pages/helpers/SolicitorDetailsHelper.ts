import { Locator, Page } from "playwright";
import { expect } from "playwright/test";

export class SolicitorDetailsHelper {

    async selectOrganisation(page: Page, orgName: string) {
        const selectOrgButton = (orgName: string) =>
            page.locator(
                `table#organisation-table tr td.td-select a[title^="Select the organisation ${orgName}"]`
            );

        await page.getByLabel('You can only search for').fill(orgName);
        await expect(page.locator('table#organisation-table')).toBeVisible();
        const selectButton = selectOrgButton(orgName);
        await selectButton.click();
    }

    async enterSolicitorName(page: Page, solicitorName: string) {
        await page.getByLabel('Solicitor’s name').fill(solicitorName);
    }

    async enterFirmName(page: Page, firmName: string) {
        await page.getByLabel('Name of your firm').fill(firmName);
    }
}
