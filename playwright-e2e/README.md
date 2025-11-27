# Playwright End to End suite

End to End testing suite using:

- Playwright https://playwright.dev/
- TypeScript https://www.typescriptlang.org/

## 🤖 Starting up

For all options take a look at https://playwright.dev/docs/running-tests

To execute test through cmd, run 'yarn playwright test <optional file path>' from the Terminal. 
It is also recommend to utilise the [Playwright VSCode](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright) plugin for test development. This provides IDE breakpoint debugging, alongside DOM component identification. 


## 📁 Structure

```sh
|- playwright-e2e
|-|- config # Essential settings and constants for the framework, such as user credentials and URLs.

|-|- data-utils #Contains all the tests data construction utilities 
|-|-|- factory # Contains case data factories for constructing test case data (Spit between Consented and Contested, the factories call CaseDataBuilder and iteratively make calls to respective EventApi to progress a case to the desired state). A factory method should always create a case and return the case_id of the constructed case.
|-|-|- api # Contains API interaction classes ConsentedEventApi, and ContestedEventApi which leverage the CcdApi to construct and send payloads to trigger case events.

|-|- fixtures # With fixtures, you can group tests based on their meaning, instead of their common setup.

|-|- pages # Where to keep page classes with respective locators and methods. We utilise POM (Page Object Modeling).
|-|-|- <Folder of journey specific pages i.e. 'FR_amend_application'> # Pages are collected by the journey in which they are contained, this can be shared across Contested and Consented where appropriate.
|-|-|- BaseJourneyPage.ts # All journey pages inherit from the abstract BaseJourneyPage, which defines common behaviours across pages. 
|-|-|- helpers # Common functionality between pages such as adding addresses is abstracted to helper classes, that can then be injected into page constructors at a fixture level. 

|-|- resources # Contains static resources such as JSON files, test documents, static content assertion templates, or other assets used in tests.

|-|- test # Contains all test files organized by case type and functionality.
|-|-|- contested i.e. 'FR_amend_application' # Contains tests for contested cases, collected by event.
|-|-|- consented # Contains tests for consented cases.

 playwright.config.ts # This sits outside the playwright-e2e folder, but is the config file for Playwright-only tests.
 .env # This sits outside the playwright-e2e folder, and is required to run your tests locally. See Setup Environment Variables below.
```

## 🔐 Setup Environment Variables

This repository contains automation tests that can be run locally. To set up the environment variables for configuring URLs and passwords, follow the instructions below:

1. Create a .env file in the root directory of the project if it does not already exist.
This file must NOT be committed to GitHub

2. Add the required environment variables (ask a teammate for values or check Azure Key Vault).
Example template:

export PLAYWRIGHT_SOLICITOR_USERNAME=
export PLAYWRIGHT_SOLICITOR_PSWD=

export PLAYWRIGHT_RESPONDENT_SOL_USERNAME=
export PLAYWRIGHT_RESPONDENT_SOL_PSWD=

export PLAYWRIGHT_RESP_CAA_USERNAME=
export PLAYWRIGHT_RESP_CAA_PSWD=
export PLAYWRIGHT_APPL_CAA_USERNAME=
export PLAYWRIGHT_APPL_CAA_PSWD=
export PLAYWRIGHT_APPL_CAA2_USERNAME=
export PLAYWRIGHT_APPL_CAA2_PSWD=
export PLAYWRIGHT_RESP_CAA2_USERNAME=
export PLAYWRIGHT_RESP_CAA2_PSWD=

export PLAYWRIGHT_APPL_INTERVENER_USERNAME=
export PLAYWRIGHT_APPL_INTERVENER_PSWD=
export PLAYWRIGHT_RESP_INTERVENER_USERNAME=
export PLAYWRIGHT_RESP_INTERVENER_PSWD=

export USERNAME_BARRISTER1=
export PASSWORD_BARRISTER1=
export PLAYWRIGHT_RESP_BARRISTER_USERNAME=
export PLAYWRIGHT_RESP_BARRISTER_PSWD=

export PLAYWRIGHT_SOLICITOR2_USERNAME=
export PLAYWRIGHT_SOLICITOR2_PSWD=
export PLAYWRIGHT_RESPONDENT_SOL2_USERNAME=
export PLAYWRIGHT_RESPONDENT_SOL2_PSWD=

export CCD_ADMIN_USER_NAME=
export CCD_ADMIN_PASSWORD=
export USERNAME_SOLICITOR=
export PASSWORD_SOLICITOR=
export USERNAME_CASEWORKER=
export PASSWORD_CASEWORKER=
export USERNAME_JUDGE=
export PASSWORD_JUDGE=
export USERNAME_CAA=
export PASSWORD_CAA=
export USERNAME_RESPONDENT_SOLICITOR=

# Secrets / Tokens
export IDAM_CLIENT_SECRET=
export CCD_SUBMIT_S2S_SECRET=
export FINREM_IDAM_CLIENT_SECRET=
export FINREM_SYSTEMUPDATE_USERNAME=
export FINREM_SYSTEMUPDATE_PASSWORD=
export FINREM_CASE_ORCHESTRATION_SERVICE_S2S_KEY=

# Test Flags
export NIGHTLY_TEST=
export TESTS_FOR_ACCESSIBILITY=

# Base URLs (used depending on RUNNING_ENV)

# Main URLs (can be overridden by environment blocks below)
export CCD_ADMIN_URL=
export CCD_WEB_URL=
export CCD_DATA_API_URL=
export XUI_ORG_WEB_URL=
export MANAGE_ORG_API_BASE_URL=
export IDAM_API_URL=

###############################################
# Environment Selection 
###############################################
# Set this to choose which environment to run against:
# You can control which environment the test suite runs against by setting the RUNNING_ENV variable.

# Supported values:

aat

demo

pr-1234 (replace 1234 with the PR number you want to test against)

# Local Environment

If you want to run tests against local dev environment, override the following URLs so they point to your local containers::

export CCD_WEB_URL=
export CCD_DATA_API_URL=
export XUI_ORG_WEB_URL=
export MANAGE_ORG_API_BASE_URL=

3. Save the .env file.

## Install Dependencies

Before running the automation tests, ensure that all necessary dependencies are installed and source your .env file. You can do this by running:

```
yarn install
```

## Code Linting

We use ESLint to ensure consistent code quality, formatting, and filename conventions across the project.

* Running Linting

To check for linting errors, run:

`yarn lint`

* Fixing Linting Errors

To automatically fix linting issues where possible, run:

`yarn lint --fix`

* Filename Conventions

To avoid linting errors, filenames must follow these conventions:

- snake_case: playwright-e2e/test/**, playwright-e2e/resources/tab_content/**

- kebab-case: playwright-e2e/config/**, playwright-e2e/fixtures/**, playwright-e2e/resources/** (excluding tab_content)

- PascalCase: playwright-e2e/pages/**, playwright-e2e/data-utils/**

- camelCase: playwright-e2e/helpers/**

Example:

✅ login_page.spec.ts (snake_case)

✅ checkout-flow.json (kebab-case)

❌ LoginPage.spec.ts (should be snake_case for test files)

ESLint is configured with eslint-plugin-unicorn to enforce these rules automatically for file names in their respective folders.

## Running Tests

Once the environment variables are configured and dependencies are installed, you can run the automation tests using the following command:
```
yarn playwright test <./playwright-e2e/functional/test_folder/test_file.ts>
```

Running all the tests using the VS Code extension can be very resource intensive, instead you can run all test headless through the terminal using cmd. You can also generate a HTML report by passing the --reporter=html flag
```
yarn playwright test playwright-e2e --project=edge --reporter=html
```


## 🎬 Debugging

Playwright provides a couple of great debugging capabilities at all levels. The ones that you will probably find most useful are:

For all options take a look at https://playwright.dev/docs/debug