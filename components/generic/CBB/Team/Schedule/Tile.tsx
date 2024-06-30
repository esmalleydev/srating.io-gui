import React, { useState, useRef, useEffect, useTransition, ReactElement, RefObject } from 'react';
import { useRouter } from 'next/navigation';
import { useWindowDimensions, Dimensions } from '@/components/hooks/useWindowDimensions';

import moment from 'moment';

import HelperCBB from '@/components/helpers/CBB';

import { useTheme } from '@mui/material/styles';
import { Card, CardContent, Typography, Tooltip, Link, CardActionArea, Skeleton, IconButton } from '@mui/material';
import Locked from '@/components/generic/Billing/Locked';
import Color, { getBestColor, getWorstColor } from  '@/components/utils/Color';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import LegendToggleIcon from '@mui/icons-material/LegendToggle';
import { setScrollTop, updateVisibleScheduleDifferentials } from '@/redux/features/team-slice';
import { useScrollContext } from '@/contexts/scrollContext';
import { setLoading } from '@/redux/features/display-slice';


const Tile = ({ cbb_game, team}) => {
  const self = this;
  const myRef: RefObject<HTMLDivElement> = useRef(null);
  const router = useRouter();
  const theme = useTheme();
  const [isPending, startTransition] = useTransition();
  const [scrolled, setScrolled] = useState(false);

  const dispatch = useAppDispatch();
  const isLoadingPredictions = useAppSelector(state => state.teamReducer.schedulePredictionsLoading);
  const visibleScheduleDifferentials = useAppSelector(state => state.teamReducer.visibleScheduleDifferentials);

  const isScheduleDiffVisible = visibleScheduleDifferentials.indexOf(cbb_game.cbb_game_id) > -1;

  const displayRank = useAppSelector(state => state.displayReducer.rank);

  const scrollRef  = useScrollContext();

  const { width } = useWindowDimensions() as Dimensions;


  const won = (cbb_game.home_score > cbb_game.away_score && cbb_game.home_team_id === team.team_id) || (cbb_game.home_score < cbb_game.away_score && cbb_game.away_team_id === team.team_id);
  const otherSide = cbb_game.home_team_id === team.team_id ? 'away' : 'home';

  const bestColor = getBestColor();
  const worstColor = getWorstColor();

  const CBB = new HelperCBB({
    'cbb_game': cbb_game,
  });


  const otherTeam = cbb_game.teams[cbb_game[otherSide + '_team_id']];

  const containerStyle = {
    'display': 'flex',
    'justifyContent': 'space-between',
    'alignItems': 'center',
    // 'scrollMarginTop': '200px', // todo doesnt seem to work for games in Nov.
  };

  const circleBackgroundColor = cbb_game.status === 'final' ? (won ? theme.palette.success.light : theme.palette.error.light) : (cbb_game.status !== 'pre' ? theme.palette.warning.light : theme.palette.info.light);


  const dateStyle: React.CSSProperties = {
    'width': '55px',
    'minWidth': '55px',
    'height': '55px',
    'borderRadius': '50%',
    'border': '2px solid ' + circleBackgroundColor,
    'margin': '5px 0px',
    'display': 'flex',
    'flexWrap': 'wrap',
    'cursor': 'pointer',
  };

  const titleStyle = {
    'margin': '0px 10px',
    'overflow': 'hidden',
    'whiteSpace': 'nowrap',
    'textOverflow': 'ellipsis',
  };

  const handleGameClick = () => {
    if (
      scrollRef &&
      scrollRef.current
    ) {
      dispatch(setScrollTop(scrollRef.current.scrollTop));
    }

    dispatch(setLoading(true));
    startTransition(() => {
      router.push('/cbb/games/' + cbb_game.cbb_game_id);
    });
  };

  const handleTeamClick = (team_id) => {
    if (
      scrollRef &&
      scrollRef.current
    ) {
      dispatch(setScrollTop(scrollRef.current.scrollTop));
    }

    dispatch(setLoading(true));
    startTransition(() => {
      router.push('/cbb/team/' + team_id + '?season=' + cbb_game.season);
    });
  };

  // todo???
  // useEffect(() => {
  //   if (!scrolled && props.scroll && myRef && myRef.current) {
  //     myRef.current.scrollIntoView();
  //     setScrolled(true);
  //   }
  // });

  let scoreLineText: string | ReactElement = CBB.getTime();

  if (CBB.isFinal()) {
    scoreLineText = <div><span style = {{'color': circleBackgroundColor}}>{(won ? 'W ' : 'L ')}</span>{cbb_game.home_score + '-' + cbb_game.away_score}</div>;
  } else if (CBB.isInProgress()) {
    scoreLineText = <span style = {{'color': circleBackgroundColor}}>Live</span>;
  }

  let predictionContainer: React.JSX.Element[] = [];

  const hasAccessToPercentages = !(cbb_game.away_team_rating === null && cbb_game.home_team_rating === null);

  if (isLoadingPredictions) {
    predictionContainer.push(<Skeleton style = {{'width': '100%', 'height': '100%', 'transform': 'initial'}} key = {1} />)
  } else if (!hasAccessToPercentages) {
    predictionContainer.push(<Locked key = {1} iconFontSize = {(width < 475 ? '18px' : '20px')} />);
  } else {
    const winPercentage = (cbb_game.home_team_id === team.team_id ? +(cbb_game.home_team_rating * 100).toFixed(0) : +(cbb_game.away_team_rating * 100).toFixed(0));
    predictionContainer.push(<Typography key = {'win_percent'} variant = 'caption' style = {{'color': Color.lerpColor(worstColor, bestColor, winPercentage / 100)}}>{winPercentage}%</Typography>);
  }

  const supRankStyle: React.CSSProperties = {
    'fontSize': '11px'
  };

  const otherSideRank = CBB.getTeamRank(otherSide, displayRank);

  if (otherSideRank) {
    supRankStyle.color = Color.lerpColor(bestColor, worstColor, (+(otherSideRank / CBB.getNumberOfD1Teams(cbb_game.season))));
  }

  // other team W-L
  let wins = 0;
  let losses = 0;

  if (
    otherTeam &&
    'stats' in otherTeam
  ) {
    wins = otherTeam.stats.wins;
    losses = otherTeam.stats.losses;
  }


  const neutralStyle: React.CSSProperties = {
    'fontSize': '10px',
    'padding': '3px',
    'minWidth': '18px',
    'textAlign': 'center',
    'borderRadius': '5px',
    'backgroundColor': '#ffa726',
    'color': theme.palette.getContrastText('#ffa726'),
  };

  return (
    <div style = {{'display': 'flex', 'margin': '5px 0px', 'justifyContent': 'space-between'}}>
      <div style = {{'display': 'flex'}}>
        <Card style = {{'display': 'flex', 'width': (width <= 475 ? 40 : 75), 'marginRight': 5, 'alignContent': 'center', 'justifyContent': 'center', 'alignItems': 'center', 'cursor': 'pointer'}}  onClick={handleGameClick}>
          <Typography variant = 'caption' style = {{'color': circleBackgroundColor}}>{moment(cbb_game.start_date.split('T')[0] + ' 12:00:00').format((width <= 475 ? 'Do' : 'ddd Do'))}</Typography>
        </Card>
      </div>
      <Card style = {{'width': '100%'}}>
        <CardContent style = {{'padding': (CBB.isFinal() ? '0px' : '7px') + ' 0px'}}>
          <div ref = {myRef} style = {containerStyle}>
            <div style = {{'display': 'flex', 'alignItems': 'center', 'overflow': 'hidden'}}>

              
              {/* <div style = {dateStyle} onClick={handleGameClick}>
                <div style = {{'flexBasis': '100%', 'display': 'flex', 'justifyContent': 'center', 'alignItems': 'flex-end'}}>
                  <Typography variant = 'caption'>{moment(cbb_game.start_date.split('T')[0] + ' 12:00:00').format('ddd').toUpperCase()}</Typography>
                </div>
                <div style = {{'flexBasis': '100%', 'display': 'flex', 'justifyContent': 'center', 'alignItems': 'flex-start'}}>
                  <Typography variant = 'caption'>{moment(cbb_game.start_date.split('T')[0] + ' 12:00:00').format('Do')}</Typography>
                </div>
              </div> */}


              <div style = {{'marginLeft': '10px', 'display': 'flex', 'justifyContent': 'center', 'alignItems': 'baseline', 'overflow': 'hidden'  /*'flexWrap': 'nowrap'*/}}>
                <Typography color = 'text.secondary' variant = 'caption'>
                  {
                    cbb_game.neutral_site ? 
                      <Tooltip enterTouchDelay={0} disableFocusListener placement = 'top' title = {'Neutral site'}><span style = {neutralStyle}>N</span></Tooltip>
                    : (cbb_game.home_team_id === team.team_id ? 'vs' : '@')
                  }
                </Typography>
                <Typography style = {titleStyle} variant = {'body2'} onClick={() => {handleTeamClick(cbb_game[otherSide + '_team_id'])}}>
                  <sup style = {supRankStyle}>{CBB.getTeamRank(otherSide, displayRank)}</sup> <Link style = {{'cursor': 'pointer'}} underline='hover'>{CBB.getTeamName(otherSide)}</Link>
                  {width > 375 ? <Typography variant = 'overline' color = 'text.secondary'> ({wins}-{losses})</Typography> : ''}
                </Typography>
              </div>

            </div>
            {
              CBB.isFinal() ?
              <div>
                <Tooltip title = {'Toggle historical chart'} placement="top">
                  <IconButton
                    id = 'differential-button'
                    onClick = {() => dispatch(updateVisibleScheduleDifferentials(cbb_game.cbb_game_id))}
                  >
                    <LegendToggleIcon style = {{'fontSize': (width < 475 ? '22px' : '24px')}} color = {isScheduleDiffVisible ? 'success' : 'primary'} />
                  </IconButton>
                </Tooltip>
              </div>
              : ''
            }
          </div>
        </CardContent>
      </Card>
      <div style = {{'display': 'flex'}}>
        <Card style = {{'display': 'flex', 'width': 75, 'marginLeft': 5, 'alignContent': 'center', 'justifyContent': 'center', 'alignItems': 'center', 'cursor': 'pointer'}}  onClick={handleGameClick}>
          <Typography variant = 'caption' onClick={handleGameClick}><Link style = {{'cursor': 'pointer'}} underline='hover'>{scoreLineText}</Link></Typography>
        </Card>
        <Tooltip enterTouchDelay={1000} disableFocusListener disableHoverListener = {(width < 775)} placement = 'top' title={'Predicted win %'}>
          <Card style = {{'display': 'flex', 'width': 50, 'marginLeft': 5, 'alignContent': 'center', 'justifyContent': 'center', 'alignItems': 'center'}}>
            {predictionContainer}
          </Card>
        </Tooltip>
      </div>
    </div>
  );
}

export default Tile;
