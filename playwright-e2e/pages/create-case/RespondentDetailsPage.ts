import { Page } from "playwright";
import { BaseJourneyPage } from "../BaseJourneyPage";
import { CommonActionsHelper } from "../helpers/CommonActionsHelper";

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
        await this.commonActionsHelper.enterUkAddress(this.page);
    }
    
}
