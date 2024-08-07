'use client';

import React, { useState } from 'react';


import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

import HelperCBB from '@/components/helpers/CBB';
import { Game, ScoreIntervals } from '@/types/cbb';
import Chart from '@/components/generic/Chart';
import { LineProps } from 'recharts';
import { LinearProgress, useTheme } from '@mui/material';
import Color from '@/components/utils/Color';
import { getNavHeaderHeight } from '../NavBar';
import { getSubNavHeaderHeight } from '../SubNavBar';
import { footerNavigationHeight } from '@/components/generic/FooterNavigation';
import { headerBarHeight } from '@/components/generic/Header';

/**
 * The main wrapper div for all the contents
 */
const Contents = ({ children }): React.JSX.Element => {
  return (
    <div style = {{ textAlign: 'center' }}>
      {children}
    </div>
  );
};


const ClientSkeleton = () => {
  const paddingTop = getNavHeaderHeight() + getSubNavHeaderHeight();

  const heightToRemove = paddingTop + footerNavigationHeight + headerBarHeight + 120;
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

const Client = ({ cbb_game, cbb_game_score_intervals }: {cbb_game: Game, cbb_game_score_intervals: ScoreIntervals}) => {
  const [selectedIntervalChip, setSelectedIntervalChip] = useState('scoring');

  const theme = useTheme();
  const backgroundColor = theme.palette.background.default;

  const CBB = new HelperCBB({
    cbb_game,
  });


  const intervalCompare = [
    {
      label: 'Scoring',
      value: 'scoring',
    },
    {
      label: 'Live ML',
      value: 'liveML',
    },
    {
      label: 'Live Spread',
      value: 'liveSpread',
    },
    {
      label: 'Live O/U',
      value: 'liveOverUnder',
    },
  ];

  const intervalCompareChips: React.JSX.Element[] = [];

  for (let i = 0; i < intervalCompare.length; i++) {
    intervalCompareChips.push(
      <Chip
        key = {intervalCompare[i].value}
        sx = {{ margin: '5px 5px 10px 5px' }}
        variant = {selectedIntervalChip === intervalCompare[i].value ? 'filled' : 'outlined'}
        color = {selectedIntervalChip === intervalCompare[i].value ? 'success' : 'primary'}
        onClick = {() => { setSelectedIntervalChip(intervalCompare[i].value); }}
        label = {intervalCompare[i].label}
      />,
    );
  }


  // todo fix underlying data
  const getPeriod = (row) => {
    if (row.current_period === '1ST HALF' || (!row.current_period.length && row.clock === ':00' && !row.home_score && !row.away_score)) {
      return 1;
    } if (row.current_period === '2ND HALF' || (!row.current_period.length && row.clock === ':00')) {
      return 2;
    }

    return 0;
  };

  const clockToSeconds = (clock) => {
    // Split the time into minutes and seconds
    const parts = clock.split(':').map(Number);

    // Handle case where time is in the format ":SS"
    if (parts.length === 2) {
      const [minutes, seconds] = parts;
      return (isNaN(minutes) ? 0 : minutes) * 60 + (isNaN(seconds) ? 0 : seconds);
    }

    console.warn('Invalid time format');
    return 0;
  };

  const sorted_intervals: ScoreIntervals[] = Object.values(cbb_game_score_intervals || {}).sort((a, b) => {
    // const a_period = getPeriod(a);
    // const b_period = getPeriod(b);

    // if (a_period > b_period) {
    //   return 1;
    // }
    // if (b_period > a_period) {
    //   return -1;
    // }

    // const a_seconds = clockToSeconds(a.clock);
    // const b_seconds = clockToSeconds(b.clock);

    // if (a_seconds > b_seconds) {
    //   return -1;
    // }

    // if (a_seconds < b_seconds) {
    //   return 1;
    // }

    return a.date_of_entry < b.date_of_entry ? -1 : 1;
  });



  type Data = {
    time: string;
    home_score: number;
    away_score: number;
    money_line_home: number;
    money_line_away: number;
    spread_home: number;
    spread_away: number;
    over: number;
  };

  const formattedData: Data[] = [];

  const map = {};

  for (let i = 0; i < sorted_intervals.length; i++) {
    if (!map[sorted_intervals[i].clock + sorted_intervals[i].current_period]) {
      map[sorted_intervals[i].clock + sorted_intervals[i].current_period] = true;

      let time = sorted_intervals[i].clock;
      if (!sorted_intervals[i].current_period.length && sorted_intervals[i].clock === ':00' && !sorted_intervals[i].home_score && !sorted_intervals[i].away_score) {
        time = '1ST';
      } else if (!sorted_intervals[i].current_period.length && sorted_intervals[i].clock === ':00') {
        time = '2ND';
      }


      formattedData.push({
        time,
        home_score: sorted_intervals[i].home_score,
        away_score: sorted_intervals[i].away_score,
        money_line_home: sorted_intervals[i].money_line_home < -10000 ? -10000 : sorted_intervals[i].money_line_home,
        money_line_away: sorted_intervals[i].money_line_away < -10000 ? -10000 : sorted_intervals[i].money_line_away,
        spread_home: sorted_intervals[i].spread_home < -10000 ? -10000 : sorted_intervals[i].spread_home,
        spread_away: sorted_intervals[i].spread_away < -10000 ? -10000 : sorted_intervals[i].spread_away,
        over: sorted_intervals[i].over < -10000 ? -10000 : sorted_intervals[i].over,
      });
    }
  }

  let intervalChart: React.JSX.Element | null = null;



  const colors = CBB.getGameColors();

  if (selectedIntervalChip === 'scoring') {
    const lines: LineProps[] = [
      {
        type: 'monotone',
        name: CBB.getTeamName('home'),
        dataKey: 'home_score',
        stroke: Color.getTextColor(colors.homeColor, backgroundColor),
        strokeWidth: 2,
        dot: false,
        connectNulls: true,
      },
      {
        type: 'monotone',
        name: CBB.getTeamName('away'),
        dataKey: 'away_score',
        stroke: Color.getTextColor(colors.awayColor, backgroundColor),
        strokeWidth: 2,
        dot: false,
        connectNulls: true,
      },
    ];
    intervalChart = <Chart XAxisDataKey={'time'} YAxisLabel={'Score'} rows={formattedData} lines={lines} YAxisProps={{ scale: 'auto' }} />;
  } else if (selectedIntervalChip === 'liveML') {
    const lines: LineProps[] = [
      {
        type: 'monotone',
        name: CBB.getTeamName('home'),
        dataKey: 'money_line_home',
        stroke: Color.getTextColor(colors.homeColor, backgroundColor),
        strokeWidth: 2,
        dot: true,
        connectNulls: true,
      },
      {
        type: 'monotone',
        name: CBB.getTeamName('away'),
        dataKey: 'money_line_away',
        stroke: Color.getTextColor(colors.awayColor, backgroundColor),
        strokeWidth: 2,
        dot: true,
        connectNulls: true,
      },
    ];
    intervalChart = <Chart XAxisDataKey={'time'} YAxisLabel={'Odds'} rows={formattedData} lines={lines} YAxisProps={{ scale: 'auto' }} />;
  } else if (selectedIntervalChip === 'liveSpread') {
    const lines: LineProps[] = [
      {
        type: 'monotone',
        name: CBB.getTeamName('home'),
        dataKey: 'spread_home',
        stroke: Color.getTextColor(colors.homeColor, backgroundColor),
        strokeWidth: 2,
        dot: true,
        connectNulls: true,
      },
      {
        type: 'monotone',
        name: CBB.getTeamName('away'),
        dataKey: 'spread_away',
        stroke: Color.getTextColor(colors.awayColor, backgroundColor),
        strokeWidth: 2,
        dot: true,
        connectNulls: true,
      },
    ];
    intervalChart = <Chart XAxisDataKey={'time'} YAxisLabel={'Points spread'} rows={formattedData} lines={lines} YAxisProps={{ scale: 'auto' }} />;
  } else if (selectedIntervalChip === 'liveOverUnder') {
    const lines: LineProps[] = [
      {
        type: 'monotone',
        name: 'O/U',
        dataKey: 'over',
        stroke: Color.getTextColor(colors.homeColor, backgroundColor),
        strokeWidth: 2,
        dot: true,
        connectNulls: true,
      },
    ];
    intervalChart = <Chart XAxisDataKey={'time'} YAxisLabel={'Over / Under'} rows={formattedData} lines={lines} YAxisProps={{ scale: 'auto' }} />;
  }


  return (
    <Contents>
      {intervalCompareChips}
      {!sorted_intervals.length ? <Typography style = {{ textAlign: 'center', margin: '10px 0px' }} variant = 'h5'>Nothing here yet...</Typography> : ''}
      {sorted_intervals.length ? intervalChart : ''}
    </Contents>
  );
};

export { Client, ClientSkeleton };
