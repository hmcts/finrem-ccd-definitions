import {BaseJourneyPage} from './BaseJourneyPage.ts';
import config from '../config/config.ts';
import {ApplicationtypeEnum} from './helpers/enums/RadioEnums.ts';
import {expect, Locator, Page} from '@playwright/test';
import {envTestData} from '../data-utils/test_data/EnvTestDataConfig.ts';

interface CaseSearchResults {
  readonly results: ReadonlyArray<{ readonly case_id: string | number }>;
  readonly total: number;
}

export class CaseListPage extends BaseJourneyPage {

  private readonly url: string;
  private readonly jurisdictionSelect: Locator;
  private readonly caseTypeSelect: Locator;
  private readonly stateSelect: Locator;
  private readonly solicitorReferenceInput: Locator;
  private readonly supplementaryEvidenceRadioYes: Locator;
  private readonly supplementaryEvidenceRadioNo: Locator;
  private readonly judgeNameSelect: Locator;
  private readonly regionSelect: Locator;
  private readonly urgentCaseRadioYes: Locator;
  private readonly urgentCaseRadioNo: Locator;
  private readonly typeOfApplicationRadio: Locator;


  public constructor(page: Page) {
    super(page);
    this.url = config.manageCaseBaseURL + '/cases';
    this.jurisdictionSelect = page.locator('#wb-jurisdiction');
    this.caseTypeSelect = page.locator('#wb-case-type');
    this.stateSelect = page.locator('#wb-case-state');
    this.solicitorReferenceInput = page.locator('#solicitorReference');
    this.supplementaryEvidenceRadioYes = page.locator('#evidenceHandled_Yes');
    this.supplementaryEvidenceRadioNo = page.locator('#evidenceHandled_No');
    this.judgeNameSelect = page.locator('#assignedToJudge');
    this.regionSelect = page.locator('#regionList');
    this.urgentCaseRadioYes = page.locator('#promptForUrgentCaseQuestion_Yes');
    this.urgentCaseRadioNo = page.locator('#promptForUrgentCaseQuestion_No');
    this.typeOfApplicationRadio = page.locator('#typeOfApplication');
  }

  async visit() {
    await this.page.goto(this.url);
  }

  async isPageLoaded(): Promise<boolean> {
    return await this.page.getByRole('heading', { name: 'Case list' }).isVisible();
  }

  async selectJurisdiction() {
    await expect(this.jurisdictionSelect).toBeVisible();
    await this.jurisdictionSelect.selectOption({ label: config.jurisdiction.familyDivorce });
  }

  async selectCaseType(caseType: string) {
    await expect(this.caseTypeSelect).toBeVisible();
    await this.caseTypeSelect.selectOption({ label: caseType });
  }

  async selectState(state: string) {
    await expect(this.stateSelect).toBeVisible();
    await this.stateSelect.selectOption({ label: state });
  }

  async validateStateSelectOptions(states: string[]) {
    await expect(this.stateSelect).toBeVisible();
    await this.assertDropDownOptionsAreVisible(
      states,
      this.stateSelect
    );
  }

  async enterSolicitorReference(reference: string) {
    await expect(this.solicitorReferenceInput).toBeVisible();
    await this.solicitorReferenceInput.fill(reference);
  }

  async selectSupplementaryEvidenceHandled(yesOrNo: boolean) {
    if (yesOrNo) {
      await expect(this.supplementaryEvidenceRadioYes).toBeVisible();
      await this.supplementaryEvidenceRadioYes.check();
    } else {
      await expect(this.supplementaryEvidenceRadioNo).toBeVisible();
      await this.supplementaryEvidenceRadioNo.check();
    }
  }

  async selectJudgeName(judgeName: string) {
    await expect(this.judgeNameSelect).toBeVisible();
    await this.judgeNameSelect.selectOption({ label: judgeName });
  }

  async validateRegionSelectOptions() {
    await expect(this.regionSelect).toBeVisible();
    await this.assertDropDownOptionsAreVisible(
      ['Midlands', 'London', 'North East', 'North West', 'South East', 'South West', 'Wales', 'High Court Family Division'],
      this.regionSelect
    );
  }

  async selectUrgentCase(yesOrNo: boolean) {
    if (yesOrNo) {
      await expect(this.urgentCaseRadioYes).toBeVisible();
      await this.urgentCaseRadioYes.check();
    } else {
      await expect(this.urgentCaseRadioNo).toBeVisible();
      await this.urgentCaseRadioNo.check();
    }
  }

  async selectTypeOfApplication(type: ApplicationtypeEnum) {
    await expect(this.typeOfApplicationRadio).toBeVisible();
    const radioOption = this.typeOfApplicationRadio.getByLabel(type);
    await expect(radioOption).toBeVisible();
    await radioOption.check();
  }

  async assertCaseVisible(caseId: string | number, caseType: string, state: string): Promise<void> {
    const applyButton = this.page.locator('button.workbasket-filters-apply');
    const nextPageLink = this.page.locator('[aria-label="Next page"]');
    const caseReference = String(caseId);
    const formattedCaseId = caseReference.replace(/(\d{4})(?=\d)/g, '$1-');
    const caseLink = this.page.locator(`a[href*="${caseReference}"]`)
      .or(this.page.getByRole('link', { name: formattedCaseId }))
      .first();

    await this.visit();
    await this.selectJurisdiction();
    await this.selectCaseType(caseType);
    await this.selectState(state);

    await expect(async () => {
      let resultsPage = await this.loadSearchResults(applyButton);
      let casesSeen = resultsPage.results.length;

      while (!this.containsCase(resultsPage, caseReference) && casesSeen < resultsPage.total) {
        resultsPage = await this.loadSearchResults(nextPageLink);
        casesSeen += resultsPage.results.length;
      }

      expect(
        this.containsCase(resultsPage, caseReference),
        `Case ${caseReference} not found on any Case list results page`
      ).toBe(true);
    }).toPass({ timeout: 120_000, intervals: [5_000] });

    await expect(caseLink).toBeVisible();
  }

  private async loadSearchResults(trigger: Locator): Promise<CaseSearchResults> {
    const searchResponse = this.page.waitForResponse((response) => {
      return response.request().method() === 'POST'
        && response.url().includes('/data/internal/searchCases')
        && response.url().includes('use_case=WORKBASKET')
        && response.url().includes('state=')
        && response.ok();
    });

    await trigger.click();
    return await (await searchResponse).json() as CaseSearchResults;
  }

  private containsCase(resultsPage: CaseSearchResults, caseReference: string): boolean {
    return resultsPage.results.some((result) => {
      return String(result.case_id) === caseReference;
    });
  }

  async verifyCaseListPageForConsentedCase(states: string[], isCaseWorker: boolean = true) {
    await this.isPageLoaded();
    await this.selectJurisdiction();
    await this.selectCaseType('Financial Remedy Consented');
    await this.validateStateSelectOptions(states);
    await this.enterSolicitorReference(envTestData.ORG_ID_1);
    if( isCaseWorker) {
      await this.selectSupplementaryEvidenceHandled(false);
      await this.selectSupplementaryEvidenceHandled(true);
      await this.selectJudgeName('JUDGE ALL');
    }
    await this.validateRegionSelectOptions();
  }

  async verifyCaseListPageForContestedCase(states: string[], isCaseWorker: boolean = true) {
    await this.isPageLoaded();
    await this.selectJurisdiction();
    await this.selectCaseType('Contested Financial Remedy');
    await this.validateStateSelectOptions(states);
    await this.enterSolicitorReference(envTestData.ORG_ID_1);
    if (isCaseWorker) {
      await this.selectSupplementaryEvidenceHandled(false);
      await this.selectSupplementaryEvidenceHandled(true);
      await this.selectJudgeName('JUDGE ALL');
    }
    await this.validateRegionSelectOptions();
    await this.selectUrgentCase(true);
    await this.selectUrgentCase(false);
    await this.selectTypeOfApplication(ApplicationtypeEnum.MARRIAGE_CIVIL);
    await this.selectTypeOfApplication(ApplicationtypeEnum.CHILDRENS_ACT);
  }

}
