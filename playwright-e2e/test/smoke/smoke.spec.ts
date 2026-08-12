import { test } from '../../fixtures/fixtures';
import config from '../../config/config';

test('Smoke Test - Check env running and can login',
  { tag: ['@smoke-test'] },
  async (
    {
      loginPage,
      manageCaseDashboardPage
    }
  ) => {
    await manageCaseDashboardPage.visit();

    console.log(`[INFO] LR debug | config.waEnabled: ${config.waEnabled}`);
    if (config.waEnabled) {
        console.log(`[INFO] LR debug | WA ENABLED, login path check: ${config.loginPaths.worklist}`);
        await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
    } else {
        console.log(`[INFO] LR debug | WA DISABLED, login path check: ${config.loginPaths.cases}`);
        await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.cases);
    }

  }
);
