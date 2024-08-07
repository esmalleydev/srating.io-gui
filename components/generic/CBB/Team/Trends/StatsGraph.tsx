'use client';

import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import { Chip, useTheme } from '@mui/material';
import Chart from '@/components/generic/Chart';
import { LineProps, YAxisProps } from 'recharts';
import moment from 'moment';
import ColumnPicker from '@/components/generic/CBB/ColumnPicker';

// todo: pass the chart component a custom tool tip, with the RankSpan component, so on the graph, when I hover over each position, it shows the ranking out of everyone ex: 3P%: 49% - 25th

const StatsGraph = ({
  cbb_statistic_rankings, cbb_elos, cbb_games, cbb_conference_statistic_rankings, cbb_league_statistics,
}) => {
  const [selectedChip, setSelectedChip] = useState('adjusted_efficiency_rating');
  const [customColumn, setCustomColumn] = useState<string | null>(null);
  const [customColumnsOpen, setCustomColumnsOpen] = useState(false);

  const allColumns = getAllColumns();
  const standardColumns = [
    'adjusted_efficiency_rating',
    'points',
    'field_goal_percentage',
    'elo',
  ];

  const theme = useTheme();

  if (customColumn && customColumn in allColumns) {
    standardColumns.push(allColumns[customColumn].id);
  }


  const statsCompareChips: React.JSX.Element[] = [];

  for (let i = 0; i < standardColumns.length; i++) {
    const column = allColumns[standardColumns[i]];
    statsCompareChips.push(
      <Chip
        key = {column.id}
        sx = {{ margin: '5px 5px 10px 5px' }}
        variant = {selectedChip === column.id ? 'filled' : 'outlined'}
        color = {selectedChip === column.id ? 'success' : 'primary'}
        onClick = {() => { setSelectedChip(column.id); }}
        label = {column.label}
      />,
    );
  }

  statsCompareChips.push(
    <Chip
      key = {'custom'}
      sx = {{ margin: '5px 5px 10px 5px' }}
      variant = {selectedChip === 'custom' ? 'filled' : 'outlined'}
      color = {selectedChip === 'custom' ? 'success' : 'primary'}
      onClick = {() => { handleCustom(); }}
      label = {'+ Custom'}
    />,
  );

  const handleCustom = () => {
    setCustomColumnsOpen(true);
  };

  const handlCustomColumnsSave = (columns) => {
    const selectedColumn = columns.length ? columns[0] : null;
    setCustomColumnsOpen(false);

    if (!standardColumns.includes(selectedColumn)) {
      setCustomColumn(selectedColumn);
    }

    if (selectedColumn) {
      setSelectedChip(selectedColumn);
    }
  };

  const handlCustomColumnsExit = () => {
    setCustomColumnsOpen(false);
  };


  // this will also include all the cbb_statistic_ranking columns
  type Data = {
    team_id: string;
    elo: number;
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

    for (const key in row) {
      date_of_rank_x_data[row.date_of_rank][key] = row[key];
    }
  }

  for (const cbb_conference_statistic_ranking_id in cbb_conference_statistic_rankings) {
    const row = cbb_conference_statistic_rankings[cbb_conference_statistic_ranking_id];

    if (!(row.date_of_rank in date_of_rank_x_data)) {
      date_of_rank_x_data[row.date_of_rank] = {
        date_of_rank: row.date_of_rank,
        date_friendly: moment(row.date_of_rank).format('MMM Do'),
      };
    }

    for (const regularKey in row) {
      const modifiedKey = `conf_${regularKey}`;
      date_of_rank_x_data[row.date_of_rank][modifiedKey] = row[regularKey];
    }
  }

  for (const cbb_league_statistic_id in cbb_league_statistics) {
    const row = cbb_league_statistics[cbb_league_statistic_id];

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

  let minYaxisElo = 1100;
  let maxYaxisElo = 2000;

  for (const cbb_elo_id in cbb_elos) {
    const row = cbb_elos[cbb_elo_id];

    if (row.elo < minYaxisElo) {
      minYaxisElo = row.elo;
    }

    if (row.elo > maxYaxisElo) {
      maxYaxisElo = row.elo;
    }

    if (row.cbb_game_id && row.cbb_game_id in cbb_games) {
      const { start_date } = cbb_games[row.cbb_game_id];

      if (!(start_date in date_of_rank_x_data)) {
        date_of_rank_x_data[start_date] = {
          date_of_rank: start_date,
          date_friendly: moment(start_date).format('MMM Do'),
        };
      }

      date_of_rank_x_data[start_date].elo = row.elo;
    }
  }

  let lastElo = null;
  // connect the nulls
  for (const date_of_rank in date_of_rank_x_data) {
    if (date_of_rank_x_data[date_of_rank].elo) {
      lastElo = date_of_rank_x_data[date_of_rank].elo;
    }

    if (lastElo && !('elo' in date_of_rank_x_data[date_of_rank])) {
      date_of_rank_x_data[date_of_rank].elo = lastElo;
    }
  }

  // const rows: Data[] = Object.values(date_of_rank_x_data);
  let minYaxis: number | null = null;
  let maxYaxis: number | null = null;
  const rows: Data[] = [];
  for (const dor in date_of_rank_x_data) {
    const data = date_of_rank_x_data[dor];

    if (selectedChip in data) {
      if (
        minYaxis === null ||
        data[selectedChip] < minYaxis
      ) {
        minYaxis = data[selectedChip];
      }

      if (
        maxYaxis === null ||
        data[selectedChip] > maxYaxis
      ) {
        maxYaxis = data[selectedChip];
      }
    }

    rows.push(data);
  }

  if (selectedChip === 'elo') {
    minYaxis = minYaxisElo;
    maxYaxis = maxYaxisElo;
  }

  const formattedData: Data[] = rows.sort((a: Data, b: Data) => (a.date_of_rank > b.date_of_rank ? 1 : -1));

  let chart: React.JSX.Element | null = null;

  if (selectedChip in allColumns) {
    const statistic = allColumns[selectedChip];

    const lines: LineProps[] = [
      {
        type: 'monotone',
        name: statistic.label,
        dataKey: statistic.id,
        stroke: theme.palette.info.main,
        strokeWidth: 2,
        dot: false,
        connectNulls: true,
      },
      {
        type: 'monotone',
        name: `Conf. ${statistic.label}`,
        dataKey: `conf_${statistic.id}`,
        stroke: theme.palette.warning.main,
        strokeWidth: 2,
        dot: false,
        connectNulls: true,
      },
      {
        type: 'monotone',
        name: `League ${statistic.label}`,
        dataKey: `league_${statistic.id}`,
        stroke: theme.palette.secondary.dark,
        strokeWidth: 2,
        dot: false,
        connectNulls: true,
      },
    ];

    const YAxisProps: YAxisProps = { scale: 'auto' };
    if (minYaxis !== null && maxYaxis !== null) {
      YAxisProps.domain = [minYaxis, maxYaxis];
    }
    chart = <Chart XAxisDataKey={'date_friendly'} YAxisLabel={statistic.label} rows={formattedData} lines={lines} YAxisProps={YAxisProps} />;
  }


  return (
    <>
      <div style = {{ padding: '10px 10px 0px 10px', textAlign: 'center' }}>
        {statsCompareChips}
        {!formattedData.length ? <Typography style = {{ textAlign: 'center', margin: '10px 0px' }} variant = 'h5'>Nothing here yet...</Typography> : ''}
        {formattedData.length ? chart : ''}
      </div>
      <ColumnPicker key = {'team-stat-custom-column-picker'} options = {allColumns} open = {customColumnsOpen} selected = {customColumn ? [customColumn] : []} saveHandler = {handlCustomColumnsSave} closeHandler = {handlCustomColumnsExit} limit = {1} title='Select a column' />
    </>
  );
};

const getAllColumns = () => ({
  field_goal: {
    id: 'field_goal',
    numeric: true,
    label: 'FG',
    tooltip: 'Average field goals per game',
    sort: 'higher',
  },
  field_goal_attempts: {
    id: 'field_goal_attempts',
    numeric: true,
    label: 'FGA',
    tooltip: 'Average field goal attempts per game',
    sort: 'higher',
  },
  field_goal_percentage: {
    id: 'field_goal_percentage',
    numeric: true,
    label: 'FG%',
    tooltip: 'Field goal percentage',
    sort: 'higher',
  },
  two_point_field_goal: {
    id: 'two_point_field_goal',
    numeric: true,
    label: '2FG',
    tooltip: 'Average two point field goals per game',
    sort: 'higher',
  },
  two_point_field_goal_attempts: {
    id: 'two_point_field_goal_attempts',
    numeric: true,
    label: '2FGA',
    tooltip: 'Average two point field goal attempts per game',
    sort: 'higher',
  },
  two_point_field_goal_percentage: {
    id: 'two_point_field_goal_percentage',
    numeric: true,
    label: '2FG%',
    tooltip: 'Two point field goal percentage',
    sort: 'higher',
  },
  three_point_field_goal: {
    id: 'three_point_field_goal',
    numeric: true,
    label: '3FG',
    tooltip: 'Average three point field goals per game',
    sort: 'higher',
  },
  three_point_field_goal_attempts: {
    id: 'three_point_field_goal_attempts',
    numeric: true,
    label: '3FGA',
    tooltip: 'Average three field goal attempts per game',
    sort: 'higher',
  },
  three_point_field_goal_percentage: {
    id: 'three_point_field_goal_percentage',
    numeric: true,
    label: '3FG%',
    tooltip: 'Three field goal percentage',
    sort: 'higher',
  },
  free_throws: {
    id: 'free_throws',
    numeric: true,
    label: 'FT',
    tooltip: 'Average free throws per game',
    sort: 'higher',
  },
  free_throw_attempts: {
    id: 'free_throw_attempts',
    numeric: true,
    label: 'FTA',
    tooltip: 'Average free throw attempts per game',
    sort: 'higher',
  },
  free_throw_percentage: {
    id: 'free_throw_percentage',
    numeric: true,
    label: 'FT%',
    tooltip: 'Free throw percentage',
    sort: 'higher',
  },
  offensive_rebounds: {
    id: 'offensive_rebounds',
    numeric: true,
    label: 'ORB',
    tooltip: 'Average offensive rebounds per game',
    sort: 'higher',
  },
  defensive_rebounds: {
    id: 'defensive_rebounds',
    numeric: true,
    label: 'DRB',
    tooltip: 'Average defensive rebounds per game',
    sort: 'higher',
  },
  total_rebounds: {
    id: 'total_rebounds',
    numeric: true,
    label: 'TRB',
    tooltip: 'Average total rebounds per game',
    sort: 'higher',
  },
  assists: {
    id: 'assists',
    numeric: true,
    label: 'AST',
    tooltip: 'Average assists per game',
    sort: 'higher',
  },
  steals: {
    id: 'steals',
    numeric: true,
    label: 'STL',
    tooltip: 'Average steals per game',
    sort: 'higher',
  },
  blocks: {
    id: 'blocks',
    numeric: true,
    label: 'BLK',
    tooltip: 'Average blocks per game',
    sort: 'higher',
  },
  turnovers: {
    id: 'turnovers',
    numeric: true,
    label: 'TOV',
    tooltip: 'Average turnovers per game',
    sort: 'lower',
  },
  fouls: {
    id: 'fouls',
    numeric: true,
    label: 'PF',
    tooltip: 'Average fouls per game',
    sort: 'lower',
  },
  offensive_rating: {
    id: 'offensive_rating',
    numeric: true,
    label: 'ORT',
    tooltip: 'Offensive rating ((PTS / Poss) * 100)',
    sort: 'higher',
  },
  defensive_rating: {
    id: 'defensive_rating',
    numeric: true,
    label: 'DRT',
    tooltip: 'Defensive rating ((Opp. PTS / Opp. Poss) * 100)',
    sort: 'lower',
  },
  wins: {
    id: 'wins',
    numeric: false,
    label: 'Wins',
    tooltip: 'Wins',
    sort: 'higher',
  },
  neutralwins: {
    id: 'neutralwins',
    numeric: true,
    label: 'Neut. wins',
    tooltip: 'Neutral wins',
    sort: 'higher',
  },
  neutrallosses: {
    id: 'neutrallosses',
    numeric: true,
    label: 'Neut. losses',
    tooltip: 'Neutral losses',
    sort: 'lower',
  },
  homewins: {
    id: 'homewins',
    numeric: true,
    label: 'Home wins',
    tooltip: 'Home wins',
    sort: 'higher',
  },
  homelosses: {
    id: 'homelosses',
    numeric: true,
    label: 'Home losses',
    tooltip: 'Home losses',
    sort: 'lower',
  },
  roadwins: {
    id: 'roadwins',
    numeric: true,
    label: 'Road wins',
    tooltip: 'Road wins',
    sort: 'higher',
  },
  roadlosses: {
    id: 'roadlosses',
    numeric: true,
    label: 'Road losses',
    tooltip: 'Road losses',
    sort: 'lower',
  },
  win_margin: {
    id: 'win_margin',
    numeric: true,
    label: 'Win margin',
    tooltip: 'Win margin',
    sort: 'higher',
  },
  loss_margin: {
    id: 'loss_margin',
    numeric: true,
    label: 'Loss margin',
    tooltip: 'Loss margin',
    sort: 'lower',
  },
  confwin_margin: {
    id: 'confwin_margin',
    numeric: true,
    label: 'C Win margin',
    tooltip: 'Conference Win margin',
    sort: 'higher',
  },
  confloss_margin: {
    id: 'confloss_margin',
    numeric: true,
    label: 'C Loss margin',
    tooltip: 'Conference Loss margin',
    sort: 'lower',
  },
  possessions: {
    id: 'possessions',
    numeric: true,
    label: 'Poss.',
    tooltip: 'Average possessions per game',
    sort: 'higher',
  },
  pace: {
    id: 'pace',
    numeric: true,
    label: 'Pace',
    tooltip: 'Average pace per game',
    sort: 'higher',
  },
  opponent_offensive_rating: {
    id: 'opponent_offensive_rating',
    numeric: true,
    label: 'oORT',
    tooltip: 'Opponent average Offensive rating',
    sort: 'higher',
  },
  opponent_defensive_rating: {
    id: 'opponent_defensive_rating',
    numeric: true,
    label: 'oDRT',
    tooltip: 'Opponent average Defensive rating ',
    sort: 'lower',
  },
  opponent_efficiency_rating: {
    id: 'opponent_efficiency_rating',
    numeric: true,
    label: 'aSOS',
    tooltip: 'Strength of schedule (Opponent Efficiency margin (oORT - oDRT))',
    sort: 'higher',
  },
  opponent_field_goal: {
    id: 'opponent_field_goal',
    numeric: true,
    label: 'Opp. FG',
    tooltip: 'Opponent average field goals per game',
    sort: 'lower',
  },
  opponent_field_goal_attempts: {
    id: 'opponent_field_goal_attempts',
    numeric: true,
    label: 'Opp. FGA',
    tooltip: 'Opponent average field goal attempts per game',
    sort: 'lower',
  },
  opponent_field_goal_percentage: {
    id: 'opponent_field_goal_percentage',
    numeric: true,
    label: 'Opp. FG%',
    tooltip: 'Opponent average field goal percentage per game',
    sort: 'lower',
  },
  opponent_two_point_field_goal: {
    id: 'opponent_two_point_field_goal',
    numeric: true,
    label: 'Opp. 2FG',
    tooltip: 'Opponent average two point field goals per game',
    sort: 'lower',
  },
  opponent_two_point_field_goal_attempts: {
    id: 'opponent_two_point_field_goal_attempts',
    numeric: true,
    label: 'Opp. 2FGA',
    tooltip: 'Opponent average two point field goal attempts per game',
    sort: 'lower',
  },
  opponent_two_point_field_goal_percentage: {
    id: 'opponent_two_point_field_goal_percentage',
    numeric: true,
    label: 'Opp. 2FG%',
    tooltip: 'Opponent average two point field goal percentage per game',
    sort: 'lower',
  },
  opponent_three_point_field_goal: {
    id: 'opponent_three_point_field_goal',
    numeric: true,
    label: 'Opp. 3FG',
    tooltip: 'Opponent average three point field goals per game',
    sort: 'lower',
  },
  opponent_three_point_field_goal_attempts: {
    id: 'opponent_three_point_field_goal_attempts',
    numeric: true,
    label: 'Opp. 3FGA',
    tooltip: 'Opponent average three point field goal attempts per game',
    sort: 'lower',
  },
  opponent_three_point_field_goal_percentage: {
    id: 'opponent_three_point_field_goal_percentage',
    numeric: true,
    label: 'Opp. 3FG%',
    tooltip: 'Opponent average three point field goal percentage per game',
    sort: 'lower',
  },
  opponent_free_throws: {
    id: 'opponent_free_throws',
    numeric: true,
    label: 'Opp. FT',
    tooltip: 'Opponent average free throws per game',
    sort: 'lower',
  },
  opponent_free_throw_attempts: {
    id: 'opponent_free_throw_attempts',
    numeric: true,
    label: 'Opp. FTA',
    tooltip: 'Opponent average free throw attempts per game',
    sort: 'lower',
  },
  opponent_free_throw_percentage: {
    id: 'opponent_free_throw_percentage',
    numeric: true,
    label: 'Opp. FT%',
    tooltip: 'Opponent average free throw percentage per game',
    sort: 'lower',
  },
  opponent_offensive_rebounds: {
    id: 'opponent_offensive_rebounds',
    numeric: true,
    label: 'Opp. ORB',
    tooltip: 'Opponent average offensive rebounds per game',
    sort: 'lower',
  },
  opponent_defensive_rebounds: {
    id: 'opponent_defensive_rebounds',
    numeric: true,
    label: 'Opp. DRB',
    tooltip: 'Opponent average defensive rebounds per game',
    sort: 'lower',
  },
  opponent_total_rebounds: {
    id: 'opponent_total_rebounds',
    numeric: true,
    label: 'Opp. TRB',
    tooltip: 'Opponent average total rebounds per game',
    sort: 'lower',
  },
  opponent_assists: {
    id: 'opponent_assists',
    numeric: true,
    label: 'Opp. AST',
    tooltip: 'Opponent average assists per game',
    sort: 'lower',
  },
  opponent_steals: {
    id: 'opponent_steals',
    numeric: true,
    label: 'Opp. STL',
    tooltip: 'Opponent average steals per game',
    sort: 'lower',
  },
  opponent_blocks: {
    id: 'opponent_blocks',
    numeric: true,
    label: 'Opp. BLK',
    tooltip: 'Opponent average blocks per game',
    sort: 'lower',
  },
  opponent_turnovers: {
    id: 'opponent_turnovers',
    numeric: true,
    label: 'Opp. TOV',
    tooltip: 'Opponent average turnovers per game',
    sort: 'higher',
  },
  opponent_fouls: {
    id: 'opponent_fouls',
    numeric: true,
    label: 'Opp. PF',
    tooltip: 'Opponent average fouls per game',
    sort: 'higher',
  },
  opponent_points: {
    id: 'opponent_points',
    numeric: true,
    label: 'Opp. PTS',
    tooltip: 'Opponent average points per game',
    sort: 'lower',
  },
  opponent_possessions: {
    id: 'opponent_possessions',
    numeric: true,
    label: 'Opp. Poss.',
    tooltip: 'Opponent average possessions per game',
    sort: 'lower',
  },
  adjusted_efficiency_rating: {
    id: 'adjusted_efficiency_rating',
    numeric: true,
    label: 'aEM',
    tooltip: 'Adjusted Efficiency margin (Offensive rating - Defensive rating) + aSOS',
    sort: 'higher',
  },
  points: {
    id: 'points',
    numeric: true,
    label: 'PTS',
    tooltip: 'Average points per game',
    sort: 'higher',
  },
  elo: {
    id: 'elo',
    numeric: true,
    label: 'SR',
    tooltip: 'srating.io ELO rating',
    sort: 'higher',
  },
});

export default StatsGraph;
