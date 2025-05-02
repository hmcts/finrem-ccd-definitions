import { expect, Locator, Page } from '@playwright/test';
import { CreateFlagPage } from '../create-flag/CreateFlagPage';

interface FlagDetails {
  type: string;
  comment: string;
}

export class ManageFlagPage extends CreateFlagPage {
    private readonly manageFlagsHeading: Locator;
    private readonly manageCaseFlagsSubHeading: Locator;

    public constructor(page: Page) {
        super(page);
        this.manageFlagsHeading = page.getByRole('heading', { name: 'Manage Flags' });
        this.manageCaseFlagsSubHeading = page.getByRole('heading', { name: 'Manage case flags' });
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
}