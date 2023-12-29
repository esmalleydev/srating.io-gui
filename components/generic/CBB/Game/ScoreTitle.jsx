'use client';
import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useWindowDimensions, Dimensions } from '@/components/hooks/useWindowDimensions';

import Typography from '@mui/material/Typography';

import HelperCBB from '../../../helpers/CBB';
import BackdropLoader from '../../BackdropLoader';
import { Link } from '@mui/material';
import { useAppSelector } from '@/redux/hooks';

const ScoreTitle = (props) => {
  const self = this;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { height, width } = useWindowDimensions();

  const displaySlice = useAppSelector(state => state.displayReducer.value);

  const [spin, setSpin] = useState(false);

  const game = props.game;

  let awayTeamRecord = '';
  let homeTeamRecord = '';

  if (
    game.stats &&
    game.stats[game.away_team_id]
  ) {
    awayTeamRecord = ' (' + game.stats[game.away_team_id].wins + '-' + game.stats[game.away_team_id].losses + ')';
  }

  if (
    game.stats &&
    game.stats[game.home_team_id]
  ) {
    homeTeamRecord = ' (' + game.stats[game.home_team_id].wins + '-' + game.stats[game.home_team_id].losses + ')';
  }

  const CBB = new HelperCBB({
    'cbb_game': game,
  });

  const handleClick = (team_id) => {
    setSpin(true);
    startTransition(() => {
      router.push('/cbb/team/' + team_id + '?season=' + game.season);
      setSpin(false);
    });
  }


  const titleStyle = {
    'display': 'flex',
    'justifyContent': 'space-between',
  };


  return (
    <div>
      <BackdropLoader open = {(spin === true)} />
      <div style = {{'marginBottom': 10}}><Typography variant = 'h6' color = 'text.secondary'>{!CBB.isInProgress() ? CBB.getStartDate() + ' ' : ''}{CBB.getTime()}</Typography></div>
      <div style = {titleStyle}>
        <Typography style = {{'cursor': 'pointer'}} onClick={() => {handleClick(game.away_team_id)}} variant = {width < 600 ? 'h6' : 'h4'}>
          {CBB.getTeamRank('away', displaySlice.rank) ? <sup style = {{'marginRight': '5px'}}>{CBB.getTeamRank('away', displaySlice.rank)}</sup> : ''}
          <Link style = {{'cursor': 'pointer'}} underline='hover'>{CBB.getTeamName('away')}</Link>
          {awayTeamRecord}
        </Typography>
        <Typography variant = {width < 600 ? 'h6' : 'h4'}>{game.away_score}</Typography>
      </div>
      <div style = {Object.assign({'position': 'sticky', 'top': 20},titleStyle)}>
        <Typography style = {{'cursor': 'pointer'}} onClick={() => {handleClick(game.home_team_id)}} variant = {width < 600 ? 'h6' : 'h4'}>
          {CBB.getTeamRank('home', displaySlice.rank) ? <sup style = {{'marginRight': '5px'}}>{CBB.getTeamRank('home', displaySlice.rank)}</sup> : ''}
          <Link style = {{'cursor': 'pointer'}} underline='hover'>{CBB.getTeamName('home')}</Link>
          {homeTeamRecord}
        </Typography>
        <Typography variant = {width < 600 ? 'h6' : 'h4'}>{game.home_score}</Typography>
      </div>
    </div>
  );
}

export default ScoreTitle;