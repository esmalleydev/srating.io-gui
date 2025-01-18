/**
 * Class to manipulate objects
 */
class Objector {
  // constructor() {
  // }

  public static deepClone<T>(obj: T): T {
    // Check if the input is null or not an object/array
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    // Handle arrays
    if (Array.isArray(obj)) {
      return obj.map((item) => Objector.deepClone(item)) as unknown as T;
    }

    // Handle objects
    const clonedObj = Object.create(Object.getPrototypeOf(obj));
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = Objector.deepClone(obj[key]);
      }
    }

    return clonedObj;
  }
}

export default Objector;
