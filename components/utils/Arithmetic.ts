
class Arithmetic {
  public static clamp(number: number, min: number, max: number): number {
    return Math.max(min, Math.min(number, max));
  }
}

export default Arithmetic;
