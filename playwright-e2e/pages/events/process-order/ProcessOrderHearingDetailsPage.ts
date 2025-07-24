import { expect, Locator, Page } from "@playwright/test";
import { BaseJourneyPage } from "../../BaseJourneyPage";

export class ProcessOrderHearingDetailsPage extends BaseJourneyPage {

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

    this.newHearingAddRadio = page.locator('#processOrderAddHearing');
    this.newHearingTypeDropDown = page.locator('#workingHearing_hearingTypeDynamicList');
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
    this.newHearingAdditionalDocRadio = page.locator('#workingHearing_additionalHearingDocPrompt');
    this.newHearingSendNoticeRadio = page.locator('#workingHearing_hearingNoticePrompt');
  }

  async selectIsAnotherHearingToBeListed(selectIsAnotherHearingToBeListed: boolean) {
    const radioOption = selectIsAnotherHearingToBeListed ? 'Yes' : 'No';
    await expect(this.newHearingAddRadio).toBeVisible();
    await this.newHearingAddRadio.getByLabel(radioOption).check();
  }

  async selectTypeOfHearing(typeOfHearing: string) {
    await expect(this.newHearingTypeDropDown).toBeVisible();
    await this.newHearingTypeDropDown.selectOption(typeOfHearing);
  }

  async enterTimeEstimate(duration: string) {
    await expect(this.newHearingTimeEstimateTxtBox).toBeVisible();
    await this.newHearingTimeEstimateTxtBox.fill(duration);
  }

  async enterHearingDate(day: string, month: string, year: string) {
    await expect(this.newHearingDateDay).toBeVisible();
    await expect(this.newHearingDateMonth).toBeVisible();
    await expect(this.newHearingDateYear).toBeVisible();

    await this.newHearingDateDay.fill(day);
    await this.newHearingDateMonth.fill(month);
    await this.newHearingDateYear.fill(year);
  }

  async enterHearingTime(time: string) {
    await expect(this.newHearingTimeTxtBox).toBeVisible();
    await this.newHearingTimeTxtBox.fill(time);
  }

  async selectCourtForHearing() {
    await expect(this.newHearingRegionListDropDown).toBeVisible();
    await this.newHearingRegionListDropDown.selectOption('Midlands');
    
    await expect(this.newHearingFrcListDropDown).toBeVisible();
    await this.newHearingFrcListDropDown.selectOption('Birmingham FRC');
    
    await expect(this.newHearingCourtListDropDown).toBeVisible();
    await this.newHearingCourtListDropDown.selectOption('COVENTRY COMBINED COURT CENTRE');
  }

  async selectHearingAttendance(attendance: string) {
    await expect(this.newHearingAttendanceDropDown).toBeVisible();
    await this.newHearingAttendanceDropDown.selectOption(attendance);
  }

  async enterAdditionalHearingInformation(info: string) {
    await expect(this.newHearingAdditionalInfoTxtBox).toBeVisible();
    await this.newHearingAdditionalInfoTxtBox.fill(info);
  }

  async selectAdditionalHearingDocument(isAdditionalDoc: boolean) { 
    const radioOption = isAdditionalDoc ? 'Yes' : 'No';
    await expect(this.newHearingAdditionalDocRadio).toBeVisible();
    await this.newHearingAdditionalDocRadio.getByLabel(radioOption).check();
  }

  async selectSendNoticeOfHearing(sendNotice: boolean) {
    const radioOption = sendNotice ? 'Yes' : 'No';
    await expect(this.newHearingSendNoticeRadio).toBeVisible();
    await this.newHearingSendNoticeRadio.getByLabel(radioOption).check();
  }
}
