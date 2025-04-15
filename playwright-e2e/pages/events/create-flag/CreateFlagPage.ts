import { expect, Locator, Page } from '@playwright/test';
import { BaseJourneyPage } from '../../BaseJourneyPage';

export class CreateFlagPage extends BaseJourneyPage {

    private readonly caseSelector: Locator;
    private readonly applicantSelector: Locator;
    private readonly respondentSelector: Locator;
    private readonly selectFlagTypeAlert: Locator;
    private readonly complexCaseRadio: Locator;
    private readonly vulnerableUser: Locator;
    private readonly otherRadio: Locator;
    private readonly enterFlagTypeTextbox: Locator;
    private readonly addCommentsToThisFlagTitle: Locator;
    private readonly addCommentsToThisFlagTextbox: Locator;

    public constructor(page: Page) {
        super(page);
        this.caseSelector = page.locator('#flag-location-0');
        this.applicantSelector = page.locator('#flag-location-1');
        this.respondentSelector = page.locator('#flag-location-2');
        this.selectFlagTypeAlert = page.getByText('Please select a flag type', { exact: true })
        this.complexCaseRadio = page.getByRole('radio', { name: 'Complex Case' })
        this.vulnerableUser = page.getByRole('radio', { name: 'Vulnerable user' })
        this.otherRadio = page.getByRole('radio', { name: 'Other' })
        this.enterFlagTypeTextbox = page.getByRole('textbox', { name: 'Enter a flag type' })
        this.addCommentsToThisFlagTitle = page.getByText('Add comments for this flag')
        this.addCommentsToThisFlagTextbox = page.getByRole('textbox', { name: 'Add comments for this flag' })
    }

    async selectFlagType(type: 'case' | 'applicant' | 'respondent') {
        if (type === 'case') {
            await this.caseSelector.check();
        } else if (type === 'applicant') {
            await this.applicantSelector.check();
        } else if (type === 'respondent') {
            await this.respondentSelector.check();
        } else {
            throw new Error(`Invalid flag type: ${type}`);
        }
    }

    async problemIfCaseFlagNotSelected() {
        await expect(this.thereIsAProblemHeader).toBeVisible();
        await expect(this.selectFlagTypeAlert).toBeVisible();
    }

    async selectComplexCase() {
        await expect(this.complexCaseRadio).toBeVisible();
        await this.complexCaseRadio.check();
    }

    async selectVulnerableUser() {
        await expect(this.vulnerableUser).toBeVisible();
        await this.vulnerableUser.check();
    }

    async selectOther(otherFlagType: string) {
        await expect(this.otherRadio).toBeVisible();
        await this.otherRadio.check();
        await expect(this.enterFlagTypeTextbox).toBeVisible();
        await this.enterFlagTypeTextbox.fill(otherFlagType);
    }
    async addCommentsToThisFlag(FlagText: string) {
        await expect(this.addCommentsToThisFlagTitle).toBeVisible();
        await expect(this.addCommentsToThisFlagTextbox).toBeVisible();
        await this.addCommentsToThisFlagTextbox.fill(FlagText);
    }
}

