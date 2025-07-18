import { type Page, expect, Locator } from '@playwright/test';
import { BaseJourneyPage } from "../../BaseJourneyPage";
import { CommonActionsHelper } from '../../helpers/CommonActionsHelper';
import { YesNoRadioEnum } from '../../helpers/enums/RadioEnums';
import { DocumentHelper } from '../../../data-utils/DocumentHelper';

export class UploadDraftOrdersPage extends BaseJourneyPage {
    private readonly kindOfDraftOrderToUploadRadio: Locator;
    private readonly suggestedDraftOrderRadio: Locator;
    private readonly confirmTheUploadedDocsAreForTheCaseCheckbox: Locator;
    private readonly hearingListDropdown: Locator;
    private readonly judgeForHearingKnownRadio: Locator;
    private readonly uploadOnBehalfOfApplicantRadio: Locator;
    private readonly uploadOnBehalfOfRespondentRadio: Locator;
    private readonly uploadingOrdersCheckbox: Locator;
    private readonly uploadingPensionSharingAnnexesCheckbox: Locator;
    private readonly uploadDraftOrderGroup: Locator;
    private readonly uploadPensionSharingAnnexesGroup: Locator;
    private readonly draftOrdersUploaded: Locator;
    private readonly commonActionsHelper: CommonActionsHelper;
    
    public constructor(page: Page, commonActionsHelper: CommonActionsHelper) {
        super(page);
        this.commonActionsHelper = commonActionsHelper;
        this.kindOfDraftOrderToUploadRadio = page.getByRole('radio', { name: 'An agreed order following a hearing (agreed by the parties at the hearing)' });
        this.suggestedDraftOrderRadio = page.getByRole('radio', { name: 'A suggested draft order prior to a listed hearing (this will just be placed on file for the hearing)' });
        this.confirmTheUploadedDocsAreForTheCaseCheckbox = page.getByRole('checkbox', { name: 'I confirm the uploaded documents are for the' });
        this.hearingListDropdown =  page.locator('select#uploadAgreedDraftOrder_hearingDetails')
        this.judgeForHearingKnownRadio = page.locator('#uploadAgreedDraftOrder_judgeKnownAtHearing')
        this.uploadOnBehalfOfApplicantRadio = page.locator('input#uploadAgreedDraftOrder_uploadParty_theApplicant')
        this.uploadOnBehalfOfRespondentRadio = page.locator('input#uploadAgreedDraftOrder_uploadParty_theRespondent');
        this.uploadingOrdersCheckbox = page.getByRole('checkbox', { name: 'Orders' });
        this.uploadingPensionSharingAnnexesCheckbox = page.getByRole('checkbox', { name: 'Pension Sharing Annexes' });
        this.uploadDraftOrderGroup = page.locator('div#uploadAgreedDraftOrder_agreedDraftOrderCollection')
        this.uploadPensionSharingAnnexesGroup = page.locator('div#uploadAgreedDraftOrder_agreedPsaCollection');
        this.draftOrdersUploaded = page.getByText('Draft orders uploaded');
    }

    async chooseAnAgreedOrderFollowingAHearing() {
        await expect(this.kindOfDraftOrderToUploadRadio).toBeVisible();
        await this.kindOfDraftOrderToUploadRadio.check();
      }

    async confirmTheUploadedDocsAreForTheCase() {
        await expect(this.confirmTheUploadedDocsAreForTheCaseCheckbox).toBeVisible();
        await this.confirmTheUploadedDocsAreForTheCaseCheckbox.check();
    }
    
    async selectFirstAvailableHearing() {
        await expect(this.hearingListDropdown).toBeVisible();
        await this.hearingListDropdown.selectOption({ index: 1 });
    }

    async chooseWhetherJudgeForHearingIsKnown(yesOrNo : YesNoRadioEnum) {
        await expect(this.judgeForHearingKnownRadio).toBeVisible();
        const optionToSelect = this.judgeForHearingKnownRadio.getByLabel(yesOrNo);
        await optionToSelect.check();
    }

    async chooseUploadOnBehalfOfApplicant() {
        await expect(this.uploadOnBehalfOfApplicantRadio).toBeVisible();
        await this.uploadOnBehalfOfApplicantRadio.check();
    }

    async chooseUploadOnBehalfOfRespondent() {
        await expect(this.uploadOnBehalfOfRespondentRadio).toBeVisible();
        await this.uploadOnBehalfOfRespondentRadio.check();
    }

    async chooseThatYouAreUploadingOrders() {
        await expect(this.uploadingOrdersCheckbox).toBeVisible();
        await this.uploadingOrdersCheckbox.check();
    }

    async chooseThatYouAreUploadingPensionSharingAnnexes() {
        await expect(this.uploadingPensionSharingAnnexesCheckbox).toBeVisible();
        await this.uploadingPensionSharingAnnexesCheckbox.check();
    }

    async uploadDraftOrder(caseId: string, position : number = 0) {
        const addNewButton = this.uploadDraftOrderGroup.getByRole('button', { name: 'Add new' });
        await addNewButton.click();

        const draftOrderDocUpload = this.page.locator(`input#uploadAgreedDraftOrder_agreedDraftOrderCollection_${position}_agreedDraftOrderDocument`);
        await expect(draftOrderDocUpload).toBeVisible();
        await DocumentHelper.createDraftOrderDocument(caseId);
        await this.commonActionsHelper.uploadWithRateLimitRetry(
            this.page,
            draftOrderDocUpload,
            './playwright-e2e/resources/files_built_by_tests/upload-draft-order/agreed-draft-order-document.docx'
        );
    }

    async assertMandatoryFields() {
        const mandatoryFieldsErrors = ['Confirm the uploaded documents are for the case is required',
        'Which hearing was this? is required',
        'Do you know who was the judge at this hearing? is required',
        'Who are you uploading this on behalf of? is required',
        'What are you uploading? is required', 'Field is required'];
        await this.navigateContinue();
        await this.assertErrorMessage(mandatoryFieldsErrors);
    }

    async uploadPensionSharingAnnexes(caseId: string, position : number = 0) {
        const addNewButton = this.uploadPensionSharingAnnexesGroup.getByRole('button', { name: 'Add new' });
        await addNewButton.click();
        const pensionSharingAnnexesDocUpload = this.page.locator(`input#uploadAgreedDraftOrder_agreedPsaCollection_${position}_agreedPensionSharingAnnexes`);
        await expect(pensionSharingAnnexesDocUpload).toBeVisible();
        const filePayload = await this.commonActionsHelper
            .createAliasPDFPayload('./playwright-e2e/resources/file/test.pdf', "BagginsFDA.pdf");
        await this.commonActionsHelper.uploadWithRateLimitRetry(
            this.page,
            pensionSharingAnnexesDocUpload,
            filePayload
        );
    }

    async closeAndReturnToCaseDetails() {
        const closeButton = this.page.getByRole('button', { name: 'Close and Return to case details' });
        await expect(this.draftOrdersUploaded).toBeVisible();
        await expect(closeButton).toBeVisible();
        await closeButton.click();
        await this.page.waitForURL(/case-details/);
    }
}


