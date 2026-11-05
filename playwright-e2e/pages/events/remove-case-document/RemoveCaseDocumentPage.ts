import { type Page, expect, Locator } from '@playwright/test';
import { BaseJourneyPage } from '../../BaseJourneyPage';

export class RemoveCaseDocumentPage extends BaseJourneyPage {
  private removeCaseDocumentHeader: Locator;
  private areYouSureMessage: Locator;
  private removeButton: Locator;

  public constructor(page: Page) {
    super(page);
    this.removeCaseDocumentHeader = page.getByRole('heading', { name: 'Remove Case Document' });
    this.areYouSureMessage = page.getByRole('heading', {name: 'Are you sure you want to remove the item?'});
    this.removeButton = page.getByRole('button', { name: 'Remove' });
  }

  async verifyRemoveCaseDocumentPageDisplayed() {
    await expect(this.removeCaseDocumentHeader).toBeVisible();
  }
}
