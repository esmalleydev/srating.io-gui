/* eslint-disable no-restricted-syntax */

type Merge<T, U> = Omit<T, keyof U> & U;

type MergeAll<T extends object[]> =
  T extends [infer First, ...infer Rest]
    ? First extends object
      ? Rest extends object[]
        ? Merge<First, MergeAll<Rest>>
        : First
      : unknown
    : unknown;

/**
 * Class to manipulate objects
 */
class Objector {
  // constructor() {
  // }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static deepClone<T>(obj: T, memo = new WeakMap<any, any>()): T {
    // Check if the input is null or not an object/array
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    // Check if the object is already in the memo
    if (memo.has(obj)) {
      return memo.get(obj);
    }

    // Handle built-in types
    if (obj instanceof Date) {
      return new Date(obj.getTime()) as unknown as T;
    }
    if (obj instanceof RegExp) {
      return new RegExp(obj.source, obj.flags) as unknown as T;
    }
    if (obj instanceof Map) {
      const clonedMap = new Map();
      memo.set(obj, clonedMap);
      obj.forEach((value, key) => clonedMap.set(key, Objector.deepClone(value, memo)));
      return clonedMap as unknown as T;
    }
    if (obj instanceof Set) {
      const newSet = new Set();
      for (const item of obj) {
        newSet.add(Objector.deepClone(item));
      }
      return newSet as unknown as T;
    }

    // Handle arrays
    if (Array.isArray(obj)) {
      const clonedArray = obj.map((item) => Objector.deepClone(item, memo)) as unknown as T;
      memo.set(obj, clonedArray);
      return clonedArray;
    }

    // Handle objects
    const clonedObj = Object.create(Object.getPrototypeOf(obj));
    memo.set(obj, clonedObj);

    // per Gemini
    /**
     * While it appears to be two steps, the first step (Object.keys()) is a native C++ function in the JavaScript engine.
     * It's highly optimized for this specific task and is often faster than the JIT compiler can make the for...in loop with its conditional checks.
     */
    Object.keys(obj).forEach((key) => {
      clonedObj[key] = Objector.deepClone(obj[key], memo);
    });
    /*
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        clonedObj[key] = Objector.deepClone(obj[key], memo);
      }
    }
    */

    // Symbol keys
    Object.getOwnPropertySymbols(obj).forEach((sym) => {
      if (Object.prototype.propertyIsEnumerable.call(obj, sym)) {
        clonedObj[sym] = Objector.deepClone(obj[sym], memo);
      }
    });

    return clonedObj;
  }

  /**
   * Deeply merges one or more source objects into a target object.
   *
   * - Each property from the sources is deep-cloned before being assigned.
   * - Existing properties in the target are overwritten by matching keys in later sources.
   * - Does not use spread or Object.assign.
   * - Mutates and returns the target object.
   *
   * @template T - The type of the target object.
   * @param {T} target - The object to extend.
   * @param {...U[]} sources - One or more source objects whose properties will be copied to the target.
   * @returns {T & U} The mutated target object containing all deep-cloned properties from the sources.
   *
   * @throws {TypeError} If the target is null or undefined.
   *
   * @example
   * const target = { a: 1 };
   * const source = { b: { nested: 2 } };
   * Objector.extender(target, source);
   * // target is now { a: 1, b: { nested: 2 } }
   */
  public static extender<T extends object, U extends object[]>(
    target: T,
    ...sources: U
  ): MergeAll<[T, ...U]> {
    if (target == null) {
      throw new TypeError('Cannot convert undefined or null to object');
    }

    const to = Object(target);

    // eslint-disable-next-line no-restricted-syntax
    for (const source of sources) {
      if (source != null) {
        // String keys
        // eslint-disable-next-line no-restricted-syntax
        for (const key of Object.keys(source)) {
          to[key] = Objector.deepClone(source[key]);
        }

        // Symbol keys
        const symbols = Object.getOwnPropertySymbols(source);
        // eslint-disable-next-line no-restricted-syntax
        for (const sym of symbols) {
          if (Object.prototype.propertyIsEnumerable.call(source, sym)) {
            to[sym] = Objector.deepClone(source[sym]);
          }
        }
      }
    }

    return to as MergeAll<[T, ...U]>;
  }
}

export default Objector;
