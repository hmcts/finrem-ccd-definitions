import {expect, Locator, Page} from "@playwright/test";
import {BaseJourneyPage} from "../../BaseJourneyPage.ts";

export class ApproveOrderPage extends BaseJourneyPage {

    private readonly approveOrdersTitle: Locator;
    private readonly isAnotherHearingListed: Locator;
    private readonly judgeTitle: Locator;
    private readonly draftOrdersReviewed: Locator;

    public constructor(page: Page) {
        super(page);
        this.approveOrdersTitle = page.getByRole('heading', { name: 'Approve orders' });
        this.isAnotherHearingListed = page.locator(`#hearingInstruction_requireAnotherHearing_radio`);
        this.judgeTitle = page.locator(`#extraReportFieldsInput_judgeType`);
        this.draftOrdersReviewed = page.getByText('Draft orders reviewed');
    }


    async assertApproveOrdersPage() {
        await this.approveOrdersTitle.waitFor({ state: 'visible' });
        await expect(this.approveOrdersTitle).toBeVisible();
    }

    async selectIsThisDocumentReadyToBeSealedAndIssued(isReady: string, documentName: string) {
        const documentGroup = await this.page.locator(`div[id^="judgeApproval"][id*="_judgeApproval"]`).all();

        for (const document of documentGroup) {
            const documentTitle = await document.textContent();
            if (documentTitle?.includes(documentName)) {
                const radio = document.locator(`div[id$="_judgeDecision"]`)
                const optionToSelect = radio.getByLabel(isReady);
                await optionToSelect.check();
                break;
            }
        }
    }

    async verifyApproveOrderDetails(param:{
        order: string,
        hearing: string,
        documentName: string
    }, position: number = 1) {
        const documentGroup = this.page.locator(`div[id="judgeApproval${position}_judgeApproval${position}"]`);
        await expect(documentGroup).toBeVisible();

        const orderTitle =  documentGroup.locator(`#enhancedTitle`);
        await expect(orderTitle).toHaveText(param.order);

        // Assert hearing and documentName are present in the documentGroup's text
        await expect(documentGroup).toContainText(param.hearing);
        await expect(documentGroup).toContainText(param.documentName);
    }

    async selectIsAnotherHearingListed(isAnotherHearingListed: boolean) {
        const optionToSelect = this.isAnotherHearingListed.getByLabel(isAnotherHearingListed ? 'Yes' : 'No');
        await optionToSelect.check();
    }

    async verifyJudgeTitleListOptions() {
        const titleOptions = ['District Judge', 'Deputy District Judge', 'His Honour Judge', 'Her Honour Judge',
            'Recorder', 'The Honourable Mr Justice', 'The Honourable Mrs Justice', 'The Honourable Ms Justice'];
        await this.assertDropDownOptionsAreVisible(titleOptions, this.judgeTitle);
    }


    async selectJudgeTitle(judgeTitle: string) {
        await this.judgeTitle.selectOption({ label: judgeTitle });
    }

    async closeAndReturnToCaseDetails() {
        const closeButton = this.page.getByRole('button', { name: 'Close and Return to case details' });
        await expect(this.draftOrdersReviewed).toBeVisible();
        await expect(closeButton).toBeVisible();
        await closeButton.click();
        await this.page.waitForURL(/case-details/);
    }
}