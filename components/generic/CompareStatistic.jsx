import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import useWindowDimensions from '../hooks/useWindowDimensions';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';

import utilsColor from  '../utils/Color.jsx';

const ColorUtil = new utilsColor();


const CompareStatistic = (props) => {

  const { height, width } = useWindowDimensions();
  const theme = useTheme();

  const paperContainer = (props.paper === true);

  const maxWidth = props.maxWidth || 600;

  const fixedLength = width > 500 ? 2 : 1;

  const bestColor = theme.palette.mode === 'light' ? theme.palette.success.main : theme.palette.success.dark;
  const worstColor = theme.palette.mode === 'light' ? theme.palette.error.main : theme.palette.error.dark;

  const getColor = (row, base) => {
    if (row.favored === 'lower') {
      if (+row.awayCompareValue < +row.homeCompareValue) {
        return base === 'away' ? theme.palette.success.light : theme.palette.error.light;
      }
      if (+row.awayCompareValue > +row.homeCompareValue) {
        return base === 'home' ? theme.palette.success.light : theme.palette.error.light;
      }
    }

    if (row.favored === 'higher') {
      if (+row.awayCompareValue > +row.homeCompareValue) {
        return base === 'away' ? theme.palette.success.light : theme.palette.error.light;
      }
      if (+row.awayCompareValue < +row.homeCompareValue) {
        return base === 'home' ? theme.palette.success.light : theme.palette.error.light;
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
        return base === 'away' ? 0 : '-' + (+row.awayCompareValue - +row.homeCompareValue).toFixed(fixedLength);
      }
      if (+row.awayCompareValue < +row.homeCompareValue) {
        if (+row.homeCompareValue === Infinity) {
          return 0;
        }
        return base === 'home' ? 0 : '-' + (+row.homeCompareValue - +row.awayCompareValue).toFixed(fixedLength);
      }
    }

    if (row.favored === 'higher') {
      if (+row.awayCompareValue > +row.homeCompareValue) {
        return base === 'away' ? '+' + (+row.awayCompareValue - +row.homeCompareValue).toFixed(fixedLength) : 0;
      }
      if (+row.awayCompareValue < +row.homeCompareValue) {
        return base === 'home' ? '+' + (+row.homeCompareValue - +row.awayCompareValue).toFixed(fixedLength) : 0;
      }
    }

    return 0;
  };

  /*
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
  */

  const spanStyle = {
    'fontSize': '10px',
    'margin': '0px 5px',
    'padding': '3px',
    'borderRadius': '5px',
  };

  const Container = (props_) => {
    if (paperContainer) {
      return <Paper elevation = {3} style = {{'padding': 10, 'maxWidth': maxWidth, 'width': '100%', 'margin': 'auto'}}>{props_.children}</Paper>;
    }

    return <div style = {{'maxWidth': maxWidth, 'width': '100%', 'margin': 'auto'}}>{props_.children}</div>;
  };


  // return (
  //   <Container>
  //     <div style = {flexContainerStyle}>
  //       <div>
  //         {props.rows.map((row) => {
  //           const colors = {};
  //           let backgroundColor = null;

  //           if (
  //             row.awayRank && 
  //             (backgroundColor = ColorUtil.lerpColor(bestColor, worstColor, (+row.awayRank / 363))) &&
  //             backgroundColor !== '#'
  //           ) {
  //             colors.backgroundColor = backgroundColor;
  //             colors.color = theme.palette.getContrastText(backgroundColor);
  //           }
  //           return <Typography style = {leftFlexColumnStyle} variant = 'body2'>{row.away}{row.awayRank ? <span style = {Object.assign(colors, spanStyle)}>{row.awayRank}</span> : ''}</Typography>
  //         })}
  //       </div>
  //       <div style = {middleFlexColumnStyle}>
  //         {props.rows.map((row) => (
  //           <div style = {middleSubFlexContainerStyle}>
  //             <div style = {middleSubFlexLeftColumn}>
  //               <div style = {{'display': ('favored' in row ? 'block' : 'none'), 'width': getPercentage(row, 'away'), 'backgroundColor': getColor(row, 'away'), 'color': '#fff'/*theme.palette.getContrastText(getColor(row, 'away'))*/}}>
  //                 <Typography variant = 'caption'>{getDifference(row, 'away') && row.showDifference && width >= 375 ? getDifference(row, 'away') : ''}</Typography>
  //               </div>
  //             </div>
  //             <Tooltip key={row.name} disableFocusListener placement = 'top' title={row.title || row.name}><Typography style = {middleSubFlexMiddleColumn} variant = 'body2'>{row.name}</Typography></Tooltip>
  //             <div style = {middleSubFlexRightColumn}>
  //               <div style = {{'display': ('favored' in row ? 'block' : 'none'), 'width': getPercentage(row, 'home'), 'backgroundColor': getColor(row, 'home'), 'color': '#fff'/*theme.palette.getContrastText(getColor(row, 'home'))*/}}>
  //                 <Typography variant = 'caption'>{getDifference(row, 'home') && row.showDifference && width >= 375 ? getDifference(row, 'home') : ''}</Typography>
  //               </div>
  //             </div>
  //           </div>
  //         ))}
  //       </div>
  //       <div>
  //         {props.rows.map((row) => {
  //           const colors = {};
  //           let backgroundColor = null;

  //           if (
  //             row.homeRank && 
  //             (backgroundColor = ColorUtil.lerpColor(bestColor, worstColor, (+row.homeRank / 363))) &&
  //             backgroundColor !== '#'
  //           ) {
  //             colors.backgroundColor = backgroundColor;
  //             colors.color = theme.palette.getContrastText(backgroundColor);
  //           }
  //           return <Typography style = {rightFlexColumnStyle} variant = 'body2'>{row.homeRank ? <span style = {Object.assign(colors, spanStyle)}>{row.homeRank}</span> : ''}{row.home}</Typography>
  //         })}
  //       </div>
  //     </div>
  //   </Container>
  // );

  return (
    <Container>
      {props.rows.map((row) => {
        const awayColors = {};
        const homeColors = {};
        let backgroundColor = null;

        if (
          row.awayRank && 
          (backgroundColor = ColorUtil.lerpColor(bestColor, worstColor, (+row.awayRank / 363))) &&
          backgroundColor !== '#'
        ) {
          awayColors.backgroundColor = backgroundColor;
          awayColors.color = theme.palette.getContrastText(backgroundColor);
        }
        if (
          row.homeRank && 
          (backgroundColor = ColorUtil.lerpColor(bestColor, worstColor, (+row.homeRank / 363))) &&
          backgroundColor !== '#'
        ) {
          homeColors.backgroundColor = backgroundColor;
          homeColors.color = theme.palette.getContrastText(backgroundColor);
        }

        const radius = '4px';

        return (
          <div style = {{'margin': '10px 0px'}}>
            <div style = {{'display': 'flex', 'alignItems':'center', 'justifyContent': 'space-between'}}>
              <div style = {{'margin': '0px 20px 0px 5px', 'minWidth': '100px', 'textAlign': 'left', 'overflow': 'hidden'}}>
                <Typography variant = 'body2'>{row.away}{row.awayRank ? <span style = {Object.assign(awayColors, spanStyle)}>{row.awayRank}</span> : ''}<Typography style = {{'margin': '0px 5px'}} color = {'text.secondary'} variant = 'caption'>{getDifference(row, 'away') && row.showDifference && width >= 375 ? getDifference(row, 'away') : ''}</Typography></Typography></div>
              <div style = {{'textAlign': 'center', 'whiteSpace': 'nowrap'}}>
                <Tooltip key={row.tooltip || row.title || row.name} disableFocusListener placement = 'top' title={row.tooltip || row.title || row.name}><Typography color = {'text.secondary'} variant = 'body2'>{width > 700 ? row.title : row.name}</Typography></Tooltip>
              </div>
              <div style = {{'margin': '0px 5px 0px 20px', 'minWidth': '100px', 'textAlign': 'right', 'overflow': 'hidden'}}>
                <Typography variant = 'body2'><Typography style = {{'margin': '0px 5px'}} color = {'text.secondary'} variant = 'caption'>{getDifference(row, 'home') && row.showDifference && width >= 375 ? getDifference(row, 'home') : ''}</Typography>{row.homeRank ? <span style = {Object.assign(homeColors, spanStyle)}>{row.homeRank}</span> : ''}{row.home}</Typography>
              </div>
            </div>
            <div style = {{'display': 'flex', 'alignItems': 'center', 'justifyContent': 'space-between', 'marginTop': '5px'}}>
              <div style = {{'flexGrow': '1', 'margin': '0px 5px', 'display': 'flex', 'height': '8px'}}>
                <div style = {{'display': ('favored' in row ? 'block' : 'none'), 'width': getPercentage(row, 'away'), 'backgroundColor': getColor(row, 'away'), 'color': '#fff', 'textAlign': 'center', 'borderTopLeftRadius': radius, 'borderBottomLeftRadius': radius/*theme.palette.getContrastText(getColor(row, 'away'))*/}}>
                  
                </div>
                <div style = {{'display': ('favored' in row ? 'block' : 'none'), 'width': getPercentage(row, 'home'), 'backgroundColor': getColor(row, 'home'), 'color': '#fff', 'textAlign': 'center', 'borderTopRightRadius': radius, 'borderBottomRightRadius': radius/*theme.palette.getContrastText(getColor(row, 'home'))*/}}>
                  
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </Container>
  );
}

export default CompareStatistic;