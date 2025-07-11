import { type Page, expect, Locator } from '@playwright/test';
import { BaseJourneyPage } from '../../BaseJourneyPage';

export class CreateGeneralOrderPage extends BaseJourneyPage {

    private readonly textArea: Locator;
    private readonly checkFillDescriptionLabel: Locator;
    private readonly judgeDropdown: Locator;
    private readonly findJudgeButton: Locator;

    public constructor(page: Page) {
        super(page);
        this.checkFillDescriptionLabel = page.getByLabel("Please fill in the body of the text");
        this.textArea = page.locator('#generalOrderBodyText');
        this.judgeDropdown = page.locator('#generalOrderJudgeType');
        this.findJudgeButton = page.locator('#generalOrderJudgeType');
    }

    async fillDescription(text: string) {
        await expect(this.checkFillDescriptionLabel).toBeVisible(); 
        await this.textArea.fill(text);
    }

    async selectJudge(address: string): Promise<void> {
        await this.judgeDropdown.selectOption({ label: address });
    }

        async clickJudgeButton(): Promise<void> {
       await this.findJudgeButton.click();
    }
}
