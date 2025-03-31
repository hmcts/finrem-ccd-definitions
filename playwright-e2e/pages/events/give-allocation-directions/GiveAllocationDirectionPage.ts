import { type Page, expect, Locator } from '@playwright/test';
import { BaseJourneyPage } from "../../BaseJourneyPage";
import { YesNoRadioEnum } from '../../helpers/enums/RadioEnums';

export class GiveAllocationDirectionsPage extends BaseJourneyPage {


    private readonly fastTrackRadioOption: Locator;

    public constructor(page: Page) {
        super(page);
        this.fastTrackRadioOption = page.locator('#caseAllocatedTo')
    }

    async verifyFastTrackQuestionPresence() {
        await expect(this.fastTrackRadioOption).toBeVisible();
    }

    async verifyFastTrackQuestionAbsence() {

    }

    async verifyExpressPilotQuestionPresence() {
        
    }

    async verifyExpressPilotQuestionAbsence() {

    }

    async selectExpressPilotParticipation(participation: boolean) {
        // Implementation for selecting express pilot participation
    }

    async selectFastTrackParticipation(isFastTrack: YesNoRadioEnum) {
        await this.fastTrackRadioOption.getByLabel(isFastTrack).check();
    }
}