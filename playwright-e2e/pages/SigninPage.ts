import { type Page, type Locator, expect } from '@playwright/test';
import { BaseJourneyPage } from './BaseJourneyPage';
import config from '../config/config.ts';

export class SigninPage extends BaseJourneyPage {

  private readonly emailInputLocator: Locator;
  private readonly passwordInputLocator: Locator;

  public constructor(page: Page) {
    super(page);

    this.emailInputLocator = page.getByLabel('Enter your email address');
    this.passwordInputLocator = page.getByRole('textbox', { name: 'Password' });
  }

  private async login(email: string, password: string): Promise<void> {
    await expect(this.emailInputLocator).toBeVisible();
    await this.emailInputLocator.fill(email);

    await this.navigateContinue();

    await expect(this.passwordInputLocator).toBeVisible();
    await this.passwordInputLocator.fill(password);

    await this.navigateContinue();
  }

  async loginCaseworker(): Promise<void> {
    await this.loginWaitForPath(
      config.caseWorker.email,
      config.caseWorker.password,
      config.manageCaseBaseURL,
      [
        config.loginPaths.cases,
        config.loginPaths.worklist
      ]
    );
  }

  /**
   * Logs in and waits for one of the expected landing paths.
   *
   * A single path can be supplied for users with one expected landing page,
   * or multiple paths where more than one landing page is valid.
   */
  async loginWaitForPath(
    email: string,
    password: string,
    expectedUrl: string,
    requiredPaths: string | string[]
  ): Promise<void> {

    const paths = Array.isArray(requiredPaths)
      ? requiredPaths
      : [requiredPaths];

    const expectedOrigin = new URL(expectedUrl).origin;

    const normalisedPaths = paths.map(path =>
    {return `/${path.replace(/^\/+|\/+$/g, '')}`;}
    );

    const timeout = expectedUrl === 'http://localhost:3000'
      ? 5000
      : 30000;

    await this.login(email, password);

    try {
      await this.page.waitForURL(
        url => {
          const currentPath = url.pathname.replace(/\/+$/, '') || '/';

          return (
            url.origin === expectedOrigin &&
            normalisedPaths.includes(currentPath)
          );
        },
        { timeout }
      );
    } catch (error) {
      throw new Error(
        'Login succeeded but user did not land on an expected page.\n' +
        `Expected one of: ${normalisedPaths.join(', ')}\n` +
        `Actual URL: ${this.page.url()}\n` +
        `Cause: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}
