import { type Page, type Locator, expect } from '@playwright/test';
import { BaseJourneyPage } from './BaseJourneyPage';

export class BlankPage extends BaseJourneyPage {
  
   
  public constructor(page: Page) {
    super(page);
  }
}
