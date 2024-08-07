'use client';

import React from 'react';
import { Typography, Skeleton } from '@mui/material';

import HelperCBB from '@/components/helpers/CBB';
import { getNavHeaderHeight } from '../NavBar';
import { getSubNavHeaderHeight } from '../SubNavBar';
import { footerNavigationHeight } from '@/components/generic/FooterNavigation';
import { headerBarHeight } from '@/components/generic/Header';
import { LinearProgress } from '@mui/material';

/**
 * The main wrapper div for all the contents
 */
const Contents = ({ children }): React.JSX.Element => {
  return (
    <div style = {{ padding: '0px 10px' }}>
      {children}
    </div>
  );
};


const ClientSkeleton = () => {
  const paddingTop = getNavHeaderHeight() + getSubNavHeaderHeight();

  const heightToRemove = paddingTop + footerNavigationHeight + headerBarHeight + 120;
  return (
    <Contents>
      <div style = {{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: `calc(100vh - ${heightToRemove}px)`,
      }}>
        <LinearProgress color = 'secondary' style={{ width: '50%' }} />
      </div>
    </Contents>
  );
};


const Client = ({ cbb_game, oddsStats }) => {
  const CBB = new HelperCBB({
    cbb_game,
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
    awayOddsText = `${CBB.getTeamName('away')} is ${awayUnderdog ? `${awayOS.underdog_wins}/${awayOS.underdog_games}, ${(((awayOS.underdog_wins / awayOS.underdog_games) || 0) * 100).toFixed(0)}% as the underdog this season.` : `${awayOS.favored_wins}/${awayOS.favored_games}, ${(((awayOS.favored_wins / awayOS.favored_games) || 0) * 100).toFixed(0)}% when favored this season.`}`;
  }

  let homeOddsText: string | null = null;
  if (oddsStats && oddsStats[cbb_game.home_team_id]) {
    const homeOS = oddsStats[cbb_game.home_team_id];
    homeOddsText = `${CBB.getTeamName('home')} is ${homeUnderdog ? `${homeOS.underdog_wins}/${homeOS.underdog_games}, ${(((homeOS.underdog_wins / homeOS.underdog_games) || 0) * 100).toFixed(0)}% as the underdog this season.` : `${homeOS.favored_wins}/${homeOS.favored_games}, ${(((homeOS.favored_wins / homeOS.favored_games) || 0) * 100).toFixed(0)}% when favored this season.`}`;
  }

  return (
    <Contents>
      <Typography variant = 'body1'>Odds trends</Typography>
      <div>
        <Typography variant = 'body2'>{oddsStats === null ? <Skeleton /> : (awayOddsText || 'Missing data')}</Typography>
        <Typography variant = 'body2'>{oddsStats === null ? <Skeleton /> : (homeOddsText || 'Missing data')}</Typography>
      </div>
    </Contents>
  );
};

export { Client, ClientSkeleton };
