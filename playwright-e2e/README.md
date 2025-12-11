# Playwright End-to-End Test Suite

End-to-end testing suite built with:
- **Playwright** — https://playwright.dev/
- **TypeScript** — https://www.typescriptlang.org/

---

## 🤖 Starting Up
For full execution options: https://playwright.dev/docs/running-tests

Run tests via terminal:
```bash
yarn playwright test
```

Using the **Playwright VS Code extension** is recommended for:
- Breakpoint debugging
- DOM element inspection
- Visual test exploration

---

## 📁 Project Structure
```
playwright-e2e
│
├── config                  # Core settings, credentials, URLs
│
├── data-utils             # Test data construction utilities
│   ├── factory            # Case factories for contested/consented journeys
│   └── api                # Event APIs using CcdApi
│
├── fixtures               # Fixtures for grouping tests by meaning
│
├── pages                  # POM (Page Object Model) classes
│   ├── <journey folders>  # e.g. FR_amend_application
│   ├── BaseJourneyPage.ts # Shared abstract base class
│   └── helpers            # Reusable shared page helpers
│
├── resources              # JSON, documents, templates, static assets
│
├── test                   # All automated tests
│   ├── contested
│   └── consented
│
playwright.config.ts       # Root Playwright config
.env                       # Required local environment config (not committed)
```

---

## 🔐 Environment Variables

To run tests locally, create a `.env` file in the repository root (do **not** commit it).

Add required variables (ask a teammate or check Key Vault):

```bash
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

# Base URLs
export CCD_ADMIN_URL=
export CCD_WEB_URL=
export CCD_DATA_API_URL=
export XUI_ORG_WEB_URL=
export MANAGE_ORG_API_BASE_URL=
export IDAM_API_URL=
```

### 🌐 Environment Selection
Set target environment:
```bash
export RUNNING_ENV=aat
# or export RUNNING_ENV=demo
# or export RUNNING_ENV=pr-1234
```

### Local Development
Override URLs when using local containers:
```bash
export CCD_WEB_URL=
export CCD_DATA_API_URL=
export XUI_ORG_WEB_URL=
export MANAGE_ORG_API_BASE_URL=
```

---

## 📦 Install Dependencies
```bash
yarn install
```

---

## 🧹 Code Linting
We use **ESLint** with `eslint-plugin-unicorn` to enforce code quality and consistent file naming.

### Run linting
```bash
yarn lint
```

### Auto-fix lint issues
```bash
yarn lint --fix
```

### Filename Conventions
| Folder | Convention |
|--------|------------|
| test/, resources/tab_content/ | snake_case |
| config/, fixtures/, resources/** | kebab-case |
| pages/, data-utils/ | PascalCase |
| helpers/** | camelCase |

**Examples:**
- ✔️ `login_page.spec.ts`
- ✔️ `checkout-flow.json`
- ❌ `LoginPage.spec.ts` (incorrect)

---

## 🧪 Running Tests
Run a specific file:
```bash
yarn playwright test ./playwright-e2e/functional/test_folder/test_file.ts
```

Run full suite with HTML report:
```bash
yarn playwright test playwright-e2e --project=edge --reporter=html
```

---

## 🎬 Debugging
Playwright debugging guide:  
https://playwright.dev/docs/debug

