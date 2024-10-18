import { Page } from "playwright";
import { BaseJourneyPage } from "./BaseJourneyPage";

export class CheckYourAnswersPage extends BaseJourneyPage{

    public constructor(page: Page){
        super(page)
    }
}
