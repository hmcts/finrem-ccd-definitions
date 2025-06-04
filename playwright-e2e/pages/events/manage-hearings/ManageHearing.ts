import { expect, Locator, Page } from "@playwright/test";
import { BaseJourneyPage } from "../../BaseJourneyPage";
import {YesNoRadioEnum} from "../../helpers/enums/RadioEnums.ts";
import {PayloadHelper} from "../../../functional/helpers/Contested/ContestedPayloadHelper.ts";
import {CommonActionsHelper} from "../../helpers/CommonActionsHelper.ts";

export class ManageHearingPage extends BaseJourneyPage {

    private readonly commonActionsHelper: CommonActionsHelper;
    private readonly manageHearingTitle: Locator;
    private readonly addANewHearingRadio: Locator;
    private readonly AddANewHearingTitle: Locator;
    private readonly typeOfHearingDropDown: Locator;


    public constructor(page: Page, commonActionsHelper: CommonActionsHelper) {
        super(page);
        this.commonActionsHelper = commonActionsHelper;
        this.manageHearingTitle = page.getByRole('heading', { name: "Manage Hearings" })
        this.addANewHearingRadio = page.getByRole('radio', { name: "Add a new hearing" })
        this.AddANewHearingTitle = page.getByRole('heading', { name: "Add a new hearing" })
        this.typeOfHearingDropDown = page.locator('#workingHearing_hearingType');
    }

    async selectAddANewHearing() {
        await this.addANewHearingRadio.check();
    }

    async assertWhatWouldYouLikeToDoRequired() {
        const errorMessage = this.page.getByText('What would you like to do? is required');
        await expect(errorMessage).toBeVisible();
    }

    async selectTypeOfHearing(typeOfHearing: string) {
        await expect(this.typeOfHearingDropDown).toBeVisible();
        await this.typeOfHearingDropDown.selectOption({label : typeOfHearing });
    }

    async enterTimeEstimate(duration: string) {
        const hearingTimeEstimate = this.page.locator(`#workingHearing_hearingTimeEstimate`);
        await expect(hearingTimeEstimate).toBeVisible();
        await hearingTimeEstimate.fill(duration);
    }

    async enterHearingDate(day: string, month: string, year: string) {
        const hearingDateDay = this.page.locator(`#hearingDate-day`);
        const hearingDateMonth = this.page.locator(`#hearingDate-month`);
        const hearingDateYear = this.page.locator(`#hearingDate-year`);

        await expect(hearingDateDay).toBeVisible();
        await expect(hearingDateMonth).toBeVisible();
        await expect(hearingDateYear).toBeVisible();

        await hearingDateDay.fill(day);
        await hearingDateMonth.fill(month);
        await hearingDateYear.fill(year);
    }

    async enterHearingTime(time: string) {
        const hearingTime = this.page.locator(`#workingHearing_hearingTime`);
        await expect(hearingTime).toBeVisible();
        await hearingTime.fill(time);
    }

    async selectCourtForHearing(courtRegion: string = "London", courtFrc: string = "London",
                                localCourt: string = "BROMLEY COUNTY COURT AND FAMILY COURT") {
        const regionListDropDown = this.page.locator(`#workingHearing_hearingCourtSelection_region`);
        await expect(regionListDropDown).toBeVisible();
        await regionListDropDown.selectOption(courtRegion);

        const frcDropDown = this.page.locator(`workingHearing_hearingCourtSelection_${courtRegion.toLowerCase()}List`);
        await expect(frcDropDown).toBeVisible();
        await frcDropDown.selectOption(`${courtFrc} FRC`);

        const courtListDropDown = this.page.locator(`workingHearing_hearingCourtSelection_${courtFrc.toLowerCase()}CourtList`);
        await expect(courtListDropDown).toBeVisible();
        await courtListDropDown.selectOption(localCourt);
    }

    async selectHearingAttendees(attendance: string) {
        const hearingAttendance = this.page.locator(`#workingHearing_hearingMode`);
        await expect(hearingAttendance).toBeVisible();
        await hearingAttendance.selectOption(attendance);
    }

    async enterAdditionalInformationAboutHearing(information: string) {
        const additionalInformation = this.page.locator(`#workingHearing_additionalHearingInformation`);
        await expect(additionalInformation).toBeVisible();
        await additionalInformation.fill(information);
    }

    async whetherToUploadOtherDocuments(yesOrNo: YesNoRadioEnum) {
        const uploadOtherDocumentsQuestion = this.page.locator(`#workingHearing_additionalHearingDocPrompt_radio`);
        await expect(uploadOtherDocumentsQuestion).toBeVisible();
        const optionToSelect = uploadOtherDocumentsQuestion.getByLabel(yesOrNo);
        await optionToSelect.check();
    }

    async uploadOtherDocuments(docFilename: string, position: number = 0) {
        const addNewDocumentButton = this.page.getByRole("button", { name: "Add new" }).nth(0);
        await expect(addNewDocumentButton).toBeVisible();

        const uploadOtherDocumentFiles = this.page.locator(`#workingHearing_additionalHearingDocs_value`).nth(position);
        await expect(uploadOtherDocumentFiles).toBeVisible();

        const filePayload = await PayloadHelper.createAliasPDFPayload('./playwright-e2e/data/test.pdf', docFilename);
        await uploadOtherDocumentFiles.setInputFiles(filePayload);

        await this.commonActionsHelper.waitForAllUploadsToBeCompleted(this.page);
    }

    async removeUploadedDocument(position: number = 0) {
        const removeDocumentButton = this.page.getByRole("button", { name: "Remove" }).nth(position);
        await expect(removeDocumentButton).toBeVisible();
        await removeDocumentButton.click();

        const removeDocumentConfirmButton = this.page.getByRole("button", { name: "Remove" })
        await expect(removeDocumentConfirmButton).toBeVisible();
        await removeDocumentConfirmButton.click();
    }

    async assertErrorMessagesForAllMandatoryFields() {
        const errorMessages = [
            "Type of Hearing is required",
            "Hearing Time Estimate is required",
            "Hearing Date is required",
            "Hearing Time is required",
            "Please state in which Financial Remedies Court Zone the applicant resides is required",
            "Hearing attendance is required",
            "Additional information about the hearing is required",
            "Do you want to upload any other documents? is required",
            "Do you want to send a notice of hearing? is required"
        ];

        await this.navigateContinue();

        for (const errorMessage of errorMessages) {
            const errorLocator = this.page.getByText(errorMessage);
            await expect(errorLocator).toBeVisible();
        }

        await this.navigateContinue();
        await this.whetherToUploadOtherDocuments(YesNoRadioEnum.YES)

        const docRequired = this.page.getByText(
            "Please upload any additional documents related to your application. is required"
        );
        await expect(docRequired).toBeVisible();
    }


}