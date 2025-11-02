'use client';
import React, { useState, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';


import Tile from './Tile';
import { Typography } from '@mui/material';
import { useAppDispatch } from '@/redux/hooks';
import { setLoading } from '@/redux/features/loading-slice';


const CloseGames = (props) => {
  const self = this;

  const games = props.games || {};

  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [rankDisplay, setRankDisplay] = useState('composite_rank');


  const handleClick = (game_id) => {
    dispatch(setLoading(true));
    startTransition(() => {
      router.push('/cbb/games/' + game_id);
    });
  };


  const gameContainers = [];

  const sorted_games = Object.values(games).sort(function(a, b) {
    return a.start_datetime > b.start_datetime ? 1 : -1;
  });

  for (let i = 0; i < sorted_games.length; i++) {
    const game = sorted_games[i];
    gameContainers.push(
      <Tile data = {game} rankDisplay = {rankDisplay} />
    );
  }


  return (
    <div>
      {gameContainers.length ? <Typography variant='h6'>Close games</Typography> : ''}
      <div style = {{'display': 'flex', 'overflowY': 'auto'}}>{gameContainers}</div>
    </div>
  );
}

export default CloseGames;