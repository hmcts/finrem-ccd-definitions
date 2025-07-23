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

  private readonly newHearingAddRadio : Locator
  private readonly newHearingTypeDropDown : Locator
  private readonly newHearingTimeEstimateTxtBox : Locator
  private readonly newHearingDateDay: Locator
  private readonly newHearingDateMonth : Locator
  private readonly newHearingDateYear : Locator
  private readonly newHearingTimeTxtBox : Locator
  private readonly newHearingRegionListDropDown : Locator
  private readonly newHearingFrcListDropDown : Locator
  private readonly newHearingCourtListDropDown : Locator
  private readonly newHearingAttendanceDropDown : Locator
  private readonly newHearingAdditionalInfoTxtBox : Locator
  private readonly newHearingAdditionalDocRadio : Locator
  private readonly newHearingSendNoticeRadio : Locator

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

    this.newHearingAddRadio = page.locator('#processOrderAddHearing');
    this.newHearingTypeDropDown = page.locator('#workingHearing_hearingType');
    this.newHearingTimeEstimateTxtBox = page.locator('#workingHearing_hearingTimeEstimate');
    this.newHearingDateDay = page.locator('#hearingDate-day');
    this.newHearingDateMonth = page.locator('#hearingDate-month');
    this.newHearingDateYear = page.locator('#hearingDate-year');
    this.newHearingTimeTxtBox = page.locator('#workingHearing_hearingTime');
    this.newHearingRegionListDropDown = page.locator('#workingHearing_hearingCourtSelection_region');
    this.newHearingFrcListDropDown = page.locator('#workingHearing_hearingCourtSelection_midlandsList');
    this.newHearingCourtListDropDown = page.locator('#workingHearing_hearingCourtSelection_birminghamCourtList');
    this.newHearingAttendanceDropDown = page.locator('#workingHearing_hearingMode');
    this.newHearingAdditionalInfoTxtBox = page.locator('#workingHearing_additionalHearingInformation');
    this.newHearingAdditionalDocRadio = page.locator('#workingHearing_additionalHearingDocPrompt_radio');
    this.newHearingSendNoticeRadio = page.locator('#workingHearing_hearingNoticePrompt');
  }

  async addOldHearing() {
    await this.firstHearingListedRadio.getByRole('radio', { name: 'Yes' }).click();
    await this.firstHearingTimeEstimateTxtBox.fill('30');
    await this.firstHearingDateDay.fill('01');
    await this.firstHearingDateMonth.fill('01');
    await this.firstHearingDateYear.fill('2024');
    await this.firstHearingTimeTxtBox.fill('10:00');
    await this.firstHearingRegionListDropDown.selectOption('Midlands');
    await this.firstHearingFrcListDropDown.selectOption('Birmingham FRC');
    await this.firstHearingCourtListDropDown.selectOption('COVENTRY COMBINED COURT CENTRE');
    await this.firstHearingTypeDropdown.selectOption('First Directions Appointment (FDA)');
  }

  async addNewHearing() {
    await this.newHearingAddRadio.getByRole('radio', { name: 'Yes' }).click();
    await this.newHearingTypeDropDown.selectOption('First Directions Appointment (FDA)');
    await this.newHearingTimeEstimateTxtBox.fill('30');
    await this.newHearingDateDay.fill('01');
    await this.newHearingDateMonth.fill('01');
    await this.newHearingDateYear.fill('2024');
    await this.newHearingTimeTxtBox.fill('10:00');
    await this.newHearingRegionListDropDown.selectOption('Midlands');
    await this.newHearingFrcListDropDown.selectOption('Birmingham FRC');
    await this.newHearingCourtListDropDown.selectOption('COVENTRY COMBINED COURT CENTRE');
    await this.newHearingAttendanceDropDown.selectOption('In person');
    await this.newHearingAdditionalInfoTxtBox.fill('This is a test hearing');
    await this.newHearingAdditionalDocRadio.getByRole('radio', { name: 'No' }).click();
    await this.newHearingSendNoticeRadio.getByRole('radio', { name: 'Yes' }).click();
  }
}
