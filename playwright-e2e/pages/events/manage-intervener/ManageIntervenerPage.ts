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

    private readonly solicitorDetailsHelper: SolicitorDetailsHelper;

    public constructor(page: Page, solicitorDetailsHelper: SolicitorDetailsHelper) {
        super(page);
        this.solicitorDetailsHelper = solicitorDetailsHelper;

        this.manageIntervenerTitle = page.getByRole('heading', { name: 'Manage Interveners' });
        this.intervenerFullNameText = page.getByLabel(`Intervener's Full Name`);
        this.representativeFullNameText = page.getByLabel(`Representative's Full Name`);
        this.representativeEmailText = page.getByLabel(`Representative's Email`);
        this.representativePhoneNumberText = page.getByLabel(`Representative's Phone Number (Optional)`);
        this.representativeFirmText = page.getByLabel(`Representative Firm`);
        this.yourReferenceText = page.getByLabel(`Your Reference`);

    }

    async selectIntervenerRadio(intervenerNumber: number) {
        const radio = this.page.getByRole('radio',
            { name: new RegExp(`^Intervener ${intervenerNumber}`)});
        await radio.first().check();
    }

    async selectIntervenerActionRadio(action: string, intervenerNumber: number) {
        const actionRadio = this.page.getByRole('radio',
            { name: `${action} Intervener ${intervenerNumber}`});
        await actionRadio.first().check();
    }

    async doesIntervenerLiveOutsideUK(liveOutside : boolean,intervenerNumber: number){
        const liveOutsideRadio = this.page.locator(`#intervener${intervenerNumber}_intervenerResideOutsideUK`);
        const optionToSelect = liveOutside ? 'Yes' : 'No';
        const radioOption = liveOutsideRadio.getByLabel(optionToSelect);
        await radioOption.check();
    }

    async enterUkAddress(address?: {
        buildingAndStreet?: string;
        addressLine2?: string;
        townOrCity?: string;
        county?: string;
        postcodeOrZipcode?: string;
        country?: string;
    }) {
        await this.page.getByRole('link', { name: 'I can\'t enter a UK postcode' }).click();
        await this.page.getByRole('textbox', { name: 'Building and Street'}).fill(address?.buildingAndStreet ?? 'test street');
        await this.page.getByRole('textbox', { name: 'Address Line 2 (Optional)'}).fill(address?.addressLine2 ?? 'test address line 2');
        await this.page.getByRole('textbox', { name: 'Town or City (Optional)'}).fill(address?.townOrCity ?? 'test town');
        await this.page.getByRole('textbox', { name: 'County (Optional)'}).fill(address?.county ?? 'test county');
        await this.page.getByRole('textbox', { name: 'Postcode', exact: true }).fill(address?.postcodeOrZipcode ?? 'test postcode');
        await this.page.getByRole('textbox', { name: 'Country'}).fill(address?.country ?? 'test country');
    }

    async enterEmailAddress(emailAddress: string) {
        await this.page.getByRole('textbox', { name: 'Email address (Optional)'}).fill(emailAddress);
    }

    async enterPhoneNumber() {
        await this.page.getByRole('textbox', { name: 'Phone number (Optional)', exact: true }).fill('07111111111');
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

    async enterIntervenersDetails(
        intervenerNumber: number,
        name: string,
        email: string,
        keepIntervenerDetailsPrivate: boolean,
        isRepresented: boolean,
        intervenerDetails:{
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
        await this.enterUkAddress();
        await this.enterEmailAddress(email);
        await this.enterPhoneNumber();
        await this.keepIntervenerDetailsPrivate(intervenerNumber, keepIntervenerDetailsPrivate);
        await this.isIntervenerResidentInRefuge(intervenerNumber, false);
        await this.selectIsRepresentedRadio(intervenerNumber, isRepresented);
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

        await this.assertErrorMessage(errorMessages);

        await this.selectIsRepresentedRadio(intervenerNumber, true);
        await this.navigateContinue();

        await this.assertErrorMessage(errorMessagesForRepresentative);
    }
}