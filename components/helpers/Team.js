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

  // todo this all needs cleaned and normalized and fixed
  getLastRanking() {
    let last = null;
    if (
      this.team &&
      this.team.ranking
    ) {
      last = this.team.ranking;
    } else if (
      this.team &&
      this.team.rankings
    ) {
      last = this.team.rankings;
    } else if (
      this.team &&
      this.team.stats
    ) {
      last = this.team.stats;
    }
    return last;
  };

  getRank(opt_rankDisplay) {
    let rankDisplay = opt_rankDisplay || 'rank';

    // legacy
    if (rankDisplay === 'composite_rank') {
      rankDisplay = 'rank';
    }

    const lastRanking = this.getLastRanking();

    if (
      lastRanking &&
      lastRanking[rankDisplay]
    ) {
      return lastRanking[rankDisplay];
    }
    return null;
  };

};

export default Team;
