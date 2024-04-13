'use client';
import React from 'react';
import Typography from '@mui/material/Typography';
import { PlaybyPlay } from '@/types/cbb';


const Client = ({ cbb_game_pbp, /*tag*/}) => {
  const rows: PlaybyPlay = cbb_game_pbp;

  const sortedPBP: PlaybyPlay[] = Object.values(rows).sort(function(a, b) {
    return +a.order > +b.order ? -1 : 1;
  });


  // todo skeleton loading

  return (
    <div style = {{'padding': 20}}>
      {/* {
        pbpData === null ?
          <Paper elevation = {3} style = {{'padding': 10}}>
            <div>
              <Typography variant = 'h5'><Skeleton /></Typography>
              <Typography variant = 'h5'><Skeleton /></Typography>
              <Typography variant = 'h5'><Skeleton /></Typography>
              <Typography variant = 'h5'><Skeleton /></Typography>
              <Typography variant = 'h5'><Skeleton /></Typography>
            </div>
          </Paper>
        : ''
      } */}
      {
        sortedPBP.map((cbb_game_pbp) => {
          return (
            <div key = {cbb_game_pbp.cbb_game_pbp_id} style = {{'margin': '5px 10px'}}>
              <Typography variant = 'subtitle1'>{cbb_game_pbp.current_period}H {cbb_game_pbp.away_score}-{cbb_game_pbp.home_score} {cbb_game_pbp.clock}</Typography>
              <Typography variant = 'body1'>{cbb_game_pbp.description}</Typography>
            </div>
          );
        })
      }
      {rows !== null && sortedPBP.length === 0 ? <Typography style = {{'textAlign': 'center', 'margin': '10px 0px'}} variant = 'h5'>No play by play data yet...</Typography> : ''}
    </div>
  );
}

export default Client;
