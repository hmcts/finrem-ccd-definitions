export class DateHelper {

    /**
     * Returns today's date as a string in "YYYY-MM-DD" format.
     *
     * @returns Current date string in ISO format (date only) as a promise resolving to a string.
     */
    static getCurrentDate(): string {
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
   * Returns today's date formatted as "d MMM yyyy" (e.g. "6 Aug 2025").
   *
   * @returns Formatted current date string.
   */
  static getTodayFormattedDate(): string {
    const today = new Date();
    return today
      .toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      .replace(/\b([A-Za-z]{4,})\b/g, m => m.slice(0, 3));
  };

  /**
   * Returns today's date formatted as an array of strings [year, month, day].
   *
   * @returns An array containing the year, month, and day as strings.
   */
  static getCurrentDateFormatted(): string[] {
    const today = this.getCurrentDate();
    return today.split('-');
  };

  /**
   * Returns the current date and time formatted as "d MMM yyyy, HH:mm" (e.g. "6 Aug 2025, 11:02").
   *
   * @returns Formatted current date and time string.
   */
  static getUtcDateTimeFormatted(): string {
    const now = new Date();
    return now.toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'UTC'
    })
      .replace(/\b( am| pm)\b/i, '')
      .replace(/\bSept\b/, 'Sep');
  }

  /**
   * Returns today's date formatted as "d Month yyyy" (e.g. "06 August 2025").
   *
   * @returns Formatted current date string.
   */
  static getTodayFullFormattedDate(): string {
    const today = this.getCurrentDate();
    return this.formatToDayMonthYear(today);
  };

  //************ Hearing Date Helpers ************//

  /**
     * This is for cases that aren't "fast track" or "express".
     * Returns a hearing date, 12 weeks later than current date, as a string in "YYYY-MM-DD" format.
     *
     * @returns Hearing date string in ISO format (date only) as a promise resolving to a string.
     */
    static async getHearingDateTwelveWeeksLaterInISOFormat(): Promise<string> {
      const hearingDate = new Date();
      hearingDate.setDate(hearingDate.getDate() + 12 * 7);
      return hearingDate.toISOString().split('T')[0];
    }

  /**
   * Returns a date 12 weeks and 1 day later than today, formatted as "d MMM yyyy" (e.g. "6 Aug 2025").
   *
   * @returns Formatted date string for 12 weeks
   */
  static getFormattedDateTwelveWeeksLater(): string {
    const twelveWeeksAndOneDayLater = new Date();
    twelveWeeksAndOneDayLater.setDate(twelveWeeksAndOneDayLater.getDate() + 12 * 7);

    return twelveWeeksAndOneDayLater
      .toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      .replace(/\b([A-Za-z]{4,})\b/g, m => m.slice(0, 3));
  };

  /**
   * Returns a date 12 weeks and 1 day later than today, formatted as "dd Month yyyy" (e.g. "6 August 2025").
   *
   * @returns Formatted date string for 12 weeks
   */
  static getFullDateTwelveWeeksLater(): string {
    const twelveWeeksAndOneDayLater = new Date();
    twelveWeeksAndOneDayLater.setDate(twelveWeeksAndOneDayLater.getDate() + 12 * 7);

    return twelveWeeksAndOneDayLater
      .toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
  };

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

    /**
     * Converts a date string (ISO format) into a formatted date string
     * in the short month format "dd Month yyyy" (e.g. "06 Aug 2025").
     *
     * @param dateStr - A valid ISO date string (e.g. "2025-08-06").
     * @returns A promise that resolves with the formatted date string.
     */
    static formatToDayMonthYearShort(dateStr: string): string {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(date);
    }

    static async getFormattedHearingDate(): Promise<{ currentDate: string; hearingDate: string }> {
      const currentDate = this.getCurrentDate();
      const hearingDate = await this.getHearingDateTwelveWeeksLaterInISOFormat();
      return { currentDate, hearingDate };
    }

}
