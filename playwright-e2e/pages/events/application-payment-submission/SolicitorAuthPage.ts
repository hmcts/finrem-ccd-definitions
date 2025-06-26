import {expect, Locator, Page} from '@playwright/test';
import { BaseJourneyPage } from '../../BaseJourneyPage';
import {DateHelper} from "../../../data-utils/DateHelper.ts";

export class SolicitorAuthPage extends BaseJourneyPage {
    private readonly authorisationTitle: Locator;
    private readonly authorisationLabel: Locator;
    private readonly solicitorNameTxtBox: Locator;
    private readonly solicitorFirmTxtBox: Locator;
    private readonly solicitorPositionTxtBox: Locator;
    private readonly dayText: Locator;
    private readonly monthText: Locator;
    private readonly yearText: Locator;

    public constructor(page: Page) {
        super(page);
        this.authorisationTitle = page.getByRole('heading', { name: 'Authorisation' });
        this.authorisationLabel = page.getByRole(
            'heading', { name: 'I am duly authorised by the Applicant to complete this application' }
        );
        this.solicitorNameTxtBox = page.getByLabel('Solicitor Name');
        this.solicitorFirmTxtBox = page.getByLabel('Solicitor Firm');
        this.solicitorPositionTxtBox= page.getByLabel('Solicitor Position');
        this.dayText = this.page.locator('#authorisation3-day');
        this.monthText = this.page.locator('#authorisation3-month');
        this.yearText = this.page.locator('#authorisation3-year');
    }

    async assertAuthorisationPage() {
        await this.page.waitForLoadState('load');
        await expect(this.authorisationTitle).toBeVisible();
        await expect(this.authorisationLabel).toBeVisible();
    }

    async assertErrorMessageForMandatoryFields() {
        const errorMessages = [
            'Solicitor Name is required',
            'Solicitor Firm is required',
            'Solicitor Position is required'
        ];

        await this.navigateContinue();

        await this.assertErrorMessage(errorMessages);
    }
    async enterSolicitorDetails(solicitorName: string, solicitorFirm: string, solicitorPosition: string) {
        await this.solicitorNameTxtBox.fill(solicitorName);
        await this.solicitorFirmTxtBox.fill(solicitorFirm);
        await this.solicitorPositionTxtBox.fill(solicitorPosition);
    }

    async enterDate(day: string, month: string, year: string) {
        await expect(this.dayText).toBeVisible();
        await expect(this.monthText).toBeVisible();
        await expect(this.yearText).toBeVisible();

        await this.dayText.fill(day);
        await this.monthText.fill(month);
        await this.yearText.fill(year);
    }

    async enterTodayDate() {
        const [year, month, day] = DateHelper.getCurrentDateFormatted();
        await this.enterDate(day, month, year);
    }
}
