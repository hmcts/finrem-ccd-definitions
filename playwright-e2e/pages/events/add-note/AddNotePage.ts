import { BaseJourneyPage } from "../../BaseJourneyPage.ts";
import { expect, Locator, Page } from "@playwright/test";
import { DateHelper } from "../../../data-utils/DateHelper.ts";

export class AddNotePage extends BaseJourneyPage {
    private readonly addNoteTitle: Locator;
    private readonly notesTitle: Locator;
    private readonly dayText: Locator;
    private readonly monthText: Locator;
    private readonly yearText: Locator;
    private readonly eventSummary: Locator;
    private readonly eventDescription: Locator;

    public constructor(page: Page) {
        super(page);
        this.addNoteTitle = page.getByRole('heading', { name: "Add note" });
        this.notesTitle = page.locator('//h2[normalize-space()="Notes"]');
        this.dayText = page.locator('#caseNoteDate-day');
        this.monthText = page.locator('#caseNoteDate-month');
        this.yearText = page.locator('#caseNoteDate-year');
        this.eventSummary = page.locator('#field-trigger-summary');
        this.eventDescription = page.locator('#field-trigger-description');
    }

    async assertAddNotePage() {
        await this.page.waitForLoadState('load');
        await expect(this.addNoteTitle).toBeVisible();
        await expect(this.notesTitle).toBeVisible();
    }

    async assertNotesIsRequired() {
        const errorMessage = 'Notes is required';
        await this.assertErrorMessage([errorMessage]);
    }


    async enterAuthor(author: string, position: number = 0) {
        const authorText = this.page.locator(`#caseNotesCollection_${position}_caseNoteAuthor`);
        await expect(authorText).toBeVisible();
        await authorText.fill(author);
    }

    async enterDate(day: string, month: string, year: string, position: number = 0) {
        await expect(this.dayText.nth(position)).toBeVisible();
        await expect(this.monthText.nth(position)).toBeVisible();
        await expect(this.yearText.nth(position)).toBeVisible();

        await this.dayText.nth(position).fill(day);
        await this.monthText.nth(position).fill(month);
        await this.yearText.nth(position).fill(year);
    }

    async enterTodayDate(position: number = 0) {
        const [year, month, day] = await DateHelper.getCurrentDateFormatted();
        await this.enterDate(day, month, year, position);
    }

    async enterNote(note: string, position: number = 0) {
        const noteText = this.page.locator(`#caseNotesCollection_${position}_caseNote`);
        await expect(noteText).toBeVisible();
        await noteText.fill(note);
    }

    async assertErrorMessageForMandatoryFields() {
        const errorMessages = [
            'Author is required',
            'Date is required',
            'Note is required'
        ];

        await this.navigateContinue();

        await this.assertErrorMessage(errorMessages);
    }

    async enterEventSummaryAndDescription(summary: string, description: string) {
        await expect(this.eventSummary).toBeVisible();
        await expect(this.eventDescription).toBeVisible();

        await this.eventSummary.fill(summary);
        await this.eventDescription.fill(description);
    }

}
