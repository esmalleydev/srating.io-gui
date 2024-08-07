'use client';

import React from 'react';
import Typography from '@mui/material/Typography';
import { PlaybyPlay } from '@/types/cbb';
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
    <div style = {{ padding: 20 }}>
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

const Client = ({ cbb_game_pbp /* tag */ }) => {
  const rows: PlaybyPlay = cbb_game_pbp;

  const sortedPBP: PlaybyPlay[] = Object.values(rows).sort((a, b) => {
    return +a.order > +b.order ? -1 : 1;
  });

  return (
    <Contents>
      {
        sortedPBP.map((cbb_game_pbp) => {
          return (
            <div key = {cbb_game_pbp.cbb_game_pbp_id} style = {{ margin: '5px 10px' }}>
              <Typography variant = 'subtitle1'>{cbb_game_pbp.current_period}H {cbb_game_pbp.away_score}-{cbb_game_pbp.home_score} {cbb_game_pbp.clock}</Typography>
              <Typography variant = 'body1'>{cbb_game_pbp.description}</Typography>
            </div>
          );
        })
      }
      {rows !== null && sortedPBP.length === 0 ? <Typography style = {{ textAlign: 'center', margin: '10px 0px' }} variant = 'h5'>No play by play data yet...</Typography> : ''}
    </Contents>
  );
};

export { Client, ClientSkeleton };
