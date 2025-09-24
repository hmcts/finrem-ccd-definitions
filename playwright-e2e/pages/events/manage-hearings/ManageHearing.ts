import {expect, Locator, Page} from "@playwright/test";
import {BaseJourneyPage} from "../../BaseJourneyPage";
import {YesNoRadioEnum} from "../../helpers/enums/RadioEnums.ts";
import {CommonActionsHelper} from "../../helpers/CommonActionsHelper.ts";
import {camelCase} from "lodash";

export class ManageHearingPage extends BaseJourneyPage {

    private readonly commonActionsHelper: CommonActionsHelper;
    private readonly manageHearingTitle: Locator;
    private readonly addANewHearingRadio: Locator;
    private readonly addANewHearingTitle: Locator;
    private readonly typeOfHearingDropDown: Locator;
    private readonly hearingTimeEstimate: Locator;

    public constructor(page: Page, commonActionsHelper: CommonActionsHelper) {
        super(page);
        this.commonActionsHelper = commonActionsHelper;
        this.manageHearingTitle = page.getByRole('heading', { name: "Manage Hearings" })
        this.addANewHearingRadio = page.getByRole('radio', { name: "Add a new hearing" })
        this.addANewHearingTitle = page.getByRole('heading', { name: "Add a new hearing" })
        this.typeOfHearingDropDown = page.getByLabel('Type of Hearing');
        this.hearingTimeEstimate = this.page.locator(`#workingHearing_hearingTimeEstimate`);
    }

    async selectAddANewHearing() {
        await expect(this.manageHearingTitle).toBeVisible();
        await expect(this.addANewHearingRadio).toBeVisible();
        await this.addANewHearingRadio.check();
    }

    async assertWhatWouldYouLikeToDoRequired() {
        await this.assertErrorMessage(['What would you like to do? is required'])
    }

    async assertHearingTypeDropDownOptionsAreVisible(options: string[]) {
       await this.assertDropDownOptionsAreVisible(options, this.typeOfHearingDropDown);
    }

    async selectTypeOfHearing(typeOfHearing: string) {
        await expect(this.typeOfHearingDropDown).toBeVisible();
        await this.typeOfHearingDropDown.selectOption({label : typeOfHearing });
    }

    async enterTimeEstimate(duration: string) {
        await expect(this.hearingTimeEstimate).toBeVisible();
        await this.hearingTimeEstimate.fill(duration);
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

    async enterDefaultHearingDate() {
        const hearingDate = new Date();
        hearingDate.setDate(hearingDate.getDate() + 12 * 7); // 12 weeks from now
        const date = hearingDate.toISOString().split('T')[0];
        const [year, month, day] = date.split('-');
        await this.enterHearingDate(day, month, year);
    }

    async assertHearingDateFormatError() {
        await this.assertErrorMessage(['The data entered is not valid for Hearing Date']);
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

        const frcDropDown = this.page
            .locator(`#workingHearing_hearingCourtSelection_${camelCase(courtRegion)}List`);
        await expect(frcDropDown).toBeVisible();
        await frcDropDown.selectOption(`${courtFrc} FRC`);

        // Select the local court from the visible dropdown
        const courtListDropDown = this.page.locator('select[id^="workingHearing_hearingCourtSelection_"][id*="CourtList"]:not(:where(div[hidden] *))');
        
        await expect(courtListDropDown).toBeVisible();
        await courtListDropDown.selectOption(localCourt);
    }

    async selectHearingAttendees(attendance: string) {
        const hearingAttendance = this.page.locator(`#workingHearing_hearingMode`);
        await expect(hearingAttendance).toBeVisible();
        await hearingAttendance.selectOption(attendance);
    }

    async enterAdditionalInformationAboutHearing(information: string) {
        const additionalInformation = this.page
            .locator(`#workingHearing_additionalHearingInformation`);
        await expect(additionalInformation).toBeVisible();
        await additionalInformation.fill(information);
    }

    async whetherToUploadOtherDocuments(yesOrNo: YesNoRadioEnum) {
        const uploadOtherDocumentsQuestion = this.page
            .locator(`#workingHearing_additionalHearingDocPrompt`);
        await expect(uploadOtherDocumentsQuestion).toBeVisible();
        const optionToSelect = uploadOtherDocumentsQuestion.getByLabel(yesOrNo);
        await optionToSelect.check();
    }

    async uploadOtherDocuments(docFilename: string, position: number = 0) {
        await this.navigateAddNew();

        const uploadOtherDocumentFiles = this.page
            .locator(`#workingHearing_additionalHearingDocs_value`).nth(position);
        await expect(uploadOtherDocumentFiles).toBeVisible();

        const filePayload = await this.commonActionsHelper
            .createAliasPDFPayload('./playwright-e2e/resources/file/test.pdf', docFilename);

        await this.commonActionsHelper.uploadWithRateLimitRetry(this.page, uploadOtherDocumentFiles, filePayload);
    }

    async selectSendNoticeOfHearing(yesOrNo: YesNoRadioEnum) {
        const sendNoticeOfHearing = this.page.locator(`#workingHearing_hearingNoticePrompt`);
        await expect(sendNoticeOfHearing).toBeVisible();
        const optionToSelect = sendNoticeOfHearing.getByLabel(yesOrNo);
        await optionToSelect.check();
    }

    async selectWhoShouldSeeThisOrder(partyType: string, partyName: string) {
        const checkbox = this.page.getByRole('checkbox', { name: `${partyType} - ${partyName}` });
        await expect(checkbox).toBeVisible();
        await checkbox.check();
    }

    async selectAllWhoShouldSeeThisOrder(parties: { partyType: string, partyName: string }[]) {
        for (const { partyType, partyName } of parties) {
            await this.selectWhoShouldSeeThisOrder(partyType, partyName);
        }
    }

    async unSelectWhoShouldSeeThisOrder(partyType: string, partyName: string) {
        const checkbox = this.page.getByRole('checkbox', { name: `${partyType} - ${partyName}` });
        await expect(checkbox).toBeVisible();
        await checkbox.uncheck();
    }

    async assertErrorMessagesForAllMandatoryFields() {
        const errorMessages = [
            "Type of Hearing is required",
            "Hearing Time Estimate is required",
            "Hearing Date is required",
            "Hearing Time is required",
            "Please state in which Financial Remedies Court Zone the applicant resides is required",
            "Hearing Attendance is required",
            "Additional information about the hearing is required",
            "Do you want to upload any other documents? is required",
            "Do you want to send a notice of hearing? is required"
        ];

        await this.navigateContinue();

        await this.assertErrorMessage(errorMessages);

        await this.whetherToUploadOtherDocuments(YesNoRadioEnum.YES)

        await this.assertErrorMessage(
            ["Please upload any additional documents related to your application. is required"]
        );
    }

    async addHearing(param: {
        type: string;
        duration: string;
        date: { day: string; month: string; year: string } | {};
        time: string;
        court: { zone: string; frc: string; courtName: string };
        attendance: string;
        additionalInformation: string;
        uploadAnySupportingDocuments: boolean;
        uploadFiles: string[];
        sendANoticeOfHearing: boolean
    }) {
        await expect(this.addANewHearingTitle).toBeVisible();

        await this.selectTypeOfHearing(param.type);
        await this.enterTimeEstimate(param.duration);
        const date = param.date as any;
        if (date.day && date.month && date.year) {
            await this.enterHearingDate(date.day, date.month, date.year);
        } else {
            await this.enterDefaultHearingDate();
        }
        await this.enterHearingTime(param.time);
        await this.selectCourtForHearing(param.court.zone, param.court.frc, param.court.courtName);
        await this.selectHearingAttendees(param.attendance);
        await this.enterAdditionalInformationAboutHearing(param.additionalInformation);

        if (param.uploadAnySupportingDocuments) {
            await this.whetherToUploadOtherDocuments(YesNoRadioEnum.YES);
            for (let i=0; i< param.uploadFiles.length;i++) {
                await this.uploadOtherDocuments(param.uploadFiles[i], i);
            }
        } else {
            await this.whetherToUploadOtherDocuments(YesNoRadioEnum.NO);
        }
        if (param.sendANoticeOfHearing) {
            await this.selectSendNoticeOfHearing(YesNoRadioEnum.YES);
        } else {
            await this.selectSendNoticeOfHearing(YesNoRadioEnum.NO);
        }
    }

    async removeContent() {
        const removeButton = this.page.getByRole('button', { name: 'Remove' });
        await expect(removeButton).toBeVisible();
        await removeButton.click({ force: true });
        await expect(removeButton).toBeVisible();
        await removeButton.click({ force: true });
    }
}
