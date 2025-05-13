export class DateHelper {

    /**
     * Returns today's date as a string in "YYYY-MM-DD" format.
     *
     * @returns Current date string in ISO format (date only) as a promise resolving to a string.
     */
    static async getCurrentDate(): Promise<string> {
      return new Date().toISOString().split('T')[0];
    }

    /**
     * This is for cases that aren't "fast track" or "express".
     * Returns a hearing date, 12 weeks later than current date, as a string in "YYYY-MM-DD" format.
     *
     * @returns Hearing date string in ISO format (date only) as a promise resolving to a string.
     */
    static async getHearingDateUsingCurrentDate(): Promise<string> {
      const hearingDate = new Date();
      hearingDate.setDate(hearingDate.getDate() + 12 * 7);
      return hearingDate.toISOString().split('T')[0];
    }
  }
