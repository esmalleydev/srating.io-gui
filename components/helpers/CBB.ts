

import { DEFAULT_CBB_SEASON } from './Defaults';

class CBB {
  /**
   * Return the current default season
   * @return {number}
   */
  public static getCurrentSeason(): number {
    return DEFAULT_CBB_SEASON;
  }
}

export default CBB;
