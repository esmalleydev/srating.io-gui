'use client';

import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import { Chip, useTheme } from '@mui/material';
import Chart from '@/components/generic/Chart';
import { LineProps } from 'recharts';
import HelperCBB from '@/components/helpers/CBB';
import Color from '@/components/utils/Color';
import moment from 'moment';
import { getNavHeaderHeight } from '../NavBar';
import { getSubNavHeaderHeight } from '../SubNavBar';
import { footerNavigationHeight } from '@/components/generic/FooterNavigation';
import { headerBarHeight } from '@/components/generic/Header';
import { LinearProgress } from '@mui/material';

/**
 * The main wrapper div for all the contents
 */
const Contents = ({ children }): React.JSX.Element => {
  return (
    <div style = {{ padding: 20 }}>
      {children}
    </div>
  );
};


const ClientSkeleton = () => {
  const paddingTop = getNavHeaderHeight() + getSubNavHeaderHeight();

  const heightToRemove = paddingTop + footerNavigationHeight + headerBarHeight + 160;
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


const Client = ({ cbb_game, cbb_statistic_rankings }) => {
  const [selectedChip, setSelectedChip] = useState('rank');

  const theme = useTheme();
  const backgroundColor = theme.palette.background.default;

  const CBB = new HelperCBB({
    cbb_game,
  });


  const statsCompare = [
    {
      label: 'Rank',
      value: 'rank',
    },
    {
      label: 'SR',
      value: 'elo_rank',
    },
    {
      label: 'aEM',
      value: 'adjusted_efficiency_rating',
    },
    {
      label: 'PTS',
      value: 'points',
    },
  ];

  const statsCompareChips: React.JSX.Element[] = [];

  for (let i = 0; i < statsCompare.length; i++) {
    statsCompareChips.push(
      <Chip
        key = {statsCompare[i].value}
        sx = {{ margin: '5px 5px 10px 5px' }}
        variant = {selectedChip === statsCompare[i].value ? 'filled' : 'outlined'}
        color = {selectedChip === statsCompare[i].value ? 'success' : 'primary'}
        onClick = {() => { setSelectedChip(statsCompare[i].value); }}
        label = {statsCompare[i].label}
      />,
    );
  }

  type Data = {
    home_team_id: string;
    away_team_id: string;
    home_rank: number;
    away_rank: number;
    home_elo_rank: number;
    away_elo_rank: number;
    home_adjusted_efficiency_rating: number;
    away_adjusted_efficiency_rating: number;
    home_points: number;
    away_points: number;
    date_of_rank: string;
    date_friendly: string;
  };

  const date_of_rank_x_data = {};

  for (const cbb_statistic_ranking_id in cbb_statistic_rankings) {
    const row = cbb_statistic_rankings[cbb_statistic_ranking_id];

    if (!(row.date_of_rank in date_of_rank_x_data)) {
      date_of_rank_x_data[row.date_of_rank] = {
        date_of_rank: row.date_of_rank,
        date_friendly: moment(row.date_of_rank).format('MMM Do'),
      };
    }

    const which = cbb_game.home_team_id === row.team_id ? 'home' : 'away';

    date_of_rank_x_data[row.date_of_rank][`${which}_adjusted_efficiency_rating`] = row.adjusted_efficiency_rating;
    date_of_rank_x_data[row.date_of_rank][`${which}_points`] = row.points;
    date_of_rank_x_data[row.date_of_rank][`${which}_rank`] = row.rank;
    date_of_rank_x_data[row.date_of_rank][`${which}_elo_rank`] = row.elo_rank;
    date_of_rank_x_data[row.date_of_rank][`${which}_team_id`] = row.team_id;
  }

  const rows: Data[] = Object.values(date_of_rank_x_data);

  const formattedData: Data[] = rows.sort((a: Data, b: Data) => {
    return a.date_of_rank > b.date_of_rank ? 1 : -1;
  });

  let chart: React.JSX.Element | null = null;

  const colors = CBB.getGameColors();

  if (selectedChip === 'rank') {
    const lines: LineProps[] = [
      {
        type: 'monotone',
        name: CBB.getTeamName('home'),
        dataKey: 'home_rank',
        stroke: Color.getTextColor(colors.homeColor, backgroundColor),
        strokeWidth: 2,
        dot: false,
        connectNulls: true,
      },
      {
        type: 'monotone',
        name: CBB.getTeamName('away'),
        dataKey: 'away_rank',
        stroke: Color.getTextColor(colors.awayColor, backgroundColor),
        strokeWidth: 2,
        dot: false,
        connectNulls: true,
      },
    ];
    chart = <Chart XAxisDataKey={'date_friendly'} YAxisLabel={'Rank'} rows={formattedData} lines={lines} YAxisProps = {{ scale: 'auto' }} />;
  } else if (selectedChip === 'elo_rank') {
    const lines: LineProps[] = [
      {
        type: 'monotone',
        name: CBB.getTeamName('home'),
        dataKey: 'home_elo_rank',
        stroke: Color.getTextColor(colors.homeColor, backgroundColor),
        strokeWidth: 2,
        dot: false,
        connectNulls: true,
      },
      {
        type: 'monotone',
        name: CBB.getTeamName('away'),
        dataKey: 'away_elo_rank',
        stroke: Color.getTextColor(colors.awayColor, backgroundColor),
        strokeWidth: 2,
        dot: false,
        connectNulls: true,
      },
    ];
    chart = <Chart XAxisDataKey={'date_friendly'} YAxisLabel={'SR (elo) rank'} rows={formattedData} lines={lines} YAxisProps = {{ scale: 'auto' }} />;
  } else if (selectedChip === 'adjusted_efficiency_rating') {
    const lines: LineProps[] = [
      {
        type: 'monotone',
        name: CBB.getTeamName('home'),
        dataKey: 'home_adjusted_efficiency_rating',
        stroke: Color.getTextColor(colors.homeColor, backgroundColor),
        strokeWidth: 2,
        dot: false,
        connectNulls: true,
      },
      {
        type: 'monotone',
        name: CBB.getTeamName('away'),
        dataKey: 'away_adjusted_efficiency_rating',
        stroke: Color.getTextColor(colors.awayColor, backgroundColor),
        strokeWidth: 2,
        dot: false,
        connectNulls: true,
      },
    ];
    chart = <Chart XAxisDataKey={'date_friendly'} YAxisLabel={'aEM'} rows={formattedData} lines={lines} YAxisProps = {{ scale: 'auto' }} />;
  } else if (selectedChip === 'points') {
    const lines: LineProps[] = [
      {
        type: 'monotone',
        name: CBB.getTeamName('home'),
        dataKey: 'home_points',
        stroke: Color.getTextColor(colors.homeColor, backgroundColor),
        strokeWidth: 2,
        dot: false,
        connectNulls: true,
      },
      {
        type: 'monotone',
        name: CBB.getTeamName('away'),
        dataKey: 'away_points',
        stroke: Color.getTextColor(colors.awayColor, backgroundColor),
        strokeWidth: 2,
        dot: false,
        connectNulls: true,
      },
    ];
    chart = <Chart XAxisDataKey={'date_friendly'} YAxisLabel={'Points'} rows={formattedData} lines={lines} YAxisProps = {{ scale: 'auto' }} />;
  }


  return (
    <Contents>
      {statsCompareChips}
      {!formattedData.length ? <Typography style = {{ textAlign: 'center', margin: '10px 0px' }} variant = 'h5'>Nothing here yet...</Typography> : ''}
      {formattedData.length ? chart : ''}
    </Contents>
  );
};

export { Client, ClientSkeleton };
