import { type Page, Locator, expect } from '@playwright/test';
import { BaseJourneyPage } from '../../BaseJourneyPage';
import { CommonActionsHelper } from '../../helpers/CommonActionsHelper';
import {DateHelper} from "../../../functional/helpers/DateHelper.ts";

export class DivorceDetailsPage extends BaseJourneyPage {

    private readonly divorceNumberInput: Locator;
    private readonly divorceDetailsHeaderContested: Locator;
    private readonly civilPartnershipNoRadio: Locator;
    private readonly marriageDay: Locator;
    private readonly marriageMonth: Locator;
    private readonly marriageYear: Locator;
    private readonly issueDay: Locator;
    private readonly issueMonth: Locator;
    private readonly issueYear: Locator;
    private readonly courtName: Locator;
    private readonly divorceStage: Locator;
    private readonly uploadPetition: Locator;

    private readonly divorceDetailsHeaderConsented: Locator;
    private readonly caseNumberInput: Locator;
    private readonly caseStageDropDown: Locator;

    private readonly commonActionsHelper: CommonActionsHelper;

    public constructor(page: Page, commonActionsHelper: CommonActionsHelper) {
        super(page);
        this.commonActionsHelper = commonActionsHelper;

        this.divorceDetailsHeaderContested = page.getByRole('heading', { name: 'Divorce / Dissolution Details' });
        this.divorceNumberInput = page.getByLabel('Divorce / Dissolution Case Number');
        this.civilPartnershipNoRadio = page.getByLabel('No');
        this.marriageDay = page.getByRole('group', { name: 'Date of marriage / civil' }).getByLabel('Day');
        this.marriageMonth = page.getByRole('group', { name: 'Date of marriage / civil' }).getByLabel('Month');
        this.marriageYear = page.getByRole('group', { name: 'Date of marriage / civil' }).getByLabel('Year');
        this.issueDay = page.getByRole('group', { name: 'Application Issued Date' }).getByLabel('Day');
        this.issueMonth = page.getByRole('group', { name: 'Application Issued Date' }).getByLabel('Month');
        this.issueYear = page.getByRole('group', { name: 'Application Issued Date' }).getByLabel('Year');
        this.courtName = page.getByLabel('Name of Court / Divorce');
        this.divorceStage = page.getByLabel('What stage has the divorce /');
        this.uploadPetition = page.locator('#divorceUploadPetition');

        this.divorceDetailsHeaderConsented = page.getByRole('heading', { name: 'APPLICATION DETAILS' });
        this.caseNumberInput = page.getByLabel('Case Number');
        this.caseStageDropDown = page.getByLabel('What stage has the case');
    }

    async enterDivorceDetailsContested(divorceNumber: string, divorceStage: string) {
        await expect(this.divorceDetailsHeaderContested).toBeVisible();
        await this.divorceNumberInput.fill(divorceNumber);
        await this.civilPartnershipNoRadio.check();
        await this.marriageDay.fill('1');
        await this.marriageMonth.fill('1');
        await this.marriageYear.fill('1999');
        const [year, month, day] = await DateHelper.getCurrentDateFormatted();
        await this.issueDay.fill(day);
        await this.issueMonth.fill(month);
        await this.issueYear.fill(year);
        await this.courtName.fill('Shire Court');
        await this.divorceStage.selectOption(divorceStage);
        await this.uploadPetition.setInputFiles('./playwright-e2e/data/PETITION FORM A.docx');
        await this.commonActionsHelper.waitForAllUploadsToBeCompleted(this.page);
    }

    async enterDivorceDetailsConsented(caseNumber: string, divorceStage: string) {
        await expect(this.divorceDetailsHeaderConsented).toBeVisible();
        await this.caseNumberInput.fill(caseNumber);
        await this.civilPartnershipNoRadio.check();
        await this.caseStageDropDown.selectOption(divorceStage);
    }
}
