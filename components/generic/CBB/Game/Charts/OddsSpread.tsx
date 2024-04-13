import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import HelperCBB from '@/components/helpers/CBB';
import { ScoreIntervals } from '@/types/cbb';


const OddsSpread = ({ cbb_game, cbb_game_score_intervals}) => {

  const CBB = new HelperCBB({
    'cbb_game': cbb_game,
  });

  const homeColor = cbb_game.teams[cbb_game.home_team_id].primary_color;
  const awayColor = cbb_game.teams[cbb_game.away_team_id].primary_color;

  const scoreIntervals: ScoreIntervals = cbb_game_score_intervals;

  const sorted_intervals: ScoreIntervals[] = Object.values(scoreIntervals).sort(function (a, b) {
    // should probably use clock, but DoE should be fine for now
    return a.date_of_entry  < b.date_of_entry ? -1 : 1;
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

  let map = {};

  for (let i = 0; i < sorted_intervals.length; i++) {
    if (
      !map[sorted_intervals[i].clock + sorted_intervals[i].current_period] &&
      sorted_intervals[i].spread_away &&
      sorted_intervals[i].spread_home
    ) {
      map[sorted_intervals[i].clock + sorted_intervals[i].current_period] = true;
      if (!sorted_intervals[i].current_period.length && sorted_intervals[i].clock === ':00' && !sorted_intervals[i].home_score && !sorted_intervals[i].away_score) {
        xAxis.push('1ST');
      } else if (!sorted_intervals[i].current_period.length && sorted_intervals[i].clock === ':00') {
        xAxis.push('2ND');
      } else {
        xAxis.push(sorted_intervals[i].clock);
      }

      series.home.data.push(sorted_intervals[i].spread_home < -10000 ? -10000 : sorted_intervals[i].spread_home);
      series.away.data.push(sorted_intervals[i].spread_away < -10000 ? -10000 : sorted_intervals[i].spread_away);
    }

  }

  const oddsChartOptions = {
    'chart': {
      'type': 'line',
      'style': {
        'position': 'initial',
      },
    },
    'title': {
      'text': 'Live spread by game time'
    },
    'xAxis': {
      'categories': xAxis
    },
    'yAxis': {
      'title': {
        'text': 'Points',
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
      {!sorted_intervals.length ? <Typography style = {{'textAlign': 'center', 'margin': '10px 0px'}} variant = 'h5'>Nothing here yet...</Typography> : ''}
      {sorted_intervals.length ? <Paper elevation = {3}><HighchartsReact  highcharts={Highcharts} options={oddsChartOptions} /></Paper> : ''}
    </div>
  );
}

export default OddsSpread;
