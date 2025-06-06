import { CommonEvents } from '../../../config/case-data';
import { CaseDetailsPage } from '../../../pages/CaseDetailsPage';
import { CreateFlagPage } from '../../../pages/events/create-flag/CreateFlagPage';
import { ManageFlagPage } from '../../../pages/events/manage-flag/ManageFlagPage';

export async function createFlag(
    caseDetailsPage: CaseDetailsPage,
    createFlagPage: CreateFlagPage,
    flagType: 'case' | 'applicant' | 'respondent',
    flagSelection: () => Promise<void>, comments: string)
{
    await caseDetailsPage.selectNextStep(CommonEvents.createFlag);
    await createFlagPage.selectFlagType(flagType);
    await createFlagPage.navigateContinue();
    await createFlagPage.navigateContinue();
    await createFlagPage.problemIfCaseFlagNotSelected();
    await flagSelection();
    await createFlagPage.navigateContinue();
    await createFlagPage.addCommentsToThisFlag(comments);
    await createFlagPage.navigateContinue();
    await createFlagPage.navigateSubmit();
    await caseDetailsPage.checkHasBeenUpdated(CommonEvents.createFlag.listItem);
    await caseDetailsPage.checkActiveCaseFlagOnCase();
}

export async function manageFlagOnce(
    caseDetailsPage: CaseDetailsPage,
    manageFlagPage: ManageFlagPage,
    flagType: 'case' | 'applicant' | 'respondent',
    flagName: string,
    comment: string,
    checkActive: boolean = true // default to true
    ) {
    // Select the Manage Flags event
    await caseDetailsPage.selectNextStep(CommonEvents.manageFlags);

    // Select the flag type and navigate to the next step
    if (flagType === 'case') {
        await manageFlagPage.selectCaseFlag(flagName, comment);
    } else if (flagType === 'applicant') {
        await manageFlagPage.selectPartyFlag('Frodo Baggins', 'Applicant', flagName, comment);
    } else if (flagType === 'respondent') {
        await manageFlagPage.selectPartyFlag('Smeagol Gollum', 'Respondent', flagName, comment);
    }
    await manageFlagPage.navigateContinue();

    // Update the flag comment and make it inactive
    await manageFlagPage.updateFlagComment(flagName, `Updated ${comment}`);
    await manageFlagPage.makeFlagInactive();
    await manageFlagPage.navigateContinue();
    await manageFlagPage.navigateSubmit();

    // Check the success message and if there are active flags on the case
    await caseDetailsPage.checkHasBeenUpdated(CommonEvents.manageFlags.listItem);
    if (checkActive) {
        await caseDetailsPage.checkActiveCaseFlagOnCase();
    } else {
        await caseDetailsPage.checkNoActiveCaseFlagOnCase();
    }
}