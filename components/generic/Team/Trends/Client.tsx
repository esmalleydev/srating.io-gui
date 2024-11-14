'use client';

import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label, Brush,
} from 'recharts';
import {
  purple, blue, teal, lime, green, indigo, yellow,
} from '@mui/material/colors';
import {
  useTheme, Typography, Paper, LinearProgress,
} from '@mui/material';
import LinearScaleIcon from '@mui/icons-material/LinearScale';

import moment from 'moment';

import { Payload } from 'recharts/types/component/DefaultLegendContent';
import {
  ConferenceStatisticRankings, LeagueStatisticRankings, StatisticRankings,
} from '@/types/cbb';
import { Dimensions, useWindowDimensions } from '@/components/hooks/useWindowDimensions';
import StatsGraph from './StatsGraph';
import { useSearchParams } from 'next/navigation';
import { footerNavigationHeight } from '@/components/generic/FooterNavigation';
import { headerBarHeight } from '@/components/generic/Header';
import { Elos, Games } from '@/types/general';
import Organization from '@/components/helpers/Organization';

export interface TrendsType {
  elos: Elos;
  games: Games;
  statistic_rankings: StatisticRankings;
  conference_statistic_rankings: ConferenceStatisticRankings;
  league_statistic_rankings: LeagueStatisticRankings
}

const padding = 5;

/**
 * The main wrapper div for all the contents
 */
const Contents = ({ children }): React.JSX.Element => {
  return (
    <div style={{ padding }}>
      {children}
    </div>
  );
};

const ClientSkeleton = () => {
  const heightToRemove = padding + footerNavigationHeight + headerBarHeight + 190;
  return (
    <Contents>
      <div style = {{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: `calc(100vh - ${heightToRemove}px)`,
      }}>
        <LinearProgress color = 'secondary' style={{ width: '50%' }} />
      </div>
    </Contents>
  );
};

const Client = ({ organization_id, division_id, data }: { organization_id: string, division_id: string, data: TrendsType}) => {
  const theme = useTheme();

  const { width } = useWindowDimensions() as Dimensions;

  const breakPoint = 600;

  const searchParams = useSearchParams();
  const subView = searchParams?.get('subview') || 'stats';

  const elos = (data && data.elos) || {};
  const games = (data && data.games) || {};
  const statistic_rankings = (data && data.statistic_rankings) || {};
  const conference_statistic_rankings = (data && data.conference_statistic_rankings) || {};
  const league_statistic_rankings = (data && data.league_statistic_rankings) || {};

  const [inactiveSeries, setInactiveSeries] = useState<Array<string>>([]);


  const sorted_statistic_rankings = Object.values(statistic_rankings).sort((a, b) => {
    return a.date_of_rank > b.date_of_rank ? 1 : -1;
  });


  const getRankingGraph = () => {
    type Data = {
      name: string;
      rank: number;
      elo_rank: number;
      kenpom_rank?: number;
      net_rank?: number;
      srs_rank?: number;
      ap_rank?: number;
      coaches_rank?: number;
    };

    const formattedData: Data[] = [];

    for (let i = 0; i < sorted_statistic_rankings.length; i++) {
      const row = sorted_statistic_rankings[i];
      const date_of_rank = moment(row.date_of_rank).format('MMM Do');

      const d = {
        name: date_of_rank,
        rank: row.rank,
        elo_rank: row.elo_rank,
      };

      if (Organization.getCBBID() === organization_id) {
        Object.assign(d, {
          kenpom_rank: row.kenpom_rank,
          net_rank: row.net_rank,
          srs_rank: row.srs_rank,
          ap_rank: row.ap_rank,
          coaches_rank: row.coaches_rank,
        });
      }

      formattedData.push(d);
    }

    const CustomLegend = ({ payload }: { payload: Payload[]}) => {
      const onClick = (dataKey) => {
        if (inactiveSeries.includes(dataKey)) {
          setInactiveSeries(inactiveSeries.filter((el) => el !== dataKey));
        } else {
          setInactiveSeries((prev) => [...prev, dataKey]);
        }
      };

      const divStyle: React.CSSProperties = {
        display: (width > breakPoint ? 'flex' : 'inline-flex'),
        alignItems: 'center',
        margin: (width > breakPoint ? '5px 0px' : '5px 5px'),
        cursor: 'pointer',
      };

      return (
        <div style = {{ marginLeft: 10, textAlign: (width > breakPoint ? 'initial' : 'center') }}>
          {
            payload.map((entry, index) => {
              const color = entry.dataKey && inactiveSeries.includes(entry.dataKey as string) ? theme.palette.grey[500] : entry.color;
              return (
                <div key={`item-${index}`} style = {divStyle} onClick={() => { onClick(entry.dataKey); }}>
                  <div style = {{ display: 'flex' }}>
                    <LinearScaleIcon style = {{ fontSize: '14px', color }} />
                  </div>
                  <div style = {{ display: 'flex', marginLeft: 5 }}>
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
          <Paper elevation={3} style = {{ padding: '5px 10px' }}>
            <div><Typography color = 'text.secondary' variant='subtitle2'>{payload[0].payload?.date ? moment(payload[0].payload?.date).format('MMM Do \'YY') : label}</Typography></div>
            {
              payload.map((entry, index) => {
                return (
                  <div key = {index} style = {{ display: 'flex' }}><Typography variant='body1' color = {entry.stroke} >{entry.name}:</Typography><Typography style = {{ marginLeft: 5 }} variant='body1' color = {entry.stroke}>{entry.value}</Typography></div>
                );
              })
            }
          </Paper>
        );
      }

      return null;
    };

    const getLines = () => {
      const lines = [
        <Line type = 'monotone' hide={inactiveSeries.includes('rank')} name = 'Rank' dataKey = 'rank' stroke = {purple[500]} strokeWidth={2} dot = {false} connectNulls = {true} />,
        <Line type = 'monotone' hide={inactiveSeries.includes('elo_rank')} name = 'SR (elo)' dataKey = 'elo_rank' stroke = {green[500]} strokeWidth={2} dot = {false} connectNulls = {true} />,
      ];

      if (Organization.getCBBID() === organization_id) {
        lines.push(<Line type = 'monotone' hide={inactiveSeries.includes('kenpom_rank')} name = 'Kenpom' dataKey = 'kenpom_rank' stroke = {blue[500]} strokeWidth={2} dot = {false} connectNulls = {true} />);
        lines.push(<Line type = 'monotone' hide={inactiveSeries.includes('net_rank')} name = 'NET' dataKey = 'net_rank' stroke = {teal[500]} strokeWidth={2} dot = {false} connectNulls = {true} />);
        lines.push(<Line type = 'monotone' hide={inactiveSeries.includes('srs_rank')} name = 'SRS' dataKey = 'srs_rank' stroke = {lime[300]} strokeWidth={2} dot = {false} connectNulls = {true} />);
        lines.push(<Line type = 'monotone' hide={inactiveSeries.includes('ap_rank')} name = 'AP' dataKey = 'ap_rank' stroke = {indigo[500]} strokeWidth={2} dot = {false} connectNulls = {true} />);
        lines.push(<Line type = 'monotone' hide={inactiveSeries.includes('coaches_rank')} name = 'Coach Poll' dataKey = 'coaches_rank' stroke = {yellow[700]} strokeWidth={2} dot = {false} connectNulls = {true} />);
      }

      return lines;
    };

    return (
      <>
        <div style = {{ display: 'flex', height: 400 }}>
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
              <Tooltip cursor = {{ stroke: theme.palette.warning.main, strokeWidth: 2 }} content={<CustomTooltip />} />
              {getLines()}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style = {{ textAlign: 'center', marginLeft: 20 }}><Typography color = 'info.main' variant='subtitle2'>Date of rank</Typography></div>
      </>
    );
  };



  return (
    <Contents>
      {subView === 'ranking' ? getRankingGraph() : ''}
      {subView === 'stats' ? <StatsGraph organization_id = {organization_id} statistic_rankings = {statistic_rankings} elos = {elos} games = {games} conference_statistic_rankings = {conference_statistic_rankings} league_statistic_rankings = {league_statistic_rankings} /> : ''}
    </Contents>
  );
};

export { Client, ClientSkeleton };
