import { expect, type Locator, type Page } from '@playwright/test';
import { BaseJourneyPage } from '../../BaseJourneyPage.ts';

export class CreateGeneralLetterPage extends BaseJourneyPage {
  private readonly addresseeGroup: Locator;
  private readonly createdByInput: Locator;
  private readonly letterBodyInput: Locator;

  public constructor(page: Page) {
    super(page);
    this.addresseeGroup = page.locator('#generalLetterAddressee');
    this.createdByInput = page.locator('#generalLetterCreatedBy');
    this.letterBodyInput = page.locator('#generalLetterBody');
  }

  async selectAddressee(addressee: string): Promise<void> {
    const option = this.addresseeGroup.getByRole('radio', { name: addressee, exact: true });

    await expect(option).toBeVisible();
    await option.check();
  }

  async enterCreatedBy(name: string): Promise<void> {
    await expect(this.createdByInput).toBeVisible();
    await this.createdByInput.fill(name);
  }

  async enterLetterBody(body: string): Promise<void> {
    await expect(this.letterBodyInput).toBeVisible();
    await this.letterBodyInput.fill(body);
  }
}
