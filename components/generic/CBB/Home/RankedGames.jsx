'use client';
import React, { useState, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';


import Tile from './Tile';
import { Typography } from '@mui/material';
import { useAppDispatch } from '@/redux/hooks';
import { setLoading } from '@/redux/features/display-slice';


const RankedGames = (props) => {
  const self = this;
  const dispatch = useAppDispatch();
  const games = props.games || {};

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [rankDisplay, setRankDisplay] = useState('composite_rank');


  const handleClick = (cbb_game_id) => {
    dispatch(setLoading(true));
    startTransition(() => {
      router.push('/cbb/games/' + cbb_game_id);
    });
  };


  const gameContainers = [];

  const sorted_games = Object.values(games).sort(function(a, b) {
    return a.start_datetime > b.start_datetime ? 1 : -1;
  });

  for (let i = 0; i < sorted_games.length; i++) {
    const cbb_game = sorted_games[i];
    gameContainers.push(
      <Tile data = {cbb_game} rankDisplay = {rankDisplay} />
    );
  }


  return (
    <div>
      {gameContainers.length ? <Typography variant='h6' >Top 30 ranked games</Typography> : ''}
      <div style = {{'display': 'flex', 'overflowY': 'auto'}}>{gameContainers}</div>
    </div>
  );
}

export default RankedGames;