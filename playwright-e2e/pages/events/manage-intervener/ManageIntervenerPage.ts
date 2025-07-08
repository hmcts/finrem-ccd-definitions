import {BaseJourneyPage} from "../../BaseJourneyPage.ts";
import {expect, Locator, Page} from "@playwright/test";
import {CommonActionsHelper} from "../../helpers/CommonActionsHelper.ts";
import {SolicitorDetailsHelper} from "../../helpers/SolicitorDetailsHelper.ts";
import config from "../../../config/config.ts";


export class ManageIntervenerPage extends BaseJourneyPage {

    private readonly manageIntervenerTitle: Locator;
    private readonly intervenerFullNameText: Locator;
    private readonly representativeFullNameText: Locator;
    private readonly representativeEmailText: Locator;
    private readonly representativePhoneNumberText: Locator;
    private readonly representativeFirmText: Locator;
    private readonly yourReferenceText: Locator;

    private readonly commonActionsHelper: CommonActionsHelper
    private readonly solicitorDetailsHelper: SolicitorDetailsHelper;

    public constructor(page: Page,  commonActionsHelper: CommonActionsHelper, solicitorDetailsHelper: SolicitorDetailsHelper) {
        super(page);
        this.commonActionsHelper = commonActionsHelper;
        this.solicitorDetailsHelper = solicitorDetailsHelper;

        this.manageIntervenerTitle = page.getByRole('heading', { name: 'Manage Interveners' });
        this.intervenerFullNameText = page.getByLabel(`Intervener's Full Name`);
        this.representativeFullNameText = page.getByLabel(`Representative's Full Name`);
        this.representativeEmailText = page.getByLabel(`Representative's Email`);
        this.representativePhoneNumberText = page.getByLabel(`Representative's Phone Number (Optional)`);
        this.representativeFirmText = page.getByLabel(`Representative's Firm`);
        this.yourReferenceText = page.getByLabel(`Your Reference`);

    }

    async selectIntervenerRadio(intervenerNumber: number) {
        const radio = this.page
            .locator('#intervenersList input[type="radio"]')
            .filter({ hasText: new RegExp(`^Intervener ${intervenerNumber}`) });
        await radio.first().check();
    }

    async selectIntervenerActionRadio(action: string, intervenerNumber: number) {
        const actionRadio = this.page
            .locator('#intervenerOptionList input[type="radio"]')
            .filter({ hasText: `${action} Intervener ${intervenerNumber}` });
        await actionRadio.first().check();
    }

    async doesIntervenerLiveOutsideUK(liveOutside : boolean,intervenerNumber: number){
        const liveOutsideRadio = this.page.locator(`intervener${intervenerNumber}_intervenerResideOutsideUK`);
        const optionToSelect = liveOutside ? 'Yes' : 'No';
        const radioOption = liveOutsideRadio.getByLabel(optionToSelect);
        await radioOption.check();
    }

    async keepIntervenerDetailsPrivate(intervenerNumber: number, keepPrivate: boolean) {
        const privateRadio = this.page.locator(`#intervener${intervenerNumber}_intervenerAddressConfidential_radio`);
        const optionToSelect = keepPrivate ? 'Yes' : 'No';
        const radioOption = privateRadio.getByLabel(optionToSelect);
        await radioOption.check();
    }

    async isIntervenerResidentInRefuge(intervenerNumber: number, isInRefuge: boolean) {
        const refugeRadio = this.page.locator(`#intervener${intervenerNumber}_intervenerInRefuge_radio`);
        const optionToSelect = isInRefuge ? 'Yes' : 'No';
        const radioOption = refugeRadio.getByLabel(optionToSelect);
        await radioOption.check();
    }

    async selectIsRepresentedRadio(intervenerNumber: number, represented: boolean) {
        const representedRadio = this.page.locator(`#intervener${intervenerNumber}_intervenerRepresented_radio`);
        const optionToSelect = represented ? 'Yes' : 'No';
        const radioOption = representedRadio.getByLabel(optionToSelect);
        await radioOption.check();
    }

    async enterIntervenerRepresentedDetails(details:{
        representativeFullName?: string,
        representativeEmail?: string,
        representativePhoneNumber?: string,
        representativeFirm?: string,
        yourReference?: string,
        orgName?: string
    }) {

        await this.representativeFullNameText.fill(details.representativeFullName ?? 'Representative Name');
        await this.representativeEmailText.fill(details.representativeEmail ?? '');
        await this.representativePhoneNumberText.fill(details.representativePhoneNumber ?? '');
        await this.representativeFirmText.fill(details.representativeFirm ?? 'Representative Firm');
        await this.yourReferenceText.fill(details.yourReference ?? 'Your Reference');
        await this.solicitorDetailsHelper.selectOrganisation(this.page, details.orgName ?? 'FinRem-1-Org');

    }

    async enterIntervernersDetails(intervenerNumber: number, name: string, email: string, intervenerDetails:{
        representativeFullName?: string,
        representativeEmail?: string,
        representativePhoneNumber?: string,
        representativeFirm?: string,
        yourReference?: string,
        orgName?: string
    } ) {
        await this.page.waitForLoadState('load');
        await this.intervenerFullNameText.fill(name);
        await this.doesIntervenerLiveOutsideUK(false, intervenerNumber);
        await this.commonActionsHelper.enterUkAddress(this.page);
        await this.commonActionsHelper.enterEmailAddress(this.page, email);
        await this.commonActionsHelper.enterPhoneNumber(this.page);
        await this.keepIntervenerDetailsPrivate(intervenerNumber, false);
        await this.isIntervenerResidentInRefuge(intervenerNumber, false);
        await this.selectIsRepresentedRadio(intervenerNumber, true);
        await this.enterIntervenerRepresentedDetails(intervenerDetails);
    }

    async assertMandatoryFields(intervenerNumber: number = 1) {
        const errorMessages = [
            'Intervener\'s Full Name is required',
            'An address is required',
            'Is the Intervener represented ? is required',
            'Enter a Postcode'
        ];

        const errorMessagesForRepresentative = [
            'Representative\'s Full Name is required',
            'Representative\'s Email is required',
            'Representative\'s Firm is required',
            'Your Reference is required'
        ];
        await this.navigateContinue();

        for (const message of errorMessages) {
            const errorLocator = this.page.getByText(message);
            await expect(errorLocator).toBeVisible();
        }

        await this.selectIsRepresentedRadio(intervenerNumber, true);
        await this.navigateContinue();

        for (const message of errorMessagesForRepresentative) {
            const errorLocator = this.page.getByText(message);
            await expect(errorLocator).toBeVisible();
        }
    }
}