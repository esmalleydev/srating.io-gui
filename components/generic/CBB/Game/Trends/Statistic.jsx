import React, { useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import { useTheme } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import HelperCBB from '../../../../helpers/CBB';

import moment from 'moment';



const Statistic = (props) => {
  const self = this;

  const game = props.game;

  const homeStats = props.homeStats || {};
  const awayStats = props.awayStats || {};

 
  const sortedHomeStats = Object.values(homeStats).sort(function (a, b) {
    return a.date_of_rank  < b.date_of_rank ? -1 : 1;
  });

  const sortedAwayStats = Object.values(awayStats).sort(function (a, b) {
    return a.date_of_rank  < b.date_of_rank ? -1 : 1;
  });

  const compareKey = props.compareKey;

  const CBB = new HelperCBB({
    'cbb_game': game,
  });


  const theme = useTheme();

  let xAxis = [];
  let series = {
    'home': {
      'name': CBB.getTeamName('home'),
      'data': [],
    },
    'away': {
      'name': CBB.getTeamName('away'),
      'data': [],
    },
  };

  if (homeColor) {
    series.home.color = homeColor;
  }

  if (awayColor && awayColor !== homeColor) {
    series.away.color = awayColor;
  }


  for (let i = 0; i < sortedHomeStats.length; i++) {
    if (xAxis.indexOf(moment(sortedHomeStats[i].date_of_rank).format('MMM Do')) === -1) {
      xAxis.push(moment(sortedHomeStats[i].date_of_rank).format('MMM Do'));
    }
    series.home.data.push(sortedHomeStats[i][compareKey]);
  }

  for (let i = 0; i < sortedAwayStats.length; i++) {
    if (xAxis.indexOf(moment(sortedAwayStats[i].date_of_rank).format('MMM Do')) === -1) {
      xAxis.push(moment(sortedAwayStats[i].date_of_rank).format('MMM Do'));
    }
    series.away.data.push(sortedAwayStats[i][compareKey]);
  }

  const rankChartOptions = {
    'chart': {
      'type': 'line',
      'style': {
        'position': 'initial',
      },
    },
    'title': {
      'text': 'Stat compare'
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



  return (
    <div>
      {!sortedHomeStats.length && !sortedAwayStats.length ? <Typography style = {{'textAlign': 'center', 'margin': '10px 0px'}} variant = 'h5'>Nothing here yet...</Typography> : ''}
      {sortedHomeStats.length || sortedAwayStats.length ? <Paper elevation = {3}><HighchartsReact  highcharts={Highcharts} options={rankChartOptions} /></Paper> : ''}
    </div>
  );
}

export default Rank;
