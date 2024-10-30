import { type Page, expect, Locator } from '@playwright/test';
import { BaseJourneyPage } from '../BaseJourneyPage';
import { CommonActionsHelper } from '../helpers/CommonActionsHelper';
import { SolicitorDetailsHelper } from '../helpers/SolicitorDetailsHelper';

export class SolicitorDetailsPage extends BaseJourneyPage {

    private readonly commonActionsHelper: CommonActionsHelper
    private readonly solicitorDetailsHelper: SolicitorDetailsHelper;

    public constructor(page: Page, commonActionsHelper: CommonActionsHelper, solicitorDetailsHelper: SolicitorDetailsHelper) {
        super(page);
        this.commonActionsHelper = commonActionsHelper;
        this.solicitorDetailsHelper = solicitorDetailsHelper;
    }

    async enterSolicitorDetails(solicitorName: string, solicitorEmail: string) {
        await this.solicitorDetailsHelper.enterSolicitorName(this.page, solicitorName)
        await this.commonActionsHelper.enterPhoneNumber(this.page);
        await this.commonActionsHelper.enterEmailAddress(this.page, solicitorEmail);
    }

    async setEmailConsent(caseType: string) {
        await this.commonActionsHelper.emailConsent(this.page, caseType, true);
    }

    async selectOrganisation(orgName: string) {
       await this.solicitorDetailsHelper.selectOrganisation(this.page, orgName)
    }

}
