import { type Page, expect, Locator } from '@playwright/test';
import { BaseJourneyPage } from '../../BaseJourneyPage';

export class ManageExpressCasePage extends BaseJourneyPage {
  private readonly manageExpressCaseTitle: Locator;

  private readonly expressPilotQuestionHeader: Locator;

  public constructor(page: Page) {
    super(page);
    this.manageExpressCaseTitle = page.getByRole('heading', { name: 'Manage Express Case' });

    this.expressPilotQuestionHeader = page.getByText('Should this case be allocated to the Express Pilot?');
  }

  async selectExpressPilotQuestion(yesOrNo: string) {
    await expect(this.manageExpressCaseTitle).toBeVisible();
    await expect(this.expressPilotQuestionHeader).toBeVisible();
    const option = this.page.locator(`input[type="radio"][name="shouldAllocateToExpressPilot"][id="shouldAllocateToExpressPilot_${yesOrNo}"]`);
    await option.check();
  }

  async selectExpressPilotQuestionNo() {
    await this.selectExpressPilotQuestion('No');
  }
}
