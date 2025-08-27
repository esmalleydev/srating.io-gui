/* eslint-disable no-self-compare */
/* eslint-disable @typescript-eslint/no-explicit-any */

import Objector from '@/components/utils/Objector';


describe('Object.deepClone', () => {
  it('should not keep object references', () => {
    const baz = { foo: 2 };
    const source = { a: 1, b: baz };

    const assigned = Object.assign({}, source);

    const spread = { ...source };

    expect(source === source).toBe(true);
    expect(source === assigned).toBe(false);
    expect(source === spread).toBe(false);
    expect(source.b === assigned.b).toBe(true);
    expect(source.b === spread.b).toBe(true);
    expect(Objector.deepClone(source) !== source).toBe(true);
    expect(Objector.deepClone(source).b !== source.b).toBe(true);
    expect(Objector.deepClone(source).b === source.b).toBe(false);
  });

  it('should handle circular references without infinite loops', () => {
    const obj: any = {};
    obj.self = obj;
    const cloned = Objector.deepClone(obj);
    expect(cloned).not.toBe(obj);
    expect(cloned.self).toBe(cloned);
    expect(cloned.self).not.toBe(obj.self);
  });

  it('should clone an array of primitives', () => {
    const arr = [1, 'test', true, null];
    const clonedArr = Objector.deepClone(arr);
    expect(clonedArr).toEqual(arr);
    expect(clonedArr).not.toBe(arr);
  });

  it('should clone Date objects', () => {
    const date = new Date();
    const obj = { date };
    const cloned = Objector.deepClone(obj);
    expect(cloned.date).toEqual(date);
    expect(cloned.date).not.toBe(date);
  });

  it('should clone RegExp objects', () => {
    const regex = new RegExp('abc', 'gi');
    const obj = { regex };
    const cloned = Objector.deepClone(obj);
    expect(cloned.regex).toEqual(regex);
    expect(cloned.regex).not.toBe(regex);
  });

  it('should clone Map objects', () => {
    const map = new Map([['a', 1], ['b', { c: 2 }]]);
    const cloned = Objector.deepClone(map);
    expect(cloned).toEqual(map);
    expect(cloned).not.toBe(map);
    expect(cloned.get('b')).toEqual({ c: 2 });
    expect(cloned.get('b')).not.toBe(map.get('b'));
  });

  it('should clone Set objects', () => {
    const set = new Set([1, { a: 1 }]);
    const obj = { set };
    const cloned = Objector.deepClone(obj);
    expect(cloned.set).toEqual(set);
    expect(cloned.set).not.toBe(set);
    // Optional: check nested object
    const setArray = Array.from(set);
    const clonedSetArray = Array.from(cloned.set);
    expect(clonedSetArray[1]).not.toBe(setArray[1]);
  });

  it('should handle symbol properties', () => {
    const sym = Symbol('test');
    const obj = { [sym]: 'value' };
    const cloned = Objector.deepClone(obj);
    expect(cloned[sym]).toBe('value');
    expect(Object.getOwnPropertySymbols(cloned).length).toBe(1);
  });

  it('should not clone non-enumerable properties', () => {
    const obj = {};
    Object.defineProperty(obj, 'hidden', {
      value: 'secret',
      enumerable: false,
    });
    const cloned = Objector.deepClone(obj);
    expect(Object.keys(cloned).length).toBe(0);
    expect(cloned.hidden).toBeUndefined();
  });

  it('should return primitive types directly', () => {
    const num = 123;
    const str = 'test';
    const bool = true;
    expect(Objector.deepClone(num)).toBe(num);
    expect(Objector.deepClone(str)).toBe(str);
    expect(Objector.deepClone(bool)).toBe(bool);
  });

  it('should return null directly', () => {
    const result = Objector.deepClone(null);
    expect(result).toBeNull();
  });
});

describe('Objector.extender', () => {
  it('should throw if target is null or undefined', () => {
    expect(() => Objector.extender(null as any)).toThrow(TypeError);
    expect(() => Objector.extender(undefined as any)).toThrow(TypeError);
  });

  it('should copy enumerable own string properties with deep clone', () => {
    const target = { a: 1 };
    const source = { b: { nested: 2 } };
    const result = Objector.extender(target, source);

    expect(result).toHaveProperty('a', 1);
    expect(result).toHaveProperty('b');
    expect(result.b).toEqual({ nested: 2 });
    expect(result.b).not.toBe(source.b); // deep cloned, different reference
    expect(result).toBe(target); // mutated target returned
  });

  it('should copy enumerable own symbol properties with deep clone', () => {
    const sym = Symbol('foo');
    const target = {};
    const source = { [sym]: { nested: 'bar' } };
    const result = Objector.extender(target, source);

    expect(result[sym]).toEqual({ nested: 'bar' });
    expect(result[sym]).not.toBe(source[sym]); // deep cloned
  });

  it('should overwrite properties from earlier sources with later sources', () => {
    const target = { a: 1, b: 2 };
    const source1 = { b: 3 };
    const source2 = { a: 4 };

    const result = Objector.extender(target, source1, source2);
    expect(result.a).toBe(4);
    expect(result.b).toBe(3);
  });

  it('should ignore null and undefined sources', () => {
    const target = { a: 1 };
    const result = Objector.extender(target, null as any, undefined as any, { b: 2 });
    expect(result).toEqual({ a: 1, b: 2 });
  });

  it('should handle multiple sources', () => {
    const target = {};
    const source1 = { a: 1 };
    const source2 = { b: { nested: 2 } };
    const source3 = { c: 3 };

    const result = Objector.extender(target, source1, source2, source3);
    expect(result).toEqual({ a: 1, b: { nested: 2 }, c: 3 });
    expect(result.b).not.toBe(source2.b); // deep cloned
  });
});

