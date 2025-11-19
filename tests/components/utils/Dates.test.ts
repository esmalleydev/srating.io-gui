// npx jest test

import Dates from '@/components/utils/Dates';

describe('Dates', () => {
  describe('parse()', () => {
    it('parses ISO date string correctly', () => {
      const d = Dates.parse('2025-01-15T10:30:00Z');
      expect(d).toBeInstanceOf(Date);
      expect(d.toISOString()).toBe('2025-01-15T10:30:00.000Z');
    });

    it('parses YYYY-MM-DD as Local Midnight (Fix for ISO assumption)', () => {
      // Standard JS "new Date('2025-11-03')" creates UTC midnight.
      // In EST, that is Nov 2nd. Our parse() should ensure it remains Nov 3rd Local.
      const d = Dates.parse('2025-11-03');
      expect(d.getHours()).toBe(0);
      expect(d.getDate()).toBe(3);
      expect(d.getMonth()).toBe(10); // Nov
    });

    it('handles Date objects by returning a copy', () => {
      const original = new Date();
      const copy = Dates.parse(original);
      expect(copy).not.toBe(original); // Reference check
      expect(copy.getTime()).toBe(original.getTime()); // Value check
    });

    test('undefined returns now', () => {
      const now = new Date();
      const d = Dates.parse();
      expect(now.getTime()).toBe(d.getTime());
    });
  });

  describe('format()', () => {
    const date = new Date('2025-03-10T14:05:09Z'); // Monday, March 10, 2025 @ 14:05:09 UTC

    const getLocal = (d: Date) => ({
      year: String(d.getFullYear()),
      month: String(d.getMonth() + 1).padStart(2, '0'),
      day: String(d.getDate()).padStart(2, '0'),
      hours24: String(d.getHours()).padStart(2, '0'),
      hours12: String(((d.getHours() + 11) % 12) + 1).padStart(2, '0'),
      ampm: d.getHours() < 12 ? 'AM' : 'PM',
    });

    const local = getLocal(date);

    test('year formats: Y and y', () => {
      expect(Dates.format(date, 'Y')).toBe('2025');
      expect(Dates.format(date, 'y')).toBe('25');
    });

    test('month formats: m, n, M, F', () => {
      expect(Dates.format(date, 'm')).toBe('03'); // zero-padded
      expect(Dates.format(date, 'n')).toBe('3'); // non-padded
      expect(Dates.format(date, 'M')).toBe('Mar');
      expect(Dates.format(date, 'F')).toBe('March');
    });

    test('day formats: d, j, D, l, w, N', () => {
      expect(Dates.format(date, 'd')).toBe('10');
      expect(Dates.format(date, 'j')).toBe('10');
      expect(Dates.format(date, 'D')).toBe('Mon');
      expect(Dates.format(date, 'l')).toBe('Monday');
      expect(Dates.format(date, 'w')).toBe('1'); // 0=Sun, 1=Mon
      expect(Dates.format(date, 'N')).toBe('1'); // 1=Mon, 7=Sun
    });

    test('24-hour time formats: H, G', () => {
      expect(Dates.format(date, 'H')).toBe(local.hours24);
      expect(Dates.format(date, 'G')).toBe(String(Number(local.hours24)));
    });

    test('12-hour clock formats: h, g', () => {
      expect(Dates.format(date, 'h')).toBe(local.hours12);
      expect(Dates.format(date, 'g')).toBe(String(Number(local.hours12)));
    });

    test('AM/PM formats: A, a', () => {
      expect(Dates.format(date, 'A')).toBe(local.ampm);
      expect(Dates.format(date, 'a')).toBe(local.ampm.toLowerCase());
    });

    test('minute and second formats: i, s', () => {
      expect(Dates.format(date, 'i')).toBe('05');
      expect(Dates.format(date, 's')).toBe('09');
    });

    test('complex format strings', () => {
      const expected = `${local.year}-${local.month}-${local.day} ${local.hours24}:05:09`;
      expect(Dates.format(date, 'Y-m-d H:i:s')).toBe(expected);

      expect(Dates.format(date, 'F j, Y (D)'))
        .toBe('March 10, 2025 (Mon)');

      expect(Dates.format(date, String.raw`l \t\h\e \jS`))
        .toBe('Monday the jth');
    });

    test('escaping tokens with backslash', () => {
      expect(Dates.format(date, '\\Y \\m \\d')).toBe('Y m d');

      expect(Dates.format(date, String.raw`\H\H:i`))
        .toBe('HH:05');
    });

    test('midnight edge case', () => {
      // Local Midnight
      const midnight = new Date(2025, 2, 10, 0, 0, 0);
      expect(Dates.format(midnight, 'H')).toBe('00');
      expect(Dates.format(midnight, 'h')).toBe('12');
      expect(Dates.format(midnight, 'A')).toBe('AM');
    });

    test('noon edge case', () => {
      // Local Noon
      const noon = new Date(2025, 2, 10, 12, 0, 0);
      expect(Dates.format(noon, 'H')).toBe('12');
      expect(Dates.format(noon, 'A')).toBe('PM');
    });
  });

  describe('isSameDay() & Timezone Handling', () => {
    it('correctly identifies Sun Nov 02 23:00 vs Nov 03 as DIFFERENT days', () => {
      // This was the specific user complaint.
      // A late night event (Nov 2) should not be the same as the next calendar date (Nov 3).

      // Create a date that is late night Nov 2nd in local time
      const lateNight = new Date('2025-11-02T23:00:00');

      // Create the comparison target (Nov 3rd)
      const nextDay = '2025-11-03';

      expect(Dates.isSameDay(lateNight, nextDay)).toBe(false);
    });

    it('identifies same calendar days correctly regardless of time', () => {
      const morning = new Date('2025-11-02T08:00:00');
      const night = new Date('2025-11-02T23:00:00');
      expect(Dates.isSameDay(morning, night)).toBe(true);
    });

    it('handles string vs date object comparison', () => {
      const d1 = '2025-12-25';
      const d2 = new Date('2025-12-25T14:00:00');
      expect(Dates.isSameDay(d1, d2)).toBe(true);
    });
  });

  describe('add()', () => {
    it('adds days correctly', () => {
      const d = new Date('2025-03-10T00:00:00Z');
      const newDate = Dates.add(d, 3, 'days');

      expect(newDate.toISOString()).toBe('2025-03-13T00:00:00.000Z');
      expect(d.toISOString()).toBe('2025-03-10T00:00:00.000Z'); // immutability
    });

    it('adds hours correctly', () => {
      const d = new Date('2025-03-10T00:00:00Z');
      const newDate = Dates.add(d, 5, 'hours');

      expect(newDate.toISOString()).toBe('2025-03-10T05:00:00.000Z');
    });

    it('adds minutes correctly', () => {
      const d = new Date('2025-03-10T00:00:00Z');
      const newDate = Dates.add(d, 30, 'minutes');

      expect(newDate.toISOString()).toBe('2025-03-10T00:30:00.000Z');
    });

    it('adds days safely across DST changes', () => {
      // March 10, 2024 was DST start in US (skip forward 2am -> 3am)
      // Start: March 9th 10:00 AM
      const start = new Date(2024, 2, 9, 10, 0);

      // Add 2 days. Even if the day is only 23 hours long, it should result in March 11th 10:00 AM
      const result = Dates.add(start, 2, 'days');

      expect(result.getDate()).toBe(11);
      expect(result.getHours()).toBe(10); // Should preserve hour, not drift
    });

    it('adds months handling end-of-month overflow', () => {
      const jan31 = new Date('2024-01-31T12:00:00');
      const feb = Dates.add(jan31, 1, 'months');
      // Should be Feb 29 (Leap year)
      expect(feb.getMonth()).toBe(1); // Feb
      expect(feb.getDate()).toBe(29);
    });

    const START_DATE_MS = 1708008600000;
    const START_DATE = new Date(START_DATE_MS); // Fri Feb 15 2024 10:30:00 GMT

    // Helper to compare dates just by their string representation
    const dateToISOString = (date: Date) => date.toISOString();


    // --- Unit Tests for Millisecond-Based Units ---

    test('should add 30 minutes correctly', () => {
      const result = Dates.add(START_DATE, 30, 'minutes');
      // Expect: 11:00:00
      expect(dateToISOString(result)).toBe(new Date(START_DATE_MS + 30 * 60 * 1000).toISOString());
    });

    test('should subtract 2 hours correctly', () => {
      const result = Dates.add(START_DATE, -2, 'hours');
      // Expect: 08:30:00
      expect(dateToISOString(result)).toBe(new Date(START_DATE_MS - 2 * 60 * 60 * 1000).toISOString());
    });

    test('should add 5 days correctly (simple addition)', () => {
      const result = Dates.add(START_DATE, 5, 'days');
      // Expect: Wed Feb 20 2024 10:30:00
      expect(result.getDate()).toBe(20);
      expect(result.getMonth()).toBe(1); // February
    });

    test('should handle day rollover correctly (add 1 day to end of month)', () => {
      const start = new Date('2024-02-29T12:00:00.000Z'); // Leap day
      const result = Dates.add(start, 1, 'days');
      // Expect: Mar 1, 2024
      expect(result.getUTCFullYear()).toBe(2024);
      expect(result.getUTCMonth()).toBe(2); // March (0-indexed)
      expect(result.getUTCDate()).toBe(1);
    });

    // --- Unit Tests for 'months' ---

    test('should add 1 month correctly (simple addition)', () => {
      const result = Dates.add(START_DATE, 1, 'months');
      // Expect: Mar 15, 2024 (Note: Day of month is preserved)
      expect(result.getMonth()).toBe(2); // March
      expect(result.getDate()).toBe(15);
      expect(result.getFullYear()).toBe(2024);
    });

    test('should subtract 3 months correctly', () => {
      const result = Dates.add(START_DATE, -3, 'months');
      // Expect: Nov 15, 2023
      expect(result.getMonth()).toBe(10); // November (0-indexed)
      expect(result.getFullYear()).toBe(2023); // Year rollover handled
    });

    test('should handle year rollover correctly when adding months (Dec -> Jan)', () => {
      const start = new Date('2024-12-10T00:00:00.000Z');
      const result = Dates.add(start, 2, 'months');
      // Expect: Feb 10, 2025
      expect(result.getMonth()).toBe(1); // February (0-indexed)
      expect(result.getFullYear()).toBe(2025); // Year rolled over
    });

    test('should handle month-end overflow correctly (Jan 31 + 1 month -> Feb 29/28)', () => {
      // Start: Jan 31, 2024 (2024 is a leap year)
      const start2024 = new Date('2024-01-31T10:00:00.000Z');
      const result2024 = Dates.add(start2024, 1, 'months');
      // setMonth will automatically roll Jan 31 over to Feb 29 (the last day of Feb 2024)
      expect(result2024.getUTCMonth()).toBe(1); // February
      expect(result2024.getUTCDate()).toBe(29);

      // Start: Jan 31, 2023 (2023 is NOT a leap year)
      const start2023 = new Date('2023-01-31T10:00:00.000Z');
      const result2023 = Dates.add(start2023, 1, 'months');
      // It rolls Jan 31 over to Feb 28 (the last day of Feb 2023)
      expect(result2023.getUTCMonth()).toBe(1); // February
      expect(result2023.getUTCDate()).toBe(28);
    });

    // --- Immutability Test ---

    test('should not mutate the original date object', () => {
      const originalDate = new Date(START_DATE);
      Dates.add(originalDate, 5, 'days');
      // Ensure the original date's time is unchanged
      expect(originalDate.getTime()).toBe(START_DATE.getTime());
    });
  });

  describe('subtract()', () => {
    // Reference: March 15, 2025
    const baseDate = new Date('2025-03-15T10:00:00');

    it('subtracts years correctly', () => {
      const res = Dates.subtract(baseDate, 1, 'years');
      expect(res.getFullYear()).toBe(2024);
      expect(res.getMonth()).toBe(2); // March
      expect(res.getDate()).toBe(15);
    });

    it('subtracts months correctly', () => {
      const res = Dates.subtract(baseDate, 2, 'months');
      // March - 2 months = January
      expect(res.getMonth()).toBe(0); // Jan
      expect(res.getFullYear()).toBe(2025);
    });

    it('subtracts days correctly', () => {
      const res = Dates.subtract(baseDate, 5, 'days');
      expect(res.getDate()).toBe(10);
    });

    it('subtracts hours correctly', () => {
      const res = Dates.subtract(baseDate, 5, 'hours');
      expect(res.getHours()).toBe(5); // 10am - 5 = 5am
    });

    it('subtracts minutes correctly', () => {
      const res = Dates.subtract(baseDate, 30, 'minutes');
      expect(res.getHours()).toBe(9);
      expect(res.getMinutes()).toBe(30);
    });

    // --- Edge Cases ---

    it('handles Leap Year Reverse (Feb 29 -> Non-Leap Year)', () => {
      // Start: Feb 29, 2024 (Leap Year)
      const leapDay = new Date('2024-02-29T12:00:00');

      // Subtract 1 year -> Should be Feb 28, 2023 (Not Mar 1)
      const res = Dates.subtract(leapDay, 1, 'years');

      expect(res.getFullYear()).toBe(2023);
      expect(res.getMonth()).toBe(1); // Feb
      expect(res.getDate()).toBe(28); // Clamped to end of month
    });

    it('handles Month End Reverse (March 31 -> Feb 28)', () => {
      // Start: March 31, 2025
      const endOfMar = new Date('2025-03-31T12:00:00');

      // Subtract 1 month -> Should be Feb 28, 2025
      const res = Dates.subtract(endOfMar, 1, 'months');

      expect(res.getMonth()).toBe(1); // Feb
      expect(res.getDate()).toBe(28);
    });

    it('handles Year Rollover (Jan -> Dec)', () => {
      // Start: Jan 1, 2025
      const jan1 = new Date('2025-01-01T10:00:00');

      // Subtract 1 month -> Dec 1, 2024
      const res = Dates.subtract(jan1, 1, 'months');

      expect(res.getFullYear()).toBe(2024);
      expect(res.getMonth()).toBe(11); // Dec
    });
  });

  describe('fromNow()', () => {
    beforeAll(() => {
      jest.useFakeTimers({
        now: new Date('2025-03-10T12:00:00Z').getTime(),
      });
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it("returns 'just now' for under 1 minute", () => {
      const d = new Date('2025-03-10T11:59:40Z');
      expect(Dates.fromNow(d)).toBe('just now');
    });

    it('returns minutes ago', () => {
      const d = new Date('2025-03-10T11:45:00Z');
      expect(Dates.fromNow(d)).toBe('15m ago');
    });

    it('returns hours ago', () => {
      const d = new Date('2025-03-10T09:00:00Z');
      expect(Dates.fromNow(d)).toBe('3h ago');
    });

    it('returns days ago', () => {
      const d = new Date('2025-03-07T12:00:00Z');
      expect(Dates.fromNow(d)).toBe('3d ago');
    });
  });

  describe('getClosestDate', () => {
    // Reference date: 2024-03-18T10:00:00.000Z (a point in time)
    const dateToMatch = '2024-03-18T12:00:00';

    it('finds exact match', () => {
      const dates = ['2024-03-10', '2024-03-18', '2024-03-18T12:00:00', '2024-04-01'];
      expect(Dates.getClosestDate(dateToMatch, dates)).toBe('2024-03-18T12:00:00');
    });

    it('picks the closer date regardless of direction', () => {
      const dates = [
        '2024-03-17T12:00:00', // 1 day away
        '2024-03-25T12:00:00', // 7 days away
      ];
      expect(Dates.getClosestDate(dateToMatch, dates)).toBe('2024-03-17T12:00:00');
    });

    it('Tie-Breaker: Picks the FUTURE date when equidistant', () => {
      // Reference: 18th
      // Options: 17th and 19th (both 24 hours away)
      const dates = [
        '2024-03-17T12:00:00',
        '2024-03-19T12:00:00',
      ];

      // Should pick 19th per Todo requirement
      expect(Dates.getClosestDate(dateToMatch, dates)).toBe('2024-03-19T12:00:00');
    });

    it('Tie-Breaker: Picks the FUTURE date even if array order is reversed', () => {
      const dates = [
        '2024-03-19T12:00:00',
        '2024-03-17T12:00:00',
      ];
      expect(Dates.getClosestDate(dateToMatch, dates)).toBe('2024-03-19T12:00:00');
    });

    // Test 1: Simple case - the closest date is clear
    test('should return the single closest date', () => {
      const matchUTC = '2024-03-18T10:00:00.000Z';
      const dates = [
        '2024-03-20T00:00:00.000Z', // 1 day, 14 hours away
        '2024-03-17T00:00:00.000Z', // 1 day, 10 hours away (Closest)
        '2024-03-25T00:00:00.000Z', // Much further
      ];
        // The time difference (absolute value) is what matters
      expect(Dates.getClosestDate(matchUTC, dates)).toBe('2024-03-17T00:00:00.000Z');
    });

    // Test 2: Two dates equidistant - should pick the one that appears second in the array
    test('should pick the second equidistant date if all times are identical', () => {
      const dates = [
        '2024-03-17T10:00:00.000Z', // 1 day before
        '2024-03-19T10:00:00.000Z', // 1 day after
      ];
        // The implementation logic favors the one found second or if distance is equal (dist <= closestDist)
      expect(Dates.getClosestDate(dateToMatch, dates)).toBe('2024-03-19T10:00:00.000Z');
    });

    // Test 3: Two dates equidistant (but day-only strings) - should pick the second one due to sorting or implementation detail
    // This is the scenario mentioned in the original code's comment.
    // dateToMatch '2024-03-18' (defaults to 2024-03-18T00:00:00.000Z)
    test('should pick the future day (2024-03-19) when equidistant day-strings are used (implementation detail)', () => {
      const dateToMatchDay = '2024-03-18';
      const dates = [
        '2024-03-17', // dist: 1 day (parsed as 17th midnight)
        '2024-03-19', // dist: 1 day (parsed as 19th midnight)
      ];
        // The current implementation uses `dist <= closestDist`.
        // 1. First iteration: closestDist = 1 day, closestDate = '2024-03-17'
        // 2. Second iteration: dist = 1 day. Since (1 <= 1) is true, it updates.
      expect(Dates.getClosestDate(dateToMatchDay, dates)).toBe('2024-03-19');
    });

    // Test 4: Equidistant with one having a closer time component
    // dateToMatch: 2024-03-18T10:00:00.000Z
    test('should pick the date with the closest time if days are different', () => {
      const matchLocal = '2024-03-18T10:00:00';
      const dates = [
        '2024-03-17T12:00:00', // 22 hours away (closer)
        '2024-03-19T14:00:00', // 28 hours away (further)
      ];
      expect(Dates.getClosestDate(matchLocal, dates)).toBe('2024-03-17T12:00:00');
    });

    // Test 5: Empty array
    test('should return null for an empty array', () => {
      expect(Dates.getClosestDate(dateToMatch, [])).toBeNull();
    });

    // Test 6: Array with a single date
    test('should return the single date in the array', () => {
      const singleDate = '2024-03-18T12:00:00.000Z';
      expect(Dates.getClosestDate(dateToMatch, [singleDate])).toBe(singleDate);
    });

    // Test 7: Match date is in the array
    test('should return the match date if it exists in the array', () => {
      const dates = [
        '2024-03-17T00:00:00.000Z',
        dateToMatch, // dist = 0
        '2024-03-19T00:00:00.000Z',
      ];
      expect(Dates.getClosestDate(dateToMatch, dates)).toBe(dateToMatch);
    });
  });
});
