import { type Page, Locator } from '@playwright/test';
import { BaseJourneyPage } from '../../BaseJourneyPage';
import { CommonActionsHelper } from '../../helpers/CommonActionsHelper';

export class MiamDetailsPage extends BaseJourneyPage {

    private readonly mediatorRegistrationNumberTxtBox: Locator;
    private readonly familyMediatorServiceNameTxtBox: Locator;
    private readonly soleTraderName: Locator;
    private readonly miamDocUpload: Locator
    private readonly miamDocUploadPaperCase: Locator

    private readonly commonActionsHelper: CommonActionsHelper;

    public constructor(page: Page, commonActionsHelper: CommonActionsHelper) {
        super(page);
        this.commonActionsHelper = commonActionsHelper;

        this.mediatorRegistrationNumberTxtBox = page.locator('#mediatorRegistrationNumber');
        this.familyMediatorServiceNameTxtBox = page.locator('#familyMediatorServiceName');
        this.soleTraderName = page.locator('#soleTraderName');
        this.miamDocUpload = page.locator('#uploadMediatorDocument')
        this.miamDocUploadPaperCase = page.locator('#uploadMediatorDocumentPaperCase')
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
        await this.commonActionsHelper.uploadWithRateLimitRetry(
            this.page, this.miamDocUpload, './playwright-e2e/resources/file/MIAM.pdf'
        );
    }

    async uploadMiamDocPaperCase(){
        await this.commonActionsHelper.uploadWithRateLimitRetry(this.page, this.miamDocUploadPaperCase, './playwright-e2e/resources/file/MIAM.pdf');
    }
}
