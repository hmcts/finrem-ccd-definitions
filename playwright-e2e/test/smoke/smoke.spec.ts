import { test } from '../../fixtures/fixtures';
import config from '../../config/config';
// NOTE: When we remove codecept tests, bring utils and test data into the playwright directory
import * as utils from '../../../test/helpers/utils';

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
      await loginPage.login(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL);
    }
);
