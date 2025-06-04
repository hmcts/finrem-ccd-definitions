import {Locator, Page} from "@playwright/test";


export class CheckYourAnswersPage {
    private readonly page: Page;
    private readonly checkYourAnswersTitle: Locator;
    private readonly checkYourAnswersTable: Locator;

    public constructor(page: Page) {
        this.page = page;
        this.checkYourAnswersTitle = page.getByRole('heading', { name: 'Check your answers' });
        this.checkYourAnswersTable = page.locator("table[aria-describedby='check your answers table']");
    }

}