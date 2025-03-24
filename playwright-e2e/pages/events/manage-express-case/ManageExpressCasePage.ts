import { type Page, expect, Locator } from '@playwright/test';
import { BaseJourneyPage } from "../../BaseJourneyPage";

export class ManageExpressCasePage extends BaseJourneyPage {
    private readonly manageExpressCaesTitle: Locator;

    private readonly expressPilotQuestionHeader: Locator;
    private readonly expressPilotQuestion: Locator;

    private readonly expressPilotWasWithdrawnLabel: Locator;
    private readonly expressPilotNotEnrolledLabel: Locator;

    private readonly removeFromExpressPilotWarning: Locator;
    private readonly confirmRemoveCaseFromExpressPilot: Locator;

    public constructor(page: Page) {
        super(page);
        this.manageExpressCaesTitle = page.getByRole('heading', { name: 'Manage Express Case' });

        this.expressPilotQuestionHeader = page.getByText('Express Pilot?')
        this.expressPilotQuestion = page.getByLabel('Express Pilot?');
        this.removeFromExpressPilotWarning = page.getByText("Warning: Once you remove a case from the Express Financial Remedy Pilot, it cannot be re-added so this will be a permanent change.");
        this.confirmRemoveCaseFromExpressPilot = page.locator('input[type="checkbox"][name="confirmRemoveCaseFromExpressPilot"]');

        this.expressPilotWasWithdrawnLabel = page.getByText('This case was removed from the Express Financial Remedy Pilot.');
        this.expressPilotNotEnrolledLabel = page.getByText('This case is not enrolled in the Express Financial Remedy Pilot.');
    }

    async selectExpressPilotQuestion(yesOrNo: string) {
        expect(this.manageExpressCaesTitle).toBeVisible();
        expect(this.expressPilotQuestionHeader).toBeVisible();
        const option = this.page.locator(`input[type="radio"][name="expressPilotQuestion"][id="expressPilotQuestion_${yesOrNo}"]`);
        await option.check();

        // expect the warning to be displayed
        if (yesOrNo === 'No') {
            await this.verifyRemoveFromExpressPilotElements();
        }
    }

    async selectExpressPilotQuestionNo() {
        await this.selectExpressPilotQuestion('No');
    }

    async selectExpressPilotQuestionYes() {
        await this.selectExpressPilotQuestion('Yes');
    }

    async verifyRemoveFromExpressPilotElements() {
        expect(this.removeFromExpressPilotWarning).toBeVisible();
        expect(this.confirmRemoveCaseFromExpressPilot).toBeVisible();
    }

    async verifyExpressPilotWasWithdrawn() {
        expect(this.expressPilotWasWithdrawnLabel).toBeVisible();
    }

    async verifyExpressPilotNotEnrolled() {
        expect(this.expressPilotNotEnrolledLabel).toBeVisible();
    }

    async checkConfirmRemoveCaseFromExpressPilot() {
        expect(this.confirmRemoveCaseFromExpressPilot).toBeVisible();
        await this.confirmRemoveCaseFromExpressPilot.check();
    }

    async uncheckConfirmRemoveCaseFromExpressPilot() {
        expect(this.confirmRemoveCaseFromExpressPilot).toBeVisible();
        await this.confirmRemoveCaseFromExpressPilot.uncheck();
    }
}
