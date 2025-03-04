'use client';

import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import { Chip, useTheme } from '@mui/material';
import Chart from '@/components/generic/Chart';
import { LineProps, YAxisProps } from 'recharts';
import HelperGame from '@/components/helpers/Game';
import Color from '@/components/utils/Color';
import moment from 'moment';
import { getNavHeaderHeight } from '../NavBar';
import { getSubNavHeaderHeight } from '../SubNavBar';
import { footerNavigationHeight } from '@/components/generic/FooterNavigation';
import { headerBarHeight } from '@/components/generic/Header';
import { LinearProgress } from '@mui/material';
import Organization from '@/components/helpers/Organization';
import ColumnPicker from '../../ColumnPicker';
import { RankingColumns } from '@/types/general';

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


  const allColumns = getAllColumns({ organization_id });

  const theme = useTheme();
  const backgroundColor = theme.palette.background.default;

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
      {!formattedData.length ? <Typography style = {{ textAlign: 'center', margin: '10px 0px' }} variant = 'h5'>Nothing here yet...</Typography> : ''}
      {formattedData.length ? chart : ''}
      <ColumnPicker key = {'game-stat-custom-column-picker'} options = {allColumns} open = {customColumnsOpen} selected = {customColumn ? [customColumn] : []} saveHandler = {handlCustomColumnsSave} closeHandler = {handlCustomColumnsExit} limit = {1} title='Select a column' />
    </Contents>
  );
};

const getAllColumns = ({ organization_id }): RankingColumns => {
  if (Organization.getCBBID() === organization_id) {
    return {
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
    };
  }

  if (Organization.getCFBID() === organization_id) {
    return {
      points: {
        id: 'points',
        numeric: true,
        label: 'PTS',
        tooltip: 'Points',
        sort: 'higher',
      },
      passing_attempts: {
        id: 'passing_attempts',
        numeric: true,
        label: 'Pass att.',
        tooltip: 'Passing attempts',
        sort: 'higher',
      },
      passing_completions: {
        id: 'passing_completions',
        numeric: true,
        label: 'Pass comp.',
        tooltip: 'Passing completions',
        sort: 'higher',
      },
      passing_yards: {
        id: 'passing_yards',
        numeric: true,
        label: 'Pass yards',
        tooltip: 'Passing yards',
        sort: 'higher',
      },
      passing_completion_percentage: {
        id: 'passing_completion_percentage',
        numeric: true,
        label: 'Pass comp. %',
        tooltip: 'Passing completions percentage',
        sort: 'higher',
      },
      passing_yards_per_attempt: {
        id: 'passing_yards_per_attempt',
        numeric: true,
        label: 'Pass yards per att.',
        tooltip: 'Passing yard per attempt',
        sort: 'higher',
      },
      passing_yards_per_completion: {
        id: 'passing_yards_per_completion',
        numeric: true,
        label: 'Pass yards per comp.',
        tooltip: 'Passing yards per completion',
        sort: 'higher',
      },
      passing_touchdowns: {
        id: 'passing_touchdowns',
        numeric: true,
        label: 'Pass TD',
        tooltip: 'Passing touchdowns',
        sort: 'higher',
      },
      passing_interceptions: {
        id: 'passing_interceptions',
        numeric: true,
        label: 'Pass int.',
        tooltip: 'Passing interceptions',
        sort: 'higher',
      },
      passing_rating_pro: {
        id: 'passing_rating_pro',
        numeric: true,
        label: 'QBR(p)',
        tooltip: 'Quarter back rating (pro)',
        sort: 'higher',
      },
      passing_rating_college: {
        id: 'passing_rating_college',
        numeric: true,
        label: 'QBR(c)',
        tooltip: 'Quarter back rating (college)',
        sort: 'higher',
      },
      passing_long: {
        id: 'passing_long',
        numeric: true,
        label: 'Pass long',
        tooltip: 'Passing long',
        sort: 'higher',
      },
      rushing_attempts: {
        id: 'rushing_attempts',
        numeric: true,
        label: 'Rush att.',
        tooltip: 'Rushing attempts',
        sort: 'higher',
      },
      rushing_yards: {
        id: 'rushing_yards',
        numeric: true,
        label: 'Rush yards',
        tooltip: 'Rushing yards',
        sort: 'higher',
      },
      rushing_yards_per_attempt: {
        id: 'rushing_yards_per_attempt',
        numeric: true,
        label: 'Rush yards per att.',
        tooltip: 'Rushing yards per attempt',
        sort: 'higher',
      },
      rushing_touchdowns: {
        id: 'rushing_touchdowns',
        numeric: true,
        label: 'Rush TD',
        tooltip: 'Rushing touchdowns',
        sort: 'higher',
      },
      rushing_long: {
        id: 'rushing_long',
        numeric: true,
        label: 'Rush long',
        tooltip: 'Rushing long',
        sort: 'higher',
      },
      receptions: {
        id: 'receptions',
        numeric: true,
        label: 'Receptions',
        tooltip: '# of receptions',
        sort: 'higher',
      },
      receiving_yards: {
        id: 'receiving_yards',
        numeric: true,
        label: 'Rec. yards',
        tooltip: 'Receiving yards',
        sort: 'higher',
      },
      receiving_yards_per_reception: {
        id: 'receiving_yards_per_reception',
        numeric: true,
        label: 'Rec. yards per recep.',
        tooltip: 'Receiving yards per reception',
        sort: 'higher',
      },
      receiving_touchdowns: {
        id: 'receiving_touchdowns',
        numeric: true,
        label: 'Rec. TD',
        tooltip: 'Receiving touchdowns',
        sort: 'higher',
      },
      receiving_long: {
        id: 'receiving_long',
        numeric: true,
        label: 'Rec. long',
        tooltip: 'Receiving long',
        sort: 'higher',
      },
      // punt_returns: {
      //   id: 'punt_returns',
      //   numeric: true,
      //   label: 'Punt ret.',
      //   tooltip: 'Punt returns',
      //   sort: 'higher',
      // },
      // punt_return_yards: {
      //   id: 'punt_return_yards',
      //   numeric: true,
      //   label: 'Punt ret. yards',
      //   tooltip: 'Punt return yards',
      //   sort: 'higher',
      // },
      // punt_return_yards_per_attempt: {
      //   id: 'punt_return_yards_per_attempt',
      //   numeric: true,
      //   label: 'Punt ret. yards per att.',
      //   tooltip: 'Punt return yards per attempt',
      //   sort: 'higher',
      // },
      // punt_return_touchdowns: {
      //   id: 'punt_return_touchdowns',
      //   numeric: true,
      //   label: 'Punt ret. TD',
      //   tooltip: 'Punt return touchdowns',
      //   sort: 'higher',
      // },
      // punt_return_long: {
      //   id: 'punt_return_long',
      //   numeric: true,
      //   label: 'Punt ret. long',
      //   tooltip: 'Punt return long',
      //   sort: 'higher',
      // },
      // kick_returns: {
      //   id: 'kick_returns',
      //   numeric: true,
      //   label: 'Kick ret.',
      //   tooltip: 'Kick returns',
      //   sort: 'higher',
      // },
      // kick_return_yards: {
      //   id: 'kick_return_yards',
      //   numeric: true,
      //   label: 'Kick ret. yards',
      //   tooltip: 'Kick return yards',
      //   sort: 'higher',
      // },
      // kick_return_yards_per_attempt: {
      //   id: 'kick_return_yards_per_attempt',
      //   numeric: true,
      //   label: 'Kick ret. yards per att.',
      //   tooltip: 'Kick return yards per attempt',
      //   sort: 'higher',
      // },
      // kick_return_touchdowns: {
      //   id: 'kick_return_touchdowns',
      //   numeric: true,
      //   label: 'Kick ret. TD',
      //   tooltip: 'Kick return touchdowns',
      //   sort: 'higher',
      // },
      // kick_return_long: {
      //   id: 'kick_return_long',
      //   numeric: true,
      //   label: 'Kick ret. long',
      //   tooltip: 'Kick return long',
      //   sort: 'higher',
      // },
      // punts: {
      //   id: 'punts',
      //   numeric: true,
      //   label: 'Punts',
      //   tooltip: 'Punts',
      //   sort: 'higher',
      // },
      // punt_yards: {
      //   id: 'punt_yards',
      //   numeric: true,
      //   label: 'Punt yards',
      //   tooltip: 'Punt yards',
      //   sort: 'higher',
      // },
      // punt_average: {
      //   id: 'punt_average',
      //   numeric: true,
      //   label: 'Punt avg.',
      //   tooltip: 'Punt average',
      //   sort: 'higher',
      // },
      // punt_long: {
      //   id: 'punt_long',
      //   numeric: true,
      //   label: 'Punt long',
      //   tooltip: 'Punt long',
      //   sort: 'higher',
      // },
      // field_goals_attempted: {
      //   id: 'field_goals_attempted',
      //   numeric: true,
      //   label: 'FG att.',
      //   tooltip: 'Field goals attempted',
      //   sort: 'higher',
      // },
      // field_goals_made: {
      //   id: 'field_goals_made',
      //   numeric: true,
      //   label: 'FGs',
      //   tooltip: 'Field goals made',
      //   sort: 'higher',
      // },
      // field_goal_percentage: {
      //   id: 'field_goal_percentage',
      //   numeric: true,
      //   label: 'FG%',
      //   tooltip: 'Field goal percentage',
      //   sort: 'higher',
      // },
      // field_goals_longest_made: {
      //   id: 'field_goals_longest_made',
      //   numeric: true,
      //   label: 'FG long',
      //   tooltip: 'Field goal longest made',
      //   sort: 'higher',
      // },
      // extra_points_attempted: {
      //   id: 'extra_points_attempted',
      //   numeric: true,
      //   label: '2pt att.',
      //   tooltip: '2pt conversion attempts',
      //   sort: 'higher',
      // },
      // extra_points_made: {
      //   id: 'extra_points_made',
      //   numeric: true,
      //   label: '2pt con.',
      //   tooltip: '2pt conversions',
      //   sort: 'higher',
      // },
      // interceptions: {
      //   id: 'interceptions',
      //   numeric: true,
      //   label: 'Int.',
      //   tooltip: 'Interceptions',
      //   sort: 'higher',
      // },
      // interception_return_yards: {
      //   id: 'interception_return_yards',
      //   numeric: true,
      //   label: 'Int. ret. yards',
      //   tooltip: 'Interceptions return yards',
      //   sort: 'higher',
      // },
      // interception_return_touchdowns: {
      //   id: 'interception_return_touchdowns',
      //   numeric: true,
      //   label: 'Int. ret. TD',
      //   tooltip: 'Interceptions return touchdowns',
      //   sort: 'higher',
      // },
      // solo_tackles: {
      //   id: 'solo_tackles',
      //   numeric: true,
      //   label: 'Solo tackle',
      //   tooltip: 'Solo tackles',
      //   sort: 'higher',
      // },
      // assisted_tackles: {
      //   id: 'assisted_tackles',
      //   numeric: true,
      //   label: 'Ast. tackle',
      //   tooltip: 'Assisted tackles',
      //   sort: 'higher',
      // },
      // tackles_for_loss: {
      //   id: 'tackles_for_loss',
      //   numeric: true,
      //   label: 'Tackle for loss',
      //   tooltip: 'Tackles for loss',
      //   sort: 'higher',
      // },
      // sacks: {
      //   id: 'sacks',
      //   numeric: true,
      //   label: 'Sacks',
      //   tooltip: 'Sacks',
      //   sort: 'higher',
      // },
      // passes_defended: {
      //   id: 'passes_defended',
      //   numeric: true,
      //   label: 'Pass defended',
      //   tooltip: 'Passes defended',
      //   sort: 'higher',
      // },
      // fumbles_recovered: {
      //   id: 'fumbles_recovered',
      //   numeric: true,
      //   label: 'Fumble rec.',
      //   tooltip: 'Fumbles recovered',
      //   sort: 'higher',
      // },
      // fumble_return_touchdowns: {
      //   id: 'fumble_return_touchdowns',
      //   numeric: true,
      //   label: 'Fumble ret. TD',
      //   tooltip: 'Fumbles returned to touchdown',
      //   sort: 'higher',
      // },
      // quarterback_hurries: {
      //   id: 'quarterback_hurries',
      //   numeric: true,
      //   label: 'QB hurry',
      //   tooltip: 'QB hurries',
      //   sort: 'higher',
      // },
      // fumbles: {
      //   id: 'fumbles',
      //   numeric: true,
      //   label: 'Fumbles',
      //   tooltip: 'Fumbles',
      //   sort: 'lower',
      // },
      // fumbles_lost: {
      //   id: 'fumbles_lost',
      //   numeric: true,
      //   label: 'Fumbles lost',
      //   tooltip: 'Fumbles lost',
      //   sort: 'lower',
      // },
      wins: {
        id: 'wins',
        numeric: false,
        label: 'W/L',
        tooltip: 'Win/Loss',
        sort: 'higher',
      },
      conf_record: {
        id: 'conf_record',
        numeric: false,
        label: 'CR',
        tooltip: 'Conference Record Win/Loss',
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
      streak: {
        id: 'streak',
        numeric: true,
        label: 'Streak',
        tooltip: 'Number of wins or losses in a row (negative for loss)',
        sort: 'higher',
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
      elo: {
        id: 'elo',
        numeric: true,
        label: 'SR',
        tooltip: 'srating.io ELO rating',
        sort: 'higher',
      },
      elo_sos: {
        id: 'elo_sos',
        numeric: true,
        label: 'eSOS',
        tooltip: 'Strength of schedule (opponent elo)',
        sort: 'higher',
      },
      yards_per_play: {
        id: 'yards_per_play',
        numeric: true,
        label: 'YPP',
        tooltip: 'Yards per play',
        sort: 'higher',
      },
      points_per_play: {
        id: 'points_per_play',
        numeric: true,
        label: 'PPP',
        tooltip: 'Points per play',
        sort: 'higher',
      },
      // successful_pass_plays: {
      //   id: 'successful_pass_plays',
      //   numeric: true,
      //   label: 'SPP',
      //   tooltip: 'Successful pass plays',
      //   sort: 'higher',
      // },
      // successful_rush_plays: {
      //   id: 'successful_rush_plays',
      //   numeric: true,
      //   label: 'SRP',
      //   tooltip: 'Successful rush plays',
      //   sort: 'higher',
      // },
      // offensive_dvoa: {
      //   id: 'offensive_dvoa',
      //   numeric: true,
      //   label: 'O-DVOA',
      //   tooltip: 'offensive_dvoa', // todo
      //   sort: 'higher',
      // },
      // defensive_dvoa: {
      //   id: 'defensive_dvoa',
      //   numeric: true,
      //   label: 'D-DVOA',
      //   tooltip: 'defensive_dvoa', // todo
      //   sort: 'higher', // todo
      // },
      // first_downs: {
      //   id: 'first_downs',
      //   numeric: true,
      //   label: '1st downs',
      //   tooltip: '1st downs',
      //   sort: 'higher',
      // },
      // third_down_conversions: {
      //   id: 'third_down_conversions',
      //   numeric: true,
      //   label: '3rd down conv.',
      //   tooltip: '3rd down conversion',
      //   sort: 'higher',
      // },
      // third_down_attempts: {
      //   id: 'third_down_attempts',
      //   numeric: true,
      //   label: '3rd down att.',
      //   tooltip: '3rd down attempts',
      //   sort: 'higher',
      // },
      // fourth_down_conversions: {
      //   id: 'fourth_down_conversions',
      //   numeric: true,
      //   label: '4rd down conv.',
      //   tooltip: '4rd down conversion',
      //   sort: 'higher',
      // },
      // fourth_down_attempts: {
      //   id: 'fourth_down_attempts',
      //   numeric: true,
      //   label: '4rd down att.',
      //   tooltip: '4rd down attempts',
      //   sort: 'higher',
      // },
      // time_of_possession_seconds: {
      //   id: 'time_of_possession_seconds',
      //   numeric: true,
      //   label: 'ToP',
      //   tooltip: 'Time of possession in seconds',
      //   sort: 'higher',
      // },
      opponent_points: {
        id: 'opponent_points',
        numeric: true,
        label: 'Opp. PTS',
        tooltip: 'Opponent points',
        sort: 'higher',
      },
      opponent_yards_per_play: {
        id: 'opponent_yards_per_play',
        numeric: true,
        label: 'Opp. YPP',
        tooltip: 'Opponent Yards per play',
        sort: 'higher',
      },
      opponent_points_per_play: {
        id: 'opponent_points_per_play',
        numeric: true,
        label: 'Opp. PPP',
        tooltip: 'Opponent Points per play',
        sort: 'higher',
      },
      // opponent_successful_pass_plays: {
      //   id: 'opponent_successful_pass_plays',
      //   numeric: true,
      //   label: 'Opp. SPP',
      //   tooltip: 'Opponent Successful pass plays',
      //   sort: 'higher',
      // },
      // opponent_successful_rush_plays: {
      //   id: 'opponent_successful_rush_plays',
      //   numeric: true,
      //   label: 'Opp. SRP',
      //   tooltip: 'Opponent Successful rush plays',
      //   sort: 'higher',
      // },
      // opponent_offensive_dvoa: {
      //   id: 'opponent_offensive_dvoa',
      //   numeric: true,
      //   label: 'Opp. O-DVOA',
      //   tooltip: 'Opponent offensive_dvoa', // todo
      //   sort: 'higher',
      // },
      // opponent_defensive_dvoa: {
      //   id: 'opponent_defensive_dvoa',
      //   numeric: true,
      //   label: 'Opp. D-DVOA',
      //   tooltip: 'Opponent defensive_dvoa', // todo
      //   sort: 'higher', // todo
      // },
      // opponent_first_downs: {
      //   id: 'opponent_first_downs',
      //   numeric: true,
      //   label: 'Opp. 1st downs',
      //   tooltip: 'Opponent 1st downs',
      //   sort: 'higher',
      // },
      // opponent_third_down_conversions: {
      //   id: 'opponent_third_down_conversions',
      //   numeric: true,
      //   label: 'Opp. 3rd down conv.',
      //   tooltip: 'Opponent 3rd down conversion',
      //   sort: 'higher',
      // },
      // opponent_third_down_attempts: {
      //   id: 'opponent_third_down_attempts',
      //   numeric: true,
      //   label: 'Opp. 3rd down att.',
      //   tooltip: 'Opponent 3rd down attempts',
      //   sort: 'higher',
      // },
      // opponent_fourth_down_conversions: {
      //   id: 'opponent_fourth_down_conversions',
      //   numeric: true,
      //   label: 'Opp. 4rd down conv.',
      //   tooltip: 'Opponent 4rd down conversion',
      //   sort: 'higher',
      // },
      // opponent_fourth_down_attempts: {
      //   id: 'opponent_fourth_down_attempts',
      //   numeric: true,
      //   label: 'Opp. 4rd down att.',
      //   tooltip: 'Opponent 4rd down attempts',
      //   sort: 'higher',
      // },
      // opponent_time_of_possession_seconds: {
      //   id: 'opponent_time_of_possession_seconds',
      //   numeric: true,
      //   label: 'Opp. ToP',
      //   tooltip: 'Opponent Time of possession in seconds',
      //   sort: 'higher',
      // },
      opponent_passing_attempts: {
        id: 'opponent_passing_attempts',
        numeric: true,
        label: 'Opp. Pass att.',
        tooltip: 'Opponent Passing attempts',
        sort: 'higher',
      },
      opponent_passing_completions: {
        id: 'opponent_passing_completions',
        numeric: true,
        label: 'Opp. Pass comp.',
        tooltip: 'Opponent Passing completions',
        sort: 'higher',
      },
      opponent_passing_yards: {
        id: 'opponent_passing_yards',
        numeric: true,
        label: 'Opp. Pass yards',
        tooltip: 'Opponent Passing yards',
        sort: 'higher',
      },
      opponent_passing_completion_percentage: {
        id: 'opponent_passing_completion_percentage',
        numeric: true,
        label: 'Opp. Pass comp. %',
        tooltip: 'Opponent Passing completions percentage',
        sort: 'higher',
      },
      opponent_passing_yards_per_attempt: {
        id: 'opponent_passing_yards_per_attempt',
        numeric: true,
        label: 'Opp. Pass yards per att.',
        tooltip: 'Opponent Passing yard per attempt',
        sort: 'higher',
      },
      opponent_passing_yards_per_completion: {
        id: 'opponent_passing_yards_per_completion',
        numeric: true,
        label: 'Opp. Pass yards per comp.',
        tooltip: 'Opponent Passing yards per completion',
        sort: 'higher',
      },
      opponent_passing_touchdowns: {
        id: 'opponent_passing_touchdowns',
        numeric: true,
        label: 'Opp. Pass TD',
        tooltip: 'Opponent Passing touchdowns',
        sort: 'higher',
      },
      opponent_passing_interceptions: {
        id: 'opponent_passing_interceptions',
        numeric: true,
        label: 'Opp. Pass int.',
        tooltip: 'Opponent Passing interceptions',
        sort: 'higher',
      },
      opponent_passing_rating_pro: {
        id: 'opponent_passing_rating_pro',
        numeric: true,
        label: 'Opp. QBR(p)',
        tooltip: 'Opponent Quarter back rating (pro)',
        sort: 'higher',
      },
      opponent_passing_rating_college: {
        id: 'opponent_passing_rating_college',
        numeric: true,
        label: 'Opp. QBR(c)',
        tooltip: 'Opponent Quarter back rating (college)',
        sort: 'higher',
      },
      opponent_passing_long: {
        id: 'opponent_passing_long',
        numeric: true,
        label: 'Opp. Pass long',
        tooltip: 'Opponent Passing long',
        sort: 'higher',
      },
      opponent_rushing_attempts: {
        id: 'opponent_rushing_attempts',
        numeric: true,
        label: 'Opp. Rush att.',
        tooltip: 'Opponent Rushing attempts',
        sort: 'higher',
      },
      opponent_rushing_yards: {
        id: 'opponent_rushing_yards',
        numeric: true,
        label: 'Opp. Rush yards',
        tooltip: 'Opponent Rushing yards',
        sort: 'higher',
      },
      opponent_rushing_yards_per_attempt: {
        id: 'opponent_rushing_yards_per_attempt',
        numeric: true,
        label: 'Opp. Rush yards per att.',
        tooltip: 'Opponent Rushing yards per attempt',
        sort: 'higher',
      },
      opponent_rushing_touchdowns: {
        id: 'opponent_rushing_touchdowns',
        numeric: true,
        label: 'Opp. Rush TD',
        tooltip: 'Opponent Rushing touchdowns',
        sort: 'higher',
      },
      opponent_rushing_long: {
        id: 'opponent_rushing_long',
        numeric: true,
        label: 'Opp. Rush long',
        tooltip: 'Opponent Rushing long',
        sort: 'higher',
      },
      opponent_receptions: {
        id: 'opponent_receptions',
        numeric: true,
        label: 'Opp. Receptions',
        tooltip: 'Opponent # of receptions',
        sort: 'higher',
      },
      opponent_receiving_yards: {
        id: 'opponent_receiving_yards',
        numeric: true,
        label: 'Opp. Rec. yards',
        tooltip: 'Opponent Receiving yards',
        sort: 'higher',
      },
      opponent_receiving_yards_per_reception: {
        id: 'opponent_receiving_yards_per_reception',
        numeric: true,
        label: 'Opp. Rec. yards per recep.',
        tooltip: 'Opponent Receiving yards per reception',
        sort: 'higher',
      },
      opponent_receiving_touchdowns: {
        id: 'opponent_receiving_touchdowns',
        numeric: true,
        label: 'Opp. Rec. TD',
        tooltip: 'Opponent Receiving touchdowns',
        sort: 'higher',
      },
      opponent_receiving_long: {
        id: 'opponent_receiving_long',
        numeric: true,
        label: 'Opp. Rec. long',
        tooltip: 'Opponent Receiving long',
        sort: 'higher',
      },
      // opponent_punt_returns: {
      //   id: 'opponent_punt_returns',
      //   numeric: true,
      //   label: 'Opp. Punt ret.',
      //   tooltip: 'Opponent Punt returns',
      //   sort: 'higher',
      // },
      // opponent_punt_return_yards: {
      //   id: 'opponent_punt_return_yards',
      //   numeric: true,
      //   label: 'Opp. Punt ret. yards',
      //   tooltip: 'Opponent Punt return yards',
      //   sort: 'higher',
      // },
      // opponent_punt_return_yards_per_attempt: {
      //   id: 'opponent_punt_return_yards_per_attempt',
      //   numeric: true,
      //   label: 'Opp. Punt ret. yards per att.',
      //   tooltip: 'Opponent Punt return yards per attempt',
      //   sort: 'higher',
      // },
      // opponent_punt_return_touchdowns: {
      //   id: 'opponent_punt_return_touchdowns',
      //   numeric: true,
      //   label: 'Opp. Punt ret. TD',
      //   tooltip: 'Opponent Punt return touchdowns',
      //   sort: 'higher',
      // },
      // opponent_punt_return_long: {
      //   id: 'opponent_punt_return_long',
      //   numeric: true,
      //   label: 'Opp. Punt ret. long',
      //   tooltip: 'Opponent Punt return long',
      //   sort: 'higher',
      // },
      // opponent_kick_returns: {
      //   id: 'opponent_kick_returns',
      //   numeric: true,
      //   label: 'Opp. Kick ret.',
      //   tooltip: 'Opponent Kick returns',
      //   sort: 'higher',
      // },
      // opponent_kick_return_yards: {
      //   id: 'opponent_kick_return_yards',
      //   numeric: true,
      //   label: 'Opp. Kick ret. yards',
      //   tooltip: 'Opponent Kick return yards',
      //   sort: 'higher',
      // },
      // opponent_kick_return_yards_per_attempt: {
      //   id: 'opponent_kick_return_yards_per_attempt',
      //   numeric: true,
      //   label: 'Opp. Kick ret. yards per att.',
      //   tooltip: 'Opponent Kick return yards per attempt',
      //   sort: 'higher',
      // },
      // opponent_kick_return_touchdowns: {
      //   id: 'opponent_kick_return_touchdowns',
      //   numeric: true,
      //   label: 'Opp. Kick ret. TD',
      //   tooltip: 'Opponent Kick return touchdowns',
      //   sort: 'higher',
      // },
      // opponent_kick_return_long: {
      //   id: 'opponent_kick_return_long',
      //   numeric: true,
      //   label: 'Opp. Kick ret. long',
      //   tooltip: 'Opponent Kick return long',
      //   sort: 'higher',
      // },
      // opponent_punts: {
      //   id: 'opponent_punts',
      //   numeric: true,
      //   label: 'Opp. Punts',
      //   tooltip: 'Opponent Punts',
      //   sort: 'higher',
      // },
      // opponent_punt_yards: {
      //   id: 'opponent_punt_yards',
      //   numeric: true,
      //   label: 'Opp. Punt yards',
      //   tooltip: 'Opponent Punt yards',
      //   sort: 'higher',
      // },
      // opponent_punt_average: {
      //   id: 'opponent_punt_average',
      //   numeric: true,
      //   label: 'Opp. Punt avg.',
      //   tooltip: 'Opponent Punt average',
      //   sort: 'higher',
      // },
      // opponent_punt_long: {
      //   id: 'opponent_punt_long',
      //   numeric: true,
      //   label: 'Opp. Punt long',
      //   tooltip: 'Opponent Punt long',
      //   sort: 'higher',
      // },
      // opponent_field_goals_attempted: {
      //   id: 'opponent_field_goals_attempted',
      //   numeric: true,
      //   label: 'Opp. FG att.',
      //   tooltip: 'Opponent Field goals attempted',
      //   sort: 'higher',
      // },
      // opponent_field_goals_made: {
      //   id: 'opponent_field_goals_made',
      //   numeric: true,
      //   label: 'Opp. FGs',
      //   tooltip: 'Opponent Field goals made',
      //   sort: 'higher',
      // },
      // opponent_field_goal_percentage: {
      //   id: 'opponent_field_goal_percentage',
      //   numeric: true,
      //   label: 'Opp. FG%',
      //   tooltip: 'Opponent Field goal percentage',
      //   sort: 'higher',
      // },
      // opponent_field_goals_longest_made: {
      //   id: 'opponent_field_goals_longest_made',
      //   numeric: true,
      //   label: 'Opp. FG long',
      //   tooltip: 'Opponent Field goal longest made',
      //   sort: 'higher',
      // },
      // opponent_extra_points_attempted: {
      //   id: 'opponent_extra_points_attempted',
      //   numeric: true,
      //   label: 'Opp. 2pt att.',
      //   tooltip: 'Opponent 2pt conversion attempts',
      //   sort: 'higher',
      // },
      // opponent_extra_points_made: {
      //   id: 'opponent_extra_points_made',
      //   numeric: true,
      //   label: 'Opp. 2pt con.',
      //   tooltip: 'Opponent 2pt conversions',
      //   sort: 'higher',
      // },
      // opponent_interceptions: {
      //   id: 'opponent_interceptions',
      //   numeric: true,
      //   label: 'Opp. Int.',
      //   tooltip: 'Opponent Interceptions',
      //   sort: 'higher',
      // },
      // opponent_interception_return_yards: {
      //   id: 'opponent_interception_return_yards',
      //   numeric: true,
      //   label: 'Opp. Int. ret. yards',
      //   tooltip: 'Opponent Interceptions return yards',
      //   sort: 'higher',
      // },
      // opponent_interception_return_touchdowns: {
      //   id: 'opponent_interception_return_touchdowns',
      //   numeric: true,
      //   label: 'Opp. Int. ret. TD',
      //   tooltip: 'Opponent Interceptions return touchdowns',
      //   sort: 'higher',
      // },
      // opponent_solo_tackles: {
      //   id: 'opponent_solo_tackles',
      //   numeric: true,
      //   label: 'Opp. Solo tackle',
      //   tooltip: 'Opponent Solo tackles',
      //   sort: 'higher',
      // },
      // opponent_assisted_tackles: {
      //   id: 'opponent_assisted_tackles',
      //   numeric: true,
      //   label: 'Opp. Ast. tackle',
      //   tooltip: 'Opponent Assisted tackles',
      //   sort: 'higher',
      // },
      // opponent_tackles_for_loss: {
      //   id: 'opponent_tackles_for_loss',
      //   numeric: true,
      //   label: 'Opp. Tackle for loss',
      //   tooltip: 'Opponent Tackles for loss',
      //   sort: 'higher',
      // },
      // opponent_sacks: {
      //   id: 'opponent_sacks',
      //   numeric: true,
      //   label: 'Opp. Sacks',
      //   tooltip: 'Opponent Sacks',
      //   sort: 'higher',
      // },
      // opponent_passes_defended: {
      //   id: 'opponent_passes_defended',
      //   numeric: true,
      //   label: 'Opp. Pass defended',
      //   tooltip: 'Opponent Passes defended',
      //   sort: 'higher',
      // },
      // opponent_fumbles_recovered: {
      //   id: 'opponent_fumbles_recovered',
      //   numeric: true,
      //   label: 'Opp. Fumble rec.',
      //   tooltip: 'Opponent Fumbles recovered',
      //   sort: 'higher',
      // },
      // opponent_fumble_return_touchdowns: {
      //   id: 'opponent_fumble_return_touchdowns',
      //   numeric: true,
      //   label: 'Opp. Fumble ret. TD',
      //   tooltip: 'Opponent Fumbles returned to touchdown',
      //   sort: 'higher',
      // },
      // opponent_quarterback_hurries: {
      //   id: 'opponent_quarterback_hurries',
      //   numeric: true,
      //   label: 'Opp. QB hurry',
      //   tooltip: 'Opponent QB hurries',
      //   sort: 'higher',
      // },
      // opponent_fumbles: {
      //   id: 'opponent_fumbles',
      //   numeric: true,
      //   label: 'Opp. Fumbles',
      //   tooltip: 'Opponent Fumbles',
      //   sort: 'lower',
      // },
      // opponent_fumbles_lost: {
      //   id: 'opponent_fumbles_lost',
      //   numeric: true,
      //   label: 'Opp. Fumbles lost',
      //   tooltip: 'Opponent Fumbles lost',
      //   sort: 'lower',
      // },
    };
  }

  return {};
};

export { Client, ClientSkeleton };
