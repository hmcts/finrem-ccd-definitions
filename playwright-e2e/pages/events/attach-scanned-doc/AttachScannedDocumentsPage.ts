import { expect, type Page } from '@playwright/test';

export class AttachScannedDocumentsPage {
  public constructor(private readonly page: Page) {}

  async completeAttachScannedDocumentsEvent(
    supplementaryEvidenceHandled: boolean
  ): Promise<void> {
    await this.page.getByRole('button', { name: 'Continue' }).click();
    await this.page
      .getByRole('group', { name: 'Supplementary evidence handled' })
      .getByLabel(supplementaryEvidenceHandled ? 'Yes' : 'No')
      .check();
    await this.page.getByRole('button', { name: 'Continue' }).click();
    await this.page.getByRole('button', { name: 'Submit' }).click();
    await expect(this.page.getByText('has been updated')).toBeVisible();
  }
}
