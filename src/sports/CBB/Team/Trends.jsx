import React, { useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import { useTheme } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import HelperCBB from '../../../helpers/CBB';

import moment from 'moment';

// todo ? https://www.react-google-charts.com/examples/line-chart


const Trends = (props) => {
  const self = this;
  
  // console.log(props);

  const team = props.team;

  const ranking = props.ranking || {};
  const elo = props.elo || {};
  const games = props.games || {};

  const sorted_elo = Object.values(elo).sort(function(a, b) {
    return games[a.cbb_game_id].start_date < games[b.cbb_game_id].start_date ? -1 : 1;
  });

  const theme = useTheme();

  let xAxis = [];
  // let yAxis = [];
  let series = {
    'composite_rank': {
      'name': 'Composite',
      'data': [],
    },
    'elo_rank': {
      'name': 'ELO',
      'data': [],
    },
    'kenpom_rank': {
      'name': 'Kenpom',
      'data': [],
    },
    'net_rank': {
      'name': 'NET',
      'data': [],
    },
    'srs_rank': {
      'name': 'SRS',
      'data': [],
    },
    'ap_rank': {
      'name': 'AP',
      'data': [],
    },
    'coaches_rank': {
      'name': 'Coaches',
      'data': [],
    },
  };

  for (let id in ranking) {
    let date_of_rank = moment(ranking[id].date_of_rank).format('MMM Do');
    if (
      xAxis.indexOf(date_of_rank) === -1
    ) {
      xAxis.push(date_of_rank);
    }

    for (let key in series) {
      series[key].data.push(ranking[id][key]);
    }

  }


  const rankingChartOptions = {
    'chart': {
      'type': 'line',
      'style': {
        'position': 'initial',
      },
    },
    'title': {
      'text': 'Ranking (lower is better)'
    },
    'xAxis': {
      'categories': xAxis
    },
    'yAxis': {
      'title': {
        'text': 'Rank',
      },
    },
    'plotOptions': {
      'line': {
        'dataLabels': {
          'enabled': false
        },
        'marker': {
          'enabled': false,
        },
        'enableMouseTracking': true
      }
    },
    'series': Object.values(series),
  };

  let elo_xAxis = [];
  let elo_series = {
    'name': 'ELO',
    'data': [],
  };

  for (let i = 0; i < sorted_elo.length; i++) {
    elo_xAxis.push(moment(games[sorted_elo[i].cbb_game_id].start_datetime).format('MMM Do'));
    elo_series.data.push(sorted_elo[i].elo);
  }


  const eloChartOptions = {
    'chart': {
      'type': 'line',
      'style': {
        'position': 'initial',
      },
    },
    'title': {
      'text': 'ELO rating (higher is better)'
    },
    'xAxis': {
      'categories': elo_xAxis
    },
    'yAxis': {
      'title': {
        'text': 'ELO',
      },
    },
    'plotOptions': {
      'line': {
        'dataLabels': {
          'enabled': false
        },
        'enableMouseTracking': true
      }
    },
    'series': [elo_series],
  };

  

  return (
    <div>
      <Typography style = {{'margin': '10px 0px'}} variant = 'h5'>Ranking</Typography>
      <Paper elevation = {3}>
        <HighchartsReact  highcharts={Highcharts} options={rankingChartOptions} />
      </Paper>
      <Typography style = {{'margin': '10px 0px'}} variant = 'h5'>ELO</Typography>
      <Paper elevation = {3}>
        <HighchartsReact  highcharts={Highcharts} options={eloChartOptions} />
      </Paper>
    </div>
  );
}

export default Trends;
