import { type Page, expect, Locator } from '@playwright/test';
import { CreateFlagPage } from '../create-flag/CreateFlagPage';

interface FlagDetails {
  type: string;
  comment: string;
}

export class ManageFlagPage extends CreateFlagPage {
    private readonly manageFlagsHeading: Locator;
    private readonly manageCaseFlagsSubHeading: Locator;
    private readonly makeInactiveButton: Locator;

    public constructor(page: Page) {
        super(page);
        this.manageFlagsHeading = page.getByRole('heading', { name: 'Manage Flags' });
        this.manageCaseFlagsSubHeading = page.getByRole('heading', { name: 'Manage case flags' });
        this.makeInactiveButton = page.getByRole('button', { name: 'Make inactive' });
    }

    // Dynamic locator methods
    protected getCaseFlagRadio(flagDetails: FlagDetails): Locator {
        return this.page.getByRole('radio', { 
            name: `Case level (Case) - ${flagDetails.type} (${flagDetails.comment})`
        });
    }

    protected getPartyFlagRadio(partyName: string, partyType: 'Applicant' | 'Respondent', flagDetails: FlagDetails): Locator {
        return this.page.getByRole('radio', { 
            name: `${partyName} (${partyType}) - ${flagDetails.type} (${flagDetails.comment})`
        });
    }

    // Helper methods
    async selectCaseFlag(flagType: string, comment: string): Promise<void> {
        await this.getCaseFlagRadio({ type: flagType, comment: comment }).click();
    }

    async selectPartyFlag(partyName: string, partyType: 'Applicant' | 'Respondent', flagType: string, comment: string): Promise<void> {
        await this.getPartyFlagRadio(partyName, partyType, { type: flagType, comment: comment }).click();
    }

    async updateFlagComment(flagName: string, comment: string): Promise<void> {
        const flagCommentLocator = this.page.getByRole('textbox', { name: `Update flag "${flagName}"` });
        await flagCommentLocator.fill(comment);
    }
    async makeFlagInactive(): Promise<void> {
        await expect(this.makeInactiveButton).toBeVisible();
        await this.makeInactiveButton.click();
    }
}