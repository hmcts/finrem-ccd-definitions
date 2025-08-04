import { type Page, expect, Locator } from '@playwright/test';
import { BaseJourneyPage } from '../../BaseJourneyPage';
import {CommonActionsHelper} from "../../helpers/CommonActionsHelper.ts";
import {DateHelper} from "../../../data-utils/DateHelper.ts";

export class CreateGeneralOrderPage extends BaseJourneyPage {

    private readonly textArea: Locator;
    private readonly checkFillDescriptionLabel: Locator;
    private readonly judgeDropdown: Locator;
    private readonly findJudgeButton: Locator;
    private readonly courtOrderDateGroup: Locator;
    private readonly commonActionsHelper: CommonActionsHelper;

    public constructor(page: Page, commonActionsHelper: CommonActionsHelper) {
        super(page);
        this.checkFillDescriptionLabel = page.getByLabel("Please fill in the body of the text");
        this.textArea = page.locator('#generalOrderBodyText');
        this.judgeDropdown = page.locator('#generalOrderJudgeType');
        this.findJudgeButton = page.locator('#generalOrderJudgeType');
        this.courtOrderDateGroup = page.locator('#generalOrderDate');
        this.commonActionsHelper = commonActionsHelper;
    }

    async assertPageTitle(title: string): Promise<void> {
        await expect(this.page.getByRole('heading', { name: title })).toBeVisible();
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

    async enterCourtDate(date?: {year:string, month:string, day:string}) {
        if (date) {
            await this.commonActionsHelper.enterDate(this.courtOrderDateGroup, date);
        } else {
            const [year, month, day] = DateHelper.getCurrentDate().split('-');
            await this.commonActionsHelper.enterDate(this.courtOrderDateGroup, {year, month, day});
        }
    }

    async assertPreviewOfGeneralOrder() {
        await expect(this.page.getByText('Preview of General Order')).toBeVisible();
    }
}
