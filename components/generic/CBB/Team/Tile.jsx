import React, { useState, useRef, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
// import useWindowDimensions from '../../../hooks/useWindowDimensions';

import moment from 'moment';

import HelperCBB from '../../../helpers/CBB';
// import HelperTeam from '../../../helpers/Team';

import { useTheme } from '@mui/material/styles';
import BackdropLoader from '../../BackdropLoader';
import { Card, CardActionArea, CardContent, Typography } from '@mui/material';


const Tile = (props) => {
  const self = this;
  const myRef = useRef(null);
  const router = useRouter();
  const theme = useTheme();
  const [isPending, startTransition] = useTransition();
  // const { height, width } = useWindowDimensions();
  const [scrolled, setScrolled] = useState(false);
  const [spin, setSpin] = useState(false);

  const game = props.game;
  const team = props.team;

  const won = (game.home_score > game.away_score && game.home_team_id === team.team_id) || (game.home_score < game.away_score && game.away_team_id === team.team_id);

  const otherSide = game.home_team_id === team.team_id ? 'away' : 'home';

  const CBB = new HelperCBB({
    'cbb_game': game,
  });

  // const AwayTeam = new HelperTeam({'team': team.opponents[game.away_team_id] || team});
  // const HomeTeam = new HelperTeam({'team': team.opponents[game.home_team_id] || team});

  const containerStyle = {
    'display': 'flex',
    'justifyContent': 'space-between',
    'alignItems': 'center',
    'scrollMarginTop': '200px', // todo doesnt seem to work for games in Nov.
    // 'scrollPaddingTop': '200px',
    'cursor': 'pointer',
  };

  const circleBackgroundColor = game.status === 'final' ? (won ? theme.palette.success.light : theme.palette.error.light) : (game.status !== 'pre' ? theme.palette.warning.light : theme.palette.info.light);

  const dateStyle = {
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
  };

  const handleClick = () => {
    setSpin(true);
    startTransition(() => {
      router.push('/cbb/games/' + game.cbb_game_id);
      setSpin(false);
    });
  }

  useEffect(() => {
    if (!scrolled && props.scroll && myRef && myRef.current) {
      myRef.current.scrollIntoView();
      setScrolled(true);
    }
  });

  let scoreLineText = CBB.getTime();

  if (CBB.isFinal()) {
    scoreLineText = <div><span style = {{'color': circleBackgroundColor}}>{(won ? 'W ' : 'L ')}</span>{game.home_score + '-' + game.away_score}</div>;
  } else if (CBB.isInProgress()) {
    scoreLineText = CBB.getTime() + ' ' + game.home_score + '-' + game.away_score;
  }

  return (
    <Card style={{'margin': '5px 0px'}}>
      <CardActionArea  onClick = {handleClick}>
        <CardContent style = {{'padding': '0px 10px'}}>
          <BackdropLoader open = {(spin === true)} />
          <div ref = {myRef} style = {containerStyle}>
            <div style = {{'display': 'flex', 'alignItems': 'center',}}>
              <div style = {dateStyle}>
                <div style = {{'flexBasis': '100%', 'display': 'flex', 'justifyContent': 'center', 'alignItems': 'flex-end'}}>
                  <Typography variant = 'body2'>{moment(game.start_date.split('T')[0] + ' 12:00:00').format('Do')}</Typography>
                </div>
                <div style = {{'flexBasis': '100%', 'display': 'flex', 'justifyContent': 'center', 'alignItems': 'flex-start'}}>
                  <Typography variant = 'caption'>{moment(game.start_date.split('T')[0] + ' 12:00:00').format('ddd').toUpperCase()}</Typography>
                </div>
              </div>
              <div style = {{'marginLeft': '10px', 'display': 'flex', 'justifyContent': 'center', 'alignItems': 'baseline'}}>
                <Typography color = 'text.secondary' variant = 'body2'>{game.home_team_id === team.team_id ? 'vs' : 'at'}</Typography><Typography style = {titleStyle} variant = {'body1'}><sup style = {{'fontSize': '12px'}}>{CBB.getTeamRank(otherSide, 'composite_rank')}</sup> {CBB.getTeamName(otherSide)}</Typography>
              </div>
            </div>
            <div>
              <Typography variant = 'body1'>{scoreLineText}</Typography>
            </div>
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default Tile;
