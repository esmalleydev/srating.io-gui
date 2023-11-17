
import moment from 'moment';
import Team from './Team';



class CBB {
  constructor(args) {
    this.cbb_game = (args && args.cbb_game) || null;
    this.team = (args && args.team) || null;
  };

  /**
   * Return the current default season
   * @return {number}
   */
  getCurrentSeason() {
    return 2024;
  };

  /**
   * Instead of wasting time with a query and local storage etc
   * Just hardcode this...
   * Only do the first few seasons people will actually look at
   * @todo When I have more time, add it to the site load and store in localStorage
   * @param {number|string} season
   * @return {number}
   */
  getNumberOfD1Teams(season) {
    if (+season === 2024) {
      return 362;
    } else if (+season === 2023) {
      return 363;
    } else if (+season === 2022) {
      return 359;
    }

    return 363;
  };


  /**
   * Return the number to display next to a team
   * Ex: 1 Purdue
   * @param  {string} side            home or away
   * @param  {string} rankDisplay     the column to display
   * @return {?number}
   */
  getTeamRank(side, rankDisplay) {
    if (
      rankDisplay &&
      this.cbb_game &&
      this.cbb_game[side + '_team_id'] &&
      this.cbb_game.teams &&
      this.cbb_game[side + '_team_id'] in this.cbb_game.teams &&
      this.cbb_game.teams[this.cbb_game[side + '_team_id']].ranking &&
      this.cbb_game.teams[this.cbb_game[side + '_team_id']].ranking[rankDisplay]
    ) {
      return this.cbb_game.teams[this.cbb_game[side + '_team_id']].ranking[rankDisplay];
    }
    return null;
  };

  /**
   * Get the team name
   * @param  {string} side home or away
   * @return {string}
   */
  getTeamName(side) {
    let name = 'Unknown';
    if (
      this.cbb_game &&
      this.cbb_game[side + '_team_id'] &&
      this.cbb_game.teams &&
      this.cbb_game[side + '_team_id'] in this.cbb_game.teams
    ) {
      const team = this.cbb_game.teams[this.cbb_game[side + '_team_id']];
      name = new Team({'team': team}).getName();
    }

    return name;
  }

  /**
   * Get the team short
   * @param  {string} side home or away
   * @return {string}
   */
  getTeamNameShort(side) {
    let name = 'UNK';
    if (
      this.cbb_game &&
      this.cbb_game[side + '_team_id'] &&
      this.cbb_game.teams &&
      this.cbb_game[side + '_team_id'] in this.cbb_game.teams
    ) {
      const team = this.cbb_game.teams[this.cbb_game[side + '_team_id']];
      name = new Team({'team': team}).getNameShort();
    }

    return name;
  }

  /**
   * Get the teams conference name
   * @param {string} side 
   * @return {string}
   */
  getTeamConference(side) {
    let name = 'Unknown';
    if (
      this.cbb_game &&
      this.cbb_game[side + '_team_id'] &&
      this.cbb_game.teams &&
      this.cbb_game[side + '_team_id'] in this.cbb_game.teams
    ) {
      const team = this.cbb_game.teams[this.cbb_game[side + '_team_id']];
      name = new Team({'team': team}).getConference();
    }

    return name;
  }

   /**
   * Get the teams short conference name
   * This doesnt really work with BIG TEN vs BIG EAST, ETC... probably need to curate the list myself
   * @param {string} side 
   * @return {string}
   */
  // getTeamConferenceShort(side) {
  //   let name = 'UNK';
  //   if (
  //     this.cbb_game &&
  //     this.cbb_game[side + '_team_id'] &&
  //     this.cbb_game.teams &&
  //     this.cbb_game[side + '_team_id'] in this.cbb_game.teams
  //   ) {
  //     const team = this.cbb_game.teams[this.cbb_game[side + '_team_id']];
  //     name = new Team({'team': team}).getConferenceShort();
  //   }

  //   return name;
  // }


  /**
   * Is the game in progress?
   * @return {boolean}
   */
  isInProgress() {
    return (this.cbb_game.status !== 'pre' && this.cbb_game.status !== 'final' && this.cbb_game.status !== 'postponed' && this.cbb_game.status !== 'cancelled');
  }

  /**
   * Is the game final?
   * @return {boolean}
   */
  isFinal() {
    return (this.cbb_game.status === 'final');
  }

  /**
   * Is the game played on a neutral court?
   * @return {boolean}
   */
  isNeutralSite() {
    return (+this.cbb_game.neutral_site === 1);
  }

  /**
   * Get the friendly formatted start date of the game
   * @return {string}
   */
  getStartDate() {
    return moment(this.cbb_game.start_date).format('MMM Do');
  };

  /**
   * Get the start time or status or time remaining in game
   * @return {string}
   */
  getTime() {
    let startTime = 'Unknown';
    if (this.isFinal()) {
      startTime = 'Final';
    } else if (this.isInProgress()) {
      startTime = this.getGameTime();
    } else if (this.cbb_game.status === 'pre') {
      startTime = this.getStartTime();
    } else if (this.cbb_game.status === 'postponed') {
      startTime = 'Postponed';
    } else if (this.cbb_game.status === 'cancelled') {
      startTime = 'Cancelled';
    }

    return startTime;
  };

  /**
   * Get the start time of a game
   * @return {string}
   */
  getStartTime() {
    let date = new Date(this.cbb_game.start_timestamp * 1000);
    let startTime = ((date.getHours() % 12) || 12) + (date.getMinutes() ? ':' + (date.getMinutes().toString().length === 1 ? '0' : '') + date.getMinutes() : '') + ' ' + (date.getHours() < 12 ? 'am' : 'pm') + ' ';
    if (date.getHours() >= 2 && date.getHours() <= 6) {
      startTime = 'TBA';
    }

    return startTime;
  };

  /**
   * Get the time remaining in game
   * @return {string}
   */
  getGameTime() {
    if (this.isInProgress() && !this.cbb_game.current_period) {
      return 'Half';
    }
    let formatted_period = this.cbb_game.current_period;
    if (formatted_period == '1ST HALF') {
      formatted_period = '1st';
    } else if (formatted_period == '2ND HALF') {
      formatted_period = '2nd'
    }

    if (
      this.cbb_game.clock === '00:00' &&
      formatted_period === '2nd' &&
      this.cbb_game.home_score !== this.cbb_game.away_score
    ) {
      return 'Finalizing game...';
    }

    return this.cbb_game.clock + ' ' + formatted_period;
  };

  /**
   * Get the network of the game
   * @return {string}
   */
  getNetwork() {
    if (this.cbb_game.network) {
      return this.cbb_game.network;
    }
    return null;
  };


  /**
   * Get the pre-game money line odds
   * @param  {string} side home or away
   * @return {string}
   */
  getPreML(side) {
    if (
      this.cbb_game.odds &&
      this.cbb_game.odds['pre_game_money_line_' + side]
    ) {
      return this.cbb_game.odds['pre_game_money_line_' + side];
    }

    return '-';
  };

  /**
   * Get the pre-game spread odds
   * @param  {string} side home or away
   * @return {string}
   */
  getPreSpread(side) {
    if (
      this.cbb_game.odds &&
      this.cbb_game.odds['pre_game_spread_' + side]
    ) {
      return this.cbb_game.odds['pre_game_spread_' + side];
    }

    return '-';
  };

  /**
   * Get the pre-game over odds
   * @return {string}
   */
  getPreOver() {
    if (
      this.cbb_game.odds &&
      this.cbb_game.odds.pre_game_over
    ) {
      return this.cbb_game.odds.pre_game_over;
    }

    return '-';
  };

  /**
   * Get the pre-game under odds
   * @return {string}
   */
  getPreUnder() {
    if (
      this.cbb_game.odds &&
      this.cbb_game.odds.pre_game_under
    ) {
      return this.cbb_game.odds.pre_game_under;
    }

    return '-';
  };

  /**
   * Get the live money line odds
   * @param  {string} side home or away
   * @return {string}
   */
  getLiveML(side) {
    if (
      this.isInProgress() &&
      this.cbb_game.odds &&
      this.cbb_game.odds['live_game_money_line_' + side] &&
      this.cbb_game.odds['live_game_money_line_' + side] > -9000
    ) {
      return this.cbb_game.odds['live_game_money_line_' + side];
    }

    return '-';
  };

  /**
   * Get the live spread odds
   * @param  {string} side home or away
   * @return {string}
   */
  getLiveSpread(side) {
    if (
      this.isInProgress() &&
      this.cbb_game.odds &&
      this.cbb_game.odds['live_game_spread_' + side]
    ) {
      return this.cbb_game.odds['live_game_spread_' + side];
    }

    return '-';
  };

  /**
   * Get the live over odds
   * @return {string}
   */
  getLiveOver() {
    if (
      this.isInProgress() &&
      this.cbb_game.odds &&
      this.cbb_game.odds.live_game_over
    ) {
      return this.cbb_game.odds.live_game_over;
    }

    return '-';
  };

  /**
   * Get the live under odds
   * @return {string}
   */
  getLiveUnder(side) {
    if (
      this.isInProgress() &&
      this.cbb_game.odds &&
      this.cbb_game.odds.live_game_under
    ) {
      return this.cbb_game.odds.live_game_under;
    }

    return '-';
  };

  won(side) {
    const otherSide = (side === 'away' ? 'home' : 'away');
    if (
      this.isFinal() &&
      this.cbb_game[side + '_score'] > this.cbb_game[otherSide + '_score']
    ) {
      return true;
    }

    return false;
  };

  coveredSpread(side) {
    const otherSide = (side === 'away' ? 'home' : 'away');
    const spread = this.getPreSpread(side);
    if (
      this.isFinal() &&
      (this.cbb_game[side + '_score'] - this.cbb_game[otherSide + '_score']) > (spread * -1)
    ) {
      return true;
    }

    return false;
  };

  coveredOver() {
    const over = this.getPreOver();
    if (
      this.isFinal() &&
      (this.cbb_game.home_score + this.cbb_game.away_score) > over
    ) {
      return true;
    }

    return false;
  };

  coveredUnder() {
    const under = this.getPreUnder();
    if (
      this.isFinal() &&
      (this.cbb_game.home_score + this.cbb_game.away_score) < under
    ) {
      return true;
    }

    return false;
  };

  /**
   * Have the odds reversed since pre-game?
   * @param  {string} side home or away
   * @return {boolean}
   */
  oddsReversal(side) {
    let pre = 0;
    let live = 0;
    if (
      this.cbb_game.odds &&
      (pre = +this.cbb_game.odds['pre_game_money_line_' + side]) &&
      this.isInProgress() &&
      this.cbb_game.odds &&
      (live = +this.cbb_game.odds['live_game_money_line_' + side]) &&
      (pre < 0 && live > 0 && live > 100) 
    ) {
      return true;
    }

    return false;
  }

};

export default CBB;
