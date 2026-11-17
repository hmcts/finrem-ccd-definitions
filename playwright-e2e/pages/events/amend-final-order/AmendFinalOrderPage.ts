import { expect } from '@playwright/test';
import { BaseJourneyPage } from '../../BaseJourneyPage.ts';

export class AmendFinalOrderPage extends BaseJourneyPage {

  async completeAmendFinalOrderEvent(): Promise<void> {
    await this.navigateContinue();
    await this.page.getByRole('button', { name: 'Submit' }).click();
    await expect(this.page.getByText('has been updated')).toBeVisible();
  }
}
