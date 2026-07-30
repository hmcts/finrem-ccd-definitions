import { Page } from 'playwright';
import { expect, Locator } from '@playwright/test';
import { BaseJourneyPage } from '../../BaseJourneyPage';
import { CommonActionsHelper } from '../../helpers/CommonActionsHelper';
import { YesNoRadioEnum, MaleOrFemaleEnum } from '../../helpers/enums/RadioEnums';
export class ChildrensDetailsPage extends BaseJourneyPage {

  private readonly commonActionsHelper: CommonActionsHelper;
  private readonly addNewChildBtn: Locator;
  private readonly fullNameTextBox: Locator;
  private readonly dayOfBirthTextBox: Locator;
  private readonly monthOfBirthTextBox: Locator;
  private readonly yearOfBirthTextBox: Locator;
  private readonly relationshipOfApplicantToChildRadio: Locator;
  private readonly relationshipOfRespondentToChildRadio: Locator;
  private readonly genderRadio: Locator;

  public constructor(page: Page, commonActionsHelper: CommonActionsHelper) {
    super(page);

    this.commonActionsHelper = commonActionsHelper;
    this.addNewChildBtn = page.getByRole('button', { name: 'Add new' }).first();
    this.fullNameTextBox = page.getByRole('textbox', { name: 'Full name' });
    this.dayOfBirthTextBox = page.getByRole('textbox', { name: 'Day' });
    this.monthOfBirthTextBox = page.getByRole('textbox', { name: 'Month' });
    this.yearOfBirthTextBox = page.getByRole('textbox', { name: 'Year' });
    this.relationshipOfApplicantToChildRadio = page.getByLabel('Relationship of applicant to');
    this.relationshipOfRespondentToChildRadio = page.getByLabel('Relationship of respondent to');
    this.genderRadio = page.locator('#childrenCollection_0_childGender');
  }
    
  async addNewChild() {
    await this.addNewChildBtn.click();
  }
  async childLiveInEnglandOrWales(radioOption: YesNoRadioEnum) {
    const radioButton = this.page.getByLabel(radioOption);
    await radioButton.check(); // Check the specific radio button
  }
  async enterChildFullName(fullName: string) {
    await this.fullNameTextBox.fill(fullName);
  }

  async enterChildDateOfBirth(day: string, month: string, year: string) {
    // Adding a delay (in milliseconds) between key presses
    await this.dayOfBirthTextBox.pressSequentially(day, { delay: 100 });
    await this.monthOfBirthTextBox.pressSequentially(month, { delay: 100 });
    await this.yearOfBirthTextBox.pressSequentially(year, { delay: 100 });
  }
  async genderOfChild(genderOfChild: MaleOrFemaleEnum) {
    const genderOption = this.genderRadio.locator(`input[type="radio"][id$="${genderOfChild}"]`);
    await genderOption.evaluate((el: HTMLInputElement) => {return el.click();});
    await expect(genderOption).toBeChecked();
  }

  async relationshipOfApplicantToChild(dropdownOption: string) {
    await this.relationshipOfApplicantToChildRadio.selectOption(dropdownOption);
  }

  async relationshipOfRespondentToChild(dropdownOption: string) {
    await this.relationshipOfRespondentToChildRadio.selectOption(dropdownOption);
  }
}
