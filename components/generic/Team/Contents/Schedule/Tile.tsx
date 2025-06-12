'use client';

import {
  useRef, useTransition, ReactElement, RefObject,
} from 'react';
import { useRouter } from 'next/navigation';
import { useWindowDimensions, Dimensions } from '@/components/hooks/useWindowDimensions';

import moment from 'moment';

import HelperGame from '@/components/helpers/Game';

import {
  Card, Tooltip, Skeleton, IconButton,
} from '@mui/material';
import Locked from '@/components/generic/Billing/Locked';
import Color, { getBestColor, getWorstColor } from '@/components/utils/Color';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import LegendToggleIcon from '@mui/icons-material/LegendToggle';
import { setDataKey, updateVisibleScheduleDifferentials } from '@/redux/features/team-slice';
import { useScrollContext } from '@/contexts/scrollContext';
import { setLoading } from '@/redux/features/display-slice';
import Rank from './Tile/Rank';
import Record from './Tile/Record';
import Organization from '@/components/helpers/Organization';
import { useTheme } from '@/components/hooks/useTheme';
import Typography from '@/components/ux/text/Typography';


const Tile = ({ game, team }) => {
  const myRef: RefObject<HTMLDivElement | null> = useRef(null);
  const router = useRouter();
  const theme = useTheme();
  const [isPending, startTransition] = useTransition();
  // const [scrolled, setScrolled] = useState(false);

  const dispatch = useAppDispatch();
  const isLoadingPredictions = useAppSelector((state) => state.teamReducer.schedulePredictionsLoading);
  const visibleScheduleDifferentials = useAppSelector((state) => state.teamReducer.visibleScheduleDifferentials);
  const organizations = useAppSelector((state) => state.dictionaryReducer.organization);
  const path = Organization.getPath({ organizations, organization_id: game.organization_id });

  const isScheduleDiffVisible = visibleScheduleDifferentials.indexOf(game.game_id) > -1;


  const scrollRef = useScrollContext();

  const { width } = useWindowDimensions() as Dimensions;


  const won = (game.home_score > game.away_score && game.home_team_id === team.team_id) || (game.home_score < game.away_score && game.away_team_id === team.team_id);
  const otherSide = game.home_team_id === team.team_id ? 'away' : 'home';

  const bestColor = getBestColor();
  const worstColor = getWorstColor();

  const Game = new HelperGame({
    game,
  });


  const containerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
    // 'scrollMarginTop': '200px', // todo doesnt seem to work for games in Nov.
  };

  let textBackgroundColor = theme.info.light;
  if (game.status === 'final') {
    textBackgroundColor = (won ? theme.success.light : theme.error.light);
  } else if (game.status !== 'pre') {
    textBackgroundColor = theme.warning.light;
  }

  const titleStyle = {
    margin: '0px 10px',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  };

  const getGameHref = () => {
    return `/${path}/games/${game.game_id}`;
  };

  const handleGameClick = (e) => {
    e.preventDefault();
    if (
      scrollRef &&
      scrollRef.current
    ) {
      dispatch(setDataKey({ key: 'scrollTop', value: scrollRef.current.scrollTop }));
    }

    dispatch(setLoading(true));
    startTransition(() => {
      router.push(getGameHref());
    });
  };

  const getTeamHref = (team_id) => {
    return `/${path}/team/${team_id}?season=${game.season}`;
  };

  const handleTeamClick = (e, team_id) => {
    e.preventDefault();
    if (
      scrollRef &&
      scrollRef.current
    ) {
      dispatch(setDataKey({ key: 'scrollTop', value: scrollRef.current.scrollTop }));
    }

    dispatch(setLoading(true));
    startTransition(() => {
      router.push(getTeamHref(team_id));
    });
  };

  // todo???
  // useEffect(() => {
  //   if (!scrolled && props.scroll && myRef && myRef.current) {
  //     myRef.current.scrollIntoView();
  //     setScrolled(true);
  //   }
  // });

  let scoreLineText: string | ReactElement = Game.getTime();

  if (Game.isFinal()) {
    const leftScore = game.home_score > game.away_score ? game.home_score : game.away_score;
    const rightScore = game.home_score > game.away_score ? game.away_score : game.home_score;
    scoreLineText = <div><span style = {{ color: textBackgroundColor }}>{(won ? 'W ' : 'L ')}</span>{`${leftScore}-${rightScore}`}</div>;
  } else if (Game.isInProgress()) {
    scoreLineText = <span style = {{ color: textBackgroundColor }}>Live</span>;
  }

  const predictionContainer: React.JSX.Element[] = [];

  const hasAccessToPercentages = !(!game.prediction || (game.prediction.home_percentage === null && game.prediction.away_percentage === null));

  if (isLoadingPredictions) {
    predictionContainer.push(<Skeleton style = {{ width: '100%', height: '100%', transform: 'initial' }} key = {1} />);
  } else if (!hasAccessToPercentages) {
    predictionContainer.push(<Locked key = {1} iconFontSize = {(width < 475 ? '18px' : '20px')} />);
  } else {
    const winPercentage = (game.home_team_id === team.team_id ? +(game.prediction.home_percentage * 100).toFixed(0) : +(game.prediction.away_percentage * 100).toFixed(0));
    predictionContainer.push(<Typography key = {'win_percent'} type = 'caption' style = {{ color: Color.lerpColor(worstColor, bestColor, winPercentage / 100) }}>{winPercentage}%</Typography>);
  }

  const neutralStyle: React.CSSProperties = {
    fontSize: '10px',
    padding: '3px',
    minWidth: '18px',
    textAlign: 'center',
    borderRadius: '5px',
    backgroundColor: '#ffa726',
    color: Color.getTextColor(theme.text.primary, '#ffa726'),
  };

  let gameLocationText: string | React.JSX.Element = (game.home_team_id === team.team_id ? 'vs' : '@');
  if (game.neutral_site) {
    gameLocationText = <Tooltip enterTouchDelay={0} disableFocusListener placement = 'top' title = {'Neutral site'}><span style = {neutralStyle}>N</span></Tooltip>;
  }

  return (
    <div style = {{ display: 'flex', margin: '5px 0px', justifyContent: 'space-between' }}>
      <div style = {{ display: 'flex' }}>
        <Card style = {{
          display: 'flex', width: (width <= 475 ? 40 : 75), marginRight: 5, alignContent: 'center', justifyContent: 'center', alignItems: 'center', cursor: 'pointer',
        }} onClick={handleGameClick}>
          <Typography type = 'caption' style = {{ color: textBackgroundColor }}>{moment(`${game.start_date.split('T')[0]} 12:00:00`).format((width <= 475 ? 'Do' : 'ddd Do'))}</Typography>
        </Card>
      </div>
      <Card style = {{ width: '100%' }}>
        <div ref = {myRef} style = {containerStyle}>
          <div style = {{ display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
            <div style = {{ marginLeft: '10px', display: 'flex', justifyContent: 'center', alignItems: 'baseline', overflow: 'hidden' /* 'flexWrap': 'nowrap' */ }}>
              <Typography type = 'caption' style = {{ color: theme.text.secondary }}>
                {gameLocationText}
              </Typography>
              <Typography style = {titleStyle} type = {'body2'}>
                <Rank game={game} team_id={game[`${otherSide}_team_id`]} /> <a style = {{ cursor: 'pointer', color: theme.link.primary }} onClick={(e) => { handleTeamClick(e, game[`${otherSide}_team_id`]); }} href = {getTeamHref(game[`${otherSide}_team_id`])}>{Game.getTeamName(otherSide)}</a>
                {width > 375 ? <Record game={game} team_id={game[`${otherSide}_team_id`]} /> : ''}
              </Typography>
            </div>
          </div>
          {
            Game.isFinal() ?
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
      </Card>
      <div style = {{ display: 'flex' }}>
        <Card style = {{
          display: 'flex', width: 75, marginLeft: 5, alignContent: 'center', justifyContent: 'center', alignItems: 'center', cursor: 'pointer',
        }} onClick={handleGameClick}>
          <Typography type = 'caption'><a style = {{ cursor: 'pointer', color: theme.link.primary }} onClick={handleGameClick} href = {getGameHref()}>{scoreLineText}</a></Typography>
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
