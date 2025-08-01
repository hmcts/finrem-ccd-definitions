import { Page } from "playwright";
import { expect } from "@playwright/test";
import { BaseJourneyPage } from "../../BaseJourneyPage";
import { CommonActionsHelper } from "../../helpers/CommonActionsHelper";

export class RespondentDetailsPage extends BaseJourneyPage {
    private commonActionsHelper: CommonActionsHelper;

    public constructor(page: Page, commonActionsHelper: CommonActionsHelper) {
        super(page);
        this.commonActionsHelper = commonActionsHelper;
    }

    async enterRespondentNames(firstName: string, lastName :string) {
        await this.commonActionsHelper.enterNames(this.page, firstName, lastName);
    }

    async enterRespondentAddress(){
        await this.commonActionsHelper.enterUkAddress(this.page, {
            buildingAndStreet: "Coral, 65-68",
            addressLine2: "Leadenhall 2nd Street",
            townOrCity: "Manchester",
            postcodeOrZipcode: "EC3A 2AF",
            country: "United Kingdom"
        });
    }

    async checkRefugeFieldNotPresent() {
        await expect(this.page.getByText('Is the Respondent currently a resident in a refuge')).toHaveCount(0);
    }

}
