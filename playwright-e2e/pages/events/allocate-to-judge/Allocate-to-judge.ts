import { type Page, expect, Locator } from '@playwright/test';
import { BaseJourneyPage } from "../../BaseJourneyPage";

export class AllocateToJudgePage extends BaseJourneyPage {
    private allocateToJudgeHeader: Locator;

    public constructor(page: Page) {
        super(page);
        this.allocateToJudgeHeader = page.getByRole('heading', { name: 'Allocate to Judge' });
    }

    async verifyAllocateToJudgeHeader() {
        await expect(this.allocateToJudgeHeader).toBeVisible();
    }
}