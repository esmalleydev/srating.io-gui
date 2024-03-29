import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import { ScoreIntervals } from '@/components/generic/types';


const OddsOverUnder = ({ cbb_game_score_intervals }) => {

  const scoreIntervals: ScoreIntervals = cbb_game_score_intervals;

  const sorted_intervals: ScoreIntervals[] = Object.values(scoreIntervals).sort(function (a, b) {
    // should probably use clock, but DoE should be fine for now
    return a.date_of_entry  < b.date_of_entry ? -1 : 1;
  });

  let xAxis: string[] = [];
  let series = {
    'over': {
      'name': 'Over / Under',
      'data': [] as number[],
    },
    // 'under': {
    //   'name': 'Under',
    //   'data': [],
    // },
  };


  let map = {};

  for (let i = 0; i < sorted_intervals.length; i++) {
    if (
      !map[sorted_intervals[i].clock + sorted_intervals[i].current_period] &&
      sorted_intervals[i].over &&
      sorted_intervals[i].under
    ) {
      map[sorted_intervals[i].clock + sorted_intervals[i].current_period] = true;
      if (!sorted_intervals[i].current_period.length && sorted_intervals[i].clock === ':00' && !sorted_intervals[i].home_score && !sorted_intervals[i].away_score) {
        xAxis.push('1ST');
      } else if (!sorted_intervals[i].current_period.length && sorted_intervals[i].clock === ':00') {
        xAxis.push('2ND');
      } else {
        xAxis.push(sorted_intervals[i].clock);
      }

      series.over.data.push(sorted_intervals[i].over < -10000 ? -10000 : sorted_intervals[i].over);
      // series.under.data.push(sorted_intervals[i].under < -10000 ? -10000 : sorted_intervals[i].under);
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
      'text': 'Live O/U by game time'
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

export default OddsOverUnder;
