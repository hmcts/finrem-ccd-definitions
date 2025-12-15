import { type Page, expect, Locator } from '@playwright/test';
import { BaseJourneyPage } from '../../BaseJourneyPage';

export class RemoveCaseDocumentPage extends BaseJourneyPage {
  private removeCaseDocumentHeader: Locator;
  private areYouSureMessage: Locator;
  private removeButtton: Locator;

  public constructor(page: Page) {
    super(page);
    this.removeCaseDocumentHeader = page.getByRole('heading', { name: 'Remove Case Document' });
    this.areYouSureMessage = page.getByRole('heading', {name: 'Are you sure you want to remove the item?'});
    this.removeButtton = page.getByRole('button', { name: 'Remove' });
  }

  async verifyRemoveCaseDocumentPageDisplayed() {
    await expect(this.removeCaseDocumentHeader).toBeVisible();
  }

  /**
   * Clicks the "Remove Documents to remove" button for the specified document index.
   * @param index The document number to remove (1 for the first, 2 for the second, etc.)
   */
  async removeDocument(index: number = 1) {
    const buttonName = index === 1
      ? 'Remove Documents to remove'
      : `Remove Documents to remove ${index}`;
    const removeButton = this.page.getByRole('button', { name: buttonName, exact: true });
    await expect(removeButton).toBeVisible();
    await removeButton.click();
  }

  async assertAreYouSureYouWantToRemoveDocumentMessageIsDisplayed() {
    await expect(this.areYouSureMessage).toBeVisible();
    await expect(this.removeButtton).toBeVisible();
    await this.removeButtton.click();
  }
}
