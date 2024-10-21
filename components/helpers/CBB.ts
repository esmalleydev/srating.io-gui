

class CBB {
  /**
   * Return the current default season
   * @return {number}
   */
  public static getCurrentSeason() {
    return 2025;
  }

  /**
   * Instead of wasting time with a query and local storage etc
   * Just hardcode this...
   * Only do the first few seasons people will actually look at
   * @todo When I have more time, add it to the site load and store in localStorage
   * @param {number} season
   * @return {number}
   */
  public static getNumberOfD1Teams(season: number): number {
    if (+season === 2025) {
      return 364;
    }
    if (+season === 2024) {
      return 362;
    }
    if (+season === 2023) {
      return 363;
    }
    if (+season === 2022) {
      return 359;
    }

    return 363;
  }
}

export default CBB;
