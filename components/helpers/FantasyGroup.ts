/* eslint-disable no-restricted-syntax */

import { FantasyDraftOrders, FantasyEntrys, FantasyGroup as FantasyGroupType } from '@/types/general';


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

  getDraftOrder(
    {
      fantasy_entrys,
      fantasy_draft_orders,
    }:
    {
      fantasy_entrys?: FantasyEntrys;
      fantasy_draft_orders?: FantasyDraftOrders;
    },
  ) {
    if (!fantasy_draft_orders && !fantasy_entrys) {
      return [];
    }

    const fantasy_group = this.getFantasyGroup();

    // if we already created the draft order, just sort the rows and return it
    if (fantasy_draft_orders && Object.values(fantasy_draft_orders).length) {
      return Object.values(fantasy_draft_orders).sort((a, b) => {
        if (a.round > b.round) {
          return -1;
        }

        if (a.round < b.round) {
          return 1;
        }

        // same round
        if (a.pick > b.pick) {
          return -1;
        }

        if (b.pick < a.pick) {
          return 1;
        }

        return 0;
      });
    }

    // the draft order is not finalized yet, return a preview
    if (fantasy_entrys && Object.values(fantasy_entrys).length) {
      const preview_draft_order: {
        fantasy_group_id: string;
        fantasy_entry_id: string;
        pick: number;
        round: number;
      }[] = [];
      const sorted_entries = Object.values(fantasy_entrys).sort((a, b) => {
        return a.date_of_entry > b.date_of_entry ? 1 : -1;
      });

      const rounds = 8;
      let pick = 1;

      for (let round = 1; round <= rounds; round++) {
        // Create a copy of the entries to manipulate for this round
        const round_entries = [...sorted_entries];

        // if it is snake and If it's an even round (2, 4, 6, 8), reverse the order
        if (
          fantasy_group.draft_type_terminology_id === '443459f0-eefe-11f0-a514-529c3ffdbb93' &&
          round % 2 === 0
        ) {
          round_entries.reverse();
        }

        // Create a draft order row for each entry in this round
        for (const fantasy_entry of round_entries) {
          preview_draft_order.push({
            fantasy_group_id: fantasy_group.fantasy_group_id,
            fantasy_entry_id: fantasy_entry.fantasy_entry_id,
            pick,
            round,
          });
          pick++;
        }
      }

      return preview_draft_order;
    }
    return [];
  }
}

export default FantasyGroup;
