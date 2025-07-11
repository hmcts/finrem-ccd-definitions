import { type Page, expect, Locator } from '@playwright/test';
import { BaseJourneyPage } from "../../BaseJourneyPage";
import { CommonActionsHelper } from '../../helpers/CommonActionsHelper';

export class ContestedSendOrderPage extends BaseJourneyPage {

    private readonly sendOrderRadio: Locator;
    private readonly yesRadio: Locator;
    private readonly noRadio: Locator;
    private readonly findCaseStateButton: Locator;
    private readonly caseOrderDropdown: Locator;

    public constructor(page: Page) {
        super(page);
        this.sendOrderRadio = page.locator('#ordersToSend_value_0_documentToShare_Yes') 
        this.yesRadio = page.getByRole('radio', { name: 'Yes' });
        this.noRadio = page.getByRole('radio', { name: 'No' });
        this.findCaseStateButton = page.locator('#sendOrderPostStateOption');
        this.caseOrderDropdown = page.locator('#sendOrderPostStateOption');
    }

    async selectSendRadio(sendOrderRadio: Boolean){
        const radioOption = sendOrderRadio ? 'Yes' : 'No'; 
        const optionToSelect = this.sendOrderRadio.getByLabel(radioOption);
        await optionToSelect.check();
    }

    async checkSendOrder(isConfidential: boolean) {
        await (isConfidential ? this.yesRadio : this.noRadio).check(); 
    }

    async clickCaseState(): Promise<void> {
       await this.findCaseStateButton.click();
    }

    async selectOrder(address: string): Promise<void> {
        await this.caseOrderDropdown.selectOption({ label: address });
    }
}
