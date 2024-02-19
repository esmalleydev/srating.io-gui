'use client';
import React from 'react';
import { useTheme } from '@mui/material/styles';

import moment from 'moment';
import { Typography, Skeleton, Card, CardContent } from '@mui/material';

import utilsColor from  '@/components/utils/Color.js';

const ColorUtil = new utilsColor();

const getCardStyle = () => {
  return {'width': 300, 'minWidth': 200, 'margin': '5px'};
};

const getOrderedBuckets = () => {
  return ['today', 'yesterday', 'week', 'month', 'season'];
};

export { getCardStyle, getOrderedBuckets };

  
const Client = ({ date, stats }) => {
  const theme = useTheme();


  const orderedBuckets = getOrderedBuckets();

  const skeletonContainers: React.JSX.Element[] = [];

  for (let i = 0; i < orderedBuckets.length; i++) {
    skeletonContainers.push(<Skeleton key = {i} variant="rounded" animation="wave" height={115} sx = {getCardStyle()} />);
  }

  const statContainers: React.JSX.Element[] = [];
  if (stats) {
    const todayDate = moment(date).format('MMM Do');
    const yesterdayDate = moment(date).subtract(1, 'days').format('MMM Do');
    const weekDate = moment(date).subtract(7, 'days').format('MMM Do');
    const monthDate = moment(date).subtract(1, 'months').format('MMM Do');

    const bestColor = theme.palette.mode === 'light' ? theme.palette.success.main : theme.palette.success.dark;
    const worstColor = theme.palette.mode === 'light' ? theme.palette.error.main : theme.palette.error.dark;

    for (let i = 0; i < orderedBuckets.length; i++) {
      if (orderedBuckets[i] in stats) {
        let label: string | null = null;

        const totalGames = stats[orderedBuckets[i]].games;

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

        const colorStyle: React.CSSProperties = {};

        let percentCorrect: number = 0;
        if (totalGames) {
          percentCorrect = +((stats[orderedBuckets[i]].correct / totalGames) * 100).toFixed(2);
          let color = ColorUtil.lerpColor(worstColor, bestColor, (+percentCorrect / 100));
          colorStyle.color = color;
        }


        statContainers.push(
          <Card key = {i} sx = {getCardStyle()}>
            <CardContent>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>{label}</Typography>
              <Typography sx = {Object.assign({'textAlign': 'center'}, colorStyle)} variant="h5" component="div">{totalGames ? percentCorrect + '%' : '-'}</Typography>
              <Typography variant="body2">({stats[orderedBuckets[i]].correct} / {totalGames}) games</Typography>
            </CardContent>
          </Card>
        )
      }
    }
  }


  return (
    <>
      <div style = {{'display': 'flex', 'flexWrap': 'wrap', 'justifyContent': 'center'}}>
        {
          statContainers.length === 0 ? skeletonContainers : statContainers
        }
      </div>
    </>
  );
}

export default Client;