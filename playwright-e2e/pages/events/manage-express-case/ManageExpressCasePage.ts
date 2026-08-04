import { type Page, expect, Locator } from '@playwright/test';
import { BaseJourneyPage } from '../../BaseJourneyPage';

export class ManageExpressCasePage extends BaseJourneyPage {
  private readonly manageExpressCaseTitle: Locator;

  private readonly expressPilotQuestionHeader: Locator;

  private readonly expressPilotNotEnrolledLabel: Locator;

  private readonly removeFromExpressPilotWarning: Locator;
  private readonly confirmRemoveCaseFromExpressPilot: Locator;

  public constructor(page: Page) {
    super(page);
    this.manageExpressCaseTitle = page.getByRole('heading', { name: 'Manage Express Case' });

    this.expressPilotQuestionHeader = page.getByText('Should this case be allocated to the Express Pilot?');
    this.removeFromExpressPilotWarning = page.getByText('Warning: Once you remove a case from the Express Financial Remedy Pilot, it cannot be re-added so this will be a permanent change.');
    this.confirmRemoveCaseFromExpressPilot = page.locator('input[type="checkbox"][name="confirmRemoveCaseFromExpressPilot"]');

    this.expressPilotNotEnrolledLabel = page.getByText('This case is not enrolled in the Express Financial Remedy Pilot.');
  }

  async selectExpressPilotQuestion(yesOrNo: string) {
    expect(this.manageExpressCaseTitle).toBeVisible();
    expect(this.expressPilotQuestionHeader).toBeVisible();
    const option = this.page.locator(`input[type="radio"][name="shouldAllocateToExpressPilot"][id="shouldAllocateToExpressPilot_${yesOrNo}"]`);
    await option.check();
  }

  async selectExpressPilotQuestionNo() {
    await this.selectExpressPilotQuestion('No');
  }

  async verifyRemoveFromExpressPilotElements() {
    expect(this.removeFromExpressPilotWarning).toBeVisible();
    expect(this.confirmRemoveCaseFromExpressPilot).toBeVisible();
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
