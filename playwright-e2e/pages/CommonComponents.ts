import { type Page, expect, Locator } from '@playwright/test';

export class CommonComponents {

    readonly page: Page;

    readonly continueButton: Locator;
    readonly previousButton: Locator;
    readonly submitButton: Locator

    readonly postcodeInput: Locator;
    readonly findAddressButton: Locator;
    readonly buildingStreetInput: Locator;
    readonly addressLine2Input: Locator;
    readonly addressLine3Input: Locator;
    readonly townCityInput: Locator;
    readonly countyInput: Locator;
    readonly postcodeZipcodeInput: Locator;
    readonly countryInput: Locator;
    readonly phoneNumberInput: Locator;
    readonly emailInput: Locator;
    readonly cantEnterPostcode: Locator;

    readonly emailConsentRadio: Locator;

    readonly firstName: Locator;
    readonly lastName: Locator;
    

    public constructor(page: Page) {
        
        this.page = page;
        this.submitButton = page.getByRole('button', { name: 'Submit' });
        this.continueButton = page.getByRole('button', { name: 'Continue' });
        this.previousButton = page.getByRole('button', { name: 'Previous' });

        this.postcodeInput = page.getByLabel('Enter a UK postcode');
        this.cantEnterPostcode = page.getByRole('link', { name: 'I can\'t enter a UK postcode' });
        this.findAddressButton = page.getByRole('button', { name: 'Find address' });
        this.buildingStreetInput = page.getByRole('textbox', { name: 'Building and Street'});
        this.addressLine2Input = page.getByRole('textbox', { name: 'Address Line 2'});
        this.addressLine3Input = page.getByRole('textbox', { name: 'Address Line 3'}); 
        this.townCityInput = page.getByRole('textbox', { name: 'Town or City'}); 
        this.countyInput =  page.getByRole('textbox', { name: 'County'});  
        this.postcodeZipcodeInput = page.getByRole('textbox', { name: 'Postcode/Zipcode'}); 
        this.countryInput = page.getByRole('textbox', { name: 'Country'});
        this.phoneNumberInput =  page.getByRole('textbox', { name: 'Phone Number'}); 
        this.emailInput =  page.getByRole('textbox', { name: 'Email'}); 

        this.firstName = page.getByLabel('Current First and Middle names');
        this.lastName = page.getByLabel('Current Last Name');

        this.emailConsentRadio = page.locator(
            '#applicantSolicitorConsentForEmails_radio'
        );
    }

    async navigateSubmit() {
        await expect(this.submitButton).toBeVisible();
        await this.submitButton.click();
    }

    async navigateContinue() {
        await expect(this.continueButton).toBeVisible();
        await this.continueButton.click();
    }

    async navigatePrevious() {
        await expect(this.previousButton).toBeVisible();
        await this.continueButton.click();
    }

    async enterUkAddress() {
        await this.cantEnterPostcode.click();
        await this.buildingStreetInput.fill('test')
        await this.addressLine2Input.fill('test')
        await this.townCityInput.fill('test')
        await this.countyInput.fill('test')
        await this.postcodeZipcodeInput.fill('test')
        await this.countryInput.fill('test');
    }


    async enterPhoneNumber(phoneNumber: string) {
        await this.phoneNumberInput.fill(phoneNumber);
    }

    async enterEmailAddress(emailAddress: string) {
        await this.emailInput.fill(emailAddress);
    }
    
    async emailConsent(consent: boolean) {
        const radioOption = consent ? 'Yes' : 'No';
        const optionToSelect = this.emailConsentRadio.getByLabel(radioOption);
        await optionToSelect.check();
    }

    async enterNames(fistName: string, lastName: string) {
        await this.firstName.click();
        await this.firstName.fill(fistName);
        await this.lastName.fill(lastName);
    }

}