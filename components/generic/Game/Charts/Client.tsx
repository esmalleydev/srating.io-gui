'use client';

import React, { useState } from 'react';


import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

import HelperGame from '@/components/helpers/Game';
import { Game, GamePulse, GamePulses, Odds, Oddsz } from '@/types/general';
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

const Client = ({ game, game_pulses, odds }: {game: Game, game_pulses: GamePulses, odds: Oddsz}) => {
  const [selectedIntervalChip, setSelectedIntervalChip] = useState('scoring');

  const theme = useTheme();
  const backgroundColor = theme.palette.background.default;

  const Game = new HelperGame({
    game,
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

  const sorted_game_pulses: GamePulse[] = Object.values(game_pulses || {}).sort((a, b) => {
    return a.date_of_entry < b.date_of_entry ? -1 : 1;
  });

  type Data = {
    time: string;
    home_score: number;
    away_score: number;
    money_line_home?: number;
    money_line_away?: number;
    spread_home?: number;
    spread_away?: number;
    over?: number;
  };

  const formattedData: Data[] = [];

  const map = {};

  for (let i = 0; i < sorted_game_pulses.length; i++) {
    const { clock, current_period } = sorted_game_pulses[i];
    if (
      clock &&
      current_period
    ) {
      let showPeriod = false;

      if (!(current_period in map)) {
        // todo put a reference line for current period
        // showPeriod = true;
        map[current_period] = true;
      }

      const game_pulse_odds: Odds | null = sorted_game_pulses[i].odds_id in odds ? odds[sorted_game_pulses[i].odds_id] : null;

      const data: Data = {
        time: clock + (showPeriod ? ` ${current_period}` : ''),
        home_score: sorted_game_pulses[i].home_score,
        away_score: sorted_game_pulses[i].away_score,
      };

      if (game_pulse_odds) {
        data.money_line_home = game_pulse_odds.money_line_home < -10000 ? -10000 : game_pulse_odds.money_line_home;
        data.money_line_away = game_pulse_odds.money_line_away < -10000 ? -10000 : game_pulse_odds.money_line_away;
        data.spread_home = game_pulse_odds.spread_home < -10000 ? -10000 : game_pulse_odds.spread_home;
        data.spread_away = game_pulse_odds.spread_away < -10000 ? -10000 : game_pulse_odds.spread_away;
        data.over = game_pulse_odds.over < -10000 ? -10000 : game_pulse_odds.over;
      }

      formattedData.push(data);
    }
  }

  let intervalChart: React.JSX.Element | null = null;


  const colors = Game.getColors();

  if (selectedIntervalChip === 'scoring') {
    const lines: LineProps[] = [
      {
        type: 'monotone',
        name: Game.getTeamName('home'),
        dataKey: 'home_score',
        stroke: Color.getTextColor(colors.homeColor, backgroundColor),
        strokeWidth: 2,
        dot: false,
        connectNulls: true,
      },
      {
        type: 'monotone',
        name: Game.getTeamName('away'),
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
        name: Game.getTeamName('home'),
        dataKey: 'money_line_home',
        stroke: Color.getTextColor(colors.homeColor, backgroundColor),
        strokeWidth: 2,
        dot: false,
        connectNulls: true,
      },
      {
        type: 'monotone',
        name: Game.getTeamName('away'),
        dataKey: 'money_line_away',
        stroke: Color.getTextColor(colors.awayColor, backgroundColor),
        strokeWidth: 2,
        dot: false,
        connectNulls: true,
      },
    ];
    intervalChart = <Chart XAxisDataKey={'time'} YAxisLabel={'Odds'} rows={formattedData} lines={lines} YAxisProps={{ scale: 'auto' }} />;
  } else if (selectedIntervalChip === 'liveSpread') {
    const lines: LineProps[] = [
      {
        type: 'monotone',
        name: Game.getTeamName('home'),
        dataKey: 'spread_home',
        stroke: Color.getTextColor(colors.homeColor, backgroundColor),
        strokeWidth: 2,
        dot: false,
        connectNulls: true,
      },
      {
        type: 'monotone',
        name: Game.getTeamName('away'),
        dataKey: 'spread_away',
        stroke: Color.getTextColor(colors.awayColor, backgroundColor),
        strokeWidth: 2,
        dot: false,
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
        dot: false,
        connectNulls: true,
      },
    ];
    intervalChart = <Chart XAxisDataKey={'time'} YAxisLabel={'Over / Under'} rows={formattedData} lines={lines} YAxisProps={{ scale: 'auto' }} />;
  }

  return (
    <Contents>
      {intervalCompareChips}
      {!sorted_game_pulses.length ? <Typography style = {{ textAlign: 'center', margin: '10px 0px' }} variant = 'h5'>Nothing here yet...</Typography> : ''}
      {sorted_game_pulses.length ? intervalChart : ''}
    </Contents>
  );
};

export { Client, ClientSkeleton };
