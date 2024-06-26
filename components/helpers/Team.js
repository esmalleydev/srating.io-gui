import { useAppSelector } from "@/redux/hooks";

class Team {
  constructor(args) {
    this.team = args.team || {};
  };

  getName() {
    if (this.team.code) {
      return this.team.code;
    } else if (this.team.alt_name) {
      return this.team.alt_name;
    } else if (this.team.name) {
      return this.team.name;
    }

    return this.team.team_id || 'Unknown';
  };

  getNameShort() {
    let name = 'Unknown';

    if (this.team.char6) {
      name = this.team.char6;
    } else if (this.team.code) {
      name = this.team.code;
    } else if (this.team.alt_name) {
      name = this.team.alt_name;
    } else if (this.team.name) {
      name = this.team.name;
    }

    return name.toUpperCase().substring(0,3);
  };

  // todo this causes bugs by using the appselector
  getConference() {
    let name = 'Unknown';
    const conferences = useAppSelector(state => state.dictionaryReducer.conference);

    if (this.team.conference_id) {
      name = conferences[this.team.conference_id].code;
    }

    return name;
  };

  // This doesnt really work with BIG TEN vs BIG EAST, ETC... probably need to curate the list myself
  // getConferenceShort() {
  //   let name = 'UNK';

  //   if (this.team.conference) {
  //     name = this.team.conference;
  //   }

  //   return name.toUpperCase().substring(0,3);
  // };

  getLastRanking () {
    let last = null;
    if (
      this.team &&
      this.team.cbb_ranking
    ) {
      for (let cbb_ranking_id in this.team.cbb_ranking) {
        if (!last || last.date_of_rank < this.team.cbb_ranking[cbb_ranking_id].date_of_rank) {
          last = this.team.cbb_ranking[cbb_ranking_id];
        }
      }
    } else if (
      this.team &&
      this.team.ranking
    ) {
      last = this.team.ranking;
    } else if (
      this.team &&
      this.team.rankings
    ) {
      last = this.team.rankings;
    }
    return last;
  };

  getRank(opt_rankDisplay) {
    const rankDisplay = opt_rankDisplay || 'composite_rank';

    const cbb_ranking = this.getLastRanking();

    if (
      cbb_ranking &&
      cbb_ranking[rankDisplay]
    ) {
      return cbb_ranking[rankDisplay];
    }
    return null;
  };

};

export default Team;
