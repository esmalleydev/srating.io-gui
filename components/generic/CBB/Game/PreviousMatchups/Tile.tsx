'use client';

import React, { useState, useTransition } from 'react';
import { useTheme } from '@mui/material/styles';

import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

import moment from 'moment';

import HelperCBB from '@/components/helpers/CBB';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/redux/hooks';
import { setLoading } from '@/redux/features/display-slice';


const Tile = ({ game }) => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const CBB = new HelperCBB({
    game,
  });

  const getColor = (side) => {
    if (side === 'away' && game.away_score > game.home_score) {
      return theme.palette.success.light;
    }

    if (side === 'home' && game.away_score < game.home_score) {
      return theme.palette.success.light;
    }

    return theme.palette.text.primary;
  };

  const getTitle = () => {
    let team: string | null = null;
    if (game.away_score > game.home_score) {
      team = `${CBB.getTeamName('away')} @`;
    } else if (game.away_score < game.home_score) {
      team = CBB.getTeamName('home');
    }

    return <span style = {{ color: theme.palette.success.light }}>{team}</span>;
  };

  const getScore = () => {
    let score: string | null = null;
    if (game.away_score > game.home_score) {
      score = `${game.away_score} - ${game.home_score}`;
    } else if (game.away_score < game.home_score) {
      score = `${game.home_score} - ${game.away_score}`;
    }

    return <span>{score}</span>;
  };

  const handleClick = () => {
    dispatch(setLoading(true));
    startTransition(() => {
      router.push(`/cbb/games/${game.game_id}`);
    });
  };

  return (
    <Paper elevation = {3} style = {{ margin: '5px 10px', padding: 10, cursor: 'pointer' }} onClick = {handleClick}>
      <div>
        <Typography variant = 'body2'>{moment(game.start_date).format('MMM Do, YYYY')}</Typography>
        <Typography variant = 'body1'>{getTitle()} ({getScore()})</Typography>
      </div>
    </Paper>
  );
};

export default Tile;
