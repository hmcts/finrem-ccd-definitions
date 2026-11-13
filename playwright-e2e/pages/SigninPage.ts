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
   *
   * If Manage Case remains stalled on the loading page, refresh once
   * and retry before failing.
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
      return this.normalisePath(path);
    });

    const acceptedPathSet = new Set(normalisedPaths);

    // Some environments send users to either Cases or Worklist after sign-in.
    if (
      acceptedPathSet.has(this.normalisePath(config.loginPaths.cases)) ||
      acceptedPathSet.has(this.normalisePath(config.loginPaths.worklist))
    ) {
      acceptedPathSet.add(this.normalisePath(config.loginPaths.cases));
      acceptedPathSet.add(this.normalisePath(config.loginPaths.worklist));
    }

    const acceptedPaths = [...acceptedPathSet];

    const isExpectedLandingPath = (url: URL): boolean => {
      const currentPath = url.pathname.replace(/\/+$/, '') || '/';

      return (
        url.origin === expectedOrigin &&
        acceptedPaths.includes(currentPath) &&
        currentPath !== '/'
      );
    };

    await this.login(email, password);

    const maxAttempts = 2;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        // Wait for Manage Case to reach a valid landing page
        await expect(this.page).toHaveURL(
          isExpectedLandingPath,
          { timeout: 20000 }
        );

        return;
      } catch {
        if (attempt === maxAttempts) {
          throw new Error(
            `[SigninPage] Manage Case failed to load after ${maxAttempts} attempts.\n` +
            `Expected paths: ${acceptedPaths.join(', ')}\n` +
            `Actual URL: ${this.page.url()}`
          );
        }

        console.log(
          '[SigninPage] Manage Case still loading. Refreshing and retrying...'
        );

        await this.page.reload({ waitUntil: 'domcontentloaded' });
      }
    }
  }
}
