'use client';

import React from 'react';
import { useAppSelector } from '@/redux/hooks';
import HelperGame from '@/components/helpers/Game';
import { Skeleton } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import RankSpan from '@/components/generic/RankSpan';
import Organization from '@/components/helpers/Organization';
import { useTheme } from '@/components/hooks/useTheme';
import Paper from '@/components/ux/container/Paper';
import Typography from '@/components/ux/text/Typography';
import Dates from '@/components/utils/Dates';


const Differentials = ({ game, team_id }) => {
  const theme = useTheme();
  const isLoading = useAppSelector((state) => state.teamReducer.scheduleStatsLoading);
  const scheduleStats = useAppSelector((state) => state.teamReducer.scheduleStats);
  const numberOfTeams = Organization.getNumberOfTeams({ organization_id: game.organization_id, division_id: game.division_id, season: game.season });

  let compares: {
    label: string;
    code: string;
    type: string;
  }[] = [];

  if (game.organization_id === Organization.getCBBID()) {
    compares = [
      {
        label: 'Rank',
        code: 'rank',
        type: 'rank',
      },
      {
        label: 'SR',
        code: 'elo_rank',
        type: 'rank',
      },
      {
        label: 'aEM',
        code: 'adjusted_efficiency_rating',
        type: 'stat',
      },
      {
        label: 'ORT',
        code: 'offensive_rating',
        type: 'stat',
      },
      {
        label: 'DRT',
        code: 'defensive_rating',
        type: 'stat',
      },
      {
        label: 'aSoS',
        code: 'opponent_efficiency_rating',
        type: 'stat',
      },
    ];
  }

  if (game.organization_id === Organization.getCFBID()) {
    compares = [
      {
        label: 'Rank',
        code: 'rank',
        type: 'rank',
      },
      {
        label: 'SR',
        code: 'elo_rank',
        type: 'rank',
      },
      {
        label: 'QBR',
        code: 'passing_rating_college',
        type: 'stat',
      },
      {
        label: 'PTS',
        code: 'points',
        type: 'stat',
      },
      {
        label: 'YPP',
        code: 'yards_per_play',
        type: 'stat',
      },
    ];
  }

  const other_team_id = (game.home_team_id === team_id ? game.away_team_id : game.home_team_id);

  const data = (
    other_team_id &&
    scheduleStats &&
    game.game_id in scheduleStats &&
    scheduleStats[game.game_id]
  ) || null;

  const historical = data.historical[other_team_id] || {};
  const current = data.current[other_team_id] || {};

  const Game = new HelperGame({
    game,
  });

  const otherTeamName = Game.getTeamName((other_team_id === game.home_team_id ? 'home' : 'away'));

  if (!Game.isFinal()) {
    return null;
  }

  if (isLoading) {
    return (
      <Paper style = {{ height: 194 }}>
        <Skeleton style = {{ height: '100%', transform: 'initial' }} />
      </Paper>
    );
  }

  if (!data) {
    return null;
  }

  // if historical and current is the same, return null
  if (historical && current && historical.date_of_rank === current.date_of_rank) {
    return null;
  }

  const historicalDate = Dates.format(historical.date_of_rank || game.start_date, 'M jS');
  const currentDate = Dates.format(current.date_of_rank || game.start_date, 'M jS');

  const rows: React.JSX.Element[] = [];

  for (let i = 0; i < compares.length; i++) {
    const compare = compares[i];

    const historicalValue = historical[compare.code];
    const historicalRank = (compare.type === 'rank' ? historical[compare.code] : historical[`${compare.code}_rank`]);
    const currentValue = current[compare.code];
    const currentRank = (compare.type === 'rank' ? current[compare.code] : current[`${compare.code}_rank`]);


    const historicalDisplay: React.JSX.Element | string = historicalRank ? <RankSpan rank = {historicalRank} useOrdinal = {true} max = {numberOfTeams} /> : '-';

    const currentDisplay: React.JSX.Element | string = currentRank ? <RankSpan rank = {currentRank} useOrdinal = {true} max = {numberOfTeams} /> : '-';

    let arrowColor: 'info' | 'error' | 'success' = 'info';
    if (historicalRank < currentRank) {
      arrowColor = 'error';
    } else if (historicalRank > currentRank) {
      arrowColor = 'success';
    }

    rows.push(
      <tr key = {i} style = {{ textAlign: 'left' }}>
        <td style = {{ textAlign: 'left' }}><Typography type='caption' style = {{ color: theme.info.main }}>{compare.label}:</Typography></td>
        <td style = {{ paddingLeft: '10px' }}><Typography type='caption' style = {{ color: theme.text.secondary }}>{historicalDisplay}{compare.type !== 'rank' && historicalValue ? ` (${historicalValue})` : ''}</Typography></td>
        <td style = {{ padding: '0px 10px' }}><ArrowForwardIcon style = {{ fontSize: '14px' }} color = {arrowColor} /></td>
        <td><Typography type='caption' style = {{ color: theme.text.secondary }}>{currentDisplay}{compare.type !== 'rank' && currentValue ? ` (${currentValue})` : ''}</Typography></td>
      </tr>,
    );
  }

  return (
    <Paper elevation={2}>
      <div style = {{ padding: ' 5px 0px 5px 10px' }}>
        <Typography type='caption' style = {{ color: theme.text.secondary }}>{otherTeamName} {historicalDate} vs {currentDate}</Typography>
        <table>
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    </Paper>
  );
};

export default Differentials;
