import { expect, Locator, Page } from "@playwright/test";
import { BaseJourneyPage } from "../../BaseJourneyPage";
import {ManageHearingPage} from "../manage-hearings/ManageHearing.ts";
import {CommonActionsHelper} from "../../helpers/CommonActionsHelper.ts";

export class ProcessOrderHearingDetailsPage extends ManageHearingPage {

  private readonly newHearingAddRadio : Locator

  public constructor(page: Page, commonActionsHelper: CommonActionsHelper) {
    super(page, commonActionsHelper);

    this.newHearingAddRadio = page.locator('#isAddHearingChosen');
  }

  async selectIsAnotherHearingToBeListed(selectIsAnotherHearingToBeListed: boolean) {
    const radioOption = selectIsAnotherHearingToBeListed ? 'Yes' : 'No';
    await expect(this.newHearingAddRadio).toBeVisible();
    await this.newHearingAddRadio.getByLabel(radioOption).check();
  }

}
