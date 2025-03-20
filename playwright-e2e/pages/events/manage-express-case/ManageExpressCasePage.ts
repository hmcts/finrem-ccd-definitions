import { type Page, expect, Locator } from '@playwright/test';
import { BaseJourneyPage } from "../../BaseJourneyPage";

export class ManageExpressCasePage extends BaseJourneyPage {
    private readonly manageExpressCaesTitle: Locator;

    private readonly expressPilotQuestionHeader: Locator;
    private readonly expressPilotQuestion: Locator;

    private readonly removeFromExpressPilotWarning: Locator;
    private readonly confirmRemoveCaseFromExpressPilot: Locator;
    private readonly thereIsAProblemHeader: Locator;

    // messages
    private readonly fieldIsRequiredErrorMessage: Locator;

    public constructor(page: Page) {
        super(page);
        this.thereIsAProblemHeader = page.getByRole('heading', { name: 'There is a problem' });
        this.manageExpressCaesTitle = page.getByRole('heading', { name: 'Manage Express Case' });

        // error messages
        this.fieldIsRequiredErrorMessage = page.getByText('Field is required');

        this.expressPilotQuestionHeader = page.getByText('Express Pilot?')
        this.expressPilotQuestion = page.getByLabel('Express Pilot?');
        this.removeFromExpressPilotWarning = page.getByText("Warning: Once you remove a case from the Express Financial Remedy Pilot, it cannot be re-added so this will be a permanent change.");
        this.confirmRemoveCaseFromExpressPilot = page.locator('input[type="checkbox"][name="confirmRemoveCaseFromExpressPilot"]');
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

    async checkConfirmRemoveCaseFromExpressPilot() {
        expect(this.confirmRemoveCaseFromExpressPilot).toBeVisible();
        await this.confirmRemoveCaseFromExpressPilot.check();
    }

    async uncheckConfirmRemoveCaseFromExpressPilot() {
        expect(this.confirmRemoveCaseFromExpressPilot).toBeVisible();
        await this.confirmRemoveCaseFromExpressPilot.uncheck();
    }

    async verifyFieldIsRequiredMessageShown() {
        await expect(this.thereIsAProblemHeader).toBeVisible();
        await expect(this.fieldIsRequiredErrorMessage).toBeVisible();
    }
}
