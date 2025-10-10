import {expect, Locator, type Page} from '@playwright/test';
import {BaseJourneyPage} from "../../BaseJourneyPage";
import {CommonActionsHelper} from "../../helpers/CommonActionsHelper.ts";
import {DateHelper} from "../../../data-utils/DateHelper.ts";

export class AllocateToJudgePage extends BaseJourneyPage {
    private allocateToJudgeHeader: Locator;
    private readonly assignToJudgeHeader: Locator;
    private readonly assignToJudgeReason: Locator;
    private readonly assignToJudgeList: Locator;
    private readonly assignToJudgeDate: Locator;
    private readonly assignToJudgeText: Locator;

    private readonly commonActionsHelper: CommonActionsHelper;

    public constructor(page: Page, commonActionsHelper: CommonActionsHelper) {
        super(page);
        this.allocateToJudgeHeader = page.getByRole('heading', { name: 'Allocate to Judge' });
        this.assignToJudgeHeader = page.getByRole('heading', { name: 'Update Assign to Judge' });
        this.assignToJudgeReason = page.locator(`#assignedToJudgeReason`);
        this.assignToJudgeList = page.locator(`#assignedToJudge`);
        this.assignToJudgeDate = page.locator(`#referToJudgeDateFromConsOrdMade`);
        this.assignToJudgeText = page.locator(`#referToJudgeTextFromConsOrdMade`);
        this.commonActionsHelper = commonActionsHelper;
    }

    async verifyAllocateToJudgeHeader() {
        await expect(this.allocateToJudgeHeader).toBeVisible();
    }

    async verifyAssignToJudgeHeader() {
        await expect(this.assignToJudgeHeader).toBeVisible();
    }

    async selectAssignToJudgeReason(reason: string) {
        await expect(this.assignToJudgeReason).toBeVisible();
        await this.assignToJudgeReason.selectOption(reason);
    }

    async selectAssignToJudgeList(judge: string) {
        await expect(this.assignToJudgeList).toBeVisible();
        await this.assignToJudgeList.selectOption(judge);
    }

    async enterAssignToJudgeDate(date?: {year:string, month:string, day:string}) {
        if (date) {
            await this.commonActionsHelper.enterDate(this.assignToJudgeDate, date);
        } else {
            const [year, month, day] = DateHelper.getCurrentDate().split('-');
            await this.commonActionsHelper.enterDate(this.assignToJudgeDate, {year, month, day});
        }
    }

    async enterAssignToJudgeText(text: string) {
        await expect(this.assignToJudgeText).toBeVisible();
        await this.assignToJudgeText.fill(text);
    }

}

