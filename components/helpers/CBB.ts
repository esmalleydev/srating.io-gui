
import { getStore } from '@/app/StoreProvider';
import Organization from './Organization';
import Division from './Division';

class CBB {
  /**
   * Return the current default season
   * @return {number}
   */
  public static getCurrentSeason(): number {
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
    const store = getStore();
    const { organization_id_x_division_id_x_season_x_count } = store.getState().dictionaryReducer;

    if (
      Organization.getCBBID() in organization_id_x_division_id_x_season_x_count &&
      Division.getD1() in organization_id_x_division_id_x_season_x_count[Organization.getCBBID()] &&
      season in organization_id_x_division_id_x_season_x_count[Organization.getCBBID()][Division.getD1()]
    ) {
      return organization_id_x_division_id_x_season_x_count[Organization.getCBBID()][Division.getD1()][season];
    }

    return 1;
  }

  /**
   * todo do no hardcode this
   * @param season
   * @returns {number}
   */
  public static getNumberOfD1Players(season: number): number {
    if (+season === 2025) {
      return 5919;
    }

    return 6000;
  }
}

export default CBB;
