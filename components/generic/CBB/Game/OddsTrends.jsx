import React, { useState } from 'react';

import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';

import HelperCBB from '../../../helpers/CBB';


import Api from './../../../Api.jsx';
const api = new Api();

const OddsTrends = (props) => {
  const self = this;

  const game = props.game;

  const [requestedOddsStats, setRequestedOddsStats] = useState(false);
  const [oddsStats, setOddsStats] = useState(null);

  const CBB = new HelperCBB({
    'cbb_game': game,
  });

  let awayUnderdog = false;
  let homeUnderdog = false;

  if (game.odds) {
    awayUnderdog = game.odds.pre_game_money_line_away > 0;
    homeUnderdog = game.odds.pre_game_money_line_home > 0;
  }



  if (!requestedOddsStats) {
    setRequestedOddsStats(true);
    api.Request({
      'class': 'cbb_game',
      'function': 'getOddsStats',
      'arguments': game.cbb_game_id,
    }).then((Stats) => {
      setOddsStats(Stats || {});
    }).catch((e) => {
      setOddsStats({});
    });
  }




  let awayOddsText = null;
  if (oddsStats && oddsStats[game.away_team_id]) {
    const awayOS = oddsStats[game.away_team_id];
    awayOddsText = CBB.getTeamName('away') + ' is ' + (awayUnderdog ? awayOS.underdog_wins + '/' + awayOS.underdog_games + ', ' + (((awayOS.underdog_wins / awayOS.underdog_games) || 0) * 100).toFixed(0) + '% as the underdog this season.' : awayOS.favored_wins + '/' + awayOS.favored_games + ', ' + (((awayOS.favored_wins / awayOS.favored_games) || 0) * 100).toFixed(0) + '% when favored this season.');
  }

  let homeOddsText = null;
  if (oddsStats && oddsStats[game.home_team_id]) {
    const homeOS = oddsStats[game.home_team_id];
    homeOddsText = CBB.getTeamName('home') + ' is ' + (homeUnderdog ? homeOS.underdog_wins + '/' + homeOS.underdog_games + ', ' + (((homeOS.underdog_wins / homeOS.underdog_games) || 0) * 100).toFixed(0) + '% as the underdog this season.' : homeOS.favored_wins + '/' + homeOS.favored_games + ', ' + (((homeOS.favored_wins / homeOS.favored_games) || 0) * 100).toFixed(0) + '% when favored this season.');
  }

  return (
    <div>

      <Typography variant = 'body1'>Odds trends</Typography>
      <div>
        <Typography variant = 'body2'>{oddsStats === null ? <Skeleton /> : (awayOddsText ? awayOddsText : 'Missing data')}</Typography>
        <Typography variant = 'body2'>{oddsStats === null ? <Skeleton /> : (homeOddsText ? homeOddsText : 'Missing data')}</Typography>
      </div>
    </div>
  );
}

export default OddsTrends;
