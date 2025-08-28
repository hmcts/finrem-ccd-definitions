import { type Page, expect, Locator } from '@playwright/test';
import { BaseJourneyPage } from "../../BaseJourneyPage";
import { CommonActionsHelper } from '../../helpers/CommonActionsHelper';

    export class SendOrderPage extends BaseJourneyPage {
        private readonly updateSendApprovedOrderRadio: Locator;
        private readonly commonActionsHelper: CommonActionsHelper;
        private readonly uploadLabel: Locator;
        private readonly uploadInput: Locator;
        private readonly caseStateButton: Locator;
        private readonly caseStateDropdown: Locator;

    public constructor(page: Page, commonActionsHelper: CommonActionsHelper) {
        super(page);
        this.commonActionsHelper = commonActionsHelper;
        this.updateSendApprovedOrderRadio = page.locator('#ordersToSend_value_0_documentToShare_Yes');
        this.uploadLabel = page.getByText("Please upload any additional document (Optional");
        this.uploadInput = page.locator('#additionalDocument'); 
        this.caseStateButton = page.locator('#sendOrderPostStateOption');
        this.caseStateDropdown = page.locator('#sendOrderPostStateOption'); 

    }

    async selectSendApprovedOrder() {
        await this.updateSendApprovedOrderRadio.check();
    }

    // Upload a document
    async uploadDocument(filePath: string) {
        await expect(this.uploadLabel).toBeVisible();
        await this.uploadInput.setInputFiles(filePath);
    }

    async clickCaseStateButton(): Promise<void> {
       await this.caseStateButton.click();
    }

    async selectCaseState(state: string): Promise<void> {
        await this.caseStateDropdown.selectOption({ label: state });
    }
}
