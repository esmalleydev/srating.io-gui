import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useWindowDimensions, Dimensions } from '@/components/hooks/useWindowDimensions';

import moment from 'moment';

import Typography from '@mui/material/Typography';
// import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
// import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
// import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';


import HelperCBB from '../../../helpers/CBB';


import utilsColor from  '../../../utils/Color.jsx';
import Api from './../../../Api.jsx';

const api = new Api();
const ColorUtil = new utilsColor();

  
const Stats = (props) => {
  const self = this;

  const { height, width } = useWindowDimensions();
  const theme = useTheme();

  const date = props.date;


  const [requested, setRequested] = useState(false);
  const [statsData, setStatsData] = useState(null);


  if (!requested) {
    setRequested(true);
    api.Request({
      'class': 'cbb_game_odds',
      'function': 'getStatsData',
      'arguments': {
        'date': date,
        'season': props.season || new HelperCBB().getCurrentSeason(),
      },
    }).then((response) => {
      setStatsData(response || {});
    }).catch((e) => {
      setStatsData({});
    });
  }

  const cardStyle = {'width': 300, 'minWidth': 200, 'margin': '5px'};
  const orderedBuckets = ['today', 'yesterday', 'week', 'month', 'season'];

  const skeletonContainers = [];

  for (let i = 0; i < orderedBuckets.length; i++) {
    skeletonContainers.push(<Skeleton key = {i} variant="rounded" animation="wave" height={115} sx = {cardStyle} />);
  }

  const statContainers = [];
  if (statsData) {
    const todayDate = moment(date).format('MMM Do');
    const yesterdayDate = moment(date).subtract(1, 'days').format('MMM Do');
    const weekDate = moment(date).subtract(7, 'days').format('MMM Do');
    const monthDate = moment(date).subtract(1, 'months').format('MMM Do');

    const bestColor = theme.palette.mode === 'light' ? theme.palette.success.main : theme.palette.success.dark;
    const worstColor = theme.palette.mode === 'light' ? theme.palette.error.main : theme.palette.error.dark;

    for (let i = 0; i < orderedBuckets.length; i++) {
      if (orderedBuckets[i] in statsData) {
        let label = null;

        const totalGames = statsData[orderedBuckets[i]].games;

        if (orderedBuckets[i] === 'today') {
          label = todayDate;
        } else if (orderedBuckets[i] === 'yesterday') {
          label = yesterdayDate;
        } else if (orderedBuckets[i] === 'week') {
          label = weekDate + ' - ' + todayDate;
        } else if (orderedBuckets[i] === 'month') {
          label = monthDate + ' - ' + todayDate;
        } else if (orderedBuckets[i] === 'season') {
          label = 'Season';
        }

        const colorStyle = {};

        let percentCorrect = 0;
        if (totalGames) {
          percentCorrect = ((statsData[orderedBuckets[i]].correct / totalGames) * 100).toFixed(2);
          let color = ColorUtil.lerpColor(worstColor, bestColor, (+percentCorrect / 100));
          colorStyle.color = color;
        }


        statContainers.push(
          <Card key = {i} sx = {cardStyle}>
            <CardContent>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>{label}</Typography>
              <Typography sx = {Object.assign({'textAlign': 'center'}, colorStyle)} variant="h5" component="div">{totalGames ? percentCorrect + '%' : '-'}</Typography>
              <Typography variant="body2">({statsData[orderedBuckets[i]].correct} / {totalGames}) games</Typography>
            </CardContent>
          </Card>
        )
      }
    }
  }


  return (
    <div style = {{'padding': 20}}>
      <div style = {{'display': 'flex', 'flexWrap': 'wrap', 'justifyContent': 'center'}}>
        {
          statContainers.length === 0 ? skeletonContainers : statContainers
        }
      </div>
    </div>
  );
}

export default Stats;