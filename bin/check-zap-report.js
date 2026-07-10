#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const reportPath =
  process.argv[2] || "zap-reports/zap-report.json";

const rulesPath =
  process.argv[3] || "zap/zap-rules.tsv";

const validActions = new Set(["IGNORE", "WARN", "FAIL"]);

function readJsonFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    throw new Error(
      `Unable to parse JSON file ${filePath}: ${error.message}`
    );
  }
}

function readRulesFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Rules file not found: ${filePath}`);
  }

  const rules = new Map();
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);

  lines.forEach((rawLine, index) => {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      return;
    }

    // Supports either tab-separated columns or multiple spaces.
    const columns = rawLine.includes("\t")
      ? rawLine.split("\t")
      : rawLine.trim().split(/\s{2,}/);

    const ruleId = columns[0]?.trim();
    const action = columns[1]?.trim().toUpperCase();
    const description = columns.slice(2).join(" ").trim();

    if (!ruleId || !action) {
      throw new Error(
        `Invalid rule on line ${index + 1} of ${filePath}`
      );
    }

    if (!/^\d+$/.test(ruleId)) {
      throw new Error(
        `Invalid rule ID "${ruleId}" on line ${index + 1}`
      );
    }

    if (!validActions.has(action)) {
      throw new Error(
        `Invalid action "${action}" for rule ${ruleId}. ` +
        "Expected IGNORE, WARN or FAIL."
      );
    }

    rules.set(ruleId, {
      action,
      description,
    });
  });

  return rules;
}

function flattenAlerts(report) {
  const sites = Array.isArray(report.site) ? report.site : [];

  return sites.flatMap((site) => {
    const siteName =
      site["@name"] ||
      site.name ||
      site.host ||
      "Unknown site";

    const alerts = Array.isArray(site.alerts)
      ? site.alerts
      : [];

    return alerts.map((alert) => ({
      ...alert,
      siteName,
    }));
  });
}

function getPluginId(alert) {
  return String(
    alert.pluginid ??
    alert.pluginId ??
    alert.alertRef ??
    "UNKNOWN"
  );
}

function getRiskCode(alert) {
  const value = Number(alert.riskcode ?? alert.riskCode);

  return Number.isNaN(value) ? 0 : value;
}

function getRiskName(alert) {
  if (alert.riskdesc) {
    return String(alert.riskdesc).split(" ")[0];
  }

  switch (getRiskCode(alert)) {
    case 3:
      return "High";
    case 2:
      return "Medium";
    case 1:
      return "Low";
    default:
      return "Informational";
  }
}

function getDefaultAction(alert) {
  // Fail unexpected High-risk findings.
  if (getRiskCode(alert) === 3) {
    return "FAIL";
  }

  // Keep all other unexpected findings visible.
  return "WARN";
}

function getInstances(alert) {
  return Array.isArray(alert.instances)
    ? alert.instances
    : [];
}

function printAlert(alert, action, ruleDescription) {
  const pluginId = getPluginId(alert);
  const alertName = alert.alert || alert.name || "Unnamed alert";
  const risk = getRiskName(alert);
  const instances = getInstances(alert);

  console.log(
    `[${action}] ${pluginId} - ${alertName} ` +
    `(${risk}, ${instances.length} instance(s))`
  );

  console.log(`  Site: ${alert.siteName}`);

  if (ruleDescription) {
    console.log(`  Rule: ${ruleDescription}`);
  }

  const firstInstance = instances[0];

  if (firstInstance?.uri) {
    console.log(`  Example: ${firstInstance.uri}`);
  } else if (firstInstance?.url) {
    console.log(`  Example: ${firstInstance.url}`);
  }
}

function main() {
  console.log(`Reading ZAP report: ${path.resolve(reportPath)}`);
  console.log(`Reading ZAP rules: ${path.resolve(rulesPath)}`);

  const report = readJsonFile(reportPath);
  const rules = readRulesFile(rulesPath);
  const alerts = flattenAlerts(report);

  if (alerts.length === 0) {
    console.log("No ZAP alerts were found.");
    process.exit(0);
  }

  const results = {
    IGNORE: [],
    WARN: [],
    FAIL: [],
  };

  for (const alert of alerts) {
    const pluginId = getPluginId(alert);
    const configuredRule = rules.get(pluginId);

    const action =
      configuredRule?.action || getDefaultAction(alert);

    results[action].push({
      alert,
      description: configuredRule?.description || "",
      configured: Boolean(configuredRule),
    });
  }

  console.log("\nOWASP ZAP results\n");

  // Only output FAIL alerts.
  // WARN and IGNORE findings remain available in the HTML report.

  if (results.FAIL.length > 0) {
    console.log("\nOWASP ZAP failures\n");

    for (const result of results.FAIL) {
      printAlert(
        result.alert,
        "FAIL",
        result.description
      );

      if (!result.configured) {
        console.log(
          "  Rule: No configured rule; default action applied"
        );
      }

      console.log("");
    }
  }

console.log(`ZAP Failures: ${results.FAIL.length}`);

  if (results.FAIL.length > 0) {
    console.error(
      "\nZAP quality gate failed because one or more alerts " +
      "have the FAIL action."
    );

    process.exit(1);
  }

  console.log("\nZAP quality gate passed.");
  process.exit(0);
}

try {
  main();
} catch (error) {
  console.error(`ZAP report check failed: ${error.message}`);
  process.exit(2);
}
