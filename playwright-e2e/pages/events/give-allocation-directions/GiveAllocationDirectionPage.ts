import { type Page, expect, Locator } from '@playwright/test';
import { BaseJourneyPage } from "../../BaseJourneyPage";
import { YesNoRadioEnum } from '../../helpers/enums/RadioEnums';

export class GiveAllocationDirectionsPage extends BaseJourneyPage {


    private readonly fastTrackRadioOption: Locator;
    private readonly expressPilotRadioOption: Locator;
    private readonly complexCaseRadio: Locator;
    private readonly judgeAllocatedCheckbox: Locator;
    private readonly timeEstimateRadio: Locator;

    public constructor(page: Page) {
      super(page);
      this.fastTrackRadioOption = page.locator('#caseAllocatedTo');
      this.expressPilotRadioOption = page.locator('#judgeAgreesCaseIsExpress');
      this.complexCaseRadio = page.locator('#applicationAllocatedTo');
      this.judgeAllocatedCheckbox = page.locator('#judgeAllocated');
      this.timeEstimateRadio = page.locator('#judgeTimeEstimate');
    }

    async verifyFastTrackQuestionPresence() {
      await expect(this.fastTrackRadioOption).toBeVisible();
    }

    async verifyFastTrackQuestionAbsence() {
      await expect(this.fastTrackRadioOption).not.toBeVisible();
    }

    async verifyExpressPilotQuestionPresence() {
      await expect(this.expressPilotRadioOption).toBeVisible();
    }

    async verifyExpressPilotQuestionAbsence() {
      await expect(this.expressPilotRadioOption).not.toBeVisible();
    }

    async selectComplexCase(isComplexCase: YesNoRadioEnum) {
      await this.complexCaseRadio.getByLabel(isComplexCase).check();
    }

    async selectExpressPilotParticipation(isExpressPilot: YesNoRadioEnum) {
      await this.expressPilotRadioOption.getByLabel(isExpressPilot).check();
    }

    async selectFastTrackParticipation(isFastTrack: YesNoRadioEnum) {
      await this.fastTrackRadioOption.getByLabel(isFastTrack).check();
    }

    async selectJudgeAllocated() {
      await this.judgeAllocatedCheckbox.getByText('District Judge / Deputy').check();
    }

    async selectTimeEstimate() {
      await this.timeEstimateRadio.getByText('The application can be listed for the standard time').check();
    }
}
