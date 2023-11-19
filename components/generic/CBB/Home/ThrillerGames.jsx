import React, { useState } from 'react';
import { useRouter } from 'next/router';


import BackdropLoader from '../../BackdropLoader';
import Tile from './Tile';
import { Typography } from '@mui/material';


const ThrillerGames = (props) => {
  const self = this;

  const games = props.games || {};

  const router = useRouter();

  const [rankDisplay, setRankDisplay] = useState('composite_rank');
  const [spin, setSpin] = useState(false);


  const handleClick = (cbb_game_id) => {
    setSpin(true);
    router.push('/cbb/games/' + cbb_game_id).then(() => {
      setSpin(false);
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
      <BackdropLoader open = {(spin === true)} />
      {gameContainers.length ? <Typography variant='h6'>Potential thrillers</Typography> : ''}
      <div style = {{'display': 'flex', 'overflowY': 'auto'}}>{gameContainers}</div>
    </div>
  );
}

export default ThrillerGames;