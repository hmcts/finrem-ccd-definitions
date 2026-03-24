import { type Page, type Locator, expect } from '@playwright/test';
import { BaseJourneyPage } from '../../BaseJourneyPage';
import { CommonActionsHelper } from '../../helpers/CommonActionsHelper';
import { DateHelper } from '../../../data-utils/DateHelper';

export class CloseCasePage extends BaseJourneyPage {
  private readonly dateOfCloseGroup: Locator;
  private readonly commonActionsHelper: CommonActionsHelper;

  public constructor(page: Page, commonActionsHelper: CommonActionsHelper) {
    super(page);
    this.dateOfCloseGroup = page.locator('#caseClosureDateField');
    this.commonActionsHelper = commonActionsHelper;
  }

  async enterCloseDate(date?: { year: string, month: string, day: string }) {
    if (date) {
      await this.commonActionsHelper.enterDate(this.dateOfCloseGroup, date);
    } else {
      const [year, month, day] = DateHelper.getCurrentDate().split('-');
      await this.commonActionsHelper.enterDate(this.dateOfCloseGroup, { year, month, day });
    }
  }
}
