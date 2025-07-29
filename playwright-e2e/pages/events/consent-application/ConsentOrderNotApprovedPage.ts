import {BaseJourneyPage} from "../../BaseJourneyPage.ts";
import {expect, Locator, Page} from "@playwright/test";

export class ConsentOrderNotApprovedPage extends BaseJourneyPage {

    private readonly consentOrderNotApprovedTitle: Locator;
    private readonly andAfterTextArea: Locator;
    private readonly selectJudgeDropdown: Locator;
    private readonly judgeName: Locator;
    private readonly dateOfOrder: Locator;
    private readonly additionalComments: Locator;

    public constructor(page: Page) {
        super(page);
        this.consentOrderNotApprovedTitle = this.page.getByText('Consent Order Not Approved');
        this.andAfterTextArea = this.page.locator('#orderRefusalOnScreen_orderRefusalAfterText');
        this.selectJudgeDropdown = this.page.locator('#orderRefusalOnScreen_orderRefusalJudge');
        this.judgeName = this.page.getByLabel("Name of Judge");
        this.dateOfOrder = this.page.locator('#orderRefusalDate');
        this.additionalComments = this.page.locator('#orderRefusalOnScreen_orderRefusalAddComments');
    }

    async assertPageTitle(): Promise<void> {
        await expect(this.consentOrderNotApprovedTitle).toBeVisible();
    }

    async assertMandatoryFields() {
        const errorMessages = [
            "Reason for Refusal is required",
            "Select Judge is required"
            ];
        await this.navigateContinue();
        await this.assertErrorMessage(errorMessages);
    }

    async enterAndAfterText(text: string) {
        await expect(this.andAfterTextArea).toBeVisible();
        await this.andAfterTextArea.fill(text);
    }

    async verifyReasonsForRefusal() {
        const reasons = [
            "Insufficient information has been provided as to the parties’ capital positions if the order were effected",
            "Insufficient information has been provided as to the parties’ housing needs and whether they are met by the order",
            "Insufficient information has been provided as to the justification for departure from equality of capital",
            "Insufficient information has been provided as to the parties’ pension provision if the order were effected",
            "Insufficient information has been provided as to the children’s housing needs and whether they are met by the order",
            "The pension annex has not been attached",
            "It is unclear whether the Respondent has obtained independent legal advice",
            "The D81 form is incomplete",
            "Application should be fixed for hearing on first available date for 20 minutes when the Court will consider whether the draft order should be approved. Both parties should attend and if they do not do so the Court may not approve the order",
            "Financial Remedy application to be transferred to the Applicant’s home court to consider listing directions",
            "Entire case to be transferred to the Applicant’s home court to consider listing directions",
            "The proposed order does not appear to be fair taking account of S25 Matrimonial Causes Act 1973. The parties are requested to explain more fully the thinking behind the order and why it is fair.",
            "Please provide a breakdown of the pension values/property values as it is not possible to understand the values of what each party will receive.",
            "If other (please specify in text box provided)"
        ];

        for (const reason of reasons) {
            const reasonLocator = this.page.getByLabel(reason);
            await expect(reasonLocator).toBeVisible();
        }
    }

    async selectAllReasonsForRefusal() {
        const reasons = [
            "Insufficient information has been provided as to the parties’ capital positions if the order were effected",
            "Insufficient information has been provided as to the parties’ housing needs and whether they are met by the order",
            "Insufficient information has been provided as to the justification for departure from equality of capital",
            "Insufficient information has been provided as to the parties’ pension provision if the order were effected",
            "Insufficient information has been provided as to the children’s housing needs and whether they are met by the order",
            "The pension annex has not been attached",
            "It is unclear whether the Respondent has obtained independent legal advice",
            "The D81 form is incomplete",
            "Application should be fixed for hearing on first available date for 20 minutes when the Court will consider whether the draft order should be approved. Both parties should attend and if they do not do so the Court may not approve the order",
            "Financial Remedy application to be transferred to the Applicant’s home court to consider listing directions",
            "Entire case to be transferred to the Applicant’s home court to consider listing directions",
            "The proposed order does not appear to be fair taking account of S25 Matrimonial Causes Act 1973. The parties are requested to explain more fully the thinking behind the order and why it is fair.",
            "Please provide a breakdown of the pension values/property values as it is not possible to understand the values of what each party will receive.",
        ];
        await this.selectReasonsForRefusal(reasons);
    }

    async selectReasonsForRefusal(reasons: string[]) {
        await this.selectCheckboxByLabel(reasons)
    }

    async selectJudge(judgeName: string) {
        await expect(this.selectJudgeDropdown).toBeVisible();
        await this.selectJudgeDropdown.selectOption({ label: judgeName });
    }
}
