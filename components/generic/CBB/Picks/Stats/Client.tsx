'use client';

import React from 'react';
import { useTheme } from '@mui/material/styles';

import moment from 'moment';
import {
  Typography, Skeleton, Card, CardContent,
} from '@mui/material';

import Color from '@/components/utils/Color';


const getCardStyle = () => {
  return { width: 300, minWidth: 200, margin: '5px' };
};

const getOrderedBuckets = () => {
  return ['season', 'today', 'yesterday', 'week', 'month'];
};

export { getCardStyle, getOrderedBuckets };


const Client = ({ date, stats }) => {
  const theme = useTheme();

  const orderedBuckets = getOrderedBuckets();

  const skeletonContainers: React.JSX.Element[] = [];

  for (let i = 0; i < orderedBuckets.length; i++) {
    skeletonContainers.push(<Skeleton key = {i} variant="rounded" animation="wave" height={220} sx = {getCardStyle()} />);
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

        const subBuckets = [90, 80, 70, 60, 50];

        const subBucketsLabels = {
          90: '90-100%:',
          80: '80-90%:',
          70: '70-80%:',
          60: '60-70%:',
          50: '50-60%:',
        };

        // const totalGames = stats[orderedBuckets[i]].games;
        let totalGames = 0;
        let totalCorrect = 0;

        if (orderedBuckets[i] === 'today') {
          label = todayDate;
        } else if (orderedBuckets[i] === 'yesterday') {
          label = yesterdayDate;
        } else if (orderedBuckets[i] === 'week') {
          label = `${weekDate} - ${todayDate}`;
        } else if (orderedBuckets[i] === 'month') {
          label = `${monthDate} - ${todayDate}`;
        } else if (orderedBuckets[i] === 'season') {
          label = 'Season';
        }

        const subBucketContainers: React.JSX.Element[] = [];

        for (let s = 0; s < subBuckets.length; s++) {
          const subTotalGames = stats[orderedBuckets[i]][`${subBuckets[s]}_total`];
          const subCorrectGames = stats[orderedBuckets[i]][`${subBuckets[s]}_correct`];

          totalGames += subTotalGames;
          totalCorrect += subCorrectGames;

          const subColorStyle: React.CSSProperties = {
            fontSize: 12,
            minWidth: 60,
            textAlign: 'center',
          };

          let subPercentCorrect: number = 0;
          if (subTotalGames) {
            subPercentCorrect = +((subCorrectGames / subTotalGames) * 100).toFixed(2);
            const color = Color.lerpColor(worstColor, bestColor, (+subPercentCorrect / 100));
            subColorStyle.color = color;
          }

          subBucketContainers.push(
            <div style = {{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography sx={{ fontSize: 12, minWidth: 60 }} color="text.secondary" gutterBottom>{subBucketsLabels[subBuckets[s]]}</Typography>
              <Typography sx={subColorStyle}>{subTotalGames ? `${subPercentCorrect}%` : '-'}</Typography>
              <Typography sx={{ fontSize: 12, minWidth: 60, textAlign: 'right' }}>({`${subCorrectGames} / ${subTotalGames}`})</Typography>
            </div>,
          );
        }

        const colorStyle: React.CSSProperties = {
          fontSize: 12,
          minWidth: 60,
          textAlign: 'center',
        };

        let percentCorrect: number = 0;
        if (totalGames) {
          percentCorrect = +((totalCorrect / totalGames) * 100).toFixed(2);
          const color = Color.lerpColor(worstColor, bestColor, (+percentCorrect / 100));
          colorStyle.color = color;
        }


        statContainers.push(
          <Card key = {i} sx = {getCardStyle()}>
            <CardContent>
              <Typography sx={{ fontSize: 14, textAlign: 'center' }} color = 'info.dark' gutterBottom>{label}</Typography>
              {
              totalGames === 0 ? <Typography sx = {({ textAlign: 'center', ...colorStyle })} variant="h5" component="div">-</Typography> :
              <>
                <div style = {{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: 12, minWidth: 60 }} color="text.secondary" gutterBottom>Predicted win %</Typography>
                  <Typography sx={{ fontSize: 12, minWidth: 60, textAlign: 'center' }} color="text.secondary" gutterBottom>Accuracy</Typography>
                  <Typography sx={{ fontSize: 12, minWidth: 60, textAlign: 'right' }} color="text.secondary" gutterBottom># games</Typography>
                </div>
                {subBucketContainers}
                <div style = {{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: 12, minWidth: 60 }} color="text.secondary" gutterBottom>Total:</Typography>
                  <Typography sx={colorStyle}>{`${percentCorrect}%`}</Typography>
                  <Typography sx={{ fontSize: 12, minWidth: 60, textAlign: 'right' }}>({totalCorrect} / {totalGames})</Typography>
                </div>
              </>
              }
            </CardContent>
          </Card>,
        );
      }
    }
  }


  return (
    <>
      <div style = {{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {
          statContainers.length === 0 ? skeletonContainers : statContainers
        }
      </div>
    </>
  );
};

export default Client;
