import { type Page, type Locator, expect } from '@playwright/test';
import config from '../config/config';
import exp from 'constants';
import { BaseJourneyPage } from './BaseJourneyPage';

export class ManageOrgDashboardPage extends BaseJourneyPage {
  
  private readonly url: string;
  private readonly signOutButton: Locator;
  private readonly unassignedCasesBtn: Locator;
  private readonly showUnassignedCaseFilterBtn: Locator;
  private readonly caseNumberSearchTxtBox: Locator;
  private readonly applyFilterBtn: Locator;
  private readonly shareCaseBtn: Locator;
  private readonly emailAddressTxtBox: Locator;
  private readonly addBtn: Locator;
 
  public constructor(page: Page) {
    super(page);
    this.url = config.manageOrgBaseURL;
    this.signOutButton = page.getByText('Sign Out');
    this.unassignedCasesBtn = page.getByRole('link', { name: 'Unassigned cases' });
    this.showUnassignedCaseFilterBtn = page.getByRole('button', { name: 'Show unassigned cases filter' });
    this.caseNumberSearchTxtBox = page.getByLabel('Enter the 16-digit case');
    this.applyFilterBtn = page.getByRole('button', { name: 'Apply filter' });
    this.shareCaseBtn = page.getByRole('button', { name: 'Share case' });
    this.emailAddressTxtBox = page.getByLabel('Email address');
    this.addBtn = page.getByRole('button', { name: 'Add' });   
  }

  async assignCaseToRespondent(assigneeEmail: string) {
    await this.shareCaseBtn.click();
    this.emailAddressTxtBox.focus();
    await this.page.keyboard.type(assigneeEmail, { delay: 50 });
    const matSelection = await this.page.getByText(`${assigneeEmail}`);
    await expect(matSelection).toBeVisible();
    await matSelection.click();

    await this.addBtn.isVisible();
    this.addBtn.click();
  }

  async searchAndSelectCaseToAssign(caseId: string) {
    await this.page.waitForLoadState();
    await this.unassignedCasesBtn.click();
    await this.showUnassignedCaseFilterBtn.click();
    await expect(this.caseNumberSearchTxtBox).toBeVisible();
    await this.caseNumberSearchTxtBox.fill(`${caseId}`);
    await this.applyFilterBtn.click();
    this.page.locator(`#select-${caseId}`).click();
  }

  async visit(){
    await this.page.goto(`${this.url}`);
  }
}
