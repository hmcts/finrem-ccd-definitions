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
      .replace(/\b([A-Za-z]{4,})\b/g, m => {return m.slice(0, 3);});
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
   * Returns the current date and time formatted as "d MMM yyyy, h:mm" (e.g. "6 Aug 2025, 11:02").
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
      hourCycle: 'h12',
      timeZone: 'UTC'
    })
      .replace(/\b( am| pm)\b/i, '')
      .replace(/\bSept\b/, 'Sep');
  }

  /**
   * Returns the current date and time formatted as "d MMM yyyy, h:mm:ss" then adds a PM suffix (e.g. "6 Aug 2025, 11:02:20 PM").
   * For local running, may need to change so that timezone: 'Europe/London'
   *
   * @returns Formatted current date and time string.
   */
  static getDateTimeFormattedWithSeconds(date: Date = new Date(), timeZone: string = 'UTC'): string {
    return date.toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h12',
      timeZone: timeZone
    })
      .replace(/\b(am|pm)\b/gi, marker => {return marker.toUpperCase();})
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

  /**
   * Returns a date a given number of weekdays from the supplied date.
   * Saturdays, Sundays and standard England and Wales bank holidays are excluded.
   */
  static getFormattedDateAfterWorkingDays(
    workingDays: number,
    from: Date = new Date()
  ): string {
    const date = new Date(from);
    let workingDaysAdded = 0;

    while (workingDaysAdded < workingDays) {
      date.setDate(date.getDate() + 1);
      if (this.isWorkingDay(date)) {
        workingDaysAdded++;
      }
    }

    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  private static isWorkingDay(date: Date): boolean {
    return date.getDay() !== 0
      && date.getDay() !== 6
      && !this.getEnglandAndWalesBankHolidays(date.getFullYear())
        .has(this.toLocalIsoDate(date));
  }

  private static getEnglandAndWalesBankHolidays(year: number): Set<string> {
    const holidays = new Set<string>();
    const add = (date: Date): void => {
      holidays.add(this.toLocalIsoDate(date));
    };

    add(this.getSubstituteWeekday(new Date(year, 0, 1)));

    const easterSunday = this.getEasterSunday(year);
    const goodFriday = new Date(easterSunday);
    goodFriday.setDate(goodFriday.getDate() - 2);
    add(goodFriday);
    const easterMonday = new Date(easterSunday);
    easterMonday.setDate(easterMonday.getDate() + 1);
    add(easterMonday);

    add(this.getNthWeekdayOfMonth(year, 4, 1, 1));
    add(this.getLastWeekdayOfMonth(year, 4, 1));
    add(this.getLastWeekdayOfMonth(year, 7, 1));

    const christmasDay = new Date(year, 11, 25);
    const boxingDay = new Date(year, 11, 26);
    if (christmasDay.getDay() === 6) {
      add(new Date(year, 11, 27));
      add(new Date(year, 11, 28));
    } else if (christmasDay.getDay() === 0) {
      add(new Date(year, 11, 27));
      add(boxingDay);
    } else {
      add(christmasDay);
      add(this.getSubstituteWeekday(boxingDay));
    }

    return holidays;
  }

  private static getSubstituteWeekday(date: Date): Date {
    const substitute = new Date(date);
    if (substitute.getDay() === 6) {
      substitute.setDate(substitute.getDate() + 2);
    } else if (substitute.getDay() === 0) {
      substitute.setDate(substitute.getDate() + 1);
    }
    return substitute;
  }

  private static getNthWeekdayOfMonth(
    year: number,
    month: number,
    weekday: number,
    occurrence: number
  ): Date {
    const date = new Date(year, month, 1);
    date.setDate(1 + ((7 + weekday - date.getDay()) % 7) + (occurrence - 1) * 7);
    return date;
  }

  private static getLastWeekdayOfMonth(
    year: number,
    month: number,
    weekday: number
  ): Date {
    const date = new Date(year, month + 1, 0);
    date.setDate(date.getDate() - ((7 + date.getDay() - weekday) % 7));
    return date;
  }

  private static getEasterSunday(year: number): Date {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(year, month - 1, day);
  }

  private static toLocalIsoDate(date: Date): string {
    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0')
    ].join('-');
  }

  //************ Hearing Date Helpers ************//

  /**
   * This is for cases that aren't "fast track" or "express".
   * Returns a hearing date, 12 weeks later than current date, as a string in "YYYY-MM-DD" format.
   *
   * @returns Hearing date string in ISO format (date only) as a promise resolving to a string.
   */
  static getHearingDateTwelveWeeksLaterInISOFormat(): string {
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
      .replace(/\b([A-Za-z]{4,})\b/g, m => {return m.slice(0, 3);});
  };

  static getFormattedDateTwelveWeeksLaterWithZeroPaddedDay(): string {
    const date = new Date(
      DateHelper.getHearingDateTwelveWeeksLaterInISOFormat()
    );

    return `${String(date.getDate()).padStart(2, '0')} ${date
      .toLocaleDateString('en-GB', { month: 'short' })
      .slice(0, 3)} ${date.getFullYear()}`;
  }

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
      year: 'numeric'
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
      month: 'long',
      year: 'numeric'
    })
      .format(date)
      .replace(/\b([A-Za-z]{4,})\b/g, m => {return m.slice(0, 3);});
  }

  static async getFormattedHearingDate(): Promise<{ currentDate: string; hearingDate: string }> {
    const currentDate = this.getCurrentDate();
    const hearingDate = await this.getHearingDateTwelveWeeksLaterInISOFormat();
    return { currentDate, hearingDate };
  }

  /**
   * Returns the current date and time formatted as "dd MMMM yyyy HH:mm:ss" (e.g. "06 January 2026 16:30").
   *
   * @returns Formatted current date and time string with zero-padded day.
   */
  static getCurrentDateTimeFull(): string {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0'); // zero-padded day
    const month = now.toLocaleString('en-GB', { month: 'long' });
    const year = now.getFullYear();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${day} ${month} ${year} ${hours}:${minutes}:`;
  }

  /**
   * Returns the timezone for the current test environment.
   *
   * AAT and Demo Finrem use UTC. Local Finrem typically uses the dev machine clock (Europe/London).
   *
   * @returns `"UTC"` for AAT or Demo; otherwise, `"Europe/London"`.
   */
  static getTimeZone(): 'UTC' | 'Europe/London' {
    const runningEnvironment = process.env.RUNNING_ENV?.toLowerCase();

    return runningEnvironment === 'aat' || runningEnvironment === 'demo'
      ? 'UTC'
      : 'Europe/London';
  }
}
