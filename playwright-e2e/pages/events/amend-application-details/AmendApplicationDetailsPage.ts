import { Page } from "playwright";
import { BaseJourneyPage } from "../../BaseJourneyPage";

export class AmendApplicationDetailsPage extends BaseJourneyPage{

    public constructor(page: Page){
        super(page)
    }
}
