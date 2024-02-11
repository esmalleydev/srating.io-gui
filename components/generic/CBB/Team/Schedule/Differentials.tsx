'use client';
import React from 'react';
import { useAppSelector } from '@/redux/hooks';
import HelperCBB from '@/components/helpers/CBB';
import { Paper, Skeleton, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import RankSpan from '@/components/generic/CBB/RankSpan';
import moment from 'moment';


const Differentials = ({ cbb_game, team_id }) => {
  const isLoadingDifferentials = useAppSelector(state => state.teamReducer.scheduleDifferentialsLoading);
  const scheduleDifferentials = useAppSelector(state => state.teamReducer.scheduleDifferentials);

  const other_team_id = (cbb_game.home_team_id === team_id ? cbb_game.away_team_id : cbb_game.home_team_id);

  const data = (
    other_team_id &&
    scheduleDifferentials &&
    cbb_game.cbb_game_id in scheduleDifferentials &&
    scheduleDifferentials[cbb_game.cbb_game_id][other_team_id]
  ) || null;

  const CBB = new HelperCBB({
    'cbb_game': cbb_game,
  });

  const otherTeamName = CBB.getTeamName((other_team_id === cbb_game.home_team_id ? 'home' : 'away'));

  if (!CBB.isFinal()) {
    return null;
  }

  if (isLoadingDifferentials) {
    return (
      <Paper style = {{'height': 194}}>
        <Skeleton style = {{'height': '100%', 'transform': 'initial'}} />
      </Paper>
    );
  }

  if (!data) {
    return null;
  }

  // if historical and current is the same, return null
  if (data.historicalStats.date_of_rank === data.currentStats.date_of_rank) {
    return null;
  }

  const historicalDate = moment(data.historicalStats.date_of_rank || data.historicalRankings.date_of_rank).format('MMM Do');
  const currentDate = moment(data.currentStats.date_of_rank).format('MMM Do');

  const compares = [
    {
      'label': 'Rank',
      'code': 'composite_rank',
      'type': 'rank',
    },
    {
      'label': 'SR',
      'code': 'elo_rank',
      'type': 'rank',
    },
    {
      'label': 'aEM',
      'code': 'adjusted_efficiency_rating',
      'type': 'stat'
    },
    {
      'label': 'ORT',
      'code': 'offensive_rating',
      'type': 'stat'
    },
    {
      'label': 'DRT',
      'code': 'defensive_rating',
      'type': 'stat'
    },
    {
      'label': 'aSoS',
      'code': 'opponent_efficiency_rating',
      'type': 'stat'
    }
  ];

  const rows: React.JSX.Element[] = [];

  for (let i = 0; i < compares.length; i++) {
    const compare = compares[i];

    const historicalValue = (compare.type === 'rank' ? data.historicalRankings[compare.code] : data.historicalStats[compare.code]);
    const historicalRank = (compare.type === 'rank' ? data.historicalRankings[compare.code] : data.historicalStats[compare.code + '_rank']);
    const currentValue = (compare.type === 'rank' ? data.currentRankings[compare.code] : data.currentStats[compare.code]);
    const currentRank = (compare.type === 'rank' ? data.currentRankings[compare.code] : data.currentStats[compare.code + '_rank']);


    let historicalDisplay: React.JSX.Element | string = historicalRank ? <RankSpan rank = {historicalRank} useOrdinal = {true} max = {CBB.getNumberOfD1Teams(cbb_game.season)} /> : '-';

    let currentDisplay:  React.JSX.Element | string = currentRank ? <RankSpan rank = {currentRank} useOrdinal = {true} max = {CBB.getNumberOfD1Teams(cbb_game.season)} /> : '-';

    let arrowColor: 'info' | 'error' | 'success' = 'info';
    if (historicalRank < currentRank) {
      arrowColor = 'error';
    } else if (historicalRank > currentRank) {
      arrowColor = 'success';
    }

    rows.push(
      <tr key = {i} style = {{'textAlign': 'left'}}>
        <td style = {{'textAlign': 'left'}}><Typography variant='caption' color = {'text.secondary'}>{compare.label}</Typography></td>
        <td style = {{'paddingLeft': '10px'}}><Typography variant='caption' color = {'text.secondary'}>{historicalDisplay}{compare.type !== 'rank' && historicalValue ? ' (' + historicalValue + ')' : ''}</Typography></td>
        <td style = {{'padding': '0px 10px'}}><ArrowForwardIcon style = {{'fontSize': '14px'}} color = {arrowColor} /></td>
        <td><Typography variant='caption' color = {'text.secondary'}>{currentDisplay}{compare.type !== 'rank' && currentValue ? ' (' + currentValue + ')' : ''}</Typography></td>
      </tr>
    );
  }

  return (
    <Paper>
      <div style = {{'padding': ' 5px 0px 5px 10px'}}>
        <Typography variant='caption' color = {'text.secondary'}>{otherTeamName} {historicalDate} vs {currentDate}</Typography>
        <table>
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    </Paper>
  );
}

export default Differentials;
