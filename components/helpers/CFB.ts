

import { DEFAULT_CFB_SEASON } from './Defaults';

/**
 * This class helps simplify the CFB logic
 */
class CFB {
  /**
   * Get the current default season
   */
  public static getCurrentSeason(): number {
    return DEFAULT_CFB_SEASON;
  }
}

export default CFB;
