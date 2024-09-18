import { Page } from "playwright";
import { BaseJourneyPage } from "../BaseJourneyPage";

export class StartPage extends BaseJourneyPage{

    public constructor(page: Page){
        super(page)
    }
}
