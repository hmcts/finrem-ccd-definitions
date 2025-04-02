import { type Page, type Locator, expect } from '@playwright/test';

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

  // Generic login for any user.  No retries, less reliable.
  async login(email: string, password: string, expectedUrl: string) {   
    await expect(this.emailInputLocator).toBeVisible();
    await this.emailInputLocator.fill(email);
    await expect(this.passwordInputLocator).toBeVisible();
    await this.passwordInputLocator.fill(password);
    await expect(this.signinButtonLocator).toBeVisible();
    await expect(this.signinButtonLocator).toBeEnabled();
    await this.signinButtonLocator.click();
    await this.page.waitForURL(`${expectedUrl}/*`);
  }

  // Resilient login.  Requires the path that you expect a User to land on.
  // For instance, Solictors and Caseworker land on pages with different paths.
  // Faster timeout works for local running, but remains as safer Playwright default for AAT.
  async loginWaitForPath(email: string, password: string, expectedUrl: string, requiredPath: string) {
    const maxRetries = 10;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await expect(this.emailInputLocator).toBeVisible();
        await this.emailInputLocator.fill(email);

        await expect(this.passwordInputLocator).toBeVisible();
        await this.passwordInputLocator.fill(password);

        await expect(this.signinButtonLocator).toBeVisible();
        await expect(this.signinButtonLocator).toBeEnabled();
        await this.signinButtonLocator.click();
        
        let timeoutAmount = 30000;
        if ( expectedUrl === 'http://localhost:3000') {
          timeoutAmount = 2000;
        }

        await this.page.waitForURL(`${expectedUrl}/${requiredPath}`, { timeout: timeoutAmount });
        return;
      } catch (err) {
        if (attempt === maxRetries) throw err;
        await this.page.waitForTimeout(200);
      }
    }
  }
}
