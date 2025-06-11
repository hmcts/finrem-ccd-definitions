import { type Page, expect, Locator } from '@playwright/test';
import { BaseJourneyPage } from "../../BaseJourneyPage";
import { CommonActionsHelper } from '../../helpers/CommonActionsHelper';
import { YesNoRadioEnum } from '../../helpers/enums/RadioEnums';
import { DocumentHelper } from '../../../functional/data-utils/DocumentHelper';

export class UploadDraftOrdersPage extends BaseJourneyPage {
    private readonly kindOfDraftOrderToUploadRadio: Locator;
    private readonly confirmTheUploadedDocsAreForTheCaseCheckbox: Locator;
    private readonly hearingListdropdown: Locator;
    private readonly judgeForHearingKnownRadio: Locator;
    private readonly uploadOnBehalfOfApplicantRadio: Locator;
    private readonly uploadingOrdersCheckbox: Locator;
    private readonly firstDraftOrderDocUpload: Locator;
    private readonly commonActionsHelper: CommonActionsHelper;
    
    public constructor(page: Page, commonActionsHelper: CommonActionsHelper) {
        super(page);
        this.commonActionsHelper = commonActionsHelper;
        this.kindOfDraftOrderToUploadRadio = page.getByRole('radio', { name: 'An agreed order following a hearing (agreed by the parties at the hearing)' });
        this.confirmTheUploadedDocsAreForTheCaseCheckbox = page.getByRole('checkbox', { name: 'I confirm the uploaded documents are for the' });
        this.hearingListdropdown =  page.locator('select#uploadAgreedDraftOrder_hearingDetails')
        this.judgeForHearingKnownRadio = page.locator('#uploadAgreedDraftOrder_judgeKnownAtHearing')
        this.uploadOnBehalfOfApplicantRadio = page.locator('input#uploadAgreedDraftOrder_uploadParty_theApplicant')
        this.uploadingOrdersCheckbox = page.getByRole('checkbox', { name: 'Orders' });
        this.firstDraftOrderDocUpload = page.locator('input#uploadAgreedDraftOrder_agreedDraftOrderCollection_0_agreedDraftOrderDocument');
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
        await expect(this.hearingListdropdown).toBeVisible();
        await this.hearingListdropdown.selectOption({ index: 1 });
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

    async chooseThatYouAreUploadingOrders() {
        await expect(this.uploadingOrdersCheckbox).toBeVisible();
        await this.uploadingOrdersCheckbox.check();
    }

    async uploadDraftOrder(caseId: string) {
        await expect(this.firstDraftOrderDocUpload).toBeVisible();
        await DocumentHelper.createDraftOrderDocument(caseId);
        await this.firstDraftOrderDocUpload.setInputFiles('./playwright-e2e/resources/files_built_by_tests/upload-draft-order/agreed-draft-order-document.docx');
        await this.commonActionsHelper.waitForAllUploadsToBeCompleted(this.page);
    }
}


