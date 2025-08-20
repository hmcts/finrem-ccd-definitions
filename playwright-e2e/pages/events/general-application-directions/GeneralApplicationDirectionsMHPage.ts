import { type Page, expect, Locator } from '@playwright/test';
import { GeneralApplicationDirectionsPage } from '../../../pages/events/general-application-directions/GeneralApplicationDirectionsPage';
import { YesNoRadioEnum } from "../../helpers/enums/RadioEnums";
import { ManageHearingPage } from '../../../pages/events/manage-hearings/ManageHearing';
import { CommonActionsHelper } from '../../helpers/CommonActionsHelper';

export class GeneralApplicationDirectionsMHPage extends ManageHearingPage {

    private readonly isAHearingRequired: Locator;

    public constructor(page: Page, commonActionsHelper: CommonActionsHelper) {
        super(page, commonActionsHelper);
        this.isAHearingRequired = page.getByText('Is a Hearing required?');

    }

    async chooseWhetherAHearingIsRequired(answer: YesNoRadioEnum): Promise<void> {
        await expect(this.isAHearingRequired).toBeVisible();
        const radioButton = this.page.getByRole('group', { name: 'Is a Hearing required?' }).getByLabel(answer);
        await radioButton.check();
    }

}
