import { Page } from "playwright";
import { expect, Locator } from "@playwright/test";
import { BaseJourneyPage } from "../../BaseJourneyPage";
import { CommonActionsHelper } from "../../helpers/CommonActionsHelper";
import { YesNoRadioEnum, MaleOrFemaleEnum } from "../../helpers/enums/RadioEnums";
import { M } from "../../../../playwright-report/trace/assets/defaultSettingsView-DTenqiGw";

export class ChildrensDetailsPage extends BaseJourneyPage {

    private readonly commonActionsHelper: CommonActionsHelper;
    private readonly addNewChildBtn: Locator;
    private readonly fullNameTextBox: Locator;
    private readonly dayOfBirthTextBox: Locator;
    private readonly monthOfBirthTextBox: Locator;
    private readonly yearOfBirthTextBox: Locator;
    private readonly relationshipOfApplicantToChildRadio: Locator;
    private readonly relationshipOfRespondentToChildRadio: Locator;

    public constructor(page: Page, commonActionsHelper: CommonActionsHelper) {
        super(page);

        this.commonActionsHelper = commonActionsHelper;
        this.addNewChildBtn = page.getByRole('button', { name: 'Add new' }).first()
        this.fullNameTextBox = page.getByRole('textbox', { name: 'Full name' })
        this.dayOfBirthTextBox = page.getByRole('textbox', { name: 'Day' })
        this.monthOfBirthTextBox = page.getByRole('textbox', { name: 'Month' })
        this.yearOfBirthTextBox = page.getByRole('textbox', { name: 'Year' })
        this.relationshipOfApplicantToChildRadio = page.getByLabel('Relationship of applicant to')
        this.relationshipOfRespondentToChildRadio = page.getByLabel('Relationship of respondent to')


    }

    async addNewChild() {
        await this.addNewChildBtn.click()
    }

    async childLiveInEnglandOrWales(radioOption: YesNoRadioEnum) {
        const radioButton = this.page.getByLabel(radioOption); 
    await radioButton.check(); // Check the specific radio button
    }
    async enterChildFullName(fullName: string) {
        await this.fullNameTextBox.fill(fullName)
    }
    async enterChildDateOfBirth(day: string, month: string, year: string) {
        await this.dayOfBirthTextBox.fill(day)
        await this.monthOfBirthTextBox.fill(month)
        await this.yearOfBirthTextBox.fill(year)
    }
    async genderOfChild(radioOption: MaleOrFemaleEnum) {
        const radioButton = this.page.getByLabel(radioOption); 
        await radioButton.click();
    }
    async relationshipOfApplicantToChild(dropdownOption: string) {
        await this.relationshipOfApplicantToChildRadio.selectOption(dropdownOption);
    }
    async relationshipOfRespondentToChild(dropdownOption: string) {
        await this.relationshipOfApplicantToChildRadio.selectOption(dropdownOption); 
    }
}
