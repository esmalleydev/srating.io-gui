// todo write unit tests for closest date function to test different scenarios

class Dates {
  // constructor() {
  // }

  public static parse(str: string) {
    return new Date(str);
  }

  /**
   * Format a date using php syntax
   *
    | Token | Meaning                   | Example |
    | ----- | ------------------------- | ------- |
    | `Y`   | 4-digit year              | 2025    |
    | `y`   | 2-digit year              | 25      |
    | `m`   | 2-digit month             | 03      |
    | `n`   | month (no leading zero)   | 3       |
    | `d`   | day (2-digit)             | 09      |
    | `j`   | day (no leading zero)     | 9       |
    | `H`   | 24-hour                   | 14      |
    | `G`   | 24-hour (no leading zero) | 14      |
    | `h`   | 12-hour                   | 02      |
    | `g`   | 12-hour (no leading zero) | 2       |
    | `i`   | minutes                   | 05      |
    | `s`   | seconds                   | 09      |
    | `A`   | AM/PM                     | PM      |
    | `a`   | am/pm                     | pm      |
    | `w`   | day of week (0–6)         | 1       |
    | `N`   | day of week (1–7)         | 2       |
    | `M`   | short month name          | Mar     |
    | `F`   | full month name           | March   |
    | `D`   | short weekday             | Mon     |
    | `l`   | full weekday              | Monday  |
   */
  public static format(date: Date, format: string) {
    const pad = (n: number) => String(n).padStart(2, '0');

    const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthsLong = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const daysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const daysLong = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Use UTC getters so formatting is deterministic for ISO "Z" dates in tests
    const Y = date.getUTCFullYear();
    const y = String(Y).slice(-2);
    const month = date.getUTCMonth(); // 0-11
    const dateNum = date.getUTCDate(); // 1-31
    const day = date.getUTCDay(); // 0-6, Sun = 0
    const hours = date.getUTCHours(); // 0-23
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();

    const tokens: Record<string, string> = {
      /// Year
      Y: String(Y),
      y,

      // Month
      m: pad(month + 1),
      n: String(month + 1),
      M: monthsShort[month],
      F: monthsLong[month],

      // Day
      d: pad(dateNum),
      j: String(dateNum),
      D: daysShort[day],
      l: daysLong[day],
      w: String(day), // 0 (Sun) - 6
      N: String(day === 0 ? 7 : day), // 1 (Mon) - 7 (Sun)

      // Time
      H: pad(hours),
      G: String(hours),
      h: pad(((hours + 11) % 12) + 1),
      g: String(((hours + 11) % 12) + 1),
      i: pad(minutes),
      s: pad(seconds),

      // AM/PM
      A: hours < 12 ? 'AM' : 'PM',
      a: hours < 12 ? 'am' : 'pm',
    };

    // Replace tokens using regex
    return format.replace(/\\(.)|([a-zA-Z])/g, (_, esc, token) => {
      if (esc) {
        // literal escaped char like \H or \Y → return the raw letter
        return esc;
      }
      return tokens[token] ?? token;
    });
  }

  public static add(date: Date, amount: number, unit: 'days' | 'hours' | 'minutes') {
    const d = new Date(date);
    const map = {
      days: amount * 24 * 60 * 60 * 1000,
      hours: amount * 60 * 60 * 1000,
      minutes: amount * 60 * 1000,
    };
    d.setTime(d.getTime() + map[unit]);
    return d;
  }

  public static fromNow(date: Date) {
    const diff = Date.now() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  /**
   * Find the closest date in an array of dates
   */
  public static getClosestDate(dateToMatch: string, datesArray: string[]): string | null {
    let closestDist: number | null = null;
    let closestDate: string | null = null;

    for (let i = 0; i < datesArray.length; i++) {
      const a = new Date(datesArray[i]).getTime();
      const b = new Date(dateToMatch).getTime();

      const dist = Math.abs(a - b);

      // todo this will pick the future date, assuming it was sorted correctly in the array
      // need to add time to these dates, to correctly pick the closest
      // ex: I have games on 2024-03-17 and 2024-03-19, if the dateToMatch is 2024-03-18, both 17th and 19th have the same dist. It should pick 19th?
      if (
        closestDist === null ||
        dist <= closestDist
      ) {
        closestDist = dist;
        closestDate = datesArray[i];
      }
    }

    return closestDate;
  }

  public static getToday() {
    const formatYmd = (date) => {
      const year = date.getFullYear();
      const month = date.getMonth() < 9 ? `0${(date.getMonth() + 1).toString()}` : (date.getMonth() + 1);
      const day = date.getDate() < 10 ? `0${date.getDate().toString()}` : date.getDate();

      return `${year}-${month}-${day}`;
    };

    const today = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));

    return formatYmd(today);
  }
}

export default Dates;
