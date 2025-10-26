import { getStore } from '@/app/StoreProvider';
import { Organizations } from '@/types/general';
import { DEFAULT_CBB_ID, DEFAULT_CFB_ID, DEFAULT_ORGANIZATION_ID } from './Defaults';


/**
 * This class helps simplify the organization logic
 */
class Organization {
  /**
   * Get the organization ID for CFB
   * Hardcoded for now... should probably grab from dictionary instead, but I dont think these will change :D
   */
  public static getCFBID(): string {
    return DEFAULT_CFB_ID;
  }

  /**
   * Get the organization ID for CBB
   * Hardcoded for now... should probably grab from dictionary instead, but I dont think these will change :D
   */
  public static getCBBID(): string {
    return DEFAULT_CBB_ID;
  }

  public static getDefault(): string {
    return DEFAULT_ORGANIZATION_ID;
  }

  /**
   * Is the current organization college football?
   * Becareful using this, if you conditonally use it, the hooks between renders will be off and error out react
   */
  public static isCFB(): boolean {
    const store = getStore();
    return (store.getState().organizationReducer.organization_id === this.getCFBID());
  }

  /**
   * Is the current organization college basketball?
   */
  public static isCBB(): boolean {
    const store = getStore();
    return (store.getState().organizationReducer.organization_id === this.getCBBID());
  }

  public static getPath({ organizations, organization_id }: { organizations: Organizations, organization_id: string}): string {
    if (!organizations) {
      return '';
    }
    if (!organization_id) {
      throw new Error('organization_id required');
    }

    if (!(organization_id in organizations)) {
      throw new Error('organization_id not in organizations');
    }

    let path = organizations[organization_id].code.toLowerCase();
    if (organizations[organization_id].code === 'NCAAM') {
      path = 'cbb';
    }

    return path;
  }

  public static getNumberOfTeams({ organization_id, division_id, season }: { organization_id: string, division_id: string, season: string | number}): number {
    const store = getStore();
    const { organization_id_x_division_id_x_season_x_count } = store.getState().dictionaryReducer;

    if (
      organization_id in organization_id_x_division_id_x_season_x_count &&
      division_id in organization_id_x_division_id_x_season_x_count[organization_id] &&
      season in organization_id_x_division_id_x_season_x_count[organization_id][division_id]
    ) {
      return organization_id_x_division_id_x_season_x_count[organization_id][division_id][season];
    }

    return 1;
  }

  /**
   * Get the number of conferences in a specific division and season
   */
  public static getNumberOfConferences({ organization_id, division_id, season }: { organization_id: string, division_id: string, season: string | number}): number {
    const store = getStore();
    const { organization_id_x_division_id_x_season_x_conference_id_x_true } = store.getState().dictionaryReducer;

    if (
      organization_id in organization_id_x_division_id_x_season_x_conference_id_x_true &&
      division_id in organization_id_x_division_id_x_season_x_conference_id_x_true[organization_id] &&
      season in organization_id_x_division_id_x_season_x_conference_id_x_true[organization_id][division_id]
    ) {
      return Object.keys(organization_id_x_division_id_x_season_x_conference_id_x_true[organization_id][division_id][season]).length;
    }

    return 1;
  }
}

export default Organization;
