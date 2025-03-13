import { type Page, expect, Locator } from '@playwright/test';
import { BaseJourneyPage } from '../../BaseJourneyPage';
import { Context } from 'node:vm';

export class ExpressCaseEnrolledPage extends BaseJourneyPage {

    private readonly guidanceLink: Locator;
    private readonly guidanceLinkUrl: string = "https://www.gov.uk/guidance/what-to-expect-if-you-are-in-the-express-financial-remedy-pilot";
    private readonly guidancePageContent: string = "Page not found";

    public constructor(page: Page) {
        super(page);
        this.guidanceLink = page.locator(`a[href="${this.guidanceLinkUrl}"]`);
    }

    /**
    * Checks the correct GOV.UK Express Case guidance URL is visible on the page.
    * Opens the same URL in a new page, called GovUkGuidancePage.
    * Checks that the expected content is showing on GovUkGuidancePage.
    * Closes the GovUkGuidancePage when done.
    *
    * NOTE: Page not on GOV.UK yet, so looking for "Page not found".
    */
    async checkLinkResolves() {
        // Check for correct URL on page.
        await expect(this.guidanceLink).toBeVisible();
        // Go to the URL, in a new page, then check the content is correct.
        const GovUkGuidancePage:Page = await this.page.context().newPage();
        await GovUkGuidancePage.goto(this.guidanceLinkUrl);
        await expect(GovUkGuidancePage.locator(`text=${this.guidancePageContent}`)).toBeVisible();
        await GovUkGuidancePage.close();
    }
}
