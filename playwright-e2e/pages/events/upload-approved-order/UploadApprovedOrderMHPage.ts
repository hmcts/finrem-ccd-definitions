import { type Page, expect, Locator } from '@playwright/test';
import { GeneralApplicationDirectionsPage } from '../general-application-directions/GeneralApplicationDirectionsPage';
import { YesNoRadioEnum } from "../../helpers/enums/RadioEnums";
import { CommonActionsHelper } from '../../helpers/CommonActionsHelper';
import { GeneralApplicationDirectionsMHPage } from '../general-application-directions/GeneralApplicationDirectionsMHPage';

export class UploadApprovedOrderMHPage extends GeneralApplicationDirectionsMHPage {

    private readonly IsThisFinalOrderQuestion: Locator;
    private readonly DoYouWantToAddHearingQuestion: Locator;


    public constructor(page: Page, commonActionsHelper: CommonActionsHelper) {
        super(page, commonActionsHelper);

        this.IsThisFinalOrderQuestion = page.getByRole('group', { name: 'Is this the final order?' });
        this.DoYouWantToAddHearingQuestion = page.getByRole('group', { name: 'Do you want to add a hearing?' })


    }


    private async selectIsThisFinalOrder(answer: YesNoRadioEnum): Promise<void> {
        expect(this.IsThisFinalOrderQuestion).toBeVisible();
        await this.IsThisFinalOrderQuestion.getByLabel(answer).click();
    }

    private async selectDoYouWantToAddHearing(answer: YesNoRadioEnum): Promise<void> {
        expect(this.DoYouWantToAddHearingQuestion).toBeVisible();
        await this.DoYouWantToAddHearingQuestion.getByLabel(answer).click();
    }
}
