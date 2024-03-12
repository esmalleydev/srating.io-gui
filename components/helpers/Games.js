import HelperCBB from './CBB';

class Games {
  constructor(args) {
    this.cbb_games = args.cbb_games || {};
  };

  /**
   * Get the current live games
   * @return {object}
   */
  getLiveGames() {
    const live_games = {};
    for (let cbb_game_id in this.cbb_games) {
      const cbb_game = this.cbb_games[cbb_game_id];

      const CBB = new HelperCBB({
        'cbb_game': cbb_game
      });

      if (CBB.isInProgress()) {
        live_games[cbb_game_id] = cbb_game;
      }
    }

    return live_games;
  };


  /**
   * Get top ranked (composite) teams playing
   * @return {object}
   */
  getTopRankedGames() {
    const top_games = {};

    for (let cbb_game_id in this.cbb_games) {
      const cbb_game = this.cbb_games[cbb_game_id];

      const CBB = new HelperCBB({
        'cbb_game': cbb_game
      });

      if (CBB.isFinal()) {
        continue;
      }

      const homeRank = CBB.getTeamRank('home', 'composite_rank');
      const awayRank = CBB.getTeamRank('away', 'composite_rank');

      if (
        (homeRank && homeRank <= 30) ||
        (awayRank && awayRank <= 30)
      ) {
        top_games[cbb_game_id] = cbb_game;
      }

    }

    return top_games;
  };


  /**
   * Get games that should be interesting
   * @return {object}
   */
  getThrillerGames() {
    const thriller_games = {};

    for (let cbb_game_id in this.cbb_games) {
      const cbb_game = this.cbb_games[cbb_game_id];

      const CBB = new HelperCBB({
        'cbb_game': cbb_game
      });

      if (CBB.isFinal()) {
        continue;
      }

      const homeRank = CBB.getTeamRank('home', 'composite_rank');
      const awayRank = CBB.getTeamRank('away', 'composite_rank');

      const difference = Math.abs(homeRank - awayRank);

      if (
        difference <= 30 &&
        (
          homeRank <= 60 ||
          awayRank <= 60
        )
      ) {
        thriller_games[cbb_game_id] = cbb_game;
      }

    }

    return thriller_games;
  };


  /**
   * Return games that are close in score
   * @return {object}
   */
  getCloseGames() {
    const live_games = this.getLiveGames();

    const closeGames = {};

    for (let cbb_game_id in live_games) {
      const cbb_game = live_games[cbb_game_id];

      const difference = Math.abs(cbb_game.home_score - cbb_game.away_score);

      if (
        difference <= 6 &&
        cbb_game.home_score > 14 &&
        cbb_game.away_score > 14
      ) {
        closeGames[cbb_game_id] = cbb_game
      }
    }

    return closeGames;
  };


  /**
   * Get live games where the team that "should not" be winning, is winning 
   * @return {object}
   */
  getUpsetAlerts() {
    const live_games = this.getLiveGames();

    const upsets = {};

    for (let cbb_game_id in live_games) {
      const cbb_game = live_games[cbb_game_id];

      // todo define what an upset is
      // todo we could use the CBB.oddsReversal(), but that may not be an upset
      // or maybe if the rank is just x % difference it is an upset
      // or paid feature, checks my predictions
    }

    return upsets;
  };



};

export default Games;
