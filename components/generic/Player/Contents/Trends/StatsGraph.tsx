'use client';

import React from 'react';
import Chart from '@/components/generic/Chart';
import { LineProps, YAxisProps } from 'recharts';
import moment from 'moment';
import Organization from '@/components/helpers/Organization';
import { useTheme } from '@/components/hooks/useTheme';
import Chip from '@/components/ux/container/Chip';
import Typography from '@/components/ux/text/Typography';
import TableColumns from '@/components/helpers/TableColumns';
import AdditionalOptions from './AdditionalOptions';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setDataKey } from '@/redux/features/player-slice';
import ColumnPicker from '@/components/generic/ColumnPicker';


const StatsGraph = (
  { organization_id, division_id, season, player_statistic_rankings, games, league_player_statistic_rankings, player_boxscores }:
  { organization_id: string, division_id: string, season: number, player_statistic_rankings: object, games: object, league_player_statistic_rankings: object, player_boxscores: object },
) => {
  let max = 0;

  let standardColumns = [
    'efficiency_rating',
    'player_efficiency_rating',
    'two_point_field_goal_percentage',
    'three_point_field_goal_percentage',
    'assists_per_game',
    'elo',
  ];

  if (Organization.getCFBID() === organization_id) {
    standardColumns = [
      'passing_rating_college',
      'points',
      'elo',
    ];
  }

  const dispatch = useAppDispatch();
  const trendsBoxscoreLine = useAppSelector((state) => state.playerReducer.trendsBoxscoreLine);
  const trendsColumn = useAppSelector((state) => state.playerReducer.trendsColumn) || standardColumns[0];

  const allColumns = TableColumns.getColumns({ organization_id, view: 'player', graphable: true, disabled: false });

  const theme = useTheme();

  const handleColumn = (value: string) => {
    dispatch(setDataKey({ key: 'trendsColumn', value }));

    const current = new URLSearchParams(window.location.search);
    current.set('trendsColumn', value);
    window.history.replaceState(null, '', `?${current.toString()}`);

    // use pushState if we want to add to back button history
    // window.history.pushState(null, '', `?${current.toString()}`);
    // console.timeEnd('ColumnPicker.handleClick');
  };

  if (
    trendsColumn &&
    trendsColumn in allColumns &&
    !standardColumns.includes(trendsColumn)
  ) {
    standardColumns.push(allColumns[trendsColumn].id);
  }

  const statsCompareChips: React.JSX.Element[] = [];

  for (let i = 0; i < standardColumns.length; i++) {
    const column = allColumns[standardColumns[i]];

    statsCompareChips.push(
      <Chip
        key = {column.id}
        style = {{ margin: '5px 5px 10px 5px' }}
        filled = {trendsColumn === column.id}
        value = {column.id}
        onClick = {() => { handleColumn(column.id); }}
        title = {column.label}
      />,
    );
  }

  statsCompareChips.push(
    <ColumnPicker key = {'player-stat-custom-column-picker'} options = {allColumns} selected = {trendsColumn ? [trendsColumn] : []} filled = {false} isRadio = {true} autoClose={true} actionHandler = {handleColumn} />,
  );


  // this will also include all the statistic_ranking columns
  type Data = {
    team_id: string;
    elo: number;
    date_of_rank: string;
    date_friendly: string;
  };

  const date_of_rank_x_data = {};
  let minYaxisElo = 1100;
  let maxYaxisElo = 2000;

  for (const player_statistic_ranking_id in player_statistic_rankings) {
    const row = player_statistic_rankings[player_statistic_ranking_id];

    // remove preseason rows, so it doesnt start at 0... I think is is fine, unless I make preseason predictions for stats
    if (!row.games) {
      continue;
    }

    if (!(row.date_of_rank in date_of_rank_x_data)) {
      date_of_rank_x_data[row.date_of_rank] = {
        date_of_rank: row.date_of_rank,
        date_friendly: moment(row.date_of_rank).format('MMM Do'),
      };
    }

    if (row.elo < minYaxisElo) {
      minYaxisElo = row.elo;
    }

    if (row.elo > maxYaxisElo) {
      maxYaxisElo = row.elo;
    }

    max = row.max;

    for (const key in row) {
      date_of_rank_x_data[row.date_of_rank][key] = row[key];
    }
  }

  for (const league_player_statistic_ranking_id in league_player_statistic_rankings) {
    const row = league_player_statistic_rankings[league_player_statistic_ranking_id];


    if (!(row.date_of_rank in date_of_rank_x_data)) {
      date_of_rank_x_data[row.date_of_rank] = {
        date_of_rank: row.date_of_rank,
        date_friendly: moment(row.date_of_rank).format('MMM Do'),
      };
    }

    for (const regularKey in row) {
      const modifiedKey = `league_${regularKey}`;
      date_of_rank_x_data[row.date_of_rank][modifiedKey] = row[regularKey];
    }
  }

  if (trendsBoxscoreLine) {
    for (const player_boxscore_id in player_boxscores) {
      const row = player_boxscores[player_boxscore_id];

      if (!(row.game_id in games)) {
        continue;
      }

      const date = games[row.game_id].start_date;

      if (!(date in date_of_rank_x_data)) {
        date_of_rank_x_data[date] = {
          date_of_rank: date,
          date_friendly: moment(row.date).format('MMM Do'),
        };
      }

      for (const regularKey in row) {
        const modifiedKey = `player_boxscore_${regularKey}${regularKey.includes('percentage') ? '' : '_per_game'}`;
        date_of_rank_x_data[date][modifiedKey] = row[regularKey];
      }
    }
  }


  // const rows: Data[] = Object.values(date_of_rank_x_data);
  let minYaxis: number | null = null;
  let maxYaxis: number | null = null;
  const rows: Data[] = [];
  for (const dor in date_of_rank_x_data) {
    const data = date_of_rank_x_data[dor];
    const value = data[trendsColumn];
    const playerBoxscoreValue = data[`player_boxscore_${trendsColumn}${trendsColumn.includes('percentage') ? '' : '_per_game'}`];
    const leagueValue = data[`league_${trendsColumn}`];

    let compareMaxValue = value;
    if (!compareMaxValue || leagueValue > compareMaxValue) {
      compareMaxValue = leagueValue;
    }
    if (!compareMaxValue || playerBoxscoreValue > compareMaxValue) {
      compareMaxValue = playerBoxscoreValue;
    }

    let compareMixValue = value;
    if (!compareMixValue || leagueValue < compareMixValue) {
      compareMixValue = leagueValue;
    }
    if (!compareMixValue || playerBoxscoreValue < compareMixValue) {
      compareMixValue = playerBoxscoreValue;
    }

    if (compareMixValue !== null || compareMixValue !== undefined) {
      if (
        minYaxis === null ||
        compareMixValue < minYaxis
      ) {
        minYaxis = compareMixValue;
      }
    }

    if (compareMaxValue !== null || compareMaxValue !== undefined) {
      if (
        maxYaxis === null ||
        compareMaxValue > maxYaxis
      ) {
        maxYaxis = compareMaxValue;
      }
    }

    rows.push(data);
  }


  // give the min and max some buffer
  const buffer = Math.ceil(((minYaxis || 0) + (maxYaxis || 0)) * 0.05);
  if (minYaxis !== null) {
    minYaxis = +(minYaxis - buffer).toFixed(0);
  }
  if (maxYaxis !== null) {
    maxYaxis = +(maxYaxis + buffer).toFixed(0);
  }

  if (trendsColumn === 'elo') {
    minYaxis = minYaxisElo;
    maxYaxis = maxYaxisElo;
  }

  const formattedData: Data[] = rows.sort((a: Data, b: Data) => (a.date_of_rank > b.date_of_rank ? 1 : -1));

  // connect the nulls
  let lastElo: number | null = null;
  for (let i = 0; i < formattedData.length; i++) {
    if (formattedData[i].elo) {
      lastElo = formattedData[i].elo;
    }

    if (lastElo && !('elo' in formattedData[i])) {
      formattedData[i].elo = lastElo;
    }
  }


  let chart: React.JSX.Element | null = null;

  if (trendsColumn in allColumns) {
    const statistic = allColumns[trendsColumn];

    const lines: LineProps[] = [
      {
        type: 'monotone',
        name: statistic.label,
        dataKey: statistic.id,
        stroke: theme.info.main,
        strokeWidth: 2,
        dot: false,
        connectNulls: true,
        unit: 'rank', // hijacking this unit param to display Rankspan in tooltip
      },
      {
        type: 'monotone',
        name: `NCAA ${statistic.label}`,
        dataKey: `league_${statistic.id}`,
        stroke: theme.secondary.dark,
        strokeWidth: 2,
        dot: false,
        connectNulls: true,
      },
    ];

    if (trendsBoxscoreLine) {
      // insert the line in the second position
      lines.splice(1, 0, {
        type: 'monotone',
        name: `Box. ${statistic.label}`,
        dataKey: `player_boxscore_${statistic.id}`,
        stroke: theme.success.dark,
        strokeWidth: 2,
        dot: true,
        connectNulls: true,
      });
    }

    const YAxisProps: YAxisProps = { scale: 'auto' };
    if (minYaxis !== null && maxYaxis !== null) {
      YAxisProps.domain = [minYaxis, maxYaxis];
    }
    chart = <Chart XAxisDataKey={'date_friendly'} YAxisLabel={statistic.label} rows={formattedData} lines={lines} YAxisProps={YAxisProps} rankMax = {max} />;
  }


  return (
    <>
      <div style = {{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div><AdditionalOptions /></div>
        <div style = {{ display: 'flex', textAlign: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
          {statsCompareChips}
        </div>
        <div></div>
      </div>
      <div style = {{ textAlign: 'center' }}>
        {!formattedData.length ? <Typography style = {{ textAlign: 'center', margin: '10px 0px' }} type = 'h5'>Nothing here yet...</Typography> : ''}
        {formattedData.length ? chart : ''}
      </div>
    </>
  );
};

export default StatsGraph;
