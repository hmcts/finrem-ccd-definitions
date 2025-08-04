import { AxeBuilder } from "@axe-core/playwright";
import { Page, expect } from "@playwright/test";
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
   * @param testInfo
   * @param options {@link AuditOptions} - Optional config such as excluding element(s)
   *
   */
  public async audit(testInfo: TestInfo ,options?: AuditOptions) {
    if (!config.run_accessibility) return;

    const builder = new AxeBuilder({ page: this.page }).withTags(
      this.DEFAULT_TAGS
    );
    this.applySelectors(builder, "exclude", options?.exclude);
    this.applySelectors(builder, "include", options?.include);

    if (options?.disableRules) builder.disableRules(options.disableRules);
    const results = await builder.analyze();

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

    const urlEndpoint = this.page.url().split('/').slice(-3).join('/');
    const htmlReport = createHtmlReport({
      results: results,
      options: {
        projectKey: `${urlEndpoint}`,
        doNotCreateReportFile: true
      }
    });

    const reportFileName = (results.violations.length > 0 ? "FAILED " : "") +
      `Accessibility Report for ${urlEndpoint}`;
    await testInfo.attach(reportFileName, {
      body: htmlReport,
      contentType: 'text/html'
    });
  }
}