import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import useWindowDimensions from '../../../hooks/useWindowDimensions';

import moment from 'moment';

import Typography from '@mui/material/Typography';

import HelperCBB from '../../../helpers/CBB';
// import HelperTeam from '../../../helpers/Team';

import { useTheme } from '@mui/material/styles';


const Tile = (props) => {
  const self = this;
  const myRef = useRef(null);
  const router = useRouter();
  const theme = useTheme();
  const { height, width } = useWindowDimensions();
  const [scrolled, setScrolled] = useState(false);

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
    'scrollMarginTop': '220px',
    'cursor': 'pointer',
  };

  const circleBackgroundColor = game.status === 'final' ? (won ? theme.palette.success.light : theme.palette.error.light) : (game.status !== 'pre' ? theme.palette.warning.light : theme.palette.info.light);

  const dateStyle = {
    'width': width < 600 ? '55px' : '65px',
    'height': width < 600 ? '55px' : '65px',
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
    router.push('/CBB/Games/' + game.cbb_game_id);
  }

  useEffect(() => {
    if (!scrolled && props.scroll && myRef && myRef.current) {
      myRef.current.scrollIntoView();
      setScrolled(true);
    }
  });

  let scoreLineText = CBB.getTime();

  if (CBB.isFinal()) {
    scoreLineText = (won ? 'W ' : 'L ') + game.home_score + '-' + game.away_score;
  } else if (CBB.isInProgress()) {
    scoreLineText = CBB.getTime() + ' ' + game.home_score + '-' + game.away_score;
  }

  return (
    <div ref = {myRef} style = {containerStyle} onClick = {handleClick}>
      <div style = {{'display': 'flex', 'alignItems': 'center',}}>
        <div style = {dateStyle}>
          <div style = {{'flexBasis': '100%', 'display': 'flex', 'justifyContent': 'center', 'alignItems': 'flex-end'}}>
            <Typography variant = 'body1'>{moment(game.start_date.split('T')[0] + ' 12:00:00').format('Do')}</Typography>
          </div>
          <div style = {{'flexBasis': '100%', 'display': 'flex', 'justifyContent': 'center', 'alignItems': 'flex-start'}}>
            <Typography variant = 'body2'>{moment(game.start_date.split('T')[0] + ' 12:00:00').format('ddd').toUpperCase()}</Typography>
          </div>
        </div>
        <div style = {{'marginLeft': '10px', 'display': 'flex', 'justifyContent': 'center', 'alignItems': 'baseline'}}>
          <Typography color = 'text.secondary' variant = 'body1'>{game.home_team_id === team.team_id ? 'vs' : 'at'}</Typography><Typography style = {titleStyle} variant = {width < 600 ? 'body1' : 'h5'}><sup style = {{'fontSize': '12px'}}>{CBB.getTeamRank(otherSide, 'composite_rank')}</sup> {CBB.getTeamName(otherSide)}</Typography>
        </div>
      </div>
      <div>
        <Typography variant = {width < 600 ? 'body2' : 'h6'}>{scoreLineText}</Typography>
      </div>
    </div>
  );
}

export default Tile;
