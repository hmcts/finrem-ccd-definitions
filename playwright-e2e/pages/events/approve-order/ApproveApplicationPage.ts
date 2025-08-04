import { Locator, Page } from '@playwright/test';
import { BaseJourneyPage } from '../../BaseJourneyPage';
import {CommonActionsHelper} from "../../helpers/CommonActionsHelper.ts";

export class ApproveApplicationPage extends BaseJourneyPage {

    private readonly subjectToRadio: Locator;
    private readonly pensionProviderRadio: Locator;
    private readonly judgeDropDown: Locator;
    private readonly uploadConsentOrderFileUpload: Locator;
    private readonly commonActionsHelper: CommonActionsHelper;


    public constructor(page: Page, commonActionsHelper: CommonActionsHelper) {
        super(page);
        this.subjectToRadio = page.locator('#orderDirectionAbsolute_radio');
        this.pensionProviderRadio = page.locator('#servePensionProvider_radio');
        this.judgeDropDown = page.getByLabel('Select Judge');
        this.uploadConsentOrderFileUpload = this.page.locator('#uploadApprovedConsentOrder');
        this.commonActionsHelper = new CommonActionsHelper();
    }

    async selectIsSubjectTo(isSubjectTo: Boolean){
        const radioOption = isSubjectTo ? 'Yes' : 'No'; 
        const optionToSelect = this.subjectToRadio.getByLabel(radioOption);
        await optionToSelect.check();
    }

    async selectIsPensionProvider(isPensionProvider: Boolean){
        const radioOption = isPensionProvider ? 'Yes' : 'No'; 
        const optionToSelect = this.pensionProviderRadio.getByLabel(radioOption);
        await optionToSelect.check();
    }

    async selectJudge(judge: string){
        await this.judgeDropDown.selectOption(judge); 
    }

    async uploadConsentOrderFile(filePath: string) {
        await this.commonActionsHelper.uploadWithRateLimitRetry(this.page, this.uploadConsentOrderFileUpload, filePath);
    }

}
