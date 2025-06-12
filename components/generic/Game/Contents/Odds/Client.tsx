'use client';

import { Typography, Skeleton } from '@mui/material';

import HelperGame from '@/components/helpers/Game';
import { getNavHeaderHeight, getSubNavHeaderHeight } from '@/components/generic/Game//NavBar';
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


const Client = ({ game, oddsStats }) => {
  const Game = new HelperGame({
    game,
  });

  console.log(game)
  console.log(oddsStats)

  let awayUnderdog = false;
  let homeUnderdog = false;

  if (game.odds && game.odds.pre) {
    awayUnderdog = game.odds.pre.money_line_away > 0;
    homeUnderdog = game.odds.pre.money_line_home > 0;
  }


  let awayOddsText: string | null = null;
  if (oddsStats && oddsStats[game.away_team_id]) {
    const awayOS = oddsStats[game.away_team_id];
    awayOddsText = `${Game.getTeamName('away')} is ${awayUnderdog ? `${awayOS.underdog_wins}/${awayOS.underdog_games}, ${(((awayOS.underdog_wins / awayOS.underdog_games) || 0) * 100).toFixed(0)}% as the underdog this season.` : `${awayOS.favored_wins}/${awayOS.favored_games}, ${(((awayOS.favored_wins / awayOS.favored_games) || 0) * 100).toFixed(0)}% when favored this season.`}`;
  }

  let homeOddsText: string | null = null;
  if (oddsStats && oddsStats[game.home_team_id]) {
    const homeOS = oddsStats[game.home_team_id];
    homeOddsText = `${Game.getTeamName('home')} is ${homeUnderdog ? `${homeOS.underdog_wins}/${homeOS.underdog_games}, ${(((homeOS.underdog_wins / homeOS.underdog_games) || 0) * 100).toFixed(0)}% as the underdog this season.` : `${homeOS.favored_wins}/${homeOS.favored_games}, ${(((homeOS.favored_wins / homeOS.favored_games) || 0) * 100).toFixed(0)}% when favored this season.`}`;
  }

  return (
    <Contents>
      <Typography variant = 'body1'>Odds trends</Typography>
      <div>
        <Typography variant = 'body2'>{oddsStats === null ? <Skeleton /> : (awayOddsText || 'Missing data')}</Typography>
        <Typography variant = 'body2'>{oddsStats === null ? <Skeleton /> : (homeOddsText || 'Missing data')}</Typography>
      </div>
      <div>todo show the average ML, spread, O/U, could also show each game</div>
      <>{JSON.stringify(oddsStats)}</>
    </Contents>
  );
};

export { Client, ClientSkeleton };
