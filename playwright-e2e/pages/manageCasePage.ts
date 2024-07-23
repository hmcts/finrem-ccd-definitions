import { type Page, expect, Locator } from '@playwright/test';

export class manageCasePage {
  readonly page: Page;
  readonly createCaseButton: Locator;
  readonly jurisdictionDropdown: Locator;
  readonly caseTypeDropdown: Locator;
  readonly eventDropdown: Locator;
  readonly startCaseButton: Locator;

  public constructor(page: Page) {
    this.page = page;
    this.createCaseButton = page.getByRole('link', { name: 'Create case' });
    this.jurisdictionDropdown = page.getByLabel('Jurisdiction');
    this.caseTypeDropdown = page.getByLabel('Case type');
    this.eventDropdown = page.getByLabel('Event');
    this.startCaseButton = page.getByRole('button', { name: 'Start' });
  }

  async startCase(jurisdiction: string, caseType: string) {
    await expect(this.createCaseButton).toBeVisible();
    await this.createCaseButton.click();
    await this.jurisdictionDropdown.selectOption(jurisdiction);
    await this.caseTypeDropdown.selectOption(caseType);
    await this.startCaseButton.click();
  }
}
