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
    await this.page.waitForLoadState('domcontentloaded');

    const caseDetailsPath = `/cases/case-details/${caseId}`;
    const caseDetailsUrl = `${this.url}${caseDetailsPath}`;

    for (let attempt = 1; attempt <= 3; attempt++) {
      await this.page.goto(caseDetailsUrl, { waitUntil: 'domcontentloaded' });

      const currentPath = new URL(this.page.url()).pathname;
      const onCaseDetailsPage = currentPath.includes('/cases/case-details/') && currentPath.includes(caseId);
      if (currentPath === caseDetailsPath || onCaseDetailsPage) {
        return;
      }

      if (attempt < 3) {
        await this.page.waitForTimeout(1500);
      }
    }

    if (canView) {
      throw new Error(`Could not open case details for case ${caseId}. Current URL: ${this.page.url()}`);
    }

    await expect(this.page).toHaveURL(/\/cases(?:\/|$)/);
  }

  async navigateToTab(tab: CaseTab): Promise<void> {
    const tabLocator = this.page.getByRole('tab', { name: tab });

    await expect(tabLocator).toBeVisible();
    await tabLocator.click();

    await expect(tabLocator).toHaveAttribute('aria-selected', 'true');
  }

  async visit(): Promise<void>{
    await this.page.goto(`${this.url}`);
  }

  async signOut() {
    await this.page.waitForLoadState();
    await this.signOutButton.click();
  }

}

export enum CaseTab {
  History = 'History',
  CaseDocuments = 'Case documents',
  ConfDocuments = 'Confidential Documents',
  Tasks = 'Tasks'
}
