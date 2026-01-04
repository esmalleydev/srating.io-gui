
import { FantasyGroup as FantasyGroupType } from '@/types/general';


/**
 * This class helps simplify the FantasyGroup logic
 */
class FantasyGroup {
  constructor({ fantasy_group }) {
    this.fantasy_group = fantasy_group;
  }

  private fantasy_group: FantasyGroupType;

  getFantasyGroup() {
    return this.fantasy_group;
  }

  /**
   * Is this fantasy group a draft?
   */
  isDraft(): boolean {
    if (
      this.getFantasyGroup() &&
      this.getFantasyGroup().fantasy_group_type_terminology_id === '7ca1ccce-e033-11f0-bc34-529c3ffdbb93'
    ) {
      return true;
    }

    return false;
  }

  /**
   * Is this fantasy group a bracket?
   */
  isNCAABracket(): boolean {
    if (
      this.getFantasyGroup() &&
      this.getFantasyGroup().fantasy_group_type_terminology_id === '3e72a9f3-e034-11f0-bc34-529c3ffdbb93'
    ) {
      return true;
    }

    return false;
  }
}

export default FantasyGroup;
