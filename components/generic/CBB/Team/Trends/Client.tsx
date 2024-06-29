'use client';
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label, Brush } from 'recharts';
import { purple, blue, teal, lime, green, indigo, yellow } from '@mui/material/colors';
import { useTheme, Typography, Paper } from '@mui/material';
import LinearScaleIcon from '@mui/icons-material/LinearScale';

import moment from 'moment';

import { Payload } from 'recharts/types/component/DefaultLegendContent';
import { ConferenceStatisticRankings, Elos, Games, LeagueStatistics, Rankings, StatisticRankings } from '@/types/cbb';
import { Dimensions, useWindowDimensions } from '@/components/hooks/useWindowDimensions';
import StatsGraph from './StatsGraph';
import { useSearchParams } from 'next/navigation';

export interface Trends {
  cbb_elo: Elos;
  cbb_ranking: Rankings;
  cbb_game: Games;
  cbb_statistic_ranking: StatisticRankings;
  cbb_conference_statistic_ranking: ConferenceStatisticRankings;
  cbb_league_statistic: LeagueStatistics
};


const Trends = ({ data }: { data: Trends}) => {
  const theme = useTheme();

  const { width } = useWindowDimensions() as Dimensions;

  const breakPoint = 600;

  const searchParams = useSearchParams();
  let subView = searchParams?.get('subview') || 'stats';

  const elo = data && data.cbb_elo || {};
  const ranking = data && data.cbb_ranking || {};
  const games = data && data.cbb_game || {};
  const cbb_statistic_rankings = data && data.cbb_statistic_ranking || {};
  const cbb_conference_statistic_rankings = data && data.cbb_conference_statistic_ranking || {};
  const cbb_league_statistics = data && data.cbb_league_statistic || {};

  const [inactiveSeries, setInactiveSeries] = useState<Array<string>>([]);


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



  return (
    <div style={{'padding': '5px'}}>
      {subView === 'ranking' ? getRankingGraph() : ''}
      {subView === 'stats' ? <StatsGraph cbb_statistic_rankings = {cbb_statistic_rankings} cbb_elos = {elo} cbb_games = {games} cbb_conference_statistic_rankings = {cbb_conference_statistic_rankings} cbb_league_statistics = {cbb_league_statistics} /> : ''}
    </div>
  );
}

export default Trends;
