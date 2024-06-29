'use client';
import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import { Chip, useTheme } from '@mui/material';
import Chart from '@/components/generic/Chart';
import { LineProps } from 'recharts';
import moment from 'moment';

// todo add "+ Custom" chip to go to a select screen to add a stat to compare ( or maybe a select drop down instead?)

const StatsGraph = ({ cbb_statistic_rankings, cbb_elos, cbb_games, cbb_conference_statistic_rankings, cbb_league_statistics }) => {
  const [selectedChip, setSelectedChip] = useState('adjusted_efficiency_rating');

  const theme = useTheme();

  const statsCompare = [
    {
      label: 'aEM',
      value: 'adjusted_efficiency_rating',
    },
    {
      label: 'PTS',
      value: 'points',
    },
    {
      label: 'FG%',
      value: 'field_goal_percentage',
    },
    {
      label: 'AST',
      value: 'assists',
    },
    {
      label: 'SR',
      value: 'elo',
    },
  ];

  let statsCompareChips: React.JSX.Element[] = [];

  for (let i = 0; i < statsCompare.length; i++) {
    statsCompareChips.push(
      <Chip
        key = {statsCompare[i].value}
        sx = {{'margin': '5px 5px 10px 5px'}}
        variant = {selectedChip === statsCompare[i].value ? 'filled' : 'outlined'}
        color = {selectedChip === statsCompare[i].value ? 'success' : 'primary'}
        onClick = {() => {setSelectedChip(statsCompare[i].value);}}
        label = {statsCompare[i].label}
      />
    );
  }
  

  // this is wrong with how I am dynamically adding the stats based on the chip options
  type Data = {
    team_id: string;
    elo: number;
    adjusted_efficiency_rating: number;
    points: number;
    date_of_rank: string;
    date_friendly: string;
  };

  const date_of_rank_x_data = {};
  
  for (let cbb_statistic_ranking_id in cbb_statistic_rankings) {
    const row = cbb_statistic_rankings[cbb_statistic_ranking_id];
    
    if (!(row.date_of_rank in date_of_rank_x_data)) {
      date_of_rank_x_data[row.date_of_rank] = {
        date_of_rank: row.date_of_rank,
        date_friendly: moment(row.date_of_rank).format('MMM Do'),
      };
    }
    
    for (let i = 0; i < statsCompare.length; i++) {
      const key = statsCompare[i].value;
      
      if (key in row) {
        date_of_rank_x_data[row.date_of_rank][key] = row[key];
      }
      
      if ((key + '_rank') in row) {
        date_of_rank_x_data[row.date_of_rank][(key + '_rank')] = row[(key + '_rank')];
      }
    }
    
    date_of_rank_x_data[row.date_of_rank].team_id = row.team_id;
  }

  for (let cbb_conference_statistic_ranking_id in cbb_conference_statistic_rankings) {
    const row = cbb_conference_statistic_rankings[cbb_conference_statistic_ranking_id];

    if (!(row.date_of_rank in date_of_rank_x_data)) {
      date_of_rank_x_data[row.date_of_rank] = {
        date_of_rank: row.date_of_rank,
        date_friendly: moment(row.date_of_rank).format('MMM Do'),
      };
    }

    for (let i = 0; i < statsCompare.length; i++) {
      const regularKey = statsCompare[i].value;
      const modifiedKey = 'conf_' + statsCompare[i].value;

      if (regularKey in row) {
        date_of_rank_x_data[row.date_of_rank][modifiedKey] = row[regularKey];
      }
        
      if ((regularKey + '_rank') in row) {
        date_of_rank_x_data[row.date_of_rank][(modifiedKey + '_rank')] = row[(regularKey + '_rank')];
      }
    }

    date_of_rank_x_data[row.date_of_rank].team_id = row.team_id;
  }

  for (let cbb_league_statistic_id in cbb_league_statistics) {
    const row = cbb_league_statistics[cbb_league_statistic_id];

    if (!(row.date_of_rank in date_of_rank_x_data)) {
      date_of_rank_x_data[row.date_of_rank] = {
        date_of_rank: row.date_of_rank,
        date_friendly: moment(row.date_of_rank).format('MMM Do'),
      };
    }

    for (let i = 0; i < statsCompare.length; i++) {
      const regularKey = statsCompare[i].value;
      const modifiedKey = 'league_' + statsCompare[i].value;

      if (regularKey in row) {
        date_of_rank_x_data[row.date_of_rank][modifiedKey] = row[regularKey];
      }
        
      if ((regularKey + '_rank') in row) {
        date_of_rank_x_data[row.date_of_rank][(modifiedKey + '_rank')] = row[(regularKey + '_rank')];
      }
    }

    date_of_rank_x_data[row.date_of_rank].team_id = row.team_id;
  }

  let minYaxisElo = 1100;
  let maxYaxisElo = 2000;

  for (let cbb_elo_id in cbb_elos) {
    const row = cbb_elos[cbb_elo_id];

    if (row.elo < minYaxisElo) {
      minYaxisElo = row.elo;
    }

    if (row.elo > maxYaxisElo) {
      maxYaxisElo = row.elo;
    }

    if (row.cbb_game_id && row.cbb_game_id in cbb_games) {
      const start_date = cbb_games[row.cbb_game_id].start_date;

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
  for (let date_of_rank in date_of_rank_x_data) {
    if (date_of_rank_x_data[date_of_rank].elo) {
      lastElo = date_of_rank_x_data[date_of_rank].elo;
    }

    if (lastElo && !('elo' in date_of_rank_x_data[date_of_rank])) {
      date_of_rank_x_data[date_of_rank].elo = lastElo;
    }
  }

  const rows: Data[] = Object.values(date_of_rank_x_data);

  const formattedData: Data[] = rows.sort(function(a: Data, b: Data) {
    return a.date_of_rank > b.date_of_rank ? 1 : -1;
  });

  let chart: React.JSX.Element | null = null;

  if (selectedChip === 'elo') {
    let lines: LineProps[] = [
      {
        type: 'monotone',
        name: 'SR',
        dataKey: 'elo',
        stroke: theme.palette.info.main,
        strokeWidth: 2,
        dot: false,
        connectNulls: true
      },
      {
        type: 'monotone',
        name: 'Conf. SR',
        dataKey: 'conf_elo',
        stroke: theme.palette.warning.main,
        strokeWidth: 2,
        dot: false,
        connectNulls: true
      },
      {
        type: 'monotone',
        name: 'League SR',
        dataKey: 'league_elo',
        stroke: theme.palette.secondary.dark,
        strokeWidth: 2,
        dot: false,
        connectNulls: true
      }
    ];
    chart = <Chart XAxisDataKey={'date_friendly'} YAxisLabel={'SR'} rows={formattedData} lines={lines} YAxisProps={{scale: 'linear', domain: [minYaxisElo, maxYaxisElo]}} />;
  } else {
    for (let i = 0; i < statsCompare.length; i++) {
      const stat = statsCompare[i];
      if (stat.value === selectedChip) {
        let lines: LineProps[] = [
          {
            type: 'monotone',
            name: stat.label,
            dataKey: stat.value,
            stroke: theme.palette.info.main,
            strokeWidth: 2,
            dot: false,
            connectNulls: true
          },
          {
            type: 'monotone',
            name: 'Conf. ' + stat.label,
            dataKey: 'conf_' + stat.value,
            stroke: theme.palette.warning.main,
            strokeWidth: 2,
            dot: false,
            connectNulls: true
          },
          {
            type: 'monotone',
            name: 'League ' + stat.label,
            dataKey: 'league_' + stat.value,
            stroke: theme.palette.secondary.dark,
            strokeWidth: 2,
            dot: false,
            connectNulls: true
          }
        ];
        chart = <Chart XAxisDataKey={'date_friendly'} YAxisLabel={stat.label} rows={formattedData} lines={lines} YAxisProps={{scale: 'auto'}} />;
        break;
      }
    }
  }


  return (
    <div style = {{'padding': '10px 10px 0px 10px', 'textAlign': 'center'}}>
      <Typography color = 'info.main' variant = 'h6'>Stats</Typography>
      {statsCompareChips}
      {!formattedData.length ? <Typography style = {{'textAlign': 'center', 'margin': '10px 0px'}} variant = 'h5'>Nothing here yet...</Typography> : ''}
      {formattedData.length ? chart : ''}
    </div>
  );
}

export default StatsGraph;
