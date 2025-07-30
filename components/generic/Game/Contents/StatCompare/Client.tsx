'use client';

import React, { useState } from 'react';
import Chart from '@/components/generic/Chart';
import { LineProps, YAxisProps } from 'recharts';
import HelperGame from '@/components/helpers/Game';
import Color from '@/components/utils/Color';
import moment from 'moment';
import { getNavHeaderHeight, getSubNavHeaderHeight } from '@/components/generic/Game/NavBar';
import { footerNavigationHeight } from '@/components/generic/FooterNavigation';
import { headerBarHeight } from '@/components/generic/Header';
import { LinearProgress } from '@mui/material';
import Organization from '@/components/helpers/Organization';
import ColumnPickerFull from '@/components/generic/ColumnPickerFull';
import { RankingColumns } from '@/types/general';
import { useTheme } from '@/components/hooks/useTheme';
import Chip from '@/components/ux/container/Chip';
import Typography from '@/components/ux/text/Typography';
import TableColumns from '@/components/helpers/TableColumns';

/**
 * The main wrapper div for all the contents
 */
const Contents = ({ children }): React.JSX.Element => {
  return (
    <div style = {{ padding: 5 }}>
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


const Client = ({ game, statistic_rankings, elos }) => {
  const { organization_id } = game;

  const Game = new HelperGame({
    game,
  });

  let standardColumns = [
    'adjusted_efficiency_rating',
    'points',
    'field_goal_percentage',
    'elo',
  ];

  if (Organization.getCFBID() === organization_id) {
    standardColumns = [
      'passing_rating_college',
      'points',
      'yards_per_play',
      'elo',
    ];
  }

  const [selectedChip, setSelectedChip] = useState(standardColumns[0]);
  const [customColumn, setCustomColumn] = useState<string | null>(null);
  const [customColumnsOpen, setCustomColumnsOpen] = useState(false);


  const allColumns = TableColumns.getColumns({ organization_id, view: 'team', graphable: true });

  const theme = useTheme();
  const backgroundColor = theme.background.main;

  if (customColumn && customColumn in allColumns) {
    standardColumns.push(allColumns[customColumn].id);
  }


  const statsCompareChips: React.JSX.Element[] = [];

  for (let i = 0; i < standardColumns.length; i++) {
    const column = allColumns[standardColumns[i]];
    statsCompareChips.push(
      <Chip
        key = {column.id}
        style = {{ margin: '5px 5px 10px 5px' }}
        filled = {selectedChip === column.id}
        value = {column.id}
        onClick = {() => { setSelectedChip(column.id); }}
        title = {column.label}
      />,
    );
  }

  statsCompareChips.push(
    <Chip
      key = {'custom'}
      style = {{ margin: '5px 5px 10px 5px' }}
      filled = {selectedChip === 'custom' }
      value = {'custom'}
      onClick = {() => { handleCustom(); }}
      title = {'+ Custom'}
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

  type Data = {
    team_id: string;
    home_elo?: number;
    away_elo?: number;
    date_of_rank: string;
    date_friendly: string;
  };

  const date_of_rank_x_data = {};

  for (const statistic_ranking_id in statistic_rankings) {
    const row = statistic_rankings[statistic_ranking_id];

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

    const which = game.home_team_id === row.team_id ? 'home' : 'away';

    for (const key in row) {
      date_of_rank_x_data[row.date_of_rank][`${which}_${key}`] = row[key];
    }
  }


  let minYaxisElo = 1100;
  let maxYaxisElo = 2000;

  for (const elo_id in elos) {
    const row = elos[elo_id];

    // pre season
    if (!row.game_date) {
      continue;
    }

    if (row.elo < minYaxisElo) {
      minYaxisElo = row.elo;
    }

    if (row.elo > maxYaxisElo) {
      maxYaxisElo = row.elo;
    }

    const which = game.home_team_id === row.team_id ? 'home' : 'away';

    if (!(row.game_date in date_of_rank_x_data)) {
      date_of_rank_x_data[row.game_date] = {
        date_of_rank: row.game_date,
        date_friendly: moment(row.game_date).format('MMM Do'),
      };
    }

    date_of_rank_x_data[row.game_date][`${which}_elo`] = row.elo;
  }


  // const rows: Data[] = Object.values(date_of_rank_x_data);
  let minYaxis: number | null = null;
  let maxYaxis: number | null = null;
  const rows: Data[] = [];
  for (const dor in date_of_rank_x_data) {
    const data = date_of_rank_x_data[dor];
    const homeValue = data[`home_${selectedChip}`];
    const awayValue = data[`away_${selectedChip}`];

    if (
      `home_${selectedChip}` in data ||
      `away_${selectedChip}` in data
    ) {
      if (
        minYaxis === null ||
        homeValue < minYaxis ||
        awayValue < minYaxis
      ) {
        minYaxis = homeValue < awayValue ? homeValue : awayValue;
      }

      if (
        maxYaxis === null ||
        homeValue > maxYaxis ||
        awayValue > maxYaxis
      ) {
        maxYaxis = homeValue > awayValue ? homeValue : awayValue;
      }
    }

    rows.push(data);
  }

  // give the min and max some buffer
  const buffer = Math.ceil(((minYaxis || 0) + (maxYaxis || 0)) * 0.1);
  if (minYaxis !== null) {
    minYaxis = +(minYaxis - buffer).toFixed(0);
  }
  if (maxYaxis !== null) {
    maxYaxis = +(maxYaxis + buffer).toFixed(0);
  }

  if (selectedChip === 'elo') {
    minYaxis = minYaxisElo;
    maxYaxis = maxYaxisElo;
  }


  const formattedData: Data[] = rows.sort((a: Data, b: Data) => {
    return a.date_of_rank > b.date_of_rank ? 1 : -1;
  });

  let lastHomeElo: number | null | undefined = null;
  let lastAwayElo: number | null | undefined = null;
  // connect the nulls
  for (let i = 0; i < formattedData.length; i++) {
    if (formattedData[i].home_elo) {
      lastHomeElo = formattedData[i].home_elo;
    }

    if (lastHomeElo && !('home_elo' in formattedData[i])) {
      formattedData[i].home_elo = lastHomeElo;
    }

    if (formattedData[i].away_elo) {
      lastAwayElo = formattedData[i].away_elo;
    }

    if (lastAwayElo && !('away_elo' in formattedData[i])) {
      formattedData[i].away_elo = lastAwayElo;
    }
  }

  let chart: React.JSX.Element | null = null;

  const colors = Game.getColors();

  if (selectedChip in allColumns) {
    const statistic = allColumns[selectedChip];

    const lines: LineProps[] = [
      {
        type: 'monotone',
        name: Game.getTeamName('home'),
        dataKey: `home_${statistic.id}`,
        stroke: Color.getTextColor(colors.homeColor, backgroundColor),
        strokeWidth: 2,
        dot: false,
        connectNulls: true,
      },
      {
        type: 'monotone',
        name: Game.getTeamName('away'),
        dataKey: `away_${statistic.id}`,
        stroke: Color.getTextColor(colors.awayColor, backgroundColor),
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
    <Contents>
      <div style = {{ padding: '10px 10px 0px 10px', textAlign: 'center' }}>
        {statsCompareChips}
      </div>
      {!formattedData.length ? <Typography style = {{ textAlign: 'center', margin: '10px 0px' }} type = 'h5'>Nothing here yet...</Typography> : ''}
      {formattedData.length ? chart : ''}
      <ColumnPickerFull key = {'game-stat-custom-column-picker'} options = {allColumns} open = {customColumnsOpen} selected = {customColumn ? [customColumn] : []} saveHandler = {handlCustomColumnsSave} closeHandler = {handlCustomColumnsExit} limit = {1} title='Select a column' />
    </Contents>
  );
};

export { Client, ClientSkeleton };
