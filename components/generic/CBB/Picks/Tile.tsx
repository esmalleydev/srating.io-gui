'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useWindowDimensions, Dimensions } from '@/components/hooks/useWindowDimensions';

import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import HelperCBB from '@/components/helpers/CBB';
import CompareStatistic from '@/components/generic/CompareStatistic';
import Indicator from '@/components/generic/CBB/Indicator';
import Pin from '@/components/generic/CBB/Pin';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import Color, { getBestColor, getWorstColor } from  '@/components/utils/Color';
import { setScrollTop } from '@/redux/features/picks-slice';
import { updateGameSort } from '@/redux/features/favorite-slice';
import { useScrollContext } from '@/contexts/scrollContext';

const ColorUtil = new Color();


const Tile = ({ cbb_game, picks}) => {
  const router = useRouter();

  const scrollRef  = useScrollContext();
  const { width } = useWindowDimensions() as Dimensions;
  const dispatch = useAppDispatch();
  const displayRank = useAppSelector(state => state.displayReducer.rank);

  const bestColor = getBestColor();
  const worstColor = getWorstColor();

  const home_team_id = cbb_game.home_team_id;
  const away_team_id = cbb_game.away_team_id;

  const maxWidth = 750;

  const CBB = new HelperCBB({
    'cbb_game': cbb_game,
  });

  
    
    
  const handleMatchup = (e) => {
    if (
      scrollRef &&
      scrollRef.current
    ) {
      dispatch(setScrollTop(scrollRef.current.scrollTop));
    }
    dispatch(updateGameSort(null));
    router.push('/cbb/games/' + cbb_game.cbb_game_id);
  };

  const compareRows = [
    {
      'name': 'Win %',
      'title': 'Predicted win %',
      'away': (cbb_game.away_team_rating * 100).toFixed(0) + '%',
      'home': (cbb_game.home_team_rating * 100).toFixed(0) + '%',
      'awayCompareValue': cbb_game.away_team_rating,
      'homeCompareValue': cbb_game.home_team_rating,
      'favored': 'higher',
      'showDifference': false,
      'locked': (cbb_game.away_team_rating === null && cbb_game.home_team_rating === null),
    },
    {
      'name': 'aEM',
      'title': 'Adjusted Efficiency margin',
      'away': picks && picks[away_team_id] && picks[away_team_id].adjusted_efficiency_rating,
      'home': picks && picks[home_team_id] && picks[home_team_id].adjusted_efficiency_rating,
      'awayCompareValue': picks && picks[away_team_id] && picks[away_team_id].adjusted_efficiency_rating,
      'homeCompareValue': picks && picks[home_team_id] && picks[home_team_id].adjusted_efficiency_rating,
      'awayRank': picks && picks[away_team_id] && picks[away_team_id].adjusted_efficiency_rating_rank,
      'homeRank': picks && picks[home_team_id] && picks[home_team_id].adjusted_efficiency_rating_rank,
      'favored': 'higher',
      'showDifference': true,
      'compareType': 'rank',
    },
    {
      'name': 'aSOS',
      'title': 'aEM SoS',
      'tooltip': 'aEM Strength of schedule (Opponent Efficiency margin (oORT - oDRT))',
      'away': picks && picks[away_team_id] && picks[away_team_id].opponent_efficiency_rating,
      'home': picks && picks[home_team_id] && picks[home_team_id].opponent_efficiency_rating,
      'awayCompareValue': picks && picks[away_team_id] && picks[away_team_id].opponent_efficiency_rating,
      'homeCompareValue': picks && picks[home_team_id] && picks[home_team_id].opponent_efficiency_rating,
      'awayRank': picks && picks[away_team_id] && picks[away_team_id].opponent_efficiency_rating_rank,
      'homeRank': picks && picks[home_team_id] && picks[home_team_id].opponent_efficiency_rating_rank,
      'favored': 'higher',
      'showDifference': true,
      'compareType': 'rank',
    },
    {
      'name': 'eSOS',
      'title': 'Elo SoS',
      'tooltip': 'sRating elo Strength of schedule (Average opponent elo)',
      'away': picks && picks[away_team_id] && picks[away_team_id].elo_sos,
      'home': picks && picks[home_team_id] && picks[home_team_id].elo_sos,
      'awayCompareValue': picks && picks[away_team_id] && picks[away_team_id].elo_sos,
      'homeCompareValue': picks && picks[home_team_id] && picks[home_team_id].elo_sos,
      'awayRank': picks && picks[away_team_id] && picks[away_team_id].elo_sos_rank,
      'homeRank': picks && picks[home_team_id] && picks[home_team_id].elo_sos_rank,
      'favored': 'higher',
      'showDifference': true,
      'compareType': 'rank',
    },
    {
      'name': 'ORT',
      'title': 'Offensive rating',
      'away': picks && picks[away_team_id] && picks[away_team_id].offensive_rating,
      'home': picks && picks[home_team_id] && picks[home_team_id].offensive_rating,
      'awayCompareValue': picks && picks[away_team_id] && picks[away_team_id].offensive_rating,
      'homeCompareValue': picks && picks[home_team_id] && picks[home_team_id].offensive_rating,
      'awayRank': picks && picks[away_team_id] && picks[away_team_id].offensive_rating_rank,
      'homeRank': picks && picks[home_team_id] && picks[home_team_id].offensive_rating_rank,
      'favored': 'higher',
      'showDifference': true,
    },
    // {
    //   'name': 'DRT',
    //   'title': 'Defensive rating',
    //   'away': picks && picks[away_team_id] && picks[away_team_id].defensive_rating,
    //   'home': picks && picks[home_team_id] && picks[home_team_id].defensive_rating,
    //   'awayCompareValue': picks && picks[away_team_id] && picks[away_team_id].defensive_rating,
    //   'homeCompareValue': picks && picks[home_team_id] && picks[home_team_id].defensive_rating,
    //   'awayRank': picks && picks[away_team_id] && picks[away_team_id].defensive_rating_rank,
    //   'homeRank': picks && picks[home_team_id] && picks[home_team_id].defensive_rating_rank,
    //   'favored': 'lower',
    //   'showDifference': true,
    // },
    // {
    //   'name': 'PTS Off.',
    //   'title': 'Avg points scored',
    //   'away': picks && picks[away_team_id] && picks[away_team_id].points,
    //   'home': picks && picks[home_team_id] && picks[home_team_id].points,
    //   'awayCompareValue': picks && picks[away_team_id] && picks[away_team_id].points,
    //   'homeCompareValue': picks && picks[home_team_id] && picks[home_team_id].points,
    //   'awayRank': picks && picks[away_team_id] && picks[away_team_id].points_rank,
    //   'homeRank': picks && picks[home_team_id] && picks[home_team_id].points_rank,
    //   'favored': 'higher',
    //   'showDifference': true,
    // },
    // {
    //   'name': 'PTS Def.',
    //   'title': 'Avg points allowed',
    //   'away': picks && picks[away_team_id] && picks[away_team_id].opponent_points,
    //   'home': picks && picks[home_team_id] && picks[home_team_id].opponent_points,
    //   'awayCompareValue': picks && picks[away_team_id] && picks[away_team_id].opponent_points,
    //   'homeCompareValue': picks && picks[home_team_id] && picks[home_team_id].opponent_points,
    //   'awayRank': picks && picks[away_team_id] && picks[away_team_id].opponent_points_rank,
    //   'homeRank': picks && picks[home_team_id] && picks[home_team_id].opponent_points_rank,
    //   'favored': 'lower',
    //   'showDifference': true,
    // },
  ];

  /**
   * Get game start time line with pin button
   * @return {Object} div container
   */
  const getTime = () => {
    let network: React.JSX.Element[] = [];

    if (!CBB.isFinal() && CBB.getNetwork()) {
      network.push(<Typography key = {CBB.getNetwork()} sx = {{'marginLeft': '5px'}} color = 'text.secondary' variant = 'overline'>{CBB.getNetwork()}</Typography>);
    }
    return (
      <div style = {{'display': 'flex', 'justifyContent': 'space-between'}}>
        <div><Typography color = {CBB.isInProgress() ? 'info.dark' : 'text.secondary'} variant = 'overline'>{CBB.getTime()}</Typography>{network}</div>
        <Pin cbb_game_id = {cbb_game.cbb_game_id}  />
      </div>
    );
  };

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

  /**
   * Get the header line.
   * Ex: Purdue vs Indiana
   * @return {Object} div container 
   */
  const getHeader = () => {
    const flexContainerStyle: React.CSSProperties = {
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

    const supRankStyle: React.CSSProperties = {
      'marginRight': '5px',
      'fontSize': 12,
    };

    const awayColorStyle: React.CSSProperties = {};
    const homeColorStyle: React.CSSProperties = {};
  
    const awayRank = CBB.getTeamRank('away', displayRank);
    const homeRank = CBB.getTeamRank('home', displayRank);
  
    if (awayRank) {
      awayColorStyle.color = ColorUtil.lerpColor(bestColor, worstColor, (+(awayRank / CBB.getNumberOfD1Teams(cbb_game.season))));
    }

    if (homeRank) {
      homeColorStyle.color = ColorUtil.lerpColor(bestColor, worstColor, (+(homeRank / CBB.getNumberOfD1Teams(cbb_game.season))));
    }
    
    return (
      <div style={flexContainerStyle}>
        <Typography variant = 'h6' style = {{'textOverflow': 'ellipsis', 'whiteSpace': 'nowrap', 'overflow': 'hidden', 'fontSize': fontSize, 'maxWidth': maxWidthTypography}}>
          {awayRank ? <sup style = {Object.assign(awayColorStyle, supRankStyle)}>{awayRank}</sup> : ''}{awayName}
        </Typography>
        {/* <Typography color = 'text.secondary' sx = {{'minWidth': 50, 'textAlign': 'center'}} variant = 'overline' style = {{'textOverflow': 'ellipsis', 'whiteSpace': 'nowrap', 'overflow': 'hidden'}}>
          {CBB.isNeutralSite() ? 'vs' : '@'}
        </Typography> */}
        <Typography variant = 'h6' style = {{'textOverflow': 'ellipsis', 'whiteSpace': 'nowrap', 'overflow': 'hidden', 'fontSize': fontSize, 'maxWidth': maxWidthTypography}}>
          {homeRank ? <sup style = {Object.assign(homeColorStyle, supRankStyle)}>{homeRank}</sup> : ''}{homeName}
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
    const skeletons: React.JSX.Element[] = [];

    for (let i = 0; i < compareRows.length; i++) {
      skeletons.push(<Skeleton key = {i} variant="text" animation="wave" sx = {{'width': '100%', 'maxWidth': maxWidth, 'height': '30px', 'margin': '10px 0px'}} />)
    }

    return skeletons;
  };


  return (
    <Paper style = {{'width': '100%', 'maxWidth': maxWidth, 'margin': '10px 0px'}}>
      {getIndicators()}
      <div style = {{'padding': '10px'}}>
        {getTime()}
        {getHeader()}
        {getSecondaryHeader()}
        {
          picks === null ?
          getSkeleton() :
          <CompareStatistic key = {cbb_game.cbb_game_id} maxWidth = {maxWidth} paper = {false} rows = {compareRows} />
        }
        {getOdds()}
        <div style = {{'textAlign': 'right'}}>
          <Button onClick = {handleMatchup}>Full matchup</Button>
        </div>
      </div>
    </Paper>
  );
}


export default Tile;
