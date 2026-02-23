'use client';

import { useState } from 'react';

import HelperGame from '@/components/helpers/Game';
import {
  Game,
  GamePlayer,
  GamePlayers,
  GamePulse,
  GamePulses,
  Odds,
  Oddsz,
  Players,
} from '@/types/general';
import Chart from '@/components/generic/Chart';
import { LineProps } from 'recharts';
import { LinearProgress, useTheme } from '@mui/material';
import Color from '@/components/utils/Color';
import { getNavHeaderHeight, getSubNavHeaderHeight } from '@/components/generic/Game/NavBar';
import { footerNavigationHeight } from '@/components/generic/FooterNavigation';
import { headerBarHeight } from '@/components/generic/Header';
import Chip from '@/components/ux/container/Chip';
import Typography from '@/components/ux/text/Typography';

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

const Client = (
  {
    game,
    game_pulses,
    odds,
    game_players,
    players,
  }:
  {
    game: Game,
    game_pulses: GamePulses,
    odds: Oddsz,
    game_players: GamePlayers,
    players: Players,
  },
) => {
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
    {
      label: 'Active players',
      value: 'game_player',
    },
  ];

  const intervalCompareChips: React.JSX.Element[] = [];

  for (let i = 0; i < intervalCompare.length; i++) {
    intervalCompareChips.push(
      <Chip
        key = {intervalCompare[i].value}
        style = {{ margin: '5px 5px 10px 5px' }}
        filled = {selectedIntervalChip === intervalCompare[i].value }
        value = {intervalCompare[i].value}
        onClick = {() => { setSelectedIntervalChip(intervalCompare[i].value); }}
        title = {intervalCompare[i].label}
      />,
    );
  }

  type GamePulseData = GamePulse & {
    game_players?: GamePlayer[];
  }

  const sorted_game_pulses: GamePulseData[] = Object.values(game_pulses || {}).sort((a, b) => {
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

  const period_x_clock_x_game_pulses = {};

  for (const game_pulse_id in game_pulses) {
    const row = game_pulses[game_pulse_id];

    if (!(row.current_period in period_x_clock_x_game_pulses)) {
      period_x_clock_x_game_pulses[row.current_period] = {};
    }

    if (!(row.clock in period_x_clock_x_game_pulses[row.current_period])) {
      period_x_clock_x_game_pulses[row.current_period][row.clock] = {};
    }

    period_x_clock_x_game_pulses[row.current_period][row.clock][game_pulse_id] = row;
  }

  const period_x_active_game_player_data = {};

  for (const game_player_id in game_players) {
    const row = game_players[game_player_id];
    const [start_minutes, start_seconds] = row.start.split(':').map((num) => num.padStart(2, '0')).map(Number);
    const total_start_seconds = (start_minutes * 60) + start_seconds;
    let total_stop_seconds = 0;

    if (row.stop) {
      const [stop_minutes, stop_seconds] = row.stop.split(':').map((num) => num.padStart(2, '0')).map(Number);
      total_stop_seconds = (stop_minutes * 60) + stop_seconds;
    }

    if (!(row.period in period_x_active_game_player_data)) {
      period_x_active_game_player_data[row.period] = [];
    }

    period_x_active_game_player_data[row.period].push({
      ...row,
      total_start_seconds,
      total_stop_seconds,
    });
  }


  for (const period in period_x_clock_x_game_pulses) {
    const relevant_players = period_x_active_game_player_data[period] || [];
    for (const clock in period_x_clock_x_game_pulses[period]) {
      const [clock_minutes, clock_seconds] = clock.split(':').map((num) => num.padStart(2, '0')).map(Number);

      const total_clock_seconds = (clock_minutes * 60) + clock_seconds;

      const players_active_at_clock: GamePlayer[] = [];

      // eslint-disable-next-line no-restricted-syntax
      for (const player_data of relevant_players) {
        if (
          total_clock_seconds <= player_data.total_start_seconds &&
          total_clock_seconds > player_data.total_stop_seconds
        ) {
          players_active_at_clock.push(game_players[player_data.game_player_id]);
        }
      }

      players_active_at_clock.sort((a, b) => {
        // Get the total start seconds for player A and player B
        // This requires looking up their total_start_seconds from the pre-processed data
        // For simplicity, we'll assume the pre-processed structure is available to look up the times.

        // We'll rely on the original 'start' string being a consistent tie-breaker if necessary,
        // but ideally, total_start_seconds is pre-calculated and available.
        // Assuming 'period_x_active_game_player_data' has the required fields:
        const a_data = relevant_players.find((p) => p.game_player_id === a.game_player_id);
        const b_data = relevant_players.find((p) => p.game_player_id === b.game_player_id);

        // Primary Sort Key: total_start_seconds (Player who entered first has the LARGEST time)
        if (a_data.total_start_seconds !== b_data.total_start_seconds) {
          // Sort DESCENDING by total_start_seconds (largest time/earliest entry first)
          return b_data.total_start_seconds - a_data.total_start_seconds;
        }

        // Secondary Sort Key (Tie-breaker): Use game_player_id for a deterministic tie-break
        if (a_data.game_player_id < b_data.game_player_id) {
          return -1;
        }
        if (a_data.game_player_id > b_data.game_player_id) {
          return 1;
        }
        return 0;
      });

      for (const game_pulse_id in period_x_clock_x_game_pulses[period][clock]) {
        const game_pulse = period_x_clock_x_game_pulses[period][clock][game_pulse_id];

        // Assign the sorted array to the game_players property
        game_pulse.game_players = players_active_at_clock;
      }
    }
  }

  const player_id_x_played = {};

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

      if (sorted_game_pulses[i].game_players) {
        const g_players = sorted_game_pulses[i].game_players || [];

        for (let p = 0; p < g_players.length - 1; p++) {

          player_id_x_played[g_players[p].player_id] = true;

          // let name = g_players[p].player_id;
          // if (g_players[p].player_id in players) {
          //   const player = players[g_players[p].player_id];
          //   name = (player.first_name ? `${player.first_name.charAt(0)}. ` : '') + player.last_name;
          // }

          data[g_players[p].player_id] = p + 1;
        }
      }

      formattedData.push(data);
    }
  }

  // console.log(formattedData)

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
  } else if (selectedIntervalChip === 'game_player') {
    const lines: LineProps[] = [];

    for (const player_id in player_id_x_played) {
      const player = players[player_id];
      const name = (player.first_name ? `${player.first_name.charAt(0)}. ` : '') + player.last_name;

      lines.push({
        type: 'monotone',
        name,
        dataKey: `${player_id}`,
        stroke: Color.getTextColor(colors.homeColor, backgroundColor),
        strokeWidth: 2,
        dot: false,
        connectNulls: false,
      });
    }
    intervalChart = <Chart XAxisDataKey={'time'} YAxisLabel={'Active Player'} rows={formattedData} lines={lines} YAxisProps={{
      scale: 'auto', // Use 'point' scale for categorical-like data
      // domain: [1, 10], // Set domain from 0 to 2, so all '1's are in the middle
      tickFormatter: (value) => `P${value}`, // Optional: only show 'Active' for the y=1 line
      allowDecimals: false,
    }} />;
  }

  return (
    <Contents>
      {intervalCompareChips}
      {!sorted_game_pulses.length ? <Typography style = {{ textAlign: 'center', margin: '10px 0px' }} type = 'h5'>Nothing here yet...</Typography> : ''}
      {sorted_game_pulses.length ? intervalChart : ''}
    </Contents>
  );
};

export { Client, ClientSkeleton };
