import { Locator, Page } from '@playwright/test';
import { BaseJourneyPage } from '../../BaseJourneyPage';

export class SolicitorAuthPage extends BaseJourneyPage {
    solicitorNameTxtBox: Locator;
    solicitorFirmTxtBox: Locator;
    solicitorPositionTxtBox: Locator;
    currentDate: Locator;

    public constructor(page: Page) {
        super(page);
        this.solicitorNameTxtBox = page.getByLabel('Solicitor Name');
        this.solicitorFirmTxtBox = page.getByLabel('Solicitor Firm');
        this.solicitorPositionTxtBox= page.getByLabel('Solicitor Position');
        this.currentDate = page.getByRole('group', { name: 'Date' })
    }

    async enterSolicitorDetails(solicitorName: string, solicitorFirm: string, solicitorPosition: string) {
        await this.solicitorNameTxtBox.fill(solicitorName);
        await this.solicitorFirmTxtBox.fill(solicitorFirm);
        await this.solicitorPositionTxtBox.fill(solicitorPosition);
    }
}
