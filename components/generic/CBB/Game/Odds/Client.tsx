'use client';
import React from 'react';
import { Typography, Skeleton } from '@mui/material';

import HelperCBB from '@/components/helpers/CBB';



const Client = ({cbb_game, oddsStats}) => {

  const CBB = new HelperCBB({
    'cbb_game': cbb_game,
  });

  let awayUnderdog = false;
  let homeUnderdog = false;

  if (cbb_game.odds) {
    awayUnderdog = cbb_game.odds.pre_game_money_line_away > 0;
    homeUnderdog = cbb_game.odds.pre_game_money_line_home > 0;
  }


  let awayOddsText: string | null = null;
  if (oddsStats && oddsStats[cbb_game.away_team_id]) {
    const awayOS = oddsStats[cbb_game.away_team_id];
    awayOddsText = CBB.getTeamName('away') + ' is ' + (awayUnderdog ? awayOS.underdog_wins + '/' + awayOS.underdog_games + ', ' + (((awayOS.underdog_wins / awayOS.underdog_games) || 0) * 100).toFixed(0) + '% as the underdog this season.' : awayOS.favored_wins + '/' + awayOS.favored_games + ', ' + (((awayOS.favored_wins / awayOS.favored_games) || 0) * 100).toFixed(0) + '% when favored this season.');
  }

  let homeOddsText: string | null = null;
  if (oddsStats && oddsStats[cbb_game.home_team_id]) {
    const homeOS = oddsStats[cbb_game.home_team_id];
    homeOddsText = CBB.getTeamName('home') + ' is ' + (homeUnderdog ? homeOS.underdog_wins + '/' + homeOS.underdog_games + ', ' + (((homeOS.underdog_wins / homeOS.underdog_games) || 0) * 100).toFixed(0) + '% as the underdog this season.' : homeOS.favored_wins + '/' + homeOS.favored_games + ', ' + (((homeOS.favored_wins / homeOS.favored_games) || 0) * 100).toFixed(0) + '% when favored this season.');
  }

  return (
    <div style = {{'padding': '0px 10px'}}>
      <Typography variant = 'body1'>Odds trends</Typography>
      <div>
        <Typography variant = 'body2'>{oddsStats === null ? <Skeleton /> : (awayOddsText ? awayOddsText : 'Missing data')}</Typography>
        <Typography variant = 'body2'>{oddsStats === null ? <Skeleton /> : (homeOddsText ? homeOddsText : 'Missing data')}</Typography>
      </div>
    </div>
  );
}

export default Client;
