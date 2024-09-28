import Division from './Division';


/**
 * This class helps simplify the CFB logic
 */
class CFB {
  /**
   * Get the current default season
   */
  public static getCurrentSeason(): number {
    return 2024;
  }

  /**
   * TODO front load this or something, so I dont need to hardcode
   */
  public static getNumberOfTeams({ division_id, season }: { division_id: string, season: string | number}): number {
    if (Division.getFBS() === division_id) {
      if (+season === 2024 || +season === 2025) {
        return 133;
      }
    }

    if (Division.getFCS() === division_id) {
      if (+season === 2024) {
        return 128;
      }

      if (+season === 2025) {
        return 118;
      }
    }

    return 1;
  }

  /**
   * TODO front load this or something, so I dont need to hardcode
   */
  public static getNumberOfConferences({ division_id, season }: { division_id: string, season: string | number}): number {
    if (Division.getFBS() === division_id) {
      if (+season === 2024 || +season === 2025) {
        return 10;
      }
    }

    if (Division.getFCS() === division_id) {
      // todo 2025 is 13? ivy not in fcs?
      if (+season === 2024 || +season === 2025) {
        return 14;
      }
    }

    return 1;
  }
}

export default CFB;
