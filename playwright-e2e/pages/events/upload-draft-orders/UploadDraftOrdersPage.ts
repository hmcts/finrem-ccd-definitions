import { type Page, expect, Locator } from '@playwright/test';
import { BaseJourneyPage } from "../../BaseJourneyPage";
import { YesNoRadioEnum } from '../../helpers/enums/RadioEnums';

export class UploadDraftOrdersPage extends BaseJourneyPage {
    private readonly kindOfDraftOrderToUploadRadio: Locator;
    private readonly confirmTheUploadedDocsAreForTheCaseCheckbox: Locator;
    private readonly hearingListdropdown: Locator;
    private readonly judgeForHearingKnownRadio: Locator;
    private readonly uploadOnBehalfOfApplicantRadio: Locator;
    private readonly uploadingOrdersCheckbox: Locator;
    
    public constructor(page: Page) {
        super(page);
        this.kindOfDraftOrderToUploadRadio = page.getByRole('radio', { name: 'An agreed order following a hearing (agreed by the parties at the hearing)' });
        this.confirmTheUploadedDocsAreForTheCaseCheckbox = page.getByRole('checkbox', { name: 'I confirm the uploaded documents are for the' });
        this.hearingListdropdown =  page.locator('select#uploadAgreedDraftOrder_hearingDetails')
        this.judgeForHearingKnownRadio = page.locator('#uploadAgreedDraftOrder_judgeKnownAtHearing')
        this.uploadOnBehalfOfApplicantRadio = page.locator('input#uploadAgreedDraftOrder_uploadParty_theApplicant')
        this.uploadingOrdersCheckbox = page.getByRole('checkbox', { name: 'Orders' });
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

    async checkThatYouAreUploadingOrders() {
        await expect(this.uploadingOrdersCheckbox).toBeVisible();
        await this.uploadingOrdersCheckbox.check();
    }
}


