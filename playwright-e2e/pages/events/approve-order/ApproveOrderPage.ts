import {expect, Locator, Page} from "@playwright/test";
import {BaseJourneyPage} from "../../BaseJourneyPage.ts";
import { ManageHearingPage } from "../manage-hearings/ManageHearing.ts";
import { CommonActionsHelper } from "../../helpers/CommonActionsHelper.ts";

export class ApproveOrderPage extends ManageHearingPage {

    private readonly approveOrdersTitle: Locator;
    private readonly isAnotherHearingListed: Locator;
    private readonly judgeTitle: Locator;
    private readonly draftOrdersReviewed: Locator;
    private readonly whichOrderIsThisFor: Locator;

    public constructor(page: Page, commonActionsHelper: CommonActionsHelper) {
        super(page, commonActionsHelper);
        this.approveOrdersTitle = page.getByRole('heading', { name: 'Approve orders' });
        this.isAnotherHearingListed = page.locator(`#hearingInstruction_requireAnotherHearing_radio`);
        this.judgeTitle = page.locator(`#extraReportFieldsInput_judgeType`);
        this.draftOrdersReviewed = page.getByText('Draft orders reviewed');
        this.whichOrderIsThisFor = page.getByLabel('Which order is this hearing')
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

    async selectWhichOrderIsThisFor(orderName: string) {
        expect(this.whichOrderIsThisFor).toBeVisible();
        const whichOrderDropdown = this.page.getByLabel('Which order is this hearing')
        await whichOrderDropdown.selectOption({ label: orderName });
    }
    async selectTimeEstimate(option: 'standard' | 'additional' = 'standard') {
        const radioOption =
            option === 'standard'
                ? 'The application can be listed'
                : 'Additional time is needed (Or';
        await this.page.getByRole('radio', { name: radioOption }).check();
    }
}
