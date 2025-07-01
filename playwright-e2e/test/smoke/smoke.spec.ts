import { test } from '../../fixtures/fixtures';
import config from '../../config/config';

test(
    'Smoke Test - Check env running and can login',
    { tag: ['@smoke-test'] },
    async (
      { 
        loginPage,
        manageCaseDashboardPage,
      },
    ) => {
      await manageCaseDashboardPage.visit();
      await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
    }
);
