'use cleint';
import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';


import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import HelperCBB from '@/components/helpers/CBB';

import moment from 'moment';
import { Ranking } from '@/types/cbb';



const RankChart = ({ cbb_game, compareKey, rankings }) => {

  const homeColor = cbb_game.teams[cbb_game.home_team_id].primary_color;
  const awayColor = cbb_game.teams[cbb_game.away_team_id].primary_color;

  const homeRankings: Ranking[] = (cbb_game.home_team_id in rankings) ? rankings[cbb_game.home_team_id] : [];
  const awayRankings: Ranking[] = (cbb_game.away_team_id in rankings) ? rankings[cbb_game.away_team_id] : [];

  const sortedHomeRankings: Ranking[] = Object.values(homeRankings).sort(function (a, b) {
    return a.date_of_rank  < b.date_of_rank ? -1 : 1;
  });

  const sortedAwayRankings: Ranking[] = Object.values(awayRankings).sort(function (a, b) {
    return a.date_of_rank  < b.date_of_rank ? -1 : 1;
  });


  const CBB = new HelperCBB({
    'cbb_game': cbb_game,
  });


  let xAxis: string[] = [];
  let series = {
    'home': {
      'name': CBB.getTeamName('home'),
      'data': [] as number[],
      'color': null,
    },
    'away': {
      'name': CBB.getTeamName('away'),
      'data': [] as number[],
      'color': null,
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

export default RankChart;
