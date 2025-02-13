import { type Page, expect, Locator } from '@playwright/test';
import { BaseJourneyPage } from '../../BaseJourneyPage';
import { CommonActionsHelper } from '../../helpers/CommonActionsHelper';
import { SolicitorDetailsHelper } from '../../helpers/SolicitorDetailsHelper';
import { RadioEnum } from '../../helpers/enums/RadioEnum';

export class SolicitorDetailsPage extends BaseJourneyPage {

    private readonly applicantRepresentedRadioContested: Locator;
    private readonly applicationTypeAnswer: Locator;
    private readonly commonActionsHelper: CommonActionsHelper;
    private readonly solicitorDetailsHelper: SolicitorDetailsHelper;

    public constructor(page: Page, commonActionsHelper: CommonActionsHelper, solicitorDetailsHelper: SolicitorDetailsHelper) {
        super(page);
        this.commonActionsHelper = commonActionsHelper;
        this.solicitorDetailsHelper = solicitorDetailsHelper;
        this.applicantRepresentedRadioContested = page.locator('#applicantRepresented_radio')
        this.applicationTypeAnswer = page.getByRole('row', { name: 'What type of application is this' }).locator('span').nth(1);
    }

    async setApplicantRepresentation(represented: boolean) {
        const radioOption = represented ? 'Yes' : 'No';
        const optionToSelect = this.applicantRepresentedRadioContested.getByLabel(radioOption);
        await optionToSelect.check();
      }

    async enterSolicitorDetails(solicitorName: string, solicitorEmail: string) {
        await this.solicitorDetailsHelper.enterSolicitorName(this.page, solicitorName)
        await this.commonActionsHelper.enterPhoneNumber(this.page);
        await this.commonActionsHelper.enterEmailAddress(this.page, solicitorEmail);
    }

    async enterUKaddress() {
        await this.commonActionsHelper.enterUkAddress(this.page);
    }

    async enterFirmName(firmName: string) {
        await this.solicitorDetailsHelper.enterFirmName(this.page, firmName);
    }

    async enterSolicitorsFirm(firmName: string) {
        await this.solicitorDetailsHelper.enterSolicitorsFirm(this.page, firmName);
    }

    async setEmailConsent(caseType: string) {
        await this.commonActionsHelper.emailConsent(this.page, caseType, true);
    }

    async selectOrganisation(orgName: string) {
       await this.solicitorDetailsHelper.selectOrganisation(this.page, orgName)
    }

    async assertOrganisationIdRequired() {
        const errorMessage = this.page.getByText('Organisation ID is required');
        await expect(errorMessage).toHaveText('Organisation ID is required');
      }

    async enterReferenceNumber(referenceNumber: string) {
        await this.solicitorDetailsHelper.enterReferenceNumber(this.page, referenceNumber);
    }

    async selectApplicationType(selectedType: RadioEnum) {
        const optionToSelect = this.applicationTypeAnswer.getByLabel(selectedType);
        await optionToSelect.check();
    }
}
