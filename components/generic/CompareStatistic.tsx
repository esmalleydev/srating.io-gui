'use client';

import { useWindowDimensions, Dimensions } from '@/components/hooks/useWindowDimensions';

import { Skeleton } from '@mui/material';

import Locked from './Billing/Locked';
import RankSpan from './RankSpan';
import Typography from '../ux/text/Typography';
import { useTheme } from '../hooks/useTheme';
import Paper from '../ux/container/Paper';
import Tooltip from '../ux/hover/Tooltip';


const CompareStatistic = (
  { rows, season, max, paper, maxWidth = 600 }:
  { rows: any[]; season: number; max: number; paper: boolean; maxWidth?: number; },
) => {
  const { width } = useWindowDimensions() as Dimensions;
  const theme = useTheme();


  const fixedLength = width > 500 ? 2 : 1;


  const getColor = (row, base) => {
    if (row.favored === 'lower') {
      if (+row.awayCompareValue < +row.homeCompareValue) {
        return base === 'away' ? theme.success.light : theme.error.light;
      }
      if (+row.awayCompareValue > +row.homeCompareValue) {
        return base === 'home' ? theme.success.light : theme.error.light;
      }
    }

    if (row.favored === 'higher') {
      if (+row.awayCompareValue > +row.homeCompareValue) {
        return base === 'away' ? theme.success.light : theme.error.light;
      }
      if (+row.awayCompareValue < +row.homeCompareValue) {
        return base === 'home' ? theme.success.light : theme.error.light;
      }
    }

    return theme.secondary.light;
  };

  const getPercentage = (row, base) => {
    if (row.favored === 'lower') {
      const total = +row.awayCompareValue + +row.homeCompareValue;

      if (+row.awayCompareValue < +row.homeCompareValue) {
        const percentage = base === 'away' ? 100 * (+row.homeCompareValue / total) : 100 * (+row.awayCompareValue / total);
        return `${percentage}%`;
      }
      if (+row.awayCompareValue > +row.homeCompareValue) {
        const percentage = base === 'home' ? 100 * (+row.awayCompareValue / total) : 100 * (+row.homeCompareValue / total);
        return `${percentage}%`;
      }
    }


    if (row.favored === 'higher') {
      let total = +row.awayCompareValue + +row.homeCompareValue;

      // compareType rank is just for aEM because it is annoying as fuck and the numbers go all over
      /*
      if (
        row.compareType === 'absolute' &&
        (
          (
            +row.homeCompareValue < 0 &&
            +row.awayCompareValue > 0
          ) ||
          (base === 'home' && +row.awayCompareValue > total) ||
          (base === 'away' && +row.awayCompareValue > total)
        )
      ) {
        let percentage = ((+row.awayCompareValue - +row.homeCompareValue) / Math.abs(+row.homeCompareValue)) * 100;
        return (base === 'away' ? (percentage >= 100 ? 95 : percentage) : 100 - (percentage >= 100 ? 95 : percentage)) + '%';
      } */
      if (row.compareType === 'rank' && row.awayRank && row.homeRank) {
        total = row.awayRank + row.homeRank;
        const percentage = base === 'home' ? 100 * (+row.awayRank / total) : 100 * (+row.homeRank / total);
        return `${percentage}%`;
      } if (+row.awayCompareValue > +row.homeCompareValue) {
        const percentage = base === 'away' ? 100 * (+row.awayCompareValue / total) : 100 * (+row.homeCompareValue / total);
        return `${percentage}%`;
      }

      /*
      if (
        row.compareType === 'absolute' &&
        (
          (
            +row.awayCompareValue < 0 &&
            +row.homeCompareValue > 0
          ) ||
          (base === 'home' && +row.homeCompareValue > total) ||
          (base === 'away' && +row.homeCompareValue > total)
        )
      ) {
        let percentage = ((+row.homeCompareValue - +row.awayCompareValue) / Math.abs(+row.awayCompareValue)) * 100;
        return (base === 'home' ? (percentage >= 100 ? 95 : percentage) : 100 - (percentage >= 100 ? 95 : percentage)) + '%';
      } */
      if (row.compareType === 'rank' && row.awayRank && row.homeRank) {
        total = row.awayRank + row.homeRank;
        const percentage = base === 'away' ? 100 * (+row.homeRank / total) : 100 * (+row.awayRank / total);
        return `${percentage}%`;
      } if (+row.awayCompareValue < +row.homeCompareValue) {
        const percentage = base === 'home' ? 100 * (+row.homeCompareValue / total) : 100 * (+row.awayCompareValue / total);
        return `${percentage}%`;
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
        return base === 'away' ? 0 : `-${(+row.awayCompareValue - +row.homeCompareValue).toFixed(('precision' in row ? row.precision : fixedLength))}`;
      }
      if (+row.awayCompareValue < +row.homeCompareValue) {
        if (+row.homeCompareValue === Infinity) {
          return 0;
        }
        return base === 'home' ? 0 : `-${(+row.homeCompareValue - +row.awayCompareValue).toFixed(('precision' in row ? row.precision : fixedLength))}`;
      }
    }

    if (row.favored === 'higher') {
      if (+row.awayCompareValue > +row.homeCompareValue) {
        return base === 'away' ? `+${(+row.awayCompareValue - +row.homeCompareValue).toFixed(('precision' in row ? row.precision : fixedLength))}` : 0;
      }
      if (+row.awayCompareValue < +row.homeCompareValue) {
        return base === 'home' ? `+${(+row.homeCompareValue - +row.awayCompareValue).toFixed(('precision' in row ? row.precision : fixedLength))}` : 0;
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


  const Container = (props_) => {
    if (paper) {
      return <Paper elevation = {3} style = {{ padding: 10, maxWidth, width: '100%', margin: 'auto' }}>{props_.children}</Paper>;
    }

    return <div style = {{ maxWidth, width: '100%', margin: 'auto' }}>{props_.children}</div>;
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

  const titleStyle: React.CSSProperties = {
    whiteSpace: 'nowrap',
    color: theme.info.light,
  };

  if (width < 500) {
    titleStyle.maxWidth = 100;
    titleStyle.overflow = 'hidden';
    titleStyle.textOverflow = 'ellipsis';
  }
  if (width < 425) {
    titleStyle.maxWidth = 60;
    titleStyle.overflow = 'hidden';
    titleStyle.textOverflow = 'ellipsis';
  }

  let key = 0;
  return (
    <Container>
      {rows.map((row) => {
        key++;

        const radius = '4px';

        const getRankSpan = (rank) => {
          if (!rank) {
            return '';
          }

          return (
            <RankSpan rank = {rank} key = {key} max = {max} useOrdinal = {true} />
          );
        };

        if (row.loading) {
          return <Skeleton key = {key} />;
        }

        return (
          <div key = {key} style = {{ margin: '10px 0px' }}>
            <div style = {{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style = {{ margin: '0px 20px 0px 5px', minWidth: '100px', textAlign: 'left', overflow: 'hidden' }}>
                {
                row.locked ? <Locked iconFontSize={'18px'} />
                  : <Typography type = 'body2'>{row.away}{getRankSpan(row.awayRank)}<Typography style = {{ margin: `0px ${row.awayRank ? '5px' : '8px'}`, display: 'inline-block', color: theme.text.secondary }} type = 'caption'>{getDifference(row, 'away') && row.showDifference && width >= 375 ? getDifference(row, 'away') : ''}</Typography></Typography>
                }
              </div>
              <div style = {{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                <Tooltip key={row.tooltip || row.title || row.name} delay = {500} position = 'top' text={row.tooltip || row.title || row.name}><Typography style = {titleStyle} type = 'body2'>{width > 700 ? row.title : row.name}</Typography></Tooltip>
              </div>
              <div style = {{ margin: '0px 5px 0px 20px', minWidth: '100px', textAlign: 'right', overflow: 'hidden' }}>
                {
                row.locked ? <Locked iconFontSize={'18px'} />
                  : <Typography type = 'body2'><Typography style = {{ margin: `0px ${row.homeRank ? '5px' : '8px'}`, display: 'inline-block', color: theme.text.secondary }} type = 'caption'>{getDifference(row, 'home') && row.showDifference && width >= 375 ? getDifference(row, 'home') : ''}</Typography>{getRankSpan(row.homeRank)}{row.home}</Typography>
                }
              </div>
            </div>
            <div style = {{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '5px' }}>
              <div style = {{ flexGrow: '1', margin: '0px 5px', display: 'flex', height: '8px' }}>
                <div style = {{ display: ('favored' in row ? 'block' : 'none'), width: getPercentage(row, 'away'), backgroundColor: getColor(row, 'away'), color: '#fff', textAlign: 'center', borderTopLeftRadius: radius, borderBottomLeftRadius: radius/* theme.palette.getContrastText(getColor(row, 'away')) */ }}>

                </div>
                <div style = {{ display: ('favored' in row ? 'block' : 'none'), width: getPercentage(row, 'home'), backgroundColor: getColor(row, 'home'), color: '#fff', textAlign: 'center', borderTopRightRadius: radius, borderBottomRightRadius: radius/* theme.palette.getContrastText(getColor(row, 'home')) */ }}>

                </div>
              </div>
            </div>
          </div>
        );
      })}
    </Container>
  );
};

export default CompareStatistic;
