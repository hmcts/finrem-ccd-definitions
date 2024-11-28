import { type Page, Locator } from '@playwright/test';
import { BaseJourneyPage } from '../../BaseJourneyPage';

export class PropertyAdjustmentPage extends BaseJourneyPage {

    private readonly propertyAdjustmentAddressTextBox: Locator;
    private readonly propertyAdjustmentMortgages: Locator; 
    private readonly propertyAdjustmentAddAdditionalRadio: Locator
    private readonly propAdjAdditionalAddNewBtn: Locator
    private readonly propAdjAdditionalAddressTxtBox: Locator;
    private readonly propAdjAdditionalMortgageTextBox: Locator; 

    public constructor(page: Page) {
        super(page);

        this.propertyAdjustmentAddressTextBox = page.getByRole('textbox', {name: 'property address'})
        this.propertyAdjustmentMortgages = page.getByRole('textbox', {name: 'Name(s) and address(es) of any mortgage(s) for property'})
        this.propertyAdjustmentAddAdditionalRadio = page.locator(
          '#additionalPropertyOrderDecision_radio'
        );
    
        this.propAdjAdditionalAddNewBtn = page.getByRole('button', { name: 'Add new' }).first();
        this.propAdjAdditionalAddressTxtBox = page.getByRole('textbox', {name: 'property address (Optional)'}); 
        this.propAdjAdditionalMortgageTextBox = page.getByRole('textbox', {name: 'Name(s) and address(es) of any mortgage(s) for property (Optional)'}); 
    }

    async propertyAdjustmentOrder() {
        await this.propertyAdjustmentAddressTextBox.fill('Test Address');
        await this.propertyAdjustmentMortgages.fill('Test Mortgage');
    }

    async addAdditionalPropertyAdjustment(add: boolean) {
        const radioOption = add ? 'Yes' : 'No'; 
        const optionToSelect = this.propertyAdjustmentAddAdditionalRadio.getByLabel(radioOption)
        await optionToSelect.check();
        if(add) {
            await this.propAdjAdditionalAddNewBtn.click()
            await this.propAdjAdditionalAddressTxtBox.fill('Test Address 2') 
            await this.propAdjAdditionalMortgageTextBox.fill('Test Mortgage 2')
        }
    }
}
