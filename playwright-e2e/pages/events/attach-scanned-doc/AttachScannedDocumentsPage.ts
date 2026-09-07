import { expect, type Locator, type Page } from '@playwright/test';
import { BaseJourneyPage } from '../../BaseJourneyPage.ts';

export class AttachScannedDocumentsPage extends BaseJourneyPage {
  private readonly supplementaryEvidenceGroup: Locator;

  public constructor(page: Page) {
    super(page);
    this.supplementaryEvidenceGroup = page.getByRole('group', {
      name: 'Supplementary evidence handled'
    });
  }

  async completeAttachScannedDocumentsEvent(
    supplementaryEvidenceHandled: boolean
  ): Promise<void> {
    await this.navigateContinue();

    if (supplementaryEvidenceHandled) {
      await this.supplementaryEvidenceGroup.getByLabel('Yes').check();
    } else {
      await this.supplementaryEvidenceGroup.getByLabel('No').check();
    }

    await this.navigateContinue();
    await this.page.getByRole('button', { name: 'Submit' }).click();
    await expect(this.page.getByText('has been updated')).toBeVisible();
  }
}
