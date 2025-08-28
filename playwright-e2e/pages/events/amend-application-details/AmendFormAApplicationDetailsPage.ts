import { Page } from "playwright";
import { BaseJourneyPage } from "../../BaseJourneyPage";
import {Locator} from "@playwright/test";

export class AmendFormAApplicationDetailsPage extends BaseJourneyPage{

    private readonly amendApplicationDetailsTitle: Locator;
    private readonly beforeYouStartTitle: Locator;

    public constructor(page: Page){
        super(page)
        this.amendApplicationDetailsTitle = page.getByRole('heading', { name: 'Amend Application Details' });
        this.beforeYouStartTitle = page.getByRole('heading', { name: 'Before you start' });
    }

    async assertTitleIsVisible() {
        await this.page.waitForLoadState('load');
        await this.amendApplicationDetailsTitle.isVisible();
        await this.beforeYouStartTitle.isVisible();
    }
}
