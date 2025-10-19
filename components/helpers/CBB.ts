
import { getStore } from '@/app/StoreProvider';
import Organization from './Organization';
import Division from './Division';

class CBB {
  /**
   * Return the current default season
   * @return {number}
   */
  public static getCurrentSeason(): number {
    return 2026;
  }

  /**
   * Get the number of D1 teams
   * todo deprecate, use the one in Organization
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
}

export default CBB;
