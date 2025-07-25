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

1. Create a .env  file in the root directory of this project if it doesn't already exist.

2. Add the following environment variables to the .env file: (ask a team mate for details/values can be found in Azure Keyvault)
    - Can set ENVIRONMENT to use the default URLs for that environment (local/aat/demo/perftest/ithc)


```
export PLAYWRIGHT_SOLICITOR_USERNAME=example@mailinator.com
export PLAYWRIGHT_SOLICITOR_PSWD=example
export PLAYWRIGHT_RESPONDENT_SOL_USERNAME=example@mailinator.com
export PLAYWRIGHT_RESPONDENT_SOL_PSWD=example
export PLAYWRIGHT_RESP_CAA_USERNAME=example@mailinator.com
export PLAYWRIGHT_RESP_CAA_PSWD=example
export PLAYWRIGHT_APPL_CAA_USERNAME=example@mailinator.com
export PLAYWRIGHT_APPL_CAA_PSWD=example
export CCD_WEB_URL=http://example.com
export CCD_ADMIN_USER_NAME=example@mailinator.com
export CCD_ADMIN_PASSWORD=example
export USERNAME_SOLICITOR1=example@mailinator.com
export PASSWORD_SOLICITOR1=example
export USERNAME_SOLICITOR=example@mailinator.com
export PASSWORD_SOLICITOR=example
export USERNAME_CASEWORKER=example@mailinator.com
export PASSWORD_CASEWORKER=example
export USERNAME_JUDGE=example@mailinator.com
export PASSWORD_JUDGE=example
export USERNAME_CAA=example@mailinator.com
export PASSWORD_CAA=example
export CCD_DATA_API_URL=https://example.com
export XUI_ORG_WEB_URL=https://example.com
export NIGHTLY_TEST=true
export IDAM_CLIENT_SECRET=example
export IDAM_API_URL=https://example.com
export CCD_SUBMIT_S2S_SECRET=example
export CCD_ADMIN_URL=https://example.com
export USERNAME_RESPONDENT_SOLICITOR=example@mailinator.com
export FINREM_IDAM_CLIENT_SECRET=example
export FINREM_SYSTEMUPDATE_USERNAME=example@mailinator.com
export FINREM_SYSTEMUPDATE_PASSWORD=example
export USERNAME_BARRISTER1=example@mailinator.com
export PASSWORD_BARRISTER1=example
```
Replace the placeholder values with the actual values relevant to your environment.

`CCD_WEB_URL=` Can be used to toggle between PR environment, AAT and local or other environments.

3. Save the .env file.

## Install Dependencies

Before running the automation tests, ensure that all necessary dependencies are installed and source your .env file. You can do this by running:

```
yarn install
```

## Running Tests

Once the environment variables are configured and dependencies are installed, you can run the automation tests using the following command:
```
yarn playwright test <./playwright-e2e/functional/test_folder/test_file.ts>
```

Running all the tests using the VS Code extension can be very resource intensive, instead run all test headless through the terminal using cmd. (Note: The intel macs can usually only handle 1 worker):
```
yarn playwright test playwright-e2e --project=chromium --workers=1   
```


## 🎬 Debugging

Playwright provides a couple of great debugging capabilities at all levels. The ones that you will probably find most useful are:

For all options take a look at https://playwright.dev/docs/debug