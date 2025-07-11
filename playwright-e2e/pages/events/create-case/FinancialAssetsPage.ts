import {type Page, Locator, expect} from '@playwright/test';
import { BaseJourneyPage } from '../../BaseJourneyPage';

export class FinancialAssetsPage extends BaseJourneyPage {

    private readonly complexityListMultiChoice: Locator;
    private readonly netAssetsMultiChoice: Locator;
    private readonly netFamilyHomeValueTxtBox: Locator;
    private readonly netAssetsMultiChoicePaperCase: Locator;


    // Note: Have only check one of the checkbox options
    private readonly potentialIssuesNotApplicableCheckbox: Locator;

    public constructor(page: Page) {
        super(page);
        this.complexityListMultiChoice = this.page.locator('#addToComplexityListOfCourts');
        this.netAssetsMultiChoice = this.page.locator('#estimatedAssetsChecklistV2');
        this.netAssetsMultiChoicePaperCase = this.page.locator('#estimatedAssetsChecklist');
        this.netFamilyHomeValueTxtBox = this.page.locator('#netValueOfHome');
        this.potentialIssuesNotApplicableCheckbox = this.page.locator('#potentialAllegationChecklist-notApplicable');
    }

    async selectComplexityList(value: string) {
        await this.complexityListMultiChoice.getByLabel(value).check();
    }

    async selectAssetsValue(value: string){
        await this.netAssetsMultiChoice.getByLabel(value).check();
    }

    async insertFamilyHomeValue(value: string) {
        await this.netFamilyHomeValueTxtBox.fill(value);
    }

    async checkPotentialIssueNotApplicableCheckbox(){
        await this.potentialIssuesNotApplicableCheckbox.check();
    }
}
