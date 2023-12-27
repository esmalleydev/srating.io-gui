import React, { useState, useRef, useEffect, useTransition, ReactElement, RefObject } from 'react';
import { useRouter } from 'next/navigation';
import useWindowDimensions from '@/components/hooks/useWindowDimensions';

import moment from 'moment';

import HelperCBB from '../../../helpers/CBB';
// import HelperTeam from '../../../helpers/Team';

import { useTheme } from '@mui/material/styles';
import BackdropLoader from '../../BackdropLoader';
import { Card, CardContent, Typography, Tooltip, Link } from '@mui/material';
import Locked from '../../Billing/Locked';
import utilsColor from  '@/components/utils/Color.jsx';


const ColorUtil = new utilsColor();

// todo the ellipsis doesnt work for some reason

const Tile = (props) => {
  interface Dimensions {
    width: number;
    height: number;
  };

  const self = this;
  const myRef: RefObject<HTMLDivElement> = useRef(null);
  const router = useRouter();
  const theme = useTheme();
  const [isPending, startTransition] = useTransition();
  // const { height, width } = useWindowDimensions();
  const [scrolled, setScrolled] = useState(false);
  const [spin, setSpin] = useState(false);

  const { width } = useWindowDimensions() as Dimensions;

  const game = props.game;
  const team = props.team;

  const won = (game.home_score > game.away_score && game.home_team_id === team.team_id) || (game.home_score < game.away_score && game.away_team_id === team.team_id);
  const otherSide = game.home_team_id === team.team_id ? 'away' : 'home';
  const bestColor = theme.palette.mode === 'light' ? theme.palette.success.main : theme.palette.success.dark;
  const worstColor = theme.palette.mode === 'light' ? theme.palette.error.main : theme.palette.error.dark;

  const CBB = new HelperCBB({
    'cbb_game': game,
  });


  const otherTeam = game.teams[game[otherSide + '_team_id']];

  const containerStyle = {
    'display': 'flex',
    'justifyContent': 'space-between',
    'alignItems': 'center',
    'scrollMarginTop': '200px', // todo doesnt seem to work for games in Nov.
  };

  const circleBackgroundColor = game.status === 'final' ? (won ? theme.palette.success.light : theme.palette.error.light) : (game.status !== 'pre' ? theme.palette.warning.light : theme.palette.info.light);


  const dateStyle: React.CSSProperties = {
    'width': '55px',
    'height': '55px',
    'borderRadius': '50%',
    'border': '2px solid ' + circleBackgroundColor,
    // 'color': theme.palette.getContrastText(circleBackgroundColor),
    // 'backgroundColor': circleBackgroundColor,
    'margin': '5px 0px',
    'display': 'flex',
    'flexWrap': 'wrap',
  };

  const titleStyle = {
    'margin': '0px 10px',
    'overflow': 'hidden',
    'whiteSpace': 'nowrap',
    'textOverflow': 'ellipsis',
  };

  const handleGameClick = () => {
    setSpin(true);
    startTransition(() => {
      router.push('/cbb/games/' + game.cbb_game_id);
      setSpin(false);
    });
  };

  const handleTeamClick = (team_id) => {
    setSpin(true);
    startTransition(() => {
      router.push('/cbb/team/' + team_id);
      setSpin(false);
    });
  };


  useEffect(() => {
    if (!scrolled && props.scroll && myRef && myRef.current) {
      myRef.current.scrollIntoView();
      setScrolled(true);
    }
  });

  let scoreLineText: string | ReactElement = CBB.getTime();

  if (CBB.isFinal()) {
    scoreLineText = <div><span style = {{'color': circleBackgroundColor}}>{(won ? 'W ' : 'L ')}</span>{game.home_score + '-' + game.away_score}</div>;
  } else if (CBB.isInProgress()) {
    scoreLineText = CBB.getTime() + ' ' + game.home_score + '-' + game.away_score;
  }

  const percentageStyle: React.CSSProperties = {};
  let predictionPercentage: number | null = null;

  if (game.home_team_rating !== null && game.away_team_rating !== null) {
    if (game.home_team_id === team.team_id) {
      predictionPercentage = +(game.home_team_rating * 100).toFixed(0);
    } else {
      predictionPercentage = +(game.away_team_rating * 100).toFixed(0);
    }
  }
  
  if (predictionPercentage !== null) {
    percentageStyle.color = ColorUtil.lerpColor(worstColor, bestColor, (+predictionPercentage / 100));
  }

  const supRankStyle: React.CSSProperties = {
    'fontSize': '11px'
  };

  const otherSideRank = CBB.getTeamRank(otherSide, 'composite_rank');

  if (otherSideRank) {
    supRankStyle.color = ColorUtil.lerpColor(bestColor, worstColor, (+(otherSideRank / CBB.getNumberOfD1Teams(game.season))));
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

  return (
    <div style = {{'display': 'flex', 'margin': '5px 0px', 'justifyContent': 'space-between'}}>
      <Card style = {{'width': '100%', /*'padding': 10*/}}>
        <CardContent style = {{'padding': '0px 10px'}}>
          <BackdropLoader open = {(spin === true)} />
          <div ref = {myRef} style = {containerStyle}>
            <div style = {{'display': 'flex', 'alignItems': 'center'}}>

              <div style = {dateStyle}>
                <div style = {{'flexBasis': '100%', 'display': 'flex', 'justifyContent': 'center', 'alignItems': 'flex-end'}}>
                  <Typography variant = 'caption'>{moment(game.start_date.split('T')[0] + ' 12:00:00').format('ddd').toUpperCase()}</Typography>
                </div>
                <div style = {{'flexBasis': '100%', 'display': 'flex', 'justifyContent': 'center', 'alignItems': 'flex-start'}}>
                  <Typography variant = 'caption'>{moment(game.start_date.split('T')[0] + ' 12:00:00').format('Do')}</Typography>
                </div>
              </div>

              <div style = {{'marginLeft': '10px', 'display': 'flex', 'justifyContent': 'center', 'alignItems': 'baseline',  'flexWrap': 'nowrap'}}>
                <Typography color = 'text.secondary' variant = 'caption'>{game.home_team_id === team.team_id ? 'vs' : '@'}</Typography>
                <Typography style = {titleStyle} variant = {'body2'} onClick={() => {handleTeamClick(game[otherSide + '_team_id'])}}>
                  <sup style = {supRankStyle}>{CBB.getTeamRank(otherSide, 'composite_rank')}</sup> <Link style = {{'cursor': 'pointer'}} underline='hover'>{CBB.getTeamName(otherSide)}</Link>
                  {width > 375 ? <Typography variant = 'overline' color = 'text.secondary'> ({wins}-{losses})</Typography> : ''}
                </Typography>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div style = {{'display': 'flex'}}>
        <Card style = {{'display': 'flex', 'width': 75, 'marginLeft': 5, 'alignContent': 'center', 'justifyContent': 'center', 'alignItems': 'center'}}>
          <Typography variant = 'caption' onClick={handleGameClick}><Link style = {{'cursor': 'pointer'}} underline='hover'>{scoreLineText}</Link></Typography>
        </Card>
        <Tooltip enterTouchDelay={0} disableFocusListener disableHoverListener = {(width < 775)} placement = 'top' title={'Predicted win %'}>
          <Card style = {{'display': 'flex', 'width': 50, 'marginLeft': 5, 'alignContent': 'center', 'justifyContent': 'center', 'alignItems': 'center'}}>
          {
            predictionPercentage === null ?
              <Locked /> :
              <Typography style = {percentageStyle} variant = 'caption'>{predictionPercentage}%</Typography>
          }
        </Card>
        </Tooltip>
      </div>
    </div>
  );
}

export default Tile;
