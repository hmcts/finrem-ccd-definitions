import { type Page, expect, Locator } from '@playwright/test';
import { BaseJourneyPage } from '../../BaseJourneyPage';

export class FinancialRemedyCourtPage extends BaseJourneyPage {
    
    private readonly courtZoneDropDown: Locator;
    private readonly highJudgeRadio: Locator;
    private readonly highCourtJudgeReasonTxtBox: Locator;
    private readonly specialFacilitiesTxtBox: Locator;
    private readonly specialArrangementsTxtBox: Locator; 
    private readonly applicantHomeCourtRadio: Locator;
    private readonly reasonForHomeCourtTxtBox: Locator;
    private readonly frcReasonTxtBox: Locator;
    private readonly highCourtConsentError: Locator;

    public constructor(page: Page) {
        super(page);
        this.courtZoneDropDown = page.locator('#regionList');
        this.highJudgeRadio = page.locator('#allocatedToBeHeardAtHighCourtJudgeLevel_radio');
        this.highCourtJudgeReasonTxtBox = page.locator('#allocatedToBeHeardAtHighCourtJudgeLevelText')
        this.specialFacilitiesTxtBox = page.locator('#specialAssistanceRequired');
        this.specialArrangementsTxtBox = page.locator('#specificArrangementsRequired'); 
        this.applicantHomeCourtRadio = page.locator('#isApplicantsHomeCourt_radio');
        this.frcReasonTxtBox = page.locator('#reasonForFRCLocation');
        this.reasonForHomeCourtTxtBox = page.locator('#reasonForLocalCourt');
        this.highCourtConsentError = page.getByText('You cannot select the High')
    }

    async selectCourtZoneDropDown(courtRegion: string, courtFrc: string, localCourt: string) {
        // Map courtRegion to the correct frcDropdown ID
        const courtRegionMap: Record<string, string> = {
            'High Court Family Division': 'highCourtFRCList', // Special case
        };

        // Map courtFrc to the correct courtListDropdown ID
        const courtFrcMap: Record<string, string> = {
            'High Court Family Division FRC': 'highCourtList', // Special case
        };

        // Use the mapped value or default to courtRegion.toLowerCase() + 'FRCList'
        const frcDropdownId = courtRegionMap[courtRegion] || `${courtRegion.toLowerCase()}FRCList`;

        // Sanitize courtFrc to remove spaces and "FRC" for constructing the dropdown ID
        const sanitizedCourtFrc = courtFrc.replace(/\s+FRC$/, '').toLowerCase();
        const courtListDropdownId = courtFrcMap[courtFrc] || `${sanitizedCourtFrc}CourtList`;

        // Select the court region
        await this.courtZoneDropDown.selectOption(courtRegion);

        // Select the FRC (Family Remedy Court)
        const frcDropDown = this.page.locator(`#${frcDropdownId}`);
        await expect(frcDropDown).toBeVisible();
        await frcDropDown.selectOption(courtFrc);

        // Select the local court
        const courtListDropDown = this.page.locator(`#${courtListDropdownId}`);
        await expect(courtListDropDown).toBeVisible();
        await courtListDropDown.selectOption(localCourt);
    }

  async selectHighCourtJudgeLevel(isHighCourtJudgeLevel: boolean) {
    const radioOption = isHighCourtJudgeLevel ? 'Yes' : 'No'; 
    const optionToSelect = this.highJudgeRadio.getByLabel(radioOption);
    await optionToSelect.check();
    if(isHighCourtJudgeLevel) {
      await expect(this.highCourtJudgeReasonTxtBox).toBeVisible();
      await this.highCourtJudgeReasonTxtBox.fill('Reason');
    }
  }

    async verifyHighCourtConsentErrorIsVisible() {
        await expect(this.highCourtConsentError).toBeVisible();
    }

    async enterSpecialFacilities(){
        await this.specialFacilitiesTxtBox.fill("Special facilities")
    }

  async enterSpecialArrangements() {
    await this.specialArrangementsTxtBox.fill('Special Arrangements');
  }

  async selectShouldNotProceedApplicantHomeCourt(notApplicantHomeCourt: boolean) {
    const radioOption = notApplicantHomeCourt ? 'Yes' : 'No'; 
    const optionToSelect = this.applicantHomeCourtRadio.getByLabel(radioOption);
    await optionToSelect.check();
    if(notApplicantHomeCourt) {
      await expect(this.reasonForHomeCourtTxtBox).toBeVisible();
      await this.reasonForHomeCourtTxtBox.fill('Reason');
    }
  }

  async enterFrcReason() {
    await this.frcReasonTxtBox.fill('FRC Reason');
  }

  async enterHomeCourtReason() {
    await this.reasonForHomeCourtTxtBox.fill('FRC Reason');
  }
}
