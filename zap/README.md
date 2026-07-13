# OWASP ZAP Security Scanning

## Overview

This project integrates **OWASP ZAP (Zed Attack Proxy)** with the existing Playwright smoke tests to provide automated security scanning as part of the nightly Jenkins pipeline.

Rather than using ZAP as a standalone crawler, the existing Playwright smoke tests drive the application whilst all browser traffic is routed through the ZAP proxy. This allows authenticated user journeys to be analysed, providing significantly better coverage than scanning unauthenticated pages.

The implementation currently performs **passive security scanning only**.

---

# Architecture

```
Playwright Smoke Tests
        │
        ▼
 OWASP ZAP Proxy
        │
        ▼
 AAT Environment
```

1. Jenkins starts an OWASP ZAP Docker container.
2. Playwright Chromium is configured to use ZAP as its HTTP proxy.
3. Smoke tests execute as normal.
4. ZAP passively analyses all requests and responses.
5. HTML, JSON and XML reports are generated.
6. A quality gate evaluates the findings using `zap/zap-rules.conf`.
7. Reports are archived as Jenkins build artefacts.

---

# Repository Structure

```
bin/
├── check-zap-report.js
└── run-zap-smoke.sh

zap/
├── README.md
└── zap-rules.conf
```

| File                  | Purpose                                                                                                       |
| --------------------- | ------------------------------------------------------------------------------------------------------------- |
| `run-zap-smoke.sh`    | Starts the ZAP Docker container, executes the Playwright smoke tests through the proxy and generates reports. |
| `check-zap-report.js` | Reads the ZAP JSON report and applies the configured quality gate rules.                                      |
| `zap-rules.conf`      | Defines how each ZAP rule should be handled (IGNORE, WARN or FAIL).                                           |

---

# Running Locally

Ensure Docker is running.

Execute:

```bash
./bin/run-zap-smoke.sh
```

This will:

* Start OWASP ZAP
* Execute the Playwright smoke suite
* Wait for passive scanning to complete
* Generate reports in:

```
zap-reports/
```

To evaluate the report:

```bash
yarn test:zap-check
```

Open the HTML report:

```bash
open zap-reports/zap-report.html
```

---

# Jenkins Integration

The nightly pipeline executes the following steps:

1. Execute standard Playwright functional tests.
2. Start an OWASP ZAP Docker container.
3. Run the Playwright smoke suite through the ZAP proxy.
4. Generate ZAP reports.
5. Apply the quality gate.
6. Publish the HTML report.
7. Archive all generated artefacts.

This process does **not** replace the functional tests; it complements them by providing continuous security feedback.

---

# Quality Gate

The quality gate is configured using:

```
zap/zap-rules.conf
```

Each ZAP Plugin ID is assigned one of three actions:

| Action | Behaviour                                                  |
| ------ | ---------------------------------------------------------- |
| IGNORE | Excluded from pipeline evaluation.                         |
| WARN   | Reported in the HTML report but does not affect the build. |
| FAIL   | Causes the ZAP quality gate to fail.                       |

Only alerts configured as **FAIL** will cause the Jenkins quality gate to fail.

---

# Adding New Rules

After running a scan:

1. Open:

```
zap-reports/zap-report.html
```

2. Locate the **Plugin ID** for the alert.

Example:

```
Plugin ID: 10038
```

3. Add the rule to:

```
zap/zap-rules.conf
```

Example:

```
10038    FAIL    Content Security Policy Header Not Set
```

Re-run:

```bash
yarn test:zap-check
```

---

# Reports

The following reports are generated:

| File            | Description              |
| --------------- | ------------------------ |
| zap-report.html | Human-readable report    |
| zap-report.json | Used by the quality gate |
| zap-report.xml  | Machine-readable report  |

---

# Current Scope

The current implementation performs:

* Passive security scanning
* Authenticated Playwright user journeys
* Chromium smoke tests
* Nightly execution

The implementation does **not** currently perform:

* Active scanning
* Spidering
* AJAX Spider
* Authenticated context configuration
* Attack payload injection

---

# Active Scanning

Active scanning intentionally sends attack payloads to the application and may create, modify or delete data.

For this reason, active scanning is **not enabled** within the nightly pipeline.

If active scanning is introduced in the future it should:

* Run in an isolated environment.
* Use dedicated test accounts.
* Have an agreed scope.
* Exclude shared HMCTS services where appropriate.
* Be approved by the owning teams.

---

# Ownership

This implementation is intended to provide continuous security feedback during automated testing.

The ZAP quality gate should evolve over time as:

* False positives are identified.
* Platform-owned findings are excluded.
* New application functionality is introduced.
* Additional security rules are adopted.

Review the ZAP report periodically and update `zap-rules.conf` as required to ensure the quality gate remains relevant and actionable.
