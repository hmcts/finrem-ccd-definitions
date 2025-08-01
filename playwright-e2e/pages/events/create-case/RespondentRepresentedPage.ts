import { type Page, Locator } from '@playwright/test';
import { BaseJourneyPage } from '../../BaseJourneyPage';
import { CommonActionsHelper } from '../../helpers/CommonActionsHelper';
import { SolicitorDetailsHelper } from '../../helpers/SolicitorDetailsHelper';

export class RespondentRepresentedPage extends BaseJourneyPage{

    private readonly respondentRepresentedRadioContested: Locator;

    private readonly respondentRepresentedRadioConsented: Locator;
    private readonly respondentSolicitorReference: Locator;
    private readonly solicitorsFirmInput: Locator;
    private readonly respondentInRefugeRadio: Locator;

    private readonly commonActionsHelper: CommonActionsHelper;
    private readonly solicitorDetailsHelper: SolicitorDetailsHelper;

    public constructor(page: Page, commonActionsHelper: CommonActionsHelper, solicitorDetailsHelper: SolicitorDetailsHelper) {
        super(page);
        this.commonActionsHelper = commonActionsHelper;
        this.solicitorDetailsHelper = solicitorDetailsHelper;
        this.respondentRepresentedRadioContested = page.locator('#respondentRepresented_radio');
        this.respondentSolicitorReference = page.getByLabel('Respondent solicitor’s reference');
        this.solicitorsFirmInput = page.getByLabel('Solicitor’s firm');

        this.respondentRepresentedRadioConsented = page.locator('#appRespondentRep_radio')
        this.respondentInRefugeRadio = page.locator('#respondentInRefugeQuestion_radio')
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
        await this.respondentSolicitorReference.fill('MNT12345');
        await this.solicitorsFirmInput.fill('Mnt Doom Sols');
        await this.solicitorDetailsHelper.enterSolicitorName(this.page, solicitorName);
        await this.commonActionsHelper.enterUkAddress(this.page, {
            buildingAndStreet: "Coral, 65-68",
            addressLine2: "Leadenhall 2nd Street",
            townOrCity: "Manchester",
            postcodeOrZipcode: "EC3A 2AF",
            country: "United Kingdom"
        });
        await this.commonActionsHelper.enterPhoneNumber(this.page);
        await this.commonActionsHelper.enterEmailAddress(this.page, solicitorEmail);
    }

    async selectOrganisation(orgName: string) {
        await this.solicitorDetailsHelper.selectOrganisation(this.page, orgName)
     }

    async selectRespondentInRefuge(respondentInRefuge: boolean) {
        const radioOption = respondentInRefuge ? 'Yes' : 'No';
        const optionToSelect = this.respondentInRefugeRadio.getByLabel(radioOption);
        await optionToSelect.check();
    }
}
