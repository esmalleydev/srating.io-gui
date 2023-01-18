import React, { useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import { useTheme } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import HelperCBB from '../../../../helpers/CBB';

import moment from 'moment';



const Rank = (props) => {
  const self = this;

  const game = props.game;

  const homeColor = game.teams[game.home_team_id].primary_color;
  const awayColor = game.teams[game.away_team_id].primary_color;

  const homeRankings = (game.teams[game.home_team_id] && game.teams[game.home_team_id].cbb_rankings) || {};
  const awayRankings = (game.teams[game.away_team_id] && game.teams[game.away_team_id].cbb_rankings) || {};

  const sortedHomeRankings = Object.values(homeRankings).sort(function (a, b) {
    return a.date_of_rank  < b.date_of_rank ? -1 : 1;
  });

  const sortedAwayRankings = Object.values(awayRankings).sort(function (a, b) {
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


  for (let i = 0; i < sortedHomeRankings.length; i++) {
    if (xAxis.indexOf(moment(sortedHomeRankings[i].date_of_rank).format('MMM Do')) === -1) {
      xAxis.push(moment(sortedHomeRankings[i].date_of_rank).format('MMM Do'));
    }
    series.home.data.push(sortedHomeRankings[i][compareKey]);
  }

  for (let i = 0; i < sortedAwayRankings.length; i++) {
    if (xAxis.indexOf(moment(sortedAwayRankings[i].date_of_rank).format('MMM Do')) === -1) {
      xAxis.push(moment(sortedAwayRankings[i].date_of_rank).format('MMM Do'));
    }
    series.away.data.push(sortedAwayRankings[i][compareKey]);
  }

  const rankChartOptions = {
    'chart': {
      'type': 'line',
      'style': {
        'position': 'initial',
      },
    },
    'title': {
      'text': 'Rank compare (lower is better)'
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
      {!sortedHomeRankings.length && !sortedAwayRankings.length ? <Typography style = {{'textAlign': 'center', 'margin': '10px 0px'}} variant = 'h5'>Nothing here yet...</Typography> : ''}
      {sortedHomeRankings.length || sortedAwayRankings.length ? <Paper elevation = {3}><HighchartsReact  highcharts={Highcharts} options={rankChartOptions} /></Paper> : ''}
    </div>
  );
}

export default Rank;
