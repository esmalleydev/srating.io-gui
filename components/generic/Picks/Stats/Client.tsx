'use client';

import React from 'react';

import moment from 'moment';
import {
  Skeleton,
} from '@mui/material';

import Color from '@/components/utils/Color';
import { useTheme } from '@/components/hooks/useTheme';
import Typography from '@/components/ux/text/Typography';
import Paper from '@/components/ux/container/Paper';


const getCardStyle = () => {
  return { width: 300, minWidth: 200, margin: '5px', padding: 12 };
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

    const bestColor = theme.mode === 'light' ? theme.success.main : theme.success.dark;
    const worstColor = theme.mode === 'light' ? theme.error.main : theme.error.dark;

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
              <Typography style={{ fontSize: 12, minWidth: 60, color: theme.text.secondary }} type = 'caption'>{subBucketsLabels[subBuckets[s]]}</Typography>
              <Typography style={subColorStyle} type = 'caption'>{subTotalGames ? `${subPercentCorrect}%` : '-'}</Typography>
              <Typography style={{ fontSize: 12, minWidth: 60, textAlign: 'right' }} type = 'caption'>({`${subCorrectGames} / ${subTotalGames}`})</Typography>
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
          <Paper key = {i} elevation={2} style = {getCardStyle()}>
              <Typography style={{ fontSize: 14, textAlign: 'center', color: theme.info.dark }} type = 'h6'>{label}</Typography>
              {
              totalGames === 0 ? <Typography style = {({ textAlign: 'center', ...colorStyle })} type="h5">-</Typography> :
              <>
                <div style = {{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography style={{ fontSize: 12, minWidth: 60, color: theme.text.secondary }} type = 'caption'>Predicted win %</Typography>
                  <Typography style={{ fontSize: 12, minWidth: 60, color: theme.text.secondary, textAlign: 'center' }} type = 'caption'>Accuracy</Typography>
                  <Typography style={{ fontSize: 12, minWidth: 60, color: theme.text.secondary, textAlign: 'right' }} type = 'caption'># games</Typography>
                </div>
                {subBucketContainers}
                <div style = {{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography style={{ fontSize: 12, minWidth: 60, color: theme.text.secondary }} type = 'caption'>Total:</Typography>
                  <Typography style={colorStyle} type = 'caption'>{`${percentCorrect}%`}</Typography>
                  <Typography style={{ fontSize: 12, minWidth: 60, textAlign: 'right' }} type = 'caption'>({totalCorrect} / {totalGames})</Typography>
                </div>
              </>
              }
          </Paper>,
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
