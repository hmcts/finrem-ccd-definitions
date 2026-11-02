import { expect, Locator, Page } from '@playwright/test';
import { Table } from './components/table.ts';

export class CheckYourAnswersPage {
  private readonly checkYourAnswersTitle: Locator;
  private readonly checkYourAnswersTable: Locator;

  constructor(page: Page) {
    this.checkYourAnswersTitle = page.getByRole('heading', {
      name: 'Check your answers'
    });

    this.checkYourAnswersTable = page.getByRole('table', {
      name: 'check your answers table'
    });
  }

  async assertCheckYourAnswersPage(table: Table): Promise<void> {
    await expect(this.checkYourAnswersTitle).toBeVisible();
    await expect(this.checkYourAnswersTable).toBeVisible();

    const normalize = (text: string) =>
    {return text.replace(/\s+/g, '');};

    const matchesValue = (actual: string, expected: string) => {
      const actualValue = normalize(actual);
      const expectedValue = normalize(expected);

      return actualValue === expectedValue ||
    actualValue === normalize(`Multi selection tableValue${expected}`);
    };

    await expect(async () => {
      const rows = await this.checkYourAnswersTable
        .locator('tr')
        .evaluateAll(elements =>
        {return elements
          .filter(row => {return row.getClientRects().length > 0;})
          .map(row =>
          {return Array.from(row.children)
            .filter(cell =>
            {return cell.tagName === 'TH' || cell.tagName === 'TD';}
            )
            .map(cell => {return cell.textContent ?? '';});}
          );}
        );

      const actualRows = rows.map(row => {return row.map(normalize);});
      const errors: string[] = [];

      for (const expected of table.rows) {
        if (typeof expected === 'string') {
          const found = actualRows.some(row =>
          {return row.some(cell => {return matchesValue(cell, expected);});}
          );

          if (!found) {
            errors.push(`Value "${expected}" not found`);
          }

          continue;
        }

        const label = normalize(expected.cellItem);
        const value = normalize(expected.value);

        const found = actualRows.some((row, index) => {
          const labelIndex = row.findIndex(cell => {return cell === label;});

          if (labelIndex === -1) return false;

          // Label and value in the same row
          if (row.slice(labelIndex + 1).some(cell =>
          {return matchesValue(cell, value);}
          )) {
            return true;
          }

          // Label and value in adjacent rows
          const nextRow = actualRows[index + 1];

          return nextRow?.some(cell =>
          {return matchesValue(cell, value);}
          ) ?? false;
        });

        if (!found) {
          errors.push(
            `Row with "${expected.cellItem}" and "${expected.value}" not found`
          );
        }
      }

      expect(
        errors,
        'Check your answers table validation failed'
      ).toEqual([]);
    }).toPass({ timeout: 10000 });
  }
}
