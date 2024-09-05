import { type Page, Locator } from '@playwright/test';

export class MiamDetailsPage {
    readonly page: Page;

    readonly mediatorRegistrationNumberTxtBox: Locator;
    readonly familyMediatorServiceNameTxtBox: Locator; 
    readonly soleTraderName: Locator;
    readonly miamDocUpload: Locator

    public constructor(page: Page) {
        this.page = page

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
        await this.page.waitForTimeout(3000); 
    }
}