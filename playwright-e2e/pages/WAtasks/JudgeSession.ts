import type { Page } from '@playwright/test';
import config from '../../config/config.ts';
import type { SigninPage } from '../SigninPage.ts';
import type { ManageCaseDashboardPage } from '../ManageCaseDashboardPage.ts';

export type JudgeCredentials = {
  email: string;
  password: string;
};

// Signs judges in and out of Manage Case for the WA task tests. Each sign-in
// is a fresh login, so a test never depends on a session from another test.
export class JudgeSession {

  public constructor(
    private readonly page: Page,
    private readonly loginPage: SigninPage,
    private readonly manageCaseDashboardPage: ManageCaseDashboardPage
  ) {}

  async signIn({ email, password }: JudgeCredentials): Promise<void> {
    await this.manageCaseDashboardPage.visit();
    await this.loginPage.loginWaitForPath(
      email,
      password,
      config.manageCaseBaseURL,
      config.loginPaths.worklist
    );
  }

  async signInAndOpenCase(credentials: JudgeCredentials, caseId: string): Promise<void> {
    await this.signIn(credentials);
    await this.manageCaseDashboardPage.navigateToCase(caseId);
  }

  // Waits until Manage Case has sent the browser to IDAM, so the next judge
  // doesn't sign in before the sign-out has finished.
  async signOut(): Promise<void> {
    const manageCaseOrigin = new URL(config.manageCaseBaseURL).origin;
    await this.manageCaseDashboardPage.signOut();
    await this.page.waitForURL((url) => {
      return url.origin !== manageCaseOrigin;
    }, { timeout: 30_000 });
  }
}
