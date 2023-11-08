import React, { useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

// import { useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { CircularProgress } from '@mui/material';

import moment from 'moment';

import Api from './../../../Api.jsx';


const api = new Api();


let season_ = null;

const Trends = (props) => {
  const self = this;

  const team = props.team;
  const season = props.season;

  const [requested, setRequested] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  // const theme = useTheme();


  if (season_ && season_ != season) {
    setRequested(false);
    setData(null);
    setLoading(true);
  }

  season_ = season;

  if (!requested) {
    setLoading(true);
    setRequested(true);
    api.Request({
      'class': 'team',
      'function': 'getTrends',
      'arguments': {
        'team_id': team.team_id,
        'season': season,
      },
    }).then((response) => {
      setData(response || {});
      setLoading(false);
    }).catch((e) => {
      setData({});
      setLoading(false);
    });
  }

  if (loading) {
    return <div style = {{'display': 'flex', 'justifyContent': 'center', 'paddingTop': 68}}><CircularProgress /></div>;
  }

  const elo = data && data.cbb_elo || {};
  const ranking = data && data.cbb_ranking || {};
  const games = data && data.cbb_game || {};

  const sorted_elo = Object.values(elo).sort(function(a, b) {
    if (!(a.cbb_game_id)) {
      return -1;
    }

    if (!(b.cbb_game_id)) {
      return 1;
    }

    if (!(a.cbb_game_id in games)) {
      return 1;
    }

    if (!(b.cbb_game_id in games)) {
      return -1;
    }

    return games[a.cbb_game_id].start_date < games[b.cbb_game_id].start_date ? -1 : 1;
  });

  const sorted_ranking = Object.values(ranking).sort(function(a, b) {
    return a.date_of_rank > b.date_of_rank ? 1 : -1;
  });


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

  const lastKnown = {
    'composite_rank': null,
    'elo_rank': null,
    'kenpom_rank': null,
    'net_rank': null,
    'srs_rank': null,
  };

  for (let i = 0; i < sorted_ranking.length; i++) {
    const row = sorted_ranking[i];
    let date_of_rank = moment(row.date_of_rank).format('MMM Do');
    if (
      xAxis.indexOf(date_of_rank) === -1
    ) {
      xAxis.push(date_of_rank);
    }

    for (let key in series) {
      if (
        key in lastKnown &&
        row[key]
      ) {
        lastKnown[key] = row[key];
      }

      if (!row[key] && lastKnown[key]) {
        series[key].data.push(lastKnown[key]);
      } else {
        series[key].data.push(row[key]);
      }
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
    // preseason elo calc
    if (sorted_elo[i].cbb_game_id === null) {
      elo_xAxis.push(moment(sorted_elo[i].date_of_entry).format('MMM Do'));
      elo_series.data.push(sorted_elo[i].elo);
    }

    if (!(sorted_elo[i].cbb_game_id in games)) {
      continue;
    }
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
    <div style={{'padding': '48px 20px 20px 20px'}}>
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
