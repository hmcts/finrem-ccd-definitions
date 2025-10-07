import { type Page, expect, Locator } from '@playwright/test';
import { BaseJourneyPage } from "../../BaseJourneyPage";
import { YesNoRadioEnum } from '../../helpers/enums/RadioEnums';

import { CommonActionsHelper } from '../../helpers/CommonActionsHelper';

export class JudgeUploadApprovedOrderPage extends BaseJourneyPage {
    private readonly commonActionsHelper: CommonActionsHelper;
    private readonly uploadApprovedOrderDocumentHeading: Locator;
    private readonly selectJudgeHeader: Locator;
    private readonly selectJudgeDropdown: Locator;
    private readonly nameOfJudgeHeader: Locator;
    private readonly nameofJudgeTextBox: Locator;
    private readonly courtOrderDate: Locator;
    private readonly courtOrderDay: Locator;
    private readonly courtOrderMonth: Locator;
    private readonly courtOrderYear: Locator;
    private readonly draftDirectionOrderDetailsHeader: Locator;
    private readonly isThisFinalOrderQuestion: Locator;
    private readonly isThereAnotherHearingToBeListedQuestion: Locator;

    public constructor(page: Page, commonActionsHelper: CommonActionsHelper) {
        super(page);
        this.commonActionsHelper = commonActionsHelper;
        this.uploadApprovedOrderDocumentHeading = page.locator('div').filter({ hasText: /^Upload approved order$/ })
        this.selectJudgeHeader = page.getByText('Select Judge', { exact: true });
        this.selectJudgeDropdown = page.getByLabel('Select Judge')
        this.nameOfJudgeHeader = page.getByText('Name of Judge', { exact: true })
        this.nameofJudgeTextBox = page.getByRole('textbox', { name: 'Name of Judge' })
        this.courtOrderDate = page.getByText('Court order date', { exact: true })
        this.courtOrderDay = page.getByRole('textbox', { name: 'Day' })
        this.courtOrderMonth = page.getByRole('textbox', { name: 'Month' })
        this.courtOrderYear = page.getByRole('textbox', { name: 'Year' })
        this.draftDirectionOrderDetailsHeader = page.getByRole('heading', { name: 'Draft Direction Orders Details' }).first()
        this.isThisFinalOrderQuestion = page.getByRole('group', { name: 'Is this the final order?' })
        this.isThereAnotherHearingToBeListedQuestion = page.getByRole('group', { name: 'Is this the final order?' })
    }

    async uploadApprovedOrderDocument(fileName: string, position: number = 0) {
        const addNewButton = this.page.getByRole('button', { name: 'Add new' }).first()
        await addNewButton.click();

        await expect(this.uploadApprovedOrderDocumentHeading).toBeVisible();

        const uploadApprovedOrderDocument = this.page
            .getByRole('button', { name: 'Upload Approved Document' }).nth(position);

        await expect(uploadApprovedOrderDocument).toBeVisible();
        const filePayload = await this.commonActionsHelper
            .createAliasPDFPayload('./playwright-e2e/resources/file/test.docx', fileName);

        await this.commonActionsHelper.uploadWithRateLimitRetry(this.page, uploadApprovedOrderDocument, filePayload);

    }


    async uploadAdditionalAttachment(fileName: string, position: number = 0) {
        await expect(this.uploadApprovedOrderDocumentHeading).toBeVisible();
        const addNewButton = this.page.locator('#judgeApprovedOrderCollection_0_additionalDocuments').getByRole('button', { name: 'Add new' })
        await addNewButton.click();

        const uploadAdditionalAttachmentInput = this.page
            .locator('#judgeApprovedOrderCollection_0_additionalDocuments_value')

        await expect(uploadAdditionalAttachmentInput).toBeVisible();
        const filePayload = await this.commonActionsHelper
            .createAliasPDFPayload('./playwright-e2e/resources/file/test.pdf', fileName);

        await this.commonActionsHelper.uploadWithRateLimitRetry(this.page, uploadAdditionalAttachmentInput, filePayload);
  
    }

    async selectJudgeFromDropdown(judgeName: string) {
        await expect(this.selectJudgeHeader).toBeVisible();
        await this.selectJudgeDropdown.selectOption(judgeName);
    }

    async enterNameOfJudge(judgeName: string) {
        await expect(this.nameOfJudgeHeader).toBeVisible();
        await this.nameofJudgeTextBox.fill(judgeName);
    }

    async blurCourtOrderDateInput() {
        await this.courtOrderDay.blur();
        await this.courtOrderMonth.blur();
        await this.courtOrderYear.blur();
    }

    async enterCourtOrderDate(day: string, month: string, year: string) {
        await expect(this.courtOrderDate).toBeVisible();
        await this.courtOrderDay.fill(day);
        await this.courtOrderMonth.fill(month);
        await this.courtOrderYear.fill(year);
        await this.blurCourtOrderDateInput();
    }

    async enterDraftDirectionOrderDetails(
        isFinalOrder: YesNoRadioEnum = YesNoRadioEnum.YES,
        isAnotherHearing: YesNoRadioEnum = YesNoRadioEnum.YES
    ) {
        await expect(this.draftDirectionOrderDetailsHeader).toBeVisible();
        const addNewButton = this.page.getByRole('button', { name: 'Add new' }).first();
        await addNewButton.click();

        await expect(this.isThisFinalOrderQuestion).toBeVisible();
        await this.page.getByRole('group', { name: 'Is this the final order?' }).getByLabel(isFinalOrder).click();

        await expect(this.isThereAnotherHearingToBeListedQuestion).toBeVisible();
        await this.page.getByRole('group', { name: 'Is there another hearing to' }).getByLabel(isAnotherHearing).click();
    }
}
