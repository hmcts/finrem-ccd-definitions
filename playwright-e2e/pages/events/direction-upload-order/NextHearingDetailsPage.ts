import { Locator, Page } from "@playwright/test";
import { BaseJourneyPage } from "../../BaseJourneyPage";

export class NextHearingDetailsPage extends BaseJourneyPage {

  private readonly firstHearingListedRadio: Locator;
  private readonly firstHearingTimeEstimateTxtBox: Locator;
  private readonly firstHearingDateDay: Locator;
  private readonly firstHearingDateMonth: Locator;
  private readonly firstHearingDateYear: Locator;
  private readonly firstHearingTimeTxtBox: Locator 
  private readonly firstHearingRegionListDropDown: Locator;
  private readonly firstHearingFrcListDropDown: Locator;
  private readonly firstHearingCourtListDropDown: Locator;
  private readonly firstHearingTypeDropdown: Locator;

  public constructor(page: Page) {
    super(page);
    this.firstHearingListedRadio = page.locator('#directionDetailsCollection_0_isAnotherHearingYN_radio');
    this.firstHearingTimeEstimateTxtBox = page.locator('#directionDetailsCollection_0_timeEstimate');
    this.firstHearingDateDay = page.locator('#dateOfHearing-day');
    this.firstHearingDateMonth = page.locator('#dateOfHearing-month');
    this.firstHearingDateYear = page.locator('#dateOfHearing-year');
    this.firstHearingTimeTxtBox = page.locator('#directionDetailsCollection_0_hearingTime');
    this.firstHearingRegionListDropDown = page.locator('#directionDetailsCollection_0_localCourt_region');
    this.firstHearingFrcListDropDown = page.locator('#directionDetailsCollection_0_localCourt_midlandsList');
    this.firstHearingCourtListDropDown = page.locator('#directionDetailsCollection_0_localCourt_birminghamCourtList');
    this.firstHearingTypeDropdown = page.locator('#directionDetailsCollection_0_typeOfHearing');
  }

  async addHearing() {
    await this.firstHearingListedRadio.getByRole('radio', { name: 'Yes' }).click();
    await this.firstHearingTimeEstimateTxtBox.fill('30');
    await this.enterHearingDate();
    await this.firstHearingTimeTxtBox.fill('10:00');
    await this.selectCourt();
    await this.selectHearingType();
  }

  private async enterHearingDate() {
    await this.firstHearingDateDay.fill('01');
    await this.firstHearingDateMonth.fill('01');
    await this.firstHearingDateYear.fill('2024');  
  }

  private async selectCourt(){
    await this.firstHearingRegionListDropDown.selectOption('Midlands');
    await this.firstHearingFrcListDropDown.selectOption('Birmingham FRC');
    await this.firstHearingCourtListDropDown.selectOption('COVENTRY COMBINED COURT CENTRE');
  }

  private async selectHearingType() {
    await this.firstHearingTypeDropdown.selectOption('First Directions Appointment (FDA)');
  }
}
