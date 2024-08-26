import React, {
  useState, useRef, useEffect, useTransition, ReactElement, RefObject,
} from 'react';
import { useRouter } from 'next/navigation';
import { useWindowDimensions, Dimensions } from '@/components/hooks/useWindowDimensions';

import moment from 'moment';

import HelperCBB from '@/components/helpers/CBB';

import { useTheme } from '@mui/material/styles';
import {
  Card, CardContent, Typography, Tooltip, Link, CardActionArea, Skeleton, IconButton,
} from '@mui/material';
import Locked from '@/components/generic/Billing/Locked';
import Color, { getBestColor, getWorstColor } from '@/components/utils/Color';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import LegendToggleIcon from '@mui/icons-material/LegendToggle';
import { setScrollTop, updateVisibleScheduleDifferentials } from '@/redux/features/team-slice';
import { useScrollContext } from '@/contexts/scrollContext';
import { setLoading } from '@/redux/features/display-slice';
import Rank from './Tile/Rank';
import Record from './Tile/Record';


const Tile = ({ game, team }) => {
  const myRef: RefObject<HTMLDivElement> = useRef(null);
  const router = useRouter();
  const theme = useTheme();
  const [isPending, startTransition] = useTransition();
  const [scrolled, setScrolled] = useState(false);

  const dispatch = useAppDispatch();
  const isLoadingPredictions = useAppSelector((state) => state.teamReducer.schedulePredictionsLoading);
  const visibleScheduleDifferentials = useAppSelector((state) => state.teamReducer.visibleScheduleDifferentials);

  const isScheduleDiffVisible = visibleScheduleDifferentials.indexOf(game.game_id) > -1;


  const scrollRef = useScrollContext();

  const { width } = useWindowDimensions() as Dimensions;


  const won = (game.home_score > game.away_score && game.home_team_id === team.team_id) || (game.home_score < game.away_score && game.away_team_id === team.team_id);
  const otherSide = game.home_team_id === team.team_id ? 'away' : 'home';

  const bestColor = getBestColor();
  const worstColor = getWorstColor();

  const CBB = new HelperCBB({
    game,
  });



  const containerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    // 'scrollMarginTop': '200px', // todo doesnt seem to work for games in Nov.
  };

  const circleBackgroundColor = game.status === 'final' ? (won ? theme.palette.success.light : theme.palette.error.light) : (game.status !== 'pre' ? theme.palette.warning.light : theme.palette.info.light);


  const dateStyle: React.CSSProperties = {
    width: '55px',
    minWidth: '55px',
    height: '55px',
    borderRadius: '50%',
    border: `2px solid ${circleBackgroundColor}`,
    margin: '5px 0px',
    display: 'flex',
    flexWrap: 'wrap',
    cursor: 'pointer',
  };

  const titleStyle = {
    margin: '0px 10px',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
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
      router.push(`/cbb/games/${game.game_id}`);
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
      router.push(`/cbb/team/${team_id}?season=${game.season}`);
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
    scoreLineText = <div><span style = {{ color: circleBackgroundColor }}>{(won ? 'W ' : 'L ')}</span>{`${game.home_score}-${game.away_score}`}</div>;
  } else if (CBB.isInProgress()) {
    scoreLineText = <span style = {{ color: circleBackgroundColor }}>Live</span>;
  }

  const predictionContainer: React.JSX.Element[] = [];

  const hasAccessToPercentages = !(!game.prediction || (game.prediction.home_percentage === null && game.prediction.away_percentage === null));

  if (isLoadingPredictions) {
    predictionContainer.push(<Skeleton style = {{ width: '100%', height: '100%', transform: 'initial' }} key = {1} />);
  } else if (!hasAccessToPercentages) {
    predictionContainer.push(<Locked key = {1} iconFontSize = {(width < 475 ? '18px' : '20px')} />);
  } else {
    const winPercentage = (game.home_team_id === team.team_id ? +(game.prediction.home_percentage * 100).toFixed(0) : +(game.prediction.away_percentage * 100).toFixed(0));
    predictionContainer.push(<Typography key = {'win_percent'} variant = 'caption' style = {{ color: Color.lerpColor(worstColor, bestColor, winPercentage / 100) }}>{winPercentage}%</Typography>);
  }



  const neutralStyle: React.CSSProperties = {
    fontSize: '10px',
    padding: '3px',
    minWidth: '18px',
    textAlign: 'center',
    borderRadius: '5px',
    backgroundColor: '#ffa726',
    color: theme.palette.getContrastText('#ffa726'),
  };

  return (
    <div style = {{ display: 'flex', margin: '5px 0px', justifyContent: 'space-between' }}>
      <div style = {{ display: 'flex' }}>
        <Card style = {{
          display: 'flex', width: (width <= 475 ? 40 : 75), marginRight: 5, alignContent: 'center', justifyContent: 'center', alignItems: 'center', cursor: 'pointer',
        }} onClick={handleGameClick}>
          <Typography variant = 'caption' style = {{ color: circleBackgroundColor }}>{moment(`${game.start_date.split('T')[0]} 12:00:00`).format((width <= 475 ? 'Do' : 'ddd Do'))}</Typography>
        </Card>
      </div>
      <Card style = {{ width: '100%' }}>
        <CardContent style = {{ padding: `${CBB.isFinal() ? '0px' : '7px'} 0px` }}>
          <div ref = {myRef} style = {containerStyle}>
            <div style = {{ display: 'flex', alignItems: 'center', overflow: 'hidden' }}>


              {/* <div style = {dateStyle} onClick={handleGameClick}>
                <div style = {{'flexBasis': '100%', 'display': 'flex', 'justifyContent': 'center', 'alignItems': 'flex-end'}}>
                  <Typography variant = 'caption'>{moment(game.start_date.split('T')[0] + ' 12:00:00').format('ddd').toUpperCase()}</Typography>
                </div>
                <div style = {{'flexBasis': '100%', 'display': 'flex', 'justifyContent': 'center', 'alignItems': 'flex-start'}}>
                  <Typography variant = 'caption'>{moment(game.start_date.split('T')[0] + ' 12:00:00').format('Do')}</Typography>
                </div>
              </div> */}


              <div style = {{
                marginLeft: '10px', display: 'flex', justifyContent: 'center', alignItems: 'baseline', overflow: 'hidden' /* 'flexWrap': 'nowrap' */ }}>
                <Typography color = 'text.secondary' variant = 'caption'>
                  {
                    game.neutral_site ?
                      <Tooltip enterTouchDelay={0} disableFocusListener placement = 'top' title = {'Neutral site'}><span style = {neutralStyle}>N</span></Tooltip>
                      : (game.home_team_id === team.team_id ? 'vs' : '@')
                  }
                </Typography>
                <Typography style = {titleStyle} variant = {'body2'} onClick={() => { handleTeamClick(game[`${otherSide}_team_id`]); }}>
                  <Rank game={game} team_id={game[`${otherSide}_team_id`]} /> <Link style = {{ cursor: 'pointer' }} underline='hover'>{CBB.getTeamName(otherSide)}</Link>
                  {width > 375 ? <Record game={game} team_id={game[`${otherSide}_team_id`]} /> : ''}
                </Typography>
              </div>

            </div>
            {
              CBB.isFinal() ?
              <div>
                <Tooltip title = {'Toggle historical chart'} placement="top">
                  <IconButton
                    id = 'differential-button'
                    onClick = {() => dispatch(updateVisibleScheduleDifferentials(game.game_id))}
                  >
                    <LegendToggleIcon style = {{ fontSize: (width < 475 ? '22px' : '24px') }} color = {isScheduleDiffVisible ? 'success' : 'primary'} />
                  </IconButton>
                </Tooltip>
              </div>
                : ''
            }
          </div>
        </CardContent>
      </Card>
      <div style = {{ display: 'flex' }}>
        <Card style = {{
          display: 'flex', width: 75, marginLeft: 5, alignContent: 'center', justifyContent: 'center', alignItems: 'center', cursor: 'pointer',
        }} onClick={handleGameClick}>
          <Typography variant = 'caption' onClick={handleGameClick}><Link style = {{ cursor: 'pointer' }} underline='hover'>{scoreLineText}</Link></Typography>
        </Card>
        <Tooltip enterTouchDelay={1000} disableFocusListener disableHoverListener = {(width < 775)} placement = 'top' title={'Predicted win %'}>
          <Card style = {{
            display: 'flex', width: 50, marginLeft: 5, alignContent: 'center', justifyContent: 'center', alignItems: 'center',
          }}>
            {predictionContainer}
          </Card>
        </Tooltip>
      </div>
    </div>
  );
};

export default Tile;
