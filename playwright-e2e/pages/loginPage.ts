import { type Page, type Locator } from '@playwright/test';
import config from '../config';

export class LoginPage {
  
  private readonly page: Page;
  private readonly url: string;
  private readonly emailInputLocator: Locator;
  private readonly passwordInputLocator: Locator;
  private readonly signinButtonLocator: Locator;

  public constructor(page: Page) {
    this.page = page;
    this.url = config.manageCaseBaseURL;
    this.emailInputLocator = page.getByLabel('Email address');
    this.passwordInputLocator = page.getByLabel('Password');
    this.signinButtonLocator = page.getByRole('button', { name: 'Sign in' });
  }

  async login(email: string, password: string) {
    await this.page.goto(this.url);
    await this.emailInputLocator.fill(email);
    await this.passwordInputLocator.fill(password);
    await this.signinButtonLocator.click();
    await this.page.waitForLoadState();
  }
}
