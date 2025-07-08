import { type Page, expect, Locator } from '@playwright/test';
import { BaseJourneyPage } from "../../BaseJourneyPage";
import { CommonActionsHelper } from '../../helpers/CommonActionsHelper';

export class ContestedSendOrderPage extends BaseJourneyPage {

    public constructor(page: Page) {
        super(page);
    }
}