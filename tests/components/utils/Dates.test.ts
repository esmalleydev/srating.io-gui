// npx jest test

import Dates from '@/components/utils/Dates';

describe('Dates', () => {
  describe('parse()', () => {
    it('parses ISO date string correctly', () => {
      const d = Dates.parse('2025-01-15T10:30:00Z');
      expect(d).toBeInstanceOf(Date);
      expect(d.toISOString()).toBe('2025-01-15T10:30:00.000Z');
    });
  });

  describe('format()', () => {
    const date = new Date('2025-03-10T14:05:09Z'); // Monday, March 10, 2025 @ 14:05:09 UTC

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
      expect(Dates.format(date, 'H')).toBe('14');
      expect(Dates.format(date, 'G')).toBe('14');
    });

    test('12-hour clock formats: h, g', () => {
      expect(Dates.format(date, 'h')).toBe('02'); // 14:05 → 2:05 PM
      expect(Dates.format(date, 'g')).toBe('2');
    });

    test('AM/PM formats: A, a', () => {
      expect(Dates.format(date, 'A')).toBe('PM');
      expect(Dates.format(date, 'a')).toBe('pm');
    });

    test('minute and second formats: i, s', () => {
      expect(Dates.format(date, 'i')).toBe('05');
      expect(Dates.format(date, 's')).toBe('09');
    });

    test('complex format strings', () => {
      expect(Dates.format(date, 'Y-m-d H:i:s'))
        .toBe('2025-03-10 14:05:09');

      expect(Dates.format(date, 'F j, Y (D)'))
        .toBe('March 10, 2025 (Mon)');

      expect(Dates.format(date, String.raw`l \t\h\e \jS`))
        .toBe('Monday the jS');
    });

    test('escaping tokens with backslash', () => {
      expect(Dates.format(date, '\\Y \\m \\d')).toBe('Y m d');

      expect(Dates.format(date, String.raw`\H\H:i`))
        .toBe('HH:05');
    });

    test('midnight edge case', () => {
      const midnight = new Date('2025-03-10T00:00:00Z');

      expect(Dates.format(midnight, 'H')).toBe('00');
      expect(Dates.format(midnight, 'G')).toBe('0');
      expect(Dates.format(midnight, 'h')).toBe('12');
      expect(Dates.format(midnight, 'g')).toBe('12');
      expect(Dates.format(midnight, 'A')).toBe('AM');
    });

    test('noon edge case', () => {
      const noon = new Date('2025-03-10T12:00:00Z');

      expect(Dates.format(noon, 'H')).toBe('12');
      expect(Dates.format(noon, 'G')).toBe('12');
      expect(Dates.format(noon, 'h')).toBe('12');
      expect(Dates.format(noon, 'g')).toBe('12');
      expect(Dates.format(noon, 'A')).toBe('PM');
    });

    test('mixed random pattern', () => {
      expect(Dates.format(date, 'Y/M/d @ g:i A'))
        .toBe('2025/Mar/10 @ 2:05 PM');
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
});
