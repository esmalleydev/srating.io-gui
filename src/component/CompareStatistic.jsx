import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import useWindowDimensions from '../hooks/useWindowDimensions';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';


const CompareStatistic = (props) => {

  const { height, width } = useWindowDimensions();
  const theme = useTheme();

  const getColor = (row, base) => {
    if (row.favored === 'lower') {
      if (+row.awayCompareValue < +row.homeCompareValue) {
        return base === 'away' ? theme.palette.success.main : theme.palette.error.main;
      }
      if (+row.awayCompareValue > +row.homeCompareValue) {
        return base === 'home' ? theme.palette.success.main : theme.palette.error.main;
      }
    }

    if (row.favored === 'higher') {
      if (+row.awayCompareValue > +row.homeCompareValue) {
        return base === 'away' ? theme.palette.success.main : theme.palette.error.main;
      }
      if (+row.awayCompareValue < +row.homeCompareValue) {
        return base === 'home' ? theme.palette.success.main : theme.palette.error.main;
      }
    }

    return theme.palette.secondary.light;
  };

  const getPercentage = (row, base) => {
    if (row.favored === 'lower') {
      let total = +row.awayCompareValue + +row.homeCompareValue;
      if (+row.awayCompareValue < +row.homeCompareValue) {
        return base === 'away' ? 100 * (+row.homeCompareValue / total) + '%' : 100 * (+row.awayCompareValue / total) + '%';
      }
      if (+row.awayCompareValue > +row.homeCompareValue) {
        return base === 'home' ? 100 * (+row.awayCompareValue / total) + '%' : 100 * (+row.homeCompareValue / total) + '%';
      }
    }

    if (row.favored === 'higher') {
      let total = +row.awayCompareValue + +row.homeCompareValue;
      if (+row.awayCompareValue > +row.homeCompareValue) {
        return base === 'away' ? 100 * (+row.awayCompareValue / total) + '%' : 100 * (+row.homeCompareValue / total) + '%';
      }
      if (+row.awayCompareValue < +row.homeCompareValue) {
        return base === 'home' ? 100 * (+row.homeCompareValue / total) + '%' : 100 * (+row.awayCompareValue / total) + '%';
      }
    }

    return '50%';
  };

  const getDifference = (row, base) => {
    if (row.favored === 'lower') {
      if (+row.awayCompareValue > +row.homeCompareValue) {
        if (+row.awayCompareValue === Infinity) {
          return 0;
        }
        return base === 'away' ? 0 : '-' + Math.round(+row.awayCompareValue - +row.homeCompareValue);
      }
      if (+row.awayCompareValue < +row.homeCompareValue) {
        if (+row.homeCompareValue === Infinity) {
          return 0;
        }
        return base === 'home' ? 0 : '-' + Math.round(+row.homeCompareValue - +row.awayCompareValue);
      }
    }

    if (row.favored === 'higher') {
      if (+row.awayCompareValue > +row.homeCompareValue) {
        return base === 'away' ? '+' + Math.round(+row.awayCompareValue - +row.homeCompareValue) : 0;
      }
      if (+row.awayCompareValue < +row.homeCompareValue) {
        return base === 'home' ? '+' + Math.round(+row.homeCompareValue - +row.awayCompareValue) : 0;
      }
    }

    return 0;
  };

  const flexContainerStyle = {
    'display': 'flex',
    'justifyContent': 'space-between',
  };

  const leftFlexColumnStyle = {
    'margin': '5px 0px',
    'height': '24px',
  };

  const middleFlexColumnStyle = {
    'textAlign': 'center',
    'flexGrow': '1',
  };

  const rightFlexColumnStyle = {
    'margin': '5px 0px',
    'height': '24px',
    'textAlign': 'right',
  };

  const middleSubFlexContainerStyle = {
    'display': 'flex',
    'margin': '5px 0px',
    'height': '24px',
  };

  const middleSubFlexLeftColumn = {
    'width': '100%',
    'display': 'flex',
    'margin': '0px 10px',
    'justifyContent': 'flex-end',
  };

  const middleSubFlexMiddleColumn = {
    'minWidth': '80px',
  };

  const middleSubFlexRightColumn = {
    'width': '100%',
    'display': 'flex',
    'margin': '0px 10px',
  };

 


  return (
    <Paper elevation = {3} style = {{'padding': 10}}>
        <div style = {flexContainerStyle}>
          <div>
          {props.rows.map((row) => (
            <Typography style = {leftFlexColumnStyle} variant = 'body2'>{row.away}</Typography>
          ))}
          </div>
          <div style = {middleFlexColumnStyle}>
          {props.rows.map((row) => (
            <div style = {middleSubFlexContainerStyle}>
              <div style = {middleSubFlexLeftColumn}>
                <div style = {{'display': ('favored' in row ? 'block' : 'none'), 'width': getPercentage(row, 'away'), 'backgroundColor': getColor(row, 'away'), 'color': '#fff'/*theme.palette.getContrastText(getColor(row, 'away'))*/}}>
                  <Typography variant = 'caption'>{getDifference(row, 'away') && row.showDifference && width >= 375 ? getDifference(row, 'away') : ''}</Typography>
                </div>
              </div>
              <Tooltip key={row.name} disableFocusListener placement = 'top' title={row.title || row.name}><Typography style = {middleSubFlexMiddleColumn} variant = 'body2'>{row.name}</Typography></Tooltip>
              <div style = {middleSubFlexRightColumn}>
                <div style = {{'display': ('favored' in row ? 'block' : 'none'), 'width': getPercentage(row, 'home'), 'backgroundColor': getColor(row, 'home'), 'color': '#fff'/*theme.palette.getContrastText(getColor(row, 'home'))*/}}>
                  <Typography variant = 'caption'>{getDifference(row, 'home') && row.showDifference && width >= 375 ? getDifference(row, 'home') : ''}</Typography>
                </div>
              </div>
            </div>
          ))}
          </div>
          <div>
          {props.rows.map((row) => (
            <Typography style = {rightFlexColumnStyle} variant = 'body2'>{row.home}</Typography>
          ))}
          </div>
        </div>
      </Paper>
  );
}

export default CompareStatistic;