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

  async navigateToCase(caseId: string, canView: boolean = true) {
    await this.page.waitForLoadState();
    const url = `${this.url}/cases/case-details/${caseId}`;
    await this.page.goto(url);
    if (canView) {
      await expect(this.page.getByText(String(caseId).replace(/(\d{4})(?=\d)/g, '$1-'))).toBeVisible();
    } else {
      await expect(this.page.getByText(String(caseId).replace(/(\d{4})(?=\d)/g, '$1-'))).not.toBeVisible();
    }
  }

  async visit(){
    await this.page.goto(`${this.url}`);
  }

  async signOut() {
    await this.page.waitForLoadState();
    await this.signOutButton.click();
  }

}
