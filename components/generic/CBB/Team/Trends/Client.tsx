'use client';
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label, Brush } from 'recharts';
import { purple, blue, teal, lime, green, indigo, yellow } from '@mui/material/colors';
import { useTheme, Typography, Paper } from '@mui/material';
import LinearScaleIcon from '@mui/icons-material/LinearScale';

import moment from 'moment';

import { Payload } from 'recharts/types/component/DefaultLegendContent';
import { Elos, Games, Rankings } from '@/types/cbb';
import { Dimensions, useWindowDimensions } from '@/components/hooks/useWindowDimensions';

export interface Trends {
  cbb_elo: Elos;
  cbb_ranking: Rankings;
  cbb_game: Games;
};


const Trends = ({ data }: { data: Trends}) => {
  const theme = useTheme();

  const { width } = useWindowDimensions() as Dimensions;

  const breakPoint = 600;

  const elo = data && data.cbb_elo || {};
  const ranking = data && data.cbb_ranking || {};
  const games = data && data.cbb_game || {};

  const [inactiveSeries, setInactiveSeries] = useState<Array<string>>([]);

  let minYaxisElo = 1100;
  let maxYaxisElo = 2000;

  for (let id in elo) {
    if (elo[id].elo < minYaxisElo) {
      minYaxisElo = elo[id].elo;
    }

    if (elo[id].elo > maxYaxisElo) {
      maxYaxisElo = elo[id].elo;
    }
  }

  const sorted_elo = Object.values(elo).sort(function(a, b) {
    if (!(a.cbb_game_id)) {
      return -1;
    }

    if (!(b.cbb_game_id)) {
      return 1;
    }

    if (!(a.cbb_game_id in games)) {
      return 1;
    }

    if (!(b.cbb_game_id in games)) {
      return -1;
    }

    return games[a.cbb_game_id].start_date < games[b.cbb_game_id].start_date ? -1 : 1;
  });

  const sorted_ranking = Object.values(ranking).sort(function(a, b) {
    return a.date_of_rank > b.date_of_rank ? 1 : -1;
  });


  const getRankingGraph = () => {
    type Data = {
      name: string;
      composite_rank: number; 
      elo_rank: number; 
      kenpom_rank: number; 
      net_rank: number; 
      srs_rank: number; 
      ap_rank: number; 
      coaches_rank: number; 
    };

    const formattedData: Data[] = [];

    for (let i = 0; i < sorted_ranking.length; i++) {
      const row = sorted_ranking[i];
      let date_of_rank = moment(row.date_of_rank).format('MMM Do');


      formattedData.push({
        'name': date_of_rank,
        'composite_rank': row.composite_rank,
        'elo_rank': row.elo_rank,
        'kenpom_rank': row.kenpom_rank,
        'net_rank': row.net_rank,
        'srs_rank': row.srs_rank,
        'ap_rank': row.ap_rank,
        'coaches_rank': row.coaches_rank,
      });
    }

    const CustomLegend = ({ payload }: { payload: Payload[]}) => {
      const onClick = (dataKey) => {
        if (inactiveSeries.includes(dataKey)) {
          setInactiveSeries(inactiveSeries.filter(el => el !== dataKey));
        } else {
          setInactiveSeries(prev => [...prev, dataKey]);
        }
      };

      const divStyle: React.CSSProperties = {
        display: (width > breakPoint ? 'flex' : 'inline-flex'),
        alignItems: 'center',
        margin: (width > breakPoint ? '5px 0px' : '5px 5px'),
        cursor: 'pointer',
      };

      return (
        <div style = {{'marginLeft': 10, 'textAlign': (width > breakPoint ? 'initial' : 'center')}}>
          {
            payload.map((entry, index) => {
              const color = entry.dataKey && inactiveSeries.includes(entry.dataKey as string) ? theme.palette.grey[500] : entry.color;
              return (
                <div key={`item-${index}`} style = {divStyle} onClick={() => {onClick(entry.dataKey)}}>
                  <div style = {{display: 'flex'}}>
                    <LinearScaleIcon style = {{'fontSize': '14px', color: color}} />
                  </div>
                  <div style = {{display: 'flex', marginLeft: 5}}>
                    <Typography variant='caption' color = {color}>{entry.value}</Typography>
                  </div>
                </div>
              );
            })
          }
        </div>
      );
    };

    type TooltipProps = {
      active?: boolean;
      payload?: { value: number, name: string, stroke: string, payload: {date: string} }[];
      label?: number;
    };
  
    const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
      if (active && payload && payload.length) {
        return (
          <Paper elevation={3} style = {{'padding': '5px 10px'}}>
            <div><Typography color = 'text.secondary' variant='subtitle2'>{payload[0].payload?.date ? moment(payload[0].payload?.date).format('MMM Do \'YY') : label}</Typography></div>
            {
              payload.map((entry, index) => {
                return (
                  <div key = {index} style = {{'display': 'flex'}}><Typography variant='body1' color = {entry.stroke} >{entry.name}:</Typography><Typography style = {{'marginLeft': 5}} variant='body1' color = {entry.stroke}>{entry.value}</Typography></div>
                );
              })
            }
          </Paper>
        );
      }
    
      return null;
    };

    return (
      <>
        {width > breakPoint ? <div style = {{'textAlign': 'center'}}><Typography color = 'info.main' variant = 'h6'>Rankings</Typography></div> : ''}
        <div style = {{'display': 'flex', 'height': 400}}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={formattedData}
              margin={{
                right: 10,
              }}
            >
              <CartesianGrid strokeDasharray = '3 3' />
              <XAxis dataKey = 'name' minTickGap={20} tickLine = {false} axisLine = {false}>
                <Label value = 'Date of rank' position={'bottom'} />
              </XAxis>
              <YAxis scale = 'auto'>
                <Label offset={10} value={'Rank'} angle={-90} position="insideLeft" style={{ textAnchor: 'middle', fill: theme.palette.info.main, fontSize: 18 }} />
              </YAxis>
              {
                width > breakPoint ?
                <Legend layout='vertical' align='right' verticalAlign='middle' content={CustomLegend} /> :
                <Legend layout='horizontal' align='center' verticalAlign='top' content={CustomLegend} />
              }
              {
                width > breakPoint ?
                  <Brush dataKey = 'name' startIndex={0} height={20} stroke = {theme.palette.success.dark} /> :
                  ''
              }
              <Tooltip cursor = {{stroke: theme.palette.warning.main, strokeWidth: 2}} content={<CustomTooltip />} />
              <Line type = 'monotone' hide={inactiveSeries.includes('composite_rank')} name = 'Composite' dataKey = 'composite_rank' stroke = {purple[500]} strokeWidth={2} dot = {false} />
              <Line type = 'monotone' hide={inactiveSeries.includes('elo_rank')} name = 'SR (elo)' dataKey = 'elo_rank' stroke = {green[500]} strokeWidth={2} dot = {false} />
              <Line type = 'monotone' hide={inactiveSeries.includes('kenpom_rank')} name = 'Kenpom' dataKey = 'kenpom_rank' stroke = {blue[500]} strokeWidth={2} dot = {false} />
              <Line type = 'monotone' hide={inactiveSeries.includes('net_rank')} name = 'NET' dataKey = 'net_rank' stroke = {teal[500]} strokeWidth={2} dot = {false} />
              <Line type = 'monotone' hide={inactiveSeries.includes('srs_rank')} name = 'SRS' dataKey = 'srs_rank' stroke = {lime[300]} strokeWidth={2} dot = {false} />
              <Line type = 'monotone' hide={inactiveSeries.includes('ap_rank')} name = 'AP' dataKey = 'ap_rank' stroke = {indigo[500]} strokeWidth={2} dot = {false} />
              <Line type = 'monotone' hide={inactiveSeries.includes('coaches_rank')} name = 'Coach Poll' dataKey = 'coaches_rank' stroke = {yellow[700]} strokeWidth={2} dot = {false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style = {{'textAlign': 'center', 'marginLeft': 20}}><Typography color = 'info.main' variant='subtitle2'>Date of rank</Typography></div>
      </>
    );
  };

  const getEloGraph = () => {
    type Data = {
      name: string;
      elo: number;
    };

    const formattedData: Data[] = [];

    for (let i = 0; i < sorted_elo.length; i++) {
      const row = sorted_elo[i];
      let date_of_game = row.cbb_game_id in games ? moment(games[row.cbb_game_id].start_date).format('MMM Do') : 'Preseason';


      formattedData.push({
        'name': date_of_game,
        'elo': row.elo,
      });
    }

    type TooltipProps = {
      active?: boolean;
      payload?: { value: number, name: string, stroke: string, payload: {date: string} }[];
      label?: number;
    };
  
    const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
      if (active && payload && payload.length) {
        return (
          <Paper elevation={3} style = {{'padding': '5px 10px'}}>
            <div><Typography color = 'text.secondary' variant='subtitle2'>{payload[0].payload?.date ? moment(payload[0].payload?.date).format('MMM Do \'YY') : label}</Typography></div>
            {
              payload.map((entry, index) => {
                return (
                  <div key = {index} style = {{'display': 'flex'}}><Typography variant='body1' color = {entry.stroke} >{entry.name}:</Typography><Typography style = {{'marginLeft': 5}} variant='body1' color = {entry.stroke}>{entry.value}</Typography></div>
                );
              })
            }
          </Paper>
        );
      }
    
      return null;
    };

    return (
      <div style = {{'marginTop': 20}}>
        <div style = {{'textAlign': 'center'}}><Typography color = 'info.main' variant='h6'>SR (elo)</Typography></div>
        <div style = {{'display': 'flex', 'height': 400}}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={formattedData}
              margin={{
                right: 10,
              }}
            >
              <CartesianGrid strokeDasharray = '3 3' />
              <XAxis dataKey = 'name' minTickGap={20} tickLine = {false} axisLine = {false}>
                <Label value = 'Date of rank' position={'bottom'} />
              </XAxis>
              <YAxis scale = 'linear' domain = {[minYaxisElo, maxYaxisElo]}>
                <Label offset={10} value={'Rating'} angle={-90} position="insideLeft" style={{ textAnchor: 'middle', fill: theme.palette.info.main, fontSize: 18 }} />
              </YAxis>
              {/* <Legend layout='vertical' align='right' verticalAlign='middle' margin = {{top: 0, left: 10, right: 0, bottom: 0}} content={CustomLegend} /> */}
              <Tooltip cursor = {{stroke: theme.palette.warning.main, strokeWidth: 2}} content={<CustomTooltip />} />
              <Line type = 'monotone' name = 'Elo' dataKey = 'elo' stroke = {theme.palette.info.main} strokeWidth={2} dot = {false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style = {{'textAlign': 'center', 'marginLeft': 20}}><Typography color = 'info.main' variant='subtitle2'>Date</Typography></div>
      </div>
    );
  };

  

  return (
    <div style={{'padding': '48px 20px 20px 20px'}}>
      {getRankingGraph()}
      {getEloGraph()}
    </div>
  );
}

export default Trends;
