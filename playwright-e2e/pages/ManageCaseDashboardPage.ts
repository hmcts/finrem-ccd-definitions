import { type Page, type Locator, expect } from '@playwright/test';
import config from '../config';

export class ManageCaseDashboardPage {
  
  private readonly page: Page;
  private readonly url: string;

  public constructor(page: Page) {
    this.page = page;
    this.url = config.manageCaseBaseURL;
  }

  async navigateToCase(caseId: string) {
    await this.page.goto(`${this.url}/v2/${caseId}`);
  }
}
