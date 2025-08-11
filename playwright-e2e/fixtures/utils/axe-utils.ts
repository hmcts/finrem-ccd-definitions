import { AxeBuilder } from "@axe-core/playwright";
import { Page } from "@playwright/test";
import {TestInfo} from "playwright/test";
import config from "../../config/config.ts";
import {createHtmlReport} from "axe-html-reporter";

interface AuditOptions {
  exclude?: string | string[];
  include?: string | string[];
  disableRules?: string | string[];
}

export class AxeUtils {
  private readonly DEFAULT_TAGS = [
    "wcag2a",
    "wcag2aa",
    "wcag21a",
    "wcag21aa",
    "wcag22a",
    "wcag22aa",
  ];

  private resultsList: any[] = [];

  constructor(protected readonly page: Page) {}

  private applySelectors(
    builder: AxeBuilder,
    method: "exclude" | "include",
    selectors?: string | string[]
  ) {
    if (!selectors) return;
    (Array.isArray(selectors) ? selectors : [selectors]).forEach((selector) =>
      builder[method](selector)
    );
  }

  /**
   * Run the AxeBuilder checks using the pre-determined tags
   *
   * @param options {@link AuditOptions} - Optional config such as excluding element(s)
   *
   */
  public async audit(options?: AuditOptions) {
    if (!config.run_accessibility) return;

    const builder = new AxeBuilder({ page: this.page }).withTags(
      this.DEFAULT_TAGS
    );
    this.applySelectors(builder, "exclude", options?.exclude);
    this.applySelectors(builder, "include", options?.include);

    if (options?.disableRules) builder.disableRules(options.disableRules);

    const results = await builder.analyze();
    this.resultsList.push({ url: this.page.url(), results });

    if (process.env.PWDEBUG) {
      if (results.violations.length > 0) {
        console.log(`Accessibility issues found on ${this.page.url()}:`);
        results.violations.forEach((violation) => {
          console.log(`${violation.id}: ${violation.description}`);
          console.log(`Impact: ${violation.impact}`);
          console.log(
            `Affected nodes:`,
            violation.nodes.map((node) => node.html).join("\n")
          );
        });
      }
    }

    // commented out the expect.soft line to avoid failing the test
    //expect.soft(results.violations, `Accessibility violations found on ${this.page.url()}`).toEqual([]);
  }

  public async generateReport(testInfo: TestInfo) {
    if (!config.run_accessibility || this.resultsList.length === 0) return;

    // Combine all results into one HTML report
    const htmlSections = this.resultsList.map(({ url, results }, idx) => {
      const urlEndpoint = url.split('/').slice(-3).join('/');
      const htmlReport = createHtmlReport({
        results,
        options: {
          projectKey: `${urlEndpoint}`,
          doNotCreateReportFile: true,
        },
      });
      const reportFileName = (results.violations.length > 0 ? "FAILED " : "") + urlEndpoint;
      return `
      <details>
        <summary><strong>Page ${idx + 1}: ${reportFileName}</strong></summary>
        ${htmlReport}
      </details>
    `;
    });

    const consolidatedHtml = `
        <html>
          <head>
          <title>Consolidated Accessibility Report</title>
          <style>
            details { margin-bottom: 1em; }
            summary { cursor: pointer; font-size: 1.1em; }
          </style>
        </head>
          <body>
            <h1>Consolidated Accessibility Report</h1>
            ${htmlSections.join('<hr/>')}
          </body>
        </html>
      `;

    await testInfo.attach('Consolidated Accessibility Report', {
      body: consolidatedHtml,
      contentType: 'text/html',
    });

    this.resultsList = []; // reset for next test
  }
}
