import { expect, type Locator, type Page } from '@playwright/test';
import { BaseJourneyPage } from '../../BaseJourneyPage.ts';
import { CommonActionsHelper } from '../../helpers/CommonActionsHelper.ts';

export interface ConsentedHearingDetails {
  readonly hearingType: string;
  readonly timeEstimate: string;
  readonly date: { year: string; month: string; day: string };
  readonly time: string;
  readonly region: string;
  readonly frc: string;
  readonly court: string;
  readonly additionalInformation: string;
}

export class ListForHearingPage extends BaseJourneyPage {
  private readonly commonActionsHelper: CommonActionsHelper;
  private readonly hearing: Locator;

  public constructor(page: Page, commonActionsHelper: CommonActionsHelper) {
    super(page);
    this.commonActionsHelper = commonActionsHelper;
    this.hearing = page.locator('#listForHearings');
  }

  async addHearing(details: ConsentedHearingDetails): Promise<void> {
    await this.navigateAddNew();
    await this.selectOption('_hearingType', details.hearingType);
    await this.fillText('_hearingTimeEstimate', details.timeEstimate);
    await this.commonActionsHelper.enterDate(this.hearing, details.date);
    await this.fillText('_hearingTime', details.time);
    await this.selectOption('_regionList', details.region);
    await this.selectOption('_londonFRCList', details.frc);
    await this.selectOption('_cfcCourtList', details.court);
    await this.fillText('_additionalInformationAboutHearing', details.additionalInformation);

    const noOtherDocuments = this.hearing.locator('[id$="_promptForAnyDocument_No"]');
    await expect(noOtherDocuments).toBeVisible();
    await noOtherDocuments.check();
  }

  private async selectOption(idSuffix: string, label: string): Promise<void> {
    const select = this.hearing.locator(`select[id$="${idSuffix}"]`);

    await expect(select).toBeVisible();
    await select.selectOption({ label });
  }

  private async fillText(idSuffix: string, value: string): Promise<void> {
    const input = this.hearing.locator(`input[id$="${idSuffix}"]`);

    await expect(input).toBeVisible();
    await input.fill(value);
  }
}
