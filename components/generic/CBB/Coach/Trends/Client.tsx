'use client';
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label, ReferenceLine } from 'recharts';
import moment from 'moment';

// import { useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';


import { CoachElo, CoachElos, Games } from '@/types/cbb';
import { useTheme } from '@mui/material';



const Client = ({ cbb_coach_elos, cbb_games }: {cbb_coach_elos: CoachElos, cbb_games: Games}) => {

  const theme = useTheme();

  const sorted_elo: CoachElo[] = Object.values(cbb_coach_elos).sort(function(a: any, b: any) {
    if (!(a.cbb_game_id)) {
      return -1;
    }

    if (!(b.cbb_game_id)) {
      return 1;
    }

    if (!(a.cbb_game_id in cbb_games)) {
      return 1;
    }

    if (!(b.cbb_game_id in cbb_games)) {
      return -1;
    }

    return cbb_games[a.cbb_game_id].start_date < cbb_games[b.cbb_game_id].start_date ? -1 : 1;
  });


  type FormattedData = {
    name: number;
    value: number;
    date?: string | null;
  }

  const formattedData: FormattedData[] = [];

  let minYaxis = 1100;
  let maxYaxis = 2000;

  let highestElo = 0;

  for (let i = 0; i < sorted_elo.length; i++) {
    if (sorted_elo[i].elo < minYaxis) {
      minYaxis = sorted_elo[i].elo;
    }

    if (sorted_elo[i].elo > maxYaxis) {
      maxYaxis = sorted_elo[i].elo;
    }

    if (sorted_elo[i].elo > highestElo) {
      highestElo = sorted_elo[i].elo;
    }

    formattedData.push({
      'name': sorted_elo[i].season,
      'value': sorted_elo[i].elo,
      'date': sorted_elo[i].cbb_game_id && sorted_elo[i].cbb_game_id in cbb_games ? cbb_games[sorted_elo[i].cbb_game_id].start_date : null,
    });
  }

  minYaxis = minYaxis - 100;
  maxYaxis = maxYaxis + 100;

  type TooltipProps = {
    active?: boolean;
    payload?: { value: number, name: string, payload: {date: string} }[];
    label?: number;
  };

  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <Paper elevation={3} style = {{'padding': '5px 10px'}}>
          <div><Typography color = 'text.secondary' variant='subtitle2'>{payload[0].payload?.date ? moment(payload[0].payload?.date).format('MMM Do \'YY') : label}</Typography></div>
          <div style = {{'display': 'inline-flex'}}><Typography variant='body1' color = 'text.secondary' >Rating:</Typography><Typography style = {{'marginLeft': 5}} variant='body1' color = 'info.main'>{payload[0].value}</Typography></div>
        </Paper>
      );
    }
  
    return null;
  };




  return (
    <div style={{'padding': '0px 10px'}}>
      <div style = {{'display': 'flex', 'height': 400}}>
        <div style = {{'alignContent': 'center', 'transform': 'rotate(-90deg)', 'maxWidth': '20px', 'width': '20px'}}><Typography color = 'info.main' variant='subtitle2'>Rating</Typography></div>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={400}
            data={formattedData}
            margin={{
              right: 10,
            }}
          >
            <CartesianGrid strokeDasharray = '3 3' />
            <XAxis dataKey = 'name' minTickGap={20} tickLine = {false} axisLine = {false}>
              <Label value = 'Season' position={'bottom'} />
            </XAxis>
            <YAxis dataKey = 'value' scale = 'linear' domain = {[minYaxis, maxYaxis]} />
            <Tooltip cursor = {{stroke: theme.palette.warning.main, strokeWidth: 2}} content={<CustomTooltip />} />
            <Line type="monotone" dataKey = 'value' stroke = {theme.palette.info.main} strokeWidth={2} dot = {false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div style = {{'textAlign': 'center', 'marginLeft': 20}}><Typography color = 'info.main' variant='subtitle2'>Season</Typography></div>
    </div>
  );
}

export default Client;
