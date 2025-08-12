
import { getStore } from '@/app/StoreProvider';
import Organization from './Organization';


/**
 * This class helps simplify the CFB logic
 */
class CFB {
  /**
   * Get the current default season
   */
  public static getCurrentSeason(): number {
    return 2026;
  }

  /**
   * Get the number of teams for a division in a season
   */
  public static getNumberOfTeams({ division_id, season }: { division_id: string, season: string | number}): number {
    const store = getStore();
    const { organization_id_x_division_id_x_season_x_count } = store.getState().dictionaryReducer;

    if (
      Organization.getCFBID() in organization_id_x_division_id_x_season_x_count &&
      division_id in organization_id_x_division_id_x_season_x_count[Organization.getCFBID()] &&
      season in organization_id_x_division_id_x_season_x_count[Organization.getCFBID()][division_id]
    ) {
      return organization_id_x_division_id_x_season_x_count[Organization.getCFBID()][division_id][season];
    }

    return 1;
  }

  /**
   * TODO front load this or something, so I dont need to hardcode
   */
  public static getNumberOfConferences({ division_id, season }: { division_id: string, season: string | number}): number {
    const store = getStore();
    const { organization_id_x_division_id_x_season_x_conference_id_x_true } = store.getState().dictionaryReducer;

    if (
      Organization.getCFBID() in organization_id_x_division_id_x_season_x_conference_id_x_true &&
      division_id in organization_id_x_division_id_x_season_x_conference_id_x_true[Organization.getCFBID()] &&
      season in organization_id_x_division_id_x_season_x_conference_id_x_true[Organization.getCFBID()][division_id]
    ) {
      return Object.keys(organization_id_x_division_id_x_season_x_conference_id_x_true[Organization.getCFBID()][division_id][season]).length;
    }

    return 1;
  }
}

export default CFB;
