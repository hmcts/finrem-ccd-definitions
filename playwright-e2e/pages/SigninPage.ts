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

    const normalisedPaths = paths.map(path => {
      return `/${path.replace(/^\/+|\/+$/g, '')}`;
    });

    const acceptedPathSet = new Set(normalisedPaths);

    // Some environments land users on either Cases or Worklist after login.
    if (
      acceptedPathSet.has(`/${config.loginPaths.cases}`)
      || acceptedPathSet.has(`/${config.loginPaths.worklist}`)
    ) {
      acceptedPathSet.add(`/${config.loginPaths.cases}`);
      acceptedPathSet.add(`/${config.loginPaths.worklist}`);
      acceptedPathSet.add('/');
    }

    const acceptedPaths = [...acceptedPathSet];

    const timeout = expectedUrl === 'http://localhost:3000'
      ? 5000
      : 30000;

    const isExpectedLandingPath = (urlString: string): boolean => {
      const currentUrl = new URL(urlString);
      const currentPath = currentUrl.pathname.replace(/\/+$/, '') || '/';
      return currentUrl.origin === expectedOrigin && acceptedPaths.includes(currentPath);
    };

    await this.login(email, password);

    try {
      await expect
        .poll(() => {return isExpectedLandingPath(this.page.url());}, { timeout })
        .toBeTruthy();
    } catch (error) {
      throw new Error(
        'Login succeeded but user did not land on an expected page.\n' +
        `Expected one of: ${acceptedPaths.join(', ')}\n` +
        `Actual URL: ${this.page.url()}\n` +
        `Cause: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}
