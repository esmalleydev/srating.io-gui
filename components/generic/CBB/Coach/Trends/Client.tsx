'use client';
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label, ReferenceLine } from 'recharts';
import moment from 'moment';

// import { useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';


import { CoachElo, CoachElos, Games } from '@/types/cbb';
import { useTheme } from '@mui/material';


// todo compare to 2 or more coach elos on the same graph? might be cool to see them with the time comparison. ex: and old coach vs relativiely new
// add these graphs to the compare tool as well!

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
  let highestEloDate: string = '';

  for (let i = 0; i < sorted_elo.length; i++) {
    const date = sorted_elo[i].cbb_game_id && sorted_elo[i].cbb_game_id in cbb_games ? cbb_games[sorted_elo[i].cbb_game_id].start_date : null;
    if (sorted_elo[i].elo < minYaxis) {
      minYaxis = sorted_elo[i].elo;
    }

    if (sorted_elo[i].elo > maxYaxis) {
      maxYaxis = sorted_elo[i].elo;
    }

    if (sorted_elo[i].elo > highestElo) {
      highestElo = sorted_elo[i].elo;

      if (date) {
        highestEloDate = date;
      }
    }

    formattedData.push({
      'name': sorted_elo[i].season,
      'value': sorted_elo[i].elo,
      'date': date,
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

  const formatXAxis = (value) => {
    return moment(value).format('YYYY');
  };

  const referenceLineStroke = theme.palette.success[(theme.palette.mode === 'dark' ? 'light' : 'dark')];


  return (
    <div style={{'padding': '0px 10px'}}>
      <div style = {{'textAlign': 'center'}}><Typography color = 'info.main' variant='subtitle2'>SR (elo)</Typography></div>
      <div style = {{'display': 'flex', 'height': 300}}>
        <div style = {{'alignContent': 'center', 'transform': 'rotate(-90deg)', 'maxWidth': '20px', 'width': '20px'}}><Typography color = 'info.main' variant='subtitle2'>Rating</Typography></div>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={formattedData}
            margin={{
              right: 10,
            }}
          >
            <CartesianGrid strokeDasharray = '3 3' />
            <XAxis dataKey = 'date' minTickGap={20} tickLine = {false} axisLine = {false} tickFormatter={formatXAxis} />
            <YAxis dataKey = 'value' scale = 'linear' domain = {[minYaxis, maxYaxis]} />
            <Tooltip cursor = {{stroke: theme.palette.warning.main, strokeWidth: 2}} content={<CustomTooltip />} />
            <ReferenceLine y = {highestElo} stroke = {referenceLineStroke}>
              <Label value={highestElo} style={{ textAnchor: 'middle', fill: referenceLineStroke, fontSize: 18 }} dy={-10} />
            </ReferenceLine>
            <ReferenceLine x = {highestEloDate} stroke = {referenceLineStroke}>
              <Label value = {moment(highestEloDate).format('MMM Do \'YY')} angle={-90} dx={-15} style={{ textAnchor: 'middle', fill: referenceLineStroke, fontSize: 18 }} />
            </ReferenceLine>
            {/* {formattedData.length > 1 ? <ReferenceLine label="Segment" stroke="green" strokeDasharray="3 3" segment={[{x: formattedData[0].name, y: formattedData[0].value}, {x: formattedData[formattedData.length - 1].name, y: formattedData[formattedData.length - 1].value}]} /> : ''} */}
            <Line type = 'monotone' dataKey = 'value' stroke = {theme.palette.info.main} strokeWidth={2} dot = {false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div style = {{'textAlign': 'center', 'marginLeft': 20}}><Typography color = 'info.main' variant='subtitle2'>Year</Typography></div>
    </div>
  );
}

export default Client;
