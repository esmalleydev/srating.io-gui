import { getStore } from '@/app/StoreProvider';
import { useAppSelector } from '@/redux/hooks';
import { Organizations } from '@/types/general';

// todo hook bugs, the useAppSelector cna only be called top level of a function, not inside another function etc >.>

/**
 * This class helps simplify the organization logic
 */
class Organization {
  /**
   * Get the organization ID for CFB
   * Hardcoded for now... should probably grab from dictionary instead, but I dont think these will change :D
   */
  public static getCFBID(): string {
    return 'f1dedce6-3b4c-11ef-94bc-2a93761010b8';
  }

  /**
   * Get the organization ID for CBB
   * Hardcoded for now... should probably grab from dictionary instead, but I dont think these will change :D
   */
  public static getCBBID(): string {
    return 'f1c37c98-3b4c-11ef-94bc-2a93761010b8';
  }

  public static getDefault(): string {
    return Organization.getCFBID();
  }

  /**
   * Is the current organization college football?
   * Becareful using this, if you conditonally use it, the hooks between renders will be off and error out react
   */
  public static isCFB(): boolean {
    const organization_id = useAppSelector((state) => state.organizationReducer.organization_id);
    return (organization_id === this.getCFBID());
  }

  /**
   * Is the current organization college basketball?
   * Becareful using this, if you conditonally use it, the hooks between renders will be off and error out react
   */
  public static isCBB(): boolean {
    const organization_id = useAppSelector((state) => state.organizationReducer.organization_id);
    return (organization_id === this.getCBBID());
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
}

export default Organization;
