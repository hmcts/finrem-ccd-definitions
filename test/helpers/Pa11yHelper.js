const { I } = inject();
const pa11y = require('pa11y');

async function runPa11yCheck() {
  const currentUrl = await I.grabCurrentUrl();
  const pa11yOptions = {
      standard: 'WCAG2.1AA', // Current HMCTS Standard.
    };
  const result = await pa11y(currentUrl, pa11yOptions);
  console.log(`Accessibility issues for ${currentUrl}:`, result.issues); // Logging for local testing.
  logger.info('accessibility test run');
  if (result.issues.length > 0) {
    console.log(`Accessibility issues for ${currentUrl}:`, result.issues); // Logging for local testing.
    assert.fail(`Accessibility issues detected for ${currentUrl}, ${result.issues}`); // Pipeline logging.
  }
}

module.exports = {
  runPa11yCheck,
};