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
     * Returns a timestamp.  It's UTC.
     * Formated as: "2023-10-06T12:34:56.789Z".  Postgres stores as "2023-10-06T12:34:56.789000" (localtime).
     *
     * @returns Current datetime string in ISO format as a promise resolving to a string.
     */
    static async getCurrentTimestamp(): Promise<string> {
      return new Date().toISOString();
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

    /**
     * Converts a date string (ISO format) into a formatted date string
     * in the format "dd Month yyyy" (e.g. "06 August 2025").
     *
     * @param dateStr - A valid ISO date string (e.g. "2025-08-06").
     * @returns A promise that resolves with the formatted date string.
     */
    static formatToDayMonthYear(dateStr: string): string {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }).format(date);
    }
  }
