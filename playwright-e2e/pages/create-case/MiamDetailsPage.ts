import { type Page, Locator } from '@playwright/test';
import { BaseJourneyPage } from '../BaseJourneyPage';

export class MiamDetailsPage extends BaseJourneyPage {

    private readonly mediatorRegistrationNumberTxtBox: Locator;
    private readonly familyMediatorServiceNameTxtBox: Locator; 
    private readonly soleTraderName: Locator;
    private readonly miamDocUpload: Locator

    public constructor(page: Page) {
        super(page);
        this.mediatorRegistrationNumberTxtBox = page.locator('#mediatorRegistrationNumber');
        this.familyMediatorServiceNameTxtBox = page.locator('#familyMediatorServiceName'); 
        this.soleTraderName = page.locator('#soleTraderName');
        this.miamDocUpload = page.locator('#uploadMediatorDocument')
    }

    async enterMediatorRegistrationNumber(){
        await this.mediatorRegistrationNumberTxtBox.fill('MIAM123455');
    }

    async enterFamilyMediatorServiceName(){
        await this.familyMediatorServiceNameTxtBox.fill('MIAM Serv name');
    }

    async enterSoleTraderName(){
        await this.soleTraderName.fill('Sole Trader name');
    }

    async uploadMiamDoc(){
        await this.miamDocUpload.setInputFiles('./playwright-e2e/data/MIAM.pdf');
        await this.page.waitForTimeout(6000); 
    }
}
