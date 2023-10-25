import React, { useState } from 'react';
import { useRouter } from 'next/router';
import useWindowDimensions from '../../../hooks/useWindowDimensions';

import HelperCBB from '../../../helpers/CBB';
import CompareStatistic from '../../CompareStatistic';

import { useTheme } from '@mui/material/styles';

import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import PinIcon from '@mui/icons-material/PushPin';
// import Link from '@mui/material/Link';



const Tile = (props) => {
  const self = this;
  const router = useRouter();
  const theme = useTheme();
  const [pin, setPin] = useState(props.isPinned || false);
  
  const rankDisplay = props.rankDisplay || 'composite_rank';
  const picksData = props.picks;
  const game = props.game;

  const home_team_id = game.home_team_id;
  const away_team_id = game.away_team_id;

  const maxWidth = 750;

  const CBB = new HelperCBB({
    'cbb_game': game,
  });

  const pinStyle = {};

  if (pin) {
    pinStyle.color = theme.palette.warning.light;
  }


  const { height, width } = useWindowDimensions();


  const handleMatchup = (e) => {
    props.onClickTile();
    // TODO support ?view=matchup
    router.push('/cbb/games/' + game.cbb_game_id);
  };

  const handlePin = () => {
    if (props.actionPin) {
      props.actionPin(game.cbb_game_id);
    }
    setPin(!pin);
  };


  const compareRows = [
    {
      'name': 'Win %',
      'title': 'Predicted win %',
      'away': (game.away_team_rating * 100).toFixed(0) + '%',
      'home': (game.home_team_rating * 100).toFixed(0) + '%',
      'awayCompareValue': game.away_team_rating,
      'homeCompareValue': game.home_team_rating,
      'favored': 'higher',
      'showDifference': false,
      'locked': (game.away_team_rating === null && game.home_team_rating === null),
    },
    {
      'name': 'aEM',
      'title': 'Adjusted Efficiency margin',
      'away': picksData && picksData[away_team_id] && picksData[away_team_id].adjusted_efficiency_rating,
      'home': picksData && picksData[home_team_id] && picksData[home_team_id].adjusted_efficiency_rating,
      'awayCompareValue': picksData && picksData[away_team_id] && picksData[away_team_id].adjusted_efficiency_rating,
      'homeCompareValue': picksData && picksData[home_team_id] && picksData[home_team_id].adjusted_efficiency_rating,
      'awayRank': picksData && picksData[away_team_id] && picksData[away_team_id].adjusted_efficiency_rating_rank,
      'homeRank': picksData && picksData[home_team_id] && picksData[home_team_id].adjusted_efficiency_rating_rank,
      'favored': 'higher',
      'showDifference': true,
      'compareType': 'rank',
    },
    {
      'name': 'ORT',
      'title': 'Offensive rating',
      'away': picksData && picksData[away_team_id] && picksData[away_team_id].offensive_rating,
      'home': picksData && picksData[home_team_id] && picksData[home_team_id].offensive_rating,
      'awayCompareValue': picksData && picksData[away_team_id] && picksData[away_team_id].offensive_rating,
      'homeCompareValue': picksData && picksData[home_team_id] && picksData[home_team_id].offensive_rating,
      'awayRank': picksData && picksData[away_team_id] && picksData[away_team_id].offensive_rating_rank,
      'homeRank': picksData && picksData[home_team_id] && picksData[home_team_id].offensive_rating_rank,
      'favored': 'higher',
      'showDifference': true,
    },
    // {
    //   'name': 'DRT',
    //   'title': 'Defensive rating',
    //   'away': picksData && picksData[away_team_id] && picksData[away_team_id].defensive_rating,
    //   'home': picksData && picksData[home_team_id] && picksData[home_team_id].defensive_rating,
    //   'awayCompareValue': picksData && picksData[away_team_id] && picksData[away_team_id].defensive_rating,
    //   'homeCompareValue': picksData && picksData[home_team_id] && picksData[home_team_id].defensive_rating,
    //   'awayRank': picksData && picksData[away_team_id] && picksData[away_team_id].defensive_rating_rank,
    //   'homeRank': picksData && picksData[home_team_id] && picksData[home_team_id].defensive_rating_rank,
    //   'favored': 'lower',
    //   'showDifference': true,
    // },
    // {
    //   'name': 'PTS Off.',
    //   'title': 'Avg points scored',
    //   'away': picksData && picksData[away_team_id] && picksData[away_team_id].points,
    //   'home': picksData && picksData[home_team_id] && picksData[home_team_id].points,
    //   'awayCompareValue': picksData && picksData[away_team_id] && picksData[away_team_id].points,
    //   'homeCompareValue': picksData && picksData[home_team_id] && picksData[home_team_id].points,
    //   'awayRank': picksData && picksData[away_team_id] && picksData[away_team_id].points_rank,
    //   'homeRank': picksData && picksData[home_team_id] && picksData[home_team_id].points_rank,
    //   'favored': 'higher',
    //   'showDifference': true,
    // },
    // {
    //   'name': 'PTS Def.',
    //   'title': 'Avg points allowed',
    //   'away': picksData && picksData[away_team_id] && picksData[away_team_id].opponent_points,
    //   'home': picksData && picksData[home_team_id] && picksData[home_team_id].opponent_points,
    //   'awayCompareValue': picksData && picksData[away_team_id] && picksData[away_team_id].opponent_points,
    //   'homeCompareValue': picksData && picksData[home_team_id] && picksData[home_team_id].opponent_points,
    //   'awayRank': picksData && picksData[away_team_id] && picksData[away_team_id].opponent_points_rank,
    //   'homeRank': picksData && picksData[home_team_id] && picksData[home_team_id].opponent_points_rank,
    //   'favored': 'lower',
    //   'showDifference': true,
    // },
  ];

  /**
   * Get game start time line with pin button
   * @return {Object} div container
   */
  const getTime = () => {
    return (
      <div style = {{'display': 'flex', 'justifyContent': 'space-between'}}>
        <Typography color = 'text.secondary' variant = 'overline'>{CBB.getStartTime()}</Typography>
        <IconButton id = {'pin-'+game.cbb_game_id} onClick = {handlePin}>
          <PinIcon sx = {pinStyle} fontSize = 'small' />
        </IconButton>
      </div>
    );
  };

  /**
   * Get the header line.
   * Ex: Purdue vs Indiana
   * @return {Object} div container 
   */
  const getHeader = () => {
    const flexContainerStyle = {
      'display': 'flex',
      'justifyContent': 'space-between',
      'flexWrap': 'nowrap',
      'width': '100%',
      'maxWidth': maxWidth,
      'alignItems': 'center'
    };


    const awayName = CBB.getTeamName('away');
    const homeName = CBB.getTeamName('home');

    const fontSize = width > 525 ? '1.1rem' : '1rem';
    const maxWidthTypography = width <= 425 ? 140 : (width <= 375 ? 120 : 1000);
    
    return (
      <div style={flexContainerStyle}>
        <Typography variant = 'h6' style = {{'textOverflow': 'ellipsis', 'whiteSpace': 'nowrap', 'overflow': 'hidden', 'fontSize': fontSize, 'maxWidth': maxWidthTypography}}>
          {CBB.getTeamRank('away', rankDisplay) ? <sup style = {{'marginRight': '5px', 'fontSize': 12}}>{CBB.getTeamRank('away', rankDisplay)}</sup> : ''}{awayName}
        </Typography>
        {/* <Typography color = 'text.secondary' sx = {{'minWidth': 50, 'textAlign': 'center'}} variant = 'overline' style = {{'textOverflow': 'ellipsis', 'whiteSpace': 'nowrap', 'overflow': 'hidden'}}>
          {CBB.isNeuralSite() ? 'vs' : '@'}
        </Typography> */}
        <Typography variant = 'h6' style = {{'textOverflow': 'ellipsis', 'whiteSpace': 'nowrap', 'overflow': 'hidden', 'fontSize': fontSize, 'maxWidth': maxWidthTypography}}>
          {CBB.getTeamRank('home', rankDisplay) ? <sup style = {{'marginRight': '5px', 'fontSize': 12}}>{CBB.getTeamRank('home', rankDisplay)}</sup> : ''}{homeName}
        </Typography>
      </div>
    );
  };

  /**
   * Get the secondary header, contains conference
   * @return {Object} div container
   */
  const getSecondaryHeader = () => {
    const containerStyle = {
      'display': 'flex',
      'justifyContent': 'space-between',
      'width': '100%',
      'maxWidth': maxWidth,
      'alignItems': 'center'
    };
    return (
      <div style={containerStyle}>
        <Typography variant = 'overline' color = 'text.secondary' style = {{'textOverflow': 'ellipsis', 'whiteSpace': 'nowrap', 'overflow': 'hidden', 'maxWidth': (width < 525 ? 100 : 200)}}>{CBB.getTeamConference('away')}</Typography>
        <Typography variant = 'overline' color = 'text.secondary' style = {{'textOverflow': 'ellipsis', 'whiteSpace': 'nowrap', 'overflow': 'hidden', 'maxWidth': (width < 525 ? 100 : 200)}}>{CBB.getTeamConference('home')}</Typography>
      </div>
    );
  };
  
  /**
   * Get the ML, spread and over / under lines
   * @return {Object} div container
   */
  const getOdds = () => {
    const containerStyle = {
      'display': 'flex',
      'justifyContent': 'left',
      'width': '100%',
      'maxWidth': maxWidth,
      'alignItems': 'center'
    };

    return (
      <div>
        <div style={containerStyle}>
          <Typography color = 'text.secondary' sx = {{'display': 'block', 'lineHeight': '20px'}} variant = 'overline'>Money Line: {CBB.getPreML('away')} / {CBB.getPreML('home')}</Typography>
        </div>
        <div style={containerStyle}>
          <Typography color = 'text.secondary' sx = {{'display': 'block', 'lineHeight': '20px'}} variant = 'overline'>Spread: {CBB.getPreSpread('away')} / {CBB.getPreSpread('home')}</Typography>
        </div>
        <div style={containerStyle}>
          <Typography color = 'text.secondary' sx = {{'display': 'block', 'lineHeight': '20px'}} variant = 'overline'>O/U: {CBB.getPreOver()} / {CBB.getPreUnder()}</Typography>
        </div>
      </div>
    );
  };

  /**
   * Get the loading skeletons for the picks stats
   * @return {Array}
   */
  const getSkeleton = () => {
    const skeletons = [];

    for (let i = 0; i < compareRows.length; i++) {
      skeletons.push(<Skeleton key = {i} variant="text" animation="wave" sx = {{'width': '100%', 'maxWidth': maxWidth, 'height': '30px', 'margin': '10px 0px'}} />)
    }

    return skeletons;
  };


  return (
    <Paper style = {{'width': '100%', 'maxWidth': maxWidth, 'padding': '10px', 'margin': '10px 0px'}}>
      {getTime()}
      {getHeader()}
      {getSecondaryHeader()}
      {
        picksData === null ?
        getSkeleton() :
        <CompareStatistic key = {game.cbb_game_id} maxWidth = {maxWidth} paper = {false} rows = {compareRows} />
      }
      {getOdds()}
      <div style = {{'textAlign': 'right'}}>
        <Button onClick = {handleMatchup}>Full matchup</Button>
      </div>
    </Paper>
  );
}


export default Tile;
