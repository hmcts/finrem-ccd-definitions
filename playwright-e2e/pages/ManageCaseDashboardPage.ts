import { type Page, type Locator, expect } from '@playwright/test';
import config from '../config/config';

export class ManageCaseDashboardPage {
  
  private readonly page: Page;
  private readonly url: string;
  private readonly signOutButton: Locator;

  public constructor(page: Page) {
    this.page = page;
    this.url = config.manageCaseBaseURL;
    this.signOutButton = page.getByText('Sign Out');
  }

  async navigateToCase(caseId: string) {
    await this.page.waitForLoadState();
    const url = `${this.url}/cases/case-details/${caseId}`;
    await this.page.goto(url);
    await expect(this.page.getByText(String(caseId).replace(/(\d{4})(?=\d)/g, '$1-'))).toBeVisible();
  }

  async visit(){
    await this.page.goto(`${this.url}`);
  }

  async wait(timeout: number) {
    await this.page.waitForTimeout(timeout)
  }

  async signOut() {
    await this.page.waitForLoadState();
    await this.signOutButton.click();
  }
}
