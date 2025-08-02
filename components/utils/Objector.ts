/**
 * Class to manipulate objects
 */
class Objector {
  // constructor() {
  // }

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
    // Add other types like Map, Set, etc.
    if (obj instanceof Map) {
      const clonedMap = new Map();
      memo.set(obj, clonedMap);
      obj.forEach((value, key) => clonedMap.set(key, Objector.deepClone(value, memo)));
      return clonedMap as unknown as T;
    }

    // Handle arrays
    if (Array.isArray(obj)) {
      const clonedArray = obj.map((item) => Objector.deepClone(item)) as unknown as T;
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

    return clonedObj;
  }
}

export default Objector;
