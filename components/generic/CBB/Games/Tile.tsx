'use client';
import React, { useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useWindowDimensions, Dimensions } from '@/components/hooks/useWindowDimensions';

import HelperCBB from '@/components/helpers/CBB';

import { useTheme } from '@mui/material/styles';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import Locked from '@/components/generic/Billing/Locked';
import BackdropLoader from '@/components/generic/BackdropLoader';
import { Button, Skeleton } from '@mui/material';
import Indicator from '@/components/generic/CBB/Indicator';
import Pin from '@/components/generic/CBB/Pin';

import Color, {getBestColor, getWorstColor} from '@/components/utils/Color';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { refresh } from '@/components/generic/CBB/actions';
import { useScrollContext } from '@/contexts/scrollContext';
import { updateGameSort } from '@/redux/features/favorite-slice';
import { setScrollTop } from '@/redux/features/games-slice';
import useOnScreen from '@/components/hooks/useOnScreen';


// TODO there is a bug where when a game starts, isVisible becomes false, even when visible!

const Tile = ({ cbb_game, isLoadingWinPercentage }) => {
  const ColorUtil = new Color();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const theme = useTheme();

  const [hover, setHover] = useState(false);
  const [spin, setSpin] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const bestColor = getBestColor();
  const worstColor = getWorstColor();
  
  const scrollRef  = useScrollContext();
  
  const dispatch = useAppDispatch();
  const displayRank = useAppSelector(state => state.displayReducer.value.rank);
  const displayCardView = useAppSelector(state => state.displayReducer.value.cardsView);
  
  const CBB = new HelperCBB({
    'cbb_game': cbb_game,
  });
  
  const { width } = useWindowDimensions() as Dimensions;
  const isVisible = useOnScreen(ref);

  const spreadToUseHome = (CBB.isInProgress() ? CBB.getLiveSpread('home') : CBB.getPreSpread('home'));
  const spreadToUseAway = (CBB.isInProgress() ? CBB.getLiveSpread('away') : CBB.getPreSpread('away'));
  const overUnderToUse = (CBB.isInProgress() ? CBB.getLiveOver() : CBB.getPreOver());

  const handleClick = (e) => {
    if (
      scrollRef &&
      scrollRef.current
    ) {
      dispatch(setScrollTop(scrollRef.current.scrollTop));
    }

    dispatch(updateGameSort(null));
    refresh('cbb.games.'+ cbb_game.cbb_game_id);
    setSpin(true);
    startTransition(() => {
      router.push('/cbb/games/' + cbb_game.cbb_game_id);
      setSpin(false);
    });
  };

  // const handleMouseEnter = (e) => {
  //   setHover(true);
  // };
  
  // const handleMouseLeave = (e) => {
  //   setHover(false);
  // };

  const getIndicators = () => {
    const flexContainer = {
      'display': 'flex',
      'alignItems': 'left',
      'margin': '0px 10px',
    };

    const indicators: React.JSX.Element[] = [];

    if (CBB.isNeutralSite()) {
      indicators.push(
        <Indicator key = {'N'} title = {'Neutral site'} code = {'N'} color = {'#ffa726'} />
      );
    }

    return (
      <div style = {flexContainer} >
        {indicators}
      </div>
    );
  };

  const getHeader = () => {
    const flexContainer = {
      'display': 'flex',
      'alignItems': 'center',
    };

    const timeStyle = {
      'flex': 1,
      'height': '36px',
      'lineHeight': '36px',
    };

    // if (hover) {
    //   flexContainer.backgroundColor = theme.palette.action.hover;
    // }

    let network: React.JSX.Element[] = [];

    if (!CBB.isFinal() && CBB.getNetwork()) {
      network.push(<Typography key = {CBB.getNetwork()} sx = {{'marginLeft': '5px'}} color = 'text.secondary' variant = 'overline'>{CBB.getNetwork()}</Typography>);
    }

    let oddsTexts: string[] = [];
    if (
      spreadToUseAway !== '-' &&
      spreadToUseHome !== '-'
    ) {
      oddsTexts.push(spreadToUseHome < spreadToUseAway ? CBB.getTeamNameShort('home') + ' ' + spreadToUseHome : CBB.getTeamNameShort('away') + ' ' + spreadToUseAway);
    }
    if (overUnderToUse !== '-') {
      oddsTexts.push('O' + overUnderToUse);
    }

    return (
      <div style = {flexContainer} >
        <div style = {timeStyle}><Typography color = {CBB.isInProgress() ? 'info.dark' : 'text.secondary'} variant = 'overline'>{CBB.getTime()}</Typography>{network}</div>
        {
          displayCardView === 'compact' && !CBB.isFinal() && oddsTexts.length ?
            <div><Typography style={{'fontSize': '11px'}} variant = 'overline' color={'text.secondary'}>{oddsTexts.join(' | ')}</Typography></div>
          : ''
        }
        <Pin cbb_game_id = {cbb_game.cbb_game_id}  />
      </div>
    );
  };

  let awayWinPercentageContainer: React.JSX.Element[] = [];
  let homeWinPercentageContainer: React.JSX.Element[] = [];

  const hasAccessToPercentages = !(cbb_game.away_team_rating === null && cbb_game.home_team_rating === null);

  if (isLoadingWinPercentage) {
    awayWinPercentageContainer.push(<Skeleton key = {1} />)
    homeWinPercentageContainer.push(<Skeleton key = {2} />)
  } else if (!hasAccessToPercentages) {
    awayWinPercentageContainer.push(<Locked iconFontSize={null} key = {1} />);
    homeWinPercentageContainer.push(<Locked iconFontSize={null} key = {2} />);
  } else {
    const awayPercentage = +(cbb_game.away_team_rating * 100).toFixed(0);
    const homePercentage = +(cbb_game.home_team_rating * 100).toFixed(0);

    awayWinPercentageContainer.push(<Typography key = {'away_percent'} variant = 'caption' style = {{'color': ColorUtil.lerpColor(worstColor, bestColor, cbb_game.away_team_rating)}}>{awayPercentage}{(displayCardView === 'compact' ? '%' : '')}</Typography>);
    homeWinPercentageContainer.push(<Typography key = {'home_percent'} variant = 'caption' style = {{'color': ColorUtil.lerpColor(worstColor, bestColor, cbb_game.home_team_rating)}}>{homePercentage}{(displayCardView === 'compact' ? '%' : '')}</Typography>);
  }

  const getOddsLine = () => {
    const awaySpreadCoverStyle: React.CSSProperties = {};
    const homeSpreadCoverStyle: React.CSSProperties = {};
    const awayMLStyle: React.CSSProperties = {};
    const homeMLStyle: React.CSSProperties = {};
    const overStyle: React.CSSProperties = {};
    const underStyle: React.CSSProperties = {};

    let tdAwaySpreadTitle = 'Pre-game spread';
    let tdHomeSpreadTitle = 'Pre-game spread';
    let tdAwayMLTitle = 'Pre-game money line';
    let tdHomeMLTitle = 'Pre-game money line';
    let tdOverTitle = 'Pre-game over';
    let tdUnderTitle = 'Pre-game under';

    if (CBB.isFinal()) {
      if (CBB.coveredSpread('away')) {
        awaySpreadCoverStyle.color = theme.palette.success.main;
        tdAwaySpreadTitle = 'Covered pre spread';
      }
      if (CBB.coveredSpread('home')) {
        homeSpreadCoverStyle.color = theme.palette.success.main;
        tdHomeSpreadTitle = 'Covered pre spread';
      }
      if (CBB.won('away')) {
        awayMLStyle.color = theme.palette.success.main;
        tdAwayMLTitle = 'Covered money line';
      }
      if (CBB.won('home')) {
        homeMLStyle.color = theme.palette.success.main;
        tdHomeMLTitle = 'Covered money line';
      }
      if (CBB.coveredOver()) {
        overStyle.color = theme.palette.success.main;
        tdOverTitle = 'Covered over';
      }
      if (CBB.coveredUnder()) {
        underStyle.color = theme.palette.success.main;
        tdUnderTitle = 'Covered under';
      }
    } else if (CBB.isInProgress()) {
      tdAwaySpreadTitle = 'Pre / Live spread';
      tdAwayMLTitle = 'Pre / Live money line';
      tdOverTitle = 'Pre / Live over';
      tdHomeSpreadTitle = 'Pre / Live spread';
      tdHomeMLTitle = 'Pre / Live money line';
      tdUnderTitle = 'Pre / Live under';
    }

    return (
      <table style = {{'width': '100%', 'textAlign': 'center'}}>
        <thead>
          <tr>
            <th style = {{'textAlign': 'left'}}><Typography variant = 'caption'>-</Typography></th>
            <th><Typography variant = 'caption'>SPREAD</Typography></th>
            <th><Typography variant = 'caption'>ML</Typography></th>
            <th><Typography variant = 'caption'>O/U</Typography></th>
            <th style = {{'textAlign': 'right'}}><Typography variant = 'caption'>%</Typography></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style = {{'textAlign': 'left'}}><Typography variant = 'caption'>{CBB.getTeamNameShort('away')}</Typography></td>
            <td title = {tdAwaySpreadTitle}><Typography variant = 'caption' style = {awaySpreadCoverStyle}>{CBB.getPreSpread('away')}{CBB.isInProgress() ? ' / ' + CBB.getLiveSpread('away') : ''}</Typography></td>
            <td title = {tdAwayMLTitle} style = {Object.assign({'color': CBB.oddsReversal('away') ? theme.palette.warning.main : theme.palette.text.primary}, awayMLStyle)}><Typography variant = 'caption'>{CBB.getPreML('away')}{CBB.isInProgress() ? ' / ' + CBB.getLiveML('away') : ''}</Typography></td>
            <td title = {tdOverTitle}><Typography variant = 'caption' style = {overStyle}>{CBB.getPreOver() !== '-' ? 'O ' + CBB.getPreOver() : '-'}{CBB.isInProgress() ? ' / ' + CBB.getLiveOver() : ''}</Typography></td>
            <td style = {{'textAlign': 'right'}}>{awayWinPercentageContainer}</td>
          </tr>
          <tr>
            <td style = {{'textAlign': 'left'}}><Typography variant = 'caption'>{CBB.getTeamNameShort('home')}</Typography></td>
            <td title = {tdHomeSpreadTitle}><Typography variant = 'caption' style = {homeSpreadCoverStyle}>{CBB.getPreSpread('home')}{CBB.isInProgress() ? ' / ' + CBB.getLiveSpread('home') : ''}</Typography></td>
            <td title = {tdHomeMLTitle} style = {Object.assign({'color': CBB.oddsReversal('home') ? theme.palette.warning.main : theme.palette.text.primary}, homeMLStyle)}><Typography variant = 'caption'>{CBB.getPreML('home')}{CBB.isInProgress() ? ' / ' + CBB.getLiveML('home') : ''}</Typography></td>
            <td title = {tdUnderTitle}><Typography variant = 'caption' style = {underStyle}>{CBB.getPreUnder() !== '-' ? 'U ' + CBB.getPreUnder() : '-'}{CBB.isInProgress() ? ' / ' + CBB.getLiveUnder() : ''}</Typography></td>
            <td style = {{'textAlign': 'right'}}>{homeWinPercentageContainer}</td>
          </tr>
        </tbody>
      </table>
    );
  };


  const getTeamLine = (side) => {
    const flexContainer: React.CSSProperties = {
      'display': 'flex',
      'margin': '5px 0px',
      'alignItems': displayCardView === 'compact' ? 'center' : 'self-end',
    };

    const nameStyle: React.CSSProperties = {
      'flex': 1,
      'whiteSpace': 'nowrap',
      'overflow': 'hidden',
      'textOverflow': 'ellipsis',
    }

    const scoreStyle: React.CSSProperties = {
      'margin': '0px 5px',
      'width': '34px',
      'maxWidth': '34px',
      'border': '2px solid ' + theme.palette.text.secondary,
      'borderRadius': '5px',
      'textAlign': 'center',
      'flex': 2,
    };

    // is picked
    if (
      (
        side === 'home' &&
        cbb_game.home_team_rating > cbb_game.away_team_rating
      ) ||
      (
        side === 'away' &&
        cbb_game.home_team_rating < cbb_game.away_team_rating
      )
    ) {
      scoreStyle.border = '2px solid ' + theme.palette.secondary.dark;
    }

    // won
    if (
      (
        side === 'home' &&
        cbb_game.home_score > cbb_game.away_score
      ) ||
      (
        side === 'away' &&
        cbb_game.home_score < cbb_game.away_score
      )
    ) {
      scoreStyle.backgroundColor = 'rgba(66, 245, 96, 0.5)';
    }
    
    let team_id = cbb_game[side + '_team_id'];
    let wins = 0;
    let losses = 0;

    if (
      team_id &&
      team_id in cbb_game.teams &&
      'stats' in cbb_game.teams[team_id]
    ) {
      wins = cbb_game.teams[team_id].stats.wins;
      losses = cbb_game.teams[team_id].stats.losses;
    }

    const supRankStyle: React.CSSProperties = {
      'marginRight': '5px',
      'fontWeight': 700,
    };

    const teamRank = CBB.getTeamRank(side, displayRank);

    if (teamRank) {
      supRankStyle.color = ColorUtil.lerpColor(bestColor, worstColor, (+(teamRank / CBB.getNumberOfD1Teams(cbb_game.season))));
    }

    // let spread: string | null = null;
    // let overUnder: string | null = null;

    let moneyLineToUse = (CBB.isInProgress() ? CBB.getLiveML(side) : CBB.getPreML(side));

    // if (
    //   side === 'home' &&
    //   spreadToUseHome !== '-' &&
    //   spreadToUseHome < spreadToUseAway
    // ) {
    //   spread = spreadToUseHome;
    // } else if (
    //   side === 'away' &&
    //   spreadToUseAway !== '-' &&
    //   spreadToUseAway < spreadToUseHome
    // ) {
    //   spread = spreadToUseAway;
    // } else {
    //   if (overUnderToUse !== '-') {
    //     overUnder = 'O' + overUnderToUse;
    //   }
    // }


    return (
      <div style = {flexContainer} >
        <div style = {nameStyle}>
          <div style={{'display': 'flex', 'justifyContent': 'space-between', 'alignItems': 'baseline'}}>
            <div>
              <Typography variant = 'h6' sx = {{'fontSize': 14, 'display': 'inline-block'}}>
                {teamRank ?
                  <Typography variant = 'overline' color = 'text.secondary' sx = {{'fontSize': 12}}><sup style = {supRankStyle}>{teamRank}</sup></Typography> :
                ''}
                {CBB.getTeamName(side)}
                </Typography>
              <Typography variant = 'overline' color = 'text.secondary'> ({wins}-{losses})</Typography>
            </div>
            {
              displayCardView === 'compact' && !CBB.isFinal() ?
                <div><Typography style={{'fontSize': '11px'}} variant = 'overline' color={(CBB.oddsReversal(side) ? theme.palette.warning.main : 'text.secondary')}>{/*overUnder ? overUnder + ' | ' : ''*/}{/*spread ? spread + ' | ' : ''*/}{moneyLineToUse}</Typography></div>
              : ''
            }
          </div>
        </div>
        <div style = {scoreStyle}>{CBB.isInProgress() || CBB.isFinal() ? cbb_game[side + '_score'] : '-'}</div>
      </div>
    );
  };

  const getTeamLines = () => {
    const flexContainer = {
      'display': 'flex',
      'alignItems': 'center',
    };

    const teamStyle = {
      'flex': 1,
      'cursor': 'pointer',
    };

    return (
      <div style = {flexContainer}>
        <div style = {teamStyle} onClick={handleClick}>
          {getTeamLine('away')}
          {getTeamLine('home')}
        </div>
        {
          displayCardView === 'compact' ?
          <div style = {{'display': 'flex', 'flexFlow': 'column', 'padding': '0px ' + (hasAccessToPercentages || isLoadingWinPercentage ? 5 : 0) + 'px'}}>
            <div style={{'minHeight': 40, 'minWidth': 24, 'textAlign': 'center', 'lineHeight': '40px'}}>{awayWinPercentageContainer}</div>
            <div style={{'minHeight': 40, 'minWidth': 24, 'textAlign': 'center', 'lineHeight': '40px'}}>{homeWinPercentageContainer}</div>
          </div>
          : ''
        }
      </div>
    );
  };

  let tileWidth = '320px';

  if (width >= 425) {
    tileWidth = '425px';
  } else if (width < 425 && width > 320) {
    tileWidth = '100%';
  }

  const divStyle: React.CSSProperties = {
    'width': tileWidth,
    'minHeight': '100px',
    'margin': '5px',
    'height': 139,
  };

  const teamLineStyle: React.CSSProperties = {
    // 'cursor': 'pointer',
    'padding': '10px',
  };

  if (hover) {
    teamLineStyle.backgroundColor = theme.palette.action.hover;
  }

  if (displayCardView === 'large') {
    divStyle.height = 282;
  }

  return (
    <Paper elevation={3} style = {divStyle} ref = {ref}>
      {
        isVisible ?
        <>
          <BackdropLoader open = {(spin === true)} />
          {getIndicators()}
          <div style = {teamLineStyle}>
            {getHeader()}
            {getTeamLines()}
          </div>
          {
            displayCardView === 'large' ? 
              <div style = {{'padding': '0px 10px 10px 10px'}}>
                <hr style ={{'marginTop': 0}} />
                {getOddsLine()}
              </div>
            : ''
          }
          {
            displayCardView === 'large' ? 
            <div style = {{'textAlign': 'right'}}>
              <Button onClick = {handleClick}>Full Matchup</Button>
            </div>
            : ''
          }
          </>
        : <>
            <Skeleton style = {{'height': divStyle.height, 'transform': 'initial'}} />
          </>
      }
    </Paper>
  );
}

export default Tile;
