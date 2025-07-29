import {BaseJourneyPage} from "../../BaseJourneyPage.ts";
import {expect, Locator, Page} from "@playwright/test";
import {CommonActionsHelper} from "../../helpers/CommonActionsHelper.ts";
import {DateHelper} from "../../../data-utils/DateHelper.ts";

export class ConsentApplicationApprovedPage extends BaseJourneyPage {
    private readonly consentApplicationApprovedTitle: Locator;
    private readonly subjectToDecreeAbsoluteRadio: Locator;
    private readonly doesOrderNeedToBeServedToPensionRadio: Locator;
    private readonly selectJudgeDropdown: Locator;
    private readonly dateOfOrderGroup: Locator;
    private readonly responsibleForSendingOrderToPensionProviderRadio: Locator;
    private readonly commonActionsHelper;

    public constructor(page: Page, commonActionsHelper: CommonActionsHelper) {
        super(page);
        this.consentApplicationApprovedTitle = page.getByRole('heading', { name: 'Consent Application Approved' });
        this.subjectToDecreeAbsoluteRadio = page.locator('#consentSubjectToDecreeAbsoluteValue_radio');
        this.doesOrderNeedToBeServedToPensionRadio = page.locator('#consentServePensionProvider_radio');
        this.selectJudgeDropdown = page.locator('#consentSelectJudge');
        this.dateOfOrderGroup = page.locator('#consentDateOfOrder');
        this.responsibleForSendingOrderToPensionProviderRadio = page.locator('#consentServePensionProviderResponsibility');
        this.commonActionsHelper = commonActionsHelper;
    }

    async assertConsentApplicationApprovedPage() {
        await expect(this.consentApplicationApprovedTitle).toBeVisible();
    }

    async assertMandatoryFields() {
        const errorMessages = [
            "Subject to Decree Absolute/Final Order? is required",
            "Does a copy of this order need to be served to the pension provider? is required",
            "Select Judge is required",
            "Date of order is required"
            ];
        await this.navigateContinue();
        await this.assertErrorMessage(errorMessages);
    }

    async selectSubjectToDecreeAbsoluteValue(isSubjectToDecreeAbsolute: boolean) {
        const radioOption = isSubjectToDecreeAbsolute ? 'Yes' : 'No';
        const optionToSelect = this.subjectToDecreeAbsoluteRadio.getByLabel(radioOption);
        await optionToSelect.check();
    }

    async selectCopyOfOrderToPensionProvider(doesOrderNeedToBeServedToPension: boolean, responsibleForSendingOrderToPensionProvider: string) {
        const radioOption = doesOrderNeedToBeServedToPension ? 'Yes' : 'No';
        const optionToSelect = this.doesOrderNeedToBeServedToPensionRadio.getByLabel(radioOption);
        await optionToSelect.check();
        if(doesOrderNeedToBeServedToPension) {
            await this.responsibleForSendingOrderToPensionProviderRadio.getByLabel(responsibleForSendingOrderToPensionProvider).check();
        }
    }

    async selectJudge(judgeName: string) {
        await this.selectJudgeDropdown.selectOption({ label: judgeName });
    }

    async enterCourtDate(date?: { year: string, month: string, day: string }) {
        if (date) {
            await this.commonActionsHelper.enterDate(this.dateOfOrderGroup, date);
        } else {
            const [year, month, day] = DateHelper.getCurrentDate().split('-');
            await this.commonActionsHelper.enterDate(this.dateOfOrderGroup, { year, month, day });
        }
    }
}
