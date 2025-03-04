import { type Page, expect, Locator } from '@playwright/test';
import { BaseJourneyPage } from '../../BaseJourneyPage';

export class CreateCasePage extends BaseJourneyPage {
  
  private readonly createCaseButton: Locator;
  private readonly jurisdictionDropdown: Locator;
  private readonly caseTypeDropdown: Locator;
  private readonly eventDropdown: Locator;
  private readonly startCaseButton: Locator;

  public constructor(page: Page) {
    super(page);
    this.createCaseButton = page.getByRole('link', { name: 'Create case' });
    this.jurisdictionDropdown = page.getByLabel('Jurisdiction');
    this.caseTypeDropdown = page.getByLabel('Case type');
    this.eventDropdown = page.getByLabel('Event');
    this.startCaseButton = page.getByRole('button', { name: 'Start' });
  }

  async startCase(jurisdiction: string, caseType: string, event: string) {
    await this.page.waitForLoadState();
    await expect(this.createCaseButton).toBeVisible();
    await expect(this.createCaseButton).toBeEnabled();
    await this.createCaseButton.click();
    await this.jurisdictionDropdown.selectOption(jurisdiction);
    await this.caseTypeDropdown.selectOption(caseType);
    await this.eventDropdown.selectOption(event);
    await this.startCaseButton.click();
  }
}
                              