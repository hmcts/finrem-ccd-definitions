import { type Page, type Locator, expect } from '@playwright/test'
import config from '../config/config';

export class SigninPage {
  
  private readonly page: Page;
  private readonly emailInputLocator: Locator;
  private readonly passwordInputLocator: Locator;
  private readonly signinButtonLocator: Locator;

  public constructor(page: Page) {
    this.page = page;
    this.emailInputLocator = page.getByLabel('Email address');
    this.passwordInputLocator = page.getByLabel('Password');
    this.signinButtonLocator = page.getByRole('button', { name: 'Sign in' });
  }

  // async login(email: string, password: string, expectedUrl: string) {   
  //   await expect(this.emailInputLocator).toBeVisible();
  //   await this.emailInputLocator.fill(email);
  //   await expect(this.passwordInputLocator).toBeVisible();
  //   await this.passwordInputLocator.fill(password);
  //   await expect(this.signinButtonLocator).toBeVisible();
  //   await expect(this.signinButtonLocator).toBeEnabled();
  //   await this.signinButtonLocator.click();
  //   await this.page.waitForURL(`${expectedUrl}/*`);
  // }

  async login(email: string, password: string, expectedUrl: string) {
    const maxRetries = 3;
    const retryDelayMs = 500;
  
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await expect(this.emailInputLocator).toBeVisible();
        await this.emailInputLocator.fill(email);
  
        await expect(this.passwordInputLocator).toBeVisible();
        await this.passwordInputLocator.fill(password);
  
        await expect(this.signinButtonLocator).toBeVisible();
        await expect(this.signinButtonLocator).toBeEnabled();
        await this.signinButtonLocator.click();
  
        await this.page.waitForURL(`${expectedUrl}/cases`, { timeout: 2000 });
        return;
      } catch (err) {
        if (attempt === maxRetries) throw err;
        await this.page.waitForTimeout(20);
      }
    }
  }
}
