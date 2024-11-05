import { type Page, Locator } from '@playwright/test';
import { BaseJourneyPage } from '../BaseJourneyPage';
import { CommonActionsHelper } from '../helpers/CommonActionsHelper';
import { SolicitorDetailsHelper } from '../helpers/SolicitorDetailsHelper';

export class RespondentRepresentedPage extends BaseJourneyPage{

    private readonly respondentRepresentedRadioContested: Locator;

    private readonly respondentRepresentedRadioConsented: Locator;
    private readonly solicitorsFirmInput: Locator;

    private readonly commonActionsHelper: CommonActionsHelper;
    private readonly solicitorDetailsHelper: SolicitorDetailsHelper;

    public constructor(page: Page, commonActionsHelper: CommonActionsHelper, solicitorDetailsHelper: SolicitorDetailsHelper) {
        super(page);
        this.commonActionsHelper = commonActionsHelper;
        this.solicitorDetailsHelper = solicitorDetailsHelper;
        this.respondentRepresentedRadioContested = page.locator('#respondentRepresented_radio')
        this.solicitorsFirmInput = page.getByLabel('Solicitor’s firm');

        this.respondentRepresentedRadioConsented = page.locator('#appRespondentRep_radio')
    }

    async selectRespondentRepresentedContested(represented: boolean) {
        const radioOption = represented ? 'Yes' : 'No'; 
        const optionToSelect = this.respondentRepresentedRadioContested.getByLabel(radioOption);
        await optionToSelect.check();
    }

    async selectRespondentRepresentedConsented(represented: boolean) {
        const radioOption = represented ? 'Yes' : 'No'; 
        const optionToSelect = this.respondentRepresentedRadioConsented.getByLabel(radioOption);
        await optionToSelect.check();
    }
    
    async enterSolicitorsDetails(solicitorName: string, solicitorEmail: string){
        await this.solicitorsFirmInput.fill('firm');
        await this.solicitorDetailsHelper.enterSolicitorName(this.page, solicitorName);
        await this.commonActionsHelper.enterUkAddress(this.page);
        await this.commonActionsHelper.enterPhoneNumber(this.page);
        await this.commonActionsHelper.enterEmailAddress(this.page, solicitorEmail);
    }

    async selectOrganisation(orgName: string) {
        await this.solicitorDetailsHelper.selectOrganisation(this.page, orgName)
     }
}
