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

  private normalisePath(path: string): string {
    return `/${path.replace(/^\/+|\/+$/g, '')}`;
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

    const normalisedPaths = paths.map(path => {return this.normalisePath(path);});

    const acceptedPathSet = new Set(normalisedPaths);

    // Some environments send users to either Cases or Worklist after sign-in.
    if (
      acceptedPathSet.has(this.normalisePath(config.loginPaths.cases))
      || acceptedPathSet.has(this.normalisePath(config.loginPaths.worklist))
    ) {
      acceptedPathSet.add(this.normalisePath(config.loginPaths.cases));
      acceptedPathSet.add(this.normalisePath(config.loginPaths.worklist));
      acceptedPathSet.add('/');
    }

    const acceptedPaths = [...acceptedPathSet];

    const isExpectedLandingPath = (url: URL): boolean => {
      const currentPath = url.pathname.replace(/\/+$/, '') || '/';
      return url.origin === expectedOrigin && acceptedPaths.includes(currentPath);
    };

    await this.login(email, password);

    try {
      await expect(this.page).toHaveURL(
        url => {return isExpectedLandingPath(url);}
      );
    } catch (error) {
      throw new Error(
        'Sign-in succeeded but the user did not land on an expected page.\n' +
        `Expected one of: ${acceptedPaths.join(', ')}\n` +
        `Actual URL: ${this.page.url()}\n` +
        `Cause: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}
