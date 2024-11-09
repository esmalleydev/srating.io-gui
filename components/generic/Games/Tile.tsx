'use client';

import React, { useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useWindowDimensions, Dimensions } from '@/components/hooks/useWindowDimensions';

import HelperGame from '@/components/helpers/Game';

import { useTheme } from '@mui/material/styles';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import Locked from '@/components/generic/Billing/Locked';
import { Button, Skeleton } from '@mui/material';
import Indicator from '@/components/generic/Indicator';
import Pin from '@/components/generic/Pin';

import Color, { getBestColor, getWorstColor } from '@/components/utils/Color';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { refresh } from '@/components/generic/actions';
import { useScrollContext } from '@/contexts/scrollContext';
import { updateGameSort } from '@/redux/features/favorite-slice';
import { setScrollTop } from '@/redux/features/games-slice';
import useOnScreen from '@/components/hooks/useOnScreen';
import { setLoading } from '@/redux/features/display-slice';
import Record from './Tile/Record';
import Rank from './Tile/Rank';
import Organization from '@/components/helpers/Organization';


export const getTileBaseStyle = (): React.CSSProperties => {
  const { width } = useWindowDimensions() as Dimensions;

  let tileWidth = '320px';

  if (width >= 425) {
    tileWidth = '425px';
  } else if (width < 425 && width > 320) {
    tileWidth = '100%';
  }

  return {
    width: tileWidth,
    minHeight: '100px',
    margin: '5px',
    height: 139,
  };
};

const Tile = ({ game, isLoadingWinPercentage }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const theme = useTheme();

  const [hover, setHover] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const bestColor = getBestColor();
  const worstColor = getWorstColor();
  const organizations = useAppSelector((state) => state.dictionaryReducer.organization);
  const hideOdds = useAppSelector((state) => state.displayReducer.hideOdds);
  const path = Organization.getPath({ organizations, organization_id: game.organization_id });

  const scrollRef = useScrollContext();

  const dispatch = useAppDispatch();
  const displayCardView = useAppSelector((state) => state.displayReducer.cardsView);

  const Game = new HelperGame({
    game,
  });

  const isVisible = useOnScreen(ref);

  const spreadToUseHome = (Game.isInProgress() ? Game.getLiveSpread('home') : Game.getPreSpread('home'));
  const spreadToUseAway = (Game.isInProgress() ? Game.getLiveSpread('away') : Game.getPreSpread('away'));
  const overUnderToUse = (Game.isInProgress() ? Game.getLiveOver() : Game.getPreOver());

  const handleClick = (e) => {
    if (
      scrollRef &&
      scrollRef.current
    ) {
      dispatch(setScrollTop(scrollRef.current.scrollTop));
    }

    dispatch(updateGameSort(null));
    refresh(`${path}.games.${game.game_id}`);
    dispatch(setLoading(true));
    startTransition(() => {
      router.push(`/${path}/games/${game.game_id}`);
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
      display: 'flex',
      alignItems: 'left',
      margin: '0px 10px',
    };

    const indicators: React.JSX.Element[] = [];

    if (Game.isNeutralSite()) {
      indicators.push(
        <Indicator key = {'N'} title = {'Neutral site'} code = {'N'} color = {'#ffa726'} />,
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
      display: 'flex',
      alignItems: 'center',
    };

    const timeStyle = {
      flex: 1,
      height: '36px',
      lineHeight: '36px',
    };

    // if (hover) {
    //   flexContainer.backgroundColor = theme.palette.action.hover;
    // }

    const network: React.JSX.Element[] = [];

    if (!Game.isFinal() && Game.getNetwork()) {
      network.push(<Typography key = {Game.getNetwork()} sx = {{ marginLeft: '5px' }} color = 'text.secondary' variant = 'overline'>{Game.getNetwork()}</Typography>);
    }

    const oddsTexts: string[] = [];
    if (
      spreadToUseAway !== '-' &&
      spreadToUseHome !== '-'
    ) {
      oddsTexts.push(spreadToUseHome < spreadToUseAway ? `${Game.getTeamNameShort('home')} ${spreadToUseHome}` : `${Game.getTeamNameShort('away')} ${spreadToUseAway}`);
    }
    if (overUnderToUse !== '-') {
      oddsTexts.push(`O${overUnderToUse}`);
    }

    return (
      <div style = {flexContainer} >
        <div style = {timeStyle}><Typography color = {Game.isInProgress() ? 'info.dark' : 'text.secondary'} variant = 'overline'>{Game.getTime()}</Typography>{network}</div>
        {
          displayCardView === 'compact' && !Game.isFinal() && oddsTexts.length && hideOdds !== 1 ?
            <div><Typography style={{ fontSize: '11px' }} variant = 'overline' color={'text.secondary'}>{oddsTexts.join(' | ')}</Typography></div>
            : ''
        }
        <Pin game_id = {game.game_id} />
      </div>
    );
  };

  const awayWinPercentageContainer: React.JSX.Element[] = [];
  const homeWinPercentageContainer: React.JSX.Element[] = [];

  const hasAccessToPercentages = !(!game.prediction || (game.prediction.home_percentage === null && game.prediction.away_percentage === null));

  if (isLoadingWinPercentage) {
    awayWinPercentageContainer.push(<Skeleton key = {1} />);
    homeWinPercentageContainer.push(<Skeleton key = {2} />);
  } else if (!hasAccessToPercentages) {
    awayWinPercentageContainer.push(<Locked iconFontSize={'20px'} key = {1} />);
    homeWinPercentageContainer.push(<Locked iconFontSize={'20px'} key = {2} />);
  } else {
    const awayPercentage = +(game.prediction.away_percentage * 100).toFixed(0);
    const homePercentage = +(game.prediction.home_percentage * 100).toFixed(0);

    awayWinPercentageContainer.push(<Typography key = {'away_percent'} variant = 'caption' style = {{ color: Color.lerpColor(worstColor, bestColor, game.prediction.away_percentage) }}>{awayPercentage}{(displayCardView === 'compact' ? '%' : '')}</Typography>);
    homeWinPercentageContainer.push(<Typography key = {'home_percent'} variant = 'caption' style = {{ color: Color.lerpColor(worstColor, bestColor, game.prediction.home_percentage) }}>{homePercentage}{(displayCardView === 'compact' ? '%' : '')}</Typography>);
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

    if (Game.isFinal()) {
      if (Game.coveredSpread('away')) {
        awaySpreadCoverStyle.color = theme.palette.success.main;
        tdAwaySpreadTitle = 'Covered pre spread';
      }
      if (Game.coveredSpread('home')) {
        homeSpreadCoverStyle.color = theme.palette.success.main;
        tdHomeSpreadTitle = 'Covered pre spread';
      }
      if (Game.won('away')) {
        awayMLStyle.color = theme.palette.success.main;
        tdAwayMLTitle = 'Covered money line';
      }
      if (Game.won('home')) {
        homeMLStyle.color = theme.palette.success.main;
        tdHomeMLTitle = 'Covered money line';
      }
      if (Game.coveredOver()) {
        overStyle.color = theme.palette.success.main;
        tdOverTitle = 'Covered over';
      }
      if (Game.coveredUnder()) {
        underStyle.color = theme.palette.success.main;
        tdUnderTitle = 'Covered under';
      }
    } else if (Game.isInProgress()) {
      tdAwaySpreadTitle = 'Pre / Live spread';
      tdAwayMLTitle = 'Pre / Live money line';
      tdOverTitle = 'Pre / Live over';
      tdHomeSpreadTitle = 'Pre / Live spread';
      tdHomeMLTitle = 'Pre / Live money line';
      tdUnderTitle = 'Pre / Live under';
    }

    return (
      <table style = {{ width: '100%', textAlign: 'center' }}>
        <thead>
          <tr>
            <th style = {{ textAlign: 'left' }}><Typography variant = 'caption'>-</Typography></th>
            <th><Typography variant = 'caption'>SPREAD</Typography></th>
            <th><Typography variant = 'caption'>ML</Typography></th>
            <th><Typography variant = 'caption'>O/U</Typography></th>
            <th style = {{ textAlign: 'right' }}><Typography variant = 'caption'>%</Typography></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style = {{ textAlign: 'left' }}><Typography variant = 'caption'>{Game.getTeamNameShort('away')}</Typography></td>
            <td title = {tdAwaySpreadTitle}><Typography variant = 'caption' style = {awaySpreadCoverStyle}>{Game.getPreSpread('away')}{Game.isInProgress() ? ` / ${Game.getLiveSpread('away')}` : ''}</Typography></td>
            <td title = {tdAwayMLTitle} style = {({ color: Game.oddsReversal('away') ? theme.palette.warning.main : theme.palette.text.primary, ...awayMLStyle })}><Typography variant = 'caption'>{Game.getPreML('away')}{Game.isInProgress() ? ` / ${Game.getLiveML('away')}` : ''}</Typography></td>
            <td title = {tdOverTitle}><Typography variant = 'caption' style = {overStyle}>{Game.getPreOver() !== '-' ? `O ${Game.getPreOver()}` : '-'}{Game.isInProgress() ? ` / ${Game.getLiveOver()}` : ''}</Typography></td>
            <td style = {{ textAlign: 'right' }}>{awayWinPercentageContainer}</td>
          </tr>
          <tr>
            <td style = {{ textAlign: 'left' }}><Typography variant = 'caption'>{Game.getTeamNameShort('home')}</Typography></td>
            <td title = {tdHomeSpreadTitle}><Typography variant = 'caption' style = {homeSpreadCoverStyle}>{Game.getPreSpread('home')}{Game.isInProgress() ? ` / ${Game.getLiveSpread('home')}` : ''}</Typography></td>
            <td title = {tdHomeMLTitle} style = {({ color: Game.oddsReversal('home') ? theme.palette.warning.main : theme.palette.text.primary, ...homeMLStyle })}><Typography variant = 'caption'>{Game.getPreML('home')}{Game.isInProgress() ? ` / ${Game.getLiveML('home')}` : ''}</Typography></td>
            <td title = {tdUnderTitle}><Typography variant = 'caption' style = {underStyle}>{Game.getPreUnder() !== '-' ? `U ${Game.getPreUnder()}` : '-'}{Game.isInProgress() ? ` / ${Game.getLiveUnder()}` : ''}</Typography></td>
            <td style = {{ textAlign: 'right' }}>{homeWinPercentageContainer}</td>
          </tr>
        </tbody>
      </table>
    );
  };


  const getTeamLine = (side: string) => {
    const flexContainer: React.CSSProperties = {
      display: 'flex',
      margin: '5px 0px',
      alignItems: displayCardView === 'compact' ? 'center' : 'self-end',
    };

    const nameStyle: React.CSSProperties = {
      flex: 1,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    };

    const scoreStyle: React.CSSProperties = {
      margin: '0px 5px',
      width: '34px',
      maxWidth: '34px',
      border: `2px solid ${theme.palette.text.secondary}`,
      borderRadius: '5px',
      textAlign: 'center',
      flex: 2,
    };

    // is picked
    if (
      hideOdds !== 1 &&
      (
        (
          side === 'home' &&
          game.prediction &&
          game.prediction.home_percentage !== null &&
          game.prediction.home_percentage > game.prediction.away_percentage
        ) ||
        (
          side === 'away' &&
          game.prediction &&
          game.prediction.home_percentage !== null &&
          game.prediction.home_percentage < game.prediction.away_percentage
        )
      )
    ) {
      scoreStyle.border = `2px solid ${theme.palette.secondary.dark}`;
    }

    // won
    if (
      (
        side === 'home' &&
        game.home_score > game.away_score
      ) ||
      (
        side === 'away' &&
        game.home_score < game.away_score
      )
    ) {
      scoreStyle.backgroundColor = 'rgba(66, 245, 96, 0.5)';
    }

    const team_id = game[`${side}_team_id`];

    // let spread: string | null = null;
    // let overUnder: string | null = null;

    const moneyLineToUse = (Game.isInProgress() ? Game.getLiveML(side) : Game.getPreML(side));

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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div>
              <Typography variant = 'h6' sx = {{ fontSize: 14, display: 'inline-block' }}>
                <Typography variant = 'overline' color = 'text.secondary' sx = {{ fontSize: 12 }}><Rank game={game} team_id={team_id} /></Typography>
                {Game.getTeamName(side)}
              </Typography>
              <Record game={game} team_id={team_id} />
            </div>
            {
              displayCardView === 'compact' && !Game.isFinal() && hideOdds !== 1 ?
                <div><Typography style={{ fontSize: '11px' }} variant = 'overline' color={(Game.oddsReversal(side) ? theme.palette.warning.main : 'text.secondary')}>{/* overUnder ? overUnder + ' | ' : '' */}{/* spread ? spread + ' | ' : '' */}{moneyLineToUse}</Typography></div>
                : ''
            }
          </div>
        </div>
        <div style = {scoreStyle}>{Game.isInProgress() || Game.isFinal() ? game[`${side}_score`] || 0 : '-'}</div>
      </div>
    );
  };

  const getTeamLines = () => {
    const flexContainer = {
      display: 'flex',
      alignItems: 'center',
    };

    const teamStyle = {
      flex: 1,
      cursor: 'pointer',
    };

    return (
      <div style = {flexContainer}>
        <div style = {teamStyle} onClick={handleClick}>
          {getTeamLine('away')}
          {getTeamLine('home')}
        </div>
        {
          displayCardView === 'compact' && hideOdds !== 1 ?
          <div style = {{ display: 'flex', flexFlow: 'column', padding: `0px ${hasAccessToPercentages || isLoadingWinPercentage ? 5 : 0}px` }}>
            <div style={{
              minHeight: 40, minWidth: 24, textAlign: 'center', lineHeight: '40px',
            }}>{awayWinPercentageContainer}</div>
            <div style={{
              minHeight: 40, minWidth: 24, textAlign: 'center', lineHeight: '40px',
            }}>{homeWinPercentageContainer}</div>
          </div>
            : ''
        }
      </div>
    );
  };

  const divStyle = getTileBaseStyle();

  if (Game.isNeutralSite()) {
    divStyle.height = +(divStyle.height || 0) + 21;
  }


  const teamLineStyle: React.CSSProperties = {
    // 'cursor': 'pointer',
    padding: '10px',
  };

  if (hover) {
    teamLineStyle.backgroundColor = theme.palette.action.hover;
  }

  if (displayCardView === 'large') {
    divStyle.height = 282 + (!hasAccessToPercentages ? 25 : 0) + (Game.isNeutralSite() ? 21 : 0);
  }

  return (
    <Paper elevation={3} style = {divStyle} ref = {ref}>
      {
        isVisible ?
        <>
          {getIndicators()}
          <div style = {teamLineStyle}>
            {getHeader()}
            {getTeamLines()}
          </div>
          {
            displayCardView === 'large' ?
              <div style = {{ padding: '0px 10px 10px 10px' }}>
                <hr style ={{ marginTop: 0 }} />
                {hideOdds !== 1 ? getOddsLine() : ''}
              </div>
              : ''
          }
          {
            displayCardView === 'large' ?
            <div style = {{ textAlign: 'right' }}>
              <Button onClick = {handleClick}>Full Matchup</Button>
            </div>
              : ''
          }
          </>
          : <>
            <Skeleton style = {{ height: divStyle.height, transform: 'initial' }} />
          </>
      }
    </Paper>
  );
};

export default Tile;
