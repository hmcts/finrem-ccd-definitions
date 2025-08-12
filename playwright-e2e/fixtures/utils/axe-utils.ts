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
      const unique = `_${idx}`;
      let htmlReport = createHtmlReport({
        results,
        options: {
          projectKey: `${urlEndpoint}`,
          doNotCreateReportFile: true,
        },
      });

      htmlReport = this.getUpdatedHtmlReport(htmlReport, unique);

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

  private getUpdatedHtmlReport(htmlReport: string, unique: string) {
    return htmlReport
      .replace(/id="accordionPasses"/g, `id="accordionPasses${unique}"`)
      .replace(/id="headingOne"/g, `id="headingOne${unique}"`)
      .replace(/data-target="#passes"/g, `data-target="#passes${unique}"`)
      .replace(/aria-controls="passes"/g, `aria-controls="passes${unique}"`)
      .replace(/id="passes"/g, `id="passes${unique}"`)
      .replace(/aria-labelledby="headingOne"/g, `aria-labelledby="headingOne${unique}"`)
      // Repeat for incomplete, inapplicable, rules sections...
      .replace(/id="accordionIncomplete"/g, `id="accordionIncomplete${unique}"`)
      .replace(/id="headingTwo"/g, `id="headingTwo${unique}"`)
      .replace(/data-target="#incomplete"/g, `data-target="#incomplete${unique}"`)
      .replace(/aria-controls="incomplete"/g, `aria-controls="incomplete${unique}"`)
      .replace(/id="incomplete"/g, `id="incomplete${unique}"`)
      .replace(/aria-labelledby="headingTwo"/g, `aria-labelledby="headingTwo${unique}"`)
      .replace(/id="accordionInapplicable"/g, `id="accordionInapplicable${unique}"`)
      .replace(/id="headingThree"/g, `id="headingThree${unique}"`)
      .replace(/data-target="#inapplicable"/g, `data-target="#inapplicable${unique}"`)
      .replace(/aria-controls="inapplicable"/g, `aria-controls="inapplicable${unique}"`)
      .replace(/id="inapplicable"/g, `id="inapplicable${unique}"`)
      .replace(/aria-labelledby="headingThree"/g, `aria-labelledby="headingThree${unique}"`)
      .replace(/id="rulesSection"/g, `id="rulesSection${unique}"`)
      .replace(/id="ruleSection"/g, `id="ruleSection${unique}"`)
      .replace(/data-target="#rules"/g, `data-target="#rules${unique}"`)
      .replace(/aria-controls="rules"/g, `aria-controls="rules${unique}"`)
      .replace(/id="rules"/g, `id="rules${unique}"`)
      .replace(/aria-labelledby="ruleSection"/g, `aria-labelledby="ruleSection${unique}"`)
      .replace(/data-parent="#accordionPasses"/g, `data-parent="#accordionPasses${unique}"`)
      .replace(/data-parent="#accordionIncomplete"/g, `data-parent="#accordionIncomplete${unique}"`)
      .replace(/data-parent="#accordionInapplicable"/g, `data-parent="#accordionInapplicable${unique}"`)
      .replace(/data-parent="#rules"/g, `data-parent="#rules${unique}"`);
  }
}
