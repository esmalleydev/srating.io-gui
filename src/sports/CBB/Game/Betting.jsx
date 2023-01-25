import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import useWindowDimensions from '../../../hooks/useWindowDimensions';

import moment from 'moment';

import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';

import CompareStatistic from '../../../component/CompareStatistic';
import HelperCBB from '../../../helpers/CBB';

import Api from './../../../Api.jsx';
const api = new Api();

// TODO update to show differential from season averages, build it into stats compare component?
  
const Betting = (props) => {
  const self = this;

  const { height, width } = useWindowDimensions();

  const game = props.game;

  // console.log(game);

  const awayStats = (game.stats && game.stats[game.away_team_id]) || {};
  const homeStats = (game.stats && game.stats[game.home_team_id]) || {};

  const [requestedMomentum, setRequestedMomentum] = useState(false);
  const [momentumData, setMomentumData] = useState(null);

  const awayMomentumStats = (momentumData && momentumData[game.away_team_id] && momentumData[game.away_team_id].stats) || {}; 
  const homeMomentumStats = (momentumData && momentumData[game.home_team_id] && momentumData[game.home_team_id].stats) || {};

  const awayTeamGames = (momentumData && momentumData[game.away_team_id] && momentumData[game.away_team_id].cbb_games) || {}; 
  const homeTeamGames = (momentumData && momentumData[game.home_team_id] && momentumData[game.home_team_id].cbb_games) || {}; 

  if (!requestedMomentum) {
    setRequestedMomentum(true);
    api.Request({
      'class': 'cbb_game',
      'function': 'getMomentumData',
      'arguments': game.cbb_game_id,
    }).then((response) => {
      setMomentumData(response || {});
    }).catch((e) => {
      setMomentumData({});
    });
  }


  const theme = useTheme();

  const CBB = new HelperCBB({
    'cbb_game': game,
  });

  const overviewRows = [
    {
      'name': 'Record',
      'away': awayMomentumStats.wins + '-' + awayMomentumStats.losses,
      'home': homeMomentumStats.wins + '-' + homeMomentumStats.losses,
      'awayCompareValue': awayMomentumStats.wins,
      'homeCompareValue': homeMomentumStats.wins,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'O Rating',
      'title': 'Offensive rating',
      'away': awayMomentumStats.offensive_rating,
      'home': homeMomentumStats.offensive_rating,
      'awayCompareValue': awayMomentumStats.offensive_rating,
      'homeCompareValue': homeMomentumStats.offensive_rating,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'D Rating',
      'title': 'Defensive rating',
      'away': awayMomentumStats.defensive_rating,
      'home': homeMomentumStats.defensive_rating,
      'awayCompareValue': awayMomentumStats.defensive_rating,
      'homeCompareValue': homeMomentumStats.defensive_rating,
      'favored': 'lower',
      'showDifference': true,
    },
    {
      'name': 'PTS Off.',
      'away': awayMomentumStats.points,
      'home': homeMomentumStats.points,
      'awayCompareValue': awayMomentumStats.points,
      'homeCompareValue': homeMomentumStats.points,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'PTS Def.',
      'away': awayMomentumStats.opponent_points,
      'home': homeMomentumStats.opponent_points,
      'awayCompareValue': awayMomentumStats.opponent_points,
      'homeCompareValue': homeMomentumStats.opponent_points,
      'favored': 'lower',
      'showDifference': true,
    },
  ];

  const marginRows = [
     {
      'name': 'Win MR',
      'title': 'Win margin; Average points won by.',
      'away': awayMomentumStats.win_margin,
      'home': homeMomentumStats.win_margin,
      'awayCompareValue': awayMomentumStats.win_margin,
      'homeCompareValue': homeMomentumStats.win_margin,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'Loss MR',
      'title': 'Loss margin; Average points lost by.',
      'away': awayMomentumStats.loss_margin,
      'home': homeMomentumStats.loss_margin,
      'awayCompareValue': awayMomentumStats.loss_margin,
      'homeCompareValue': homeMomentumStats.loss_margin,
      'favored': 'lower',
      'showDifference': true,
    },
    {
      'name': 'Conf. W MR',
      'title': 'Conference win margin; Average points won by.',
      'away': awayMomentumStats.confwin_margin,
      'home': homeMomentumStats.confwin_margin,
      'awayCompareValue': awayMomentumStats.confwin_margin,
      'homeCompareValue': homeMomentumStats.confwin_margin,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'Conf. L MR',
      'title': 'Conference loss margin; Average points lost by.',
      'away': awayMomentumStats.confloss_margin,
      'home': homeMomentumStats.confloss_margin,
      'awayCompareValue': awayMomentumStats.confloss_margin,
      'homeCompareValue': homeMomentumStats.confloss_margin,
      'favored': 'lower',
      'showDifference': true,
    },
  ];

  const offenseRows = [
    {
      'name': 'Pace',
      'title': 'Possesions per game',
      'away': awayMomentumStats.possessions,
      'home': homeMomentumStats.possessions,
      'awayCompareValue': awayMomentumStats.possessions,
      'homeCompareValue': homeMomentumStats.possessions,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'FG',
      'title': 'Field goals per game',
      'away': awayMomentumStats.field_goal,
      'home': homeMomentumStats.field_goal,
      'awayCompareValue': awayMomentumStats.field_goal,
      'homeCompareValue': homeMomentumStats.field_goal,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'FGA',
      'title': 'Field goal attempts per game',
      'away': awayMomentumStats.field_goal_attempts,
      'home': homeMomentumStats.field_goal_attempts,
      'awayCompareValue': awayMomentumStats.field_goal_attempts,
      'homeCompareValue': homeMomentumStats.field_goal_attempts,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'FG%',
      'title': 'Field goal percentage',
      'away': awayMomentumStats.field_goal_percentage + '%',
      'home': homeMomentumStats.field_goal_percentage + '%',
      'awayCompareValue': awayMomentumStats.field_goal_percentage,
      'homeCompareValue': homeMomentumStats.field_goal_percentage,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': '2P',
      'title': '2 point field goals per game',
      'away': awayMomentumStats.two_point_field_goal,
      'home': homeMomentumStats.two_point_field_goal,
      'awayCompareValue': awayMomentumStats.two_point_field_goal,
      'homeCompareValue': homeMomentumStats.two_point_field_goal,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': '2PA',
      'title': '2 point field goal attempts per game',
      'away': awayMomentumStats.two_point_field_goal_attempts,
      'home': homeMomentumStats.two_point_field_goal_attempts,
      'awayCompareValue': awayMomentumStats.two_point_field_goal_attempts,
      'homeCompareValue': homeMomentumStats.two_point_field_goal_attempts,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': '2P%',
      'title': '2 point field goal percentage',
      'away': awayMomentumStats.two_point_field_goal_percentage + '%',
      'home': homeMomentumStats.two_point_field_goal_percentage + '%',
      'awayCompareValue': awayMomentumStats.two_point_field_goal_percentage,
      'homeCompareValue': homeMomentumStats.two_point_field_goal_percentage,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': '3P',
      'title': '3 point field goals per game',
      'away': awayMomentumStats.three_point_field_goal,
      'home': homeMomentumStats.three_point_field_goal,
      'awayCompareValue': awayMomentumStats.three_point_field_goal,
      'homeCompareValue': homeMomentumStats.three_point_field_goal,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': '3PA',
      'title': '3 point field goal attempts per game',
      'away': awayMomentumStats.three_point_field_goal_attempts,
      'home': homeMomentumStats.three_point_field_goal_attempts,
      'awayCompareValue': awayMomentumStats.three_point_field_goal_attempts,
      'homeCompareValue': homeMomentumStats.three_point_field_goal_attempts,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': '3P%',
      'title': '3 point field goal percentage',
      'away': awayMomentumStats.three_point_field_goal_percentage + '%',
      'home': homeMomentumStats.three_point_field_goal_percentage + '%',
      'awayCompareValue': awayMomentumStats.three_point_field_goal_percentage,
      'homeCompareValue': homeMomentumStats.three_point_field_goal_percentage,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'FT',
      'title': 'Free throws per game',
      'away': awayMomentumStats.free_throws,
      'home': homeMomentumStats.free_throws,
      'awayCompareValue': awayMomentumStats.free_throws,
      'homeCompareValue': homeMomentumStats.free_throws,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'FTA',
      'title': 'Free throw attempts per game',
      'away': awayMomentumStats.free_throw_attempts,
      'home': homeMomentumStats.free_throw_attempts,
      'awayCompareValue': awayMomentumStats.free_throw_attempts,
      'homeCompareValue': homeMomentumStats.free_throw_attempts,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'FT%',
      'title': 'Free throw percentage',
      'away': awayMomentumStats.free_throw_percentage + '%',
      'home': homeMomentumStats.free_throw_percentage + '%',
      'awayCompareValue': awayMomentumStats.free_throw_percentage,
      'homeCompareValue': homeMomentumStats.free_throw_percentage,
      'favored': 'higher',
      'showDifference': true,
    },
  ];

  const specialRows = [
    {
      'name': 'ORB',
      'title': 'Offensive rebounds per game',
      'away': awayMomentumStats.offensive_rebounds,
      'home': homeMomentumStats.offensive_rebounds,
      'awayCompareValue': awayMomentumStats.offensive_rebounds,
      'homeCompareValue': homeMomentumStats.offensive_rebounds,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'DRB',
      'title': 'Defensive rebounds per game',
      'away': awayMomentumStats.defensive_rebounds,
      'home': homeMomentumStats.defensive_rebounds,
      'awayCompareValue': awayMomentumStats.defensive_rebounds,
      'homeCompareValue': homeMomentumStats.defensive_rebounds,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'AST',
      'title': 'Assists per game',
      'away': awayMomentumStats.assists,
      'home': homeMomentumStats.assists,
      'awayCompareValue': awayMomentumStats.assists,
      'homeCompareValue': homeMomentumStats.assists,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'STL',
      'title': 'Steals per game',
      'away': awayMomentumStats.steals,
      'home': homeMomentumStats.steals,
      'awayCompareValue': awayMomentumStats.steals,
      'homeCompareValue': homeMomentumStats.steals,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'BLK',
      'title': 'Blocks per game',
      'away': awayMomentumStats.blocks,
      'home': homeMomentumStats.blocks,
      'awayCompareValue': awayMomentumStats.blocks,
      'homeCompareValue': homeMomentumStats.blocks,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'TOV',
      'title': 'Turnovers per game',
      'away': awayMomentumStats.turnovers,
      'home': homeMomentumStats.turnovers,
      'awayCompareValue': awayMomentumStats.turnovers,
      'homeCompareValue': homeMomentumStats.turnovers,
      'favored': 'lower',
      'showDifference': true,
    },
    {
      'name': 'PF',
      'title': 'Turnovers per game',
      'away': awayMomentumStats.fouls,
      'home': homeMomentumStats.fouls,
      'awayCompareValue': awayMomentumStats.fouls,
      'homeCompareValue': homeMomentumStats.fouls,
      'favored': 'lower',
      'showDifference': true,
    },
  ];

  const opponentRows = [
    {
      'name': 'FG',
      'title': 'Oppenent field goals per game',
      'away': awayMomentumStats.opponent_field_goal,
      'home': homeMomentumStats.opponent_field_goal,
      'awayCompareValue': awayMomentumStats.opponent_field_goal,
      'homeCompareValue': homeMomentumStats.opponent_field_goal,
      'favored': 'lower',
      'showDifference': true,
    },
    {
      'name': 'FGA',
      'title': 'Oppenent field goal attempts per game',
      'away': awayMomentumStats.opponent_field_goal_attempts,
      'home': homeMomentumStats.opponent_field_goal_attempts,
      'awayCompareValue': awayMomentumStats.opponent_field_goal_attempts,
      'homeCompareValue': homeMomentumStats.opponent_field_goal_attempts,
      'favored': 'lower',
      'showDifference': true,
    },
    {
      'name': 'FG%',
      'title': 'Oppenent field goal percentage',
      'away': awayMomentumStats.opponent_field_goal_percentage + '%',
      'home': homeMomentumStats.opponent_field_goal_percentage + '%',
      'awayCompareValue': awayMomentumStats.opponent_field_goal_percentage,
      'homeCompareValue': homeMomentumStats.opponent_field_goal_percentage,
      'favored': 'lower',
      'showDifference': true,
    },
    {
      'name': 'ORB',
      'title': 'Oppenent Offensive rebounds per game',
      'away': awayMomentumStats.opponent_offensive_rebounds,
      'home': homeMomentumStats.opponent_offensive_rebounds,
      'awayCompareValue': awayMomentumStats.opponent_offensive_rebounds,
      'homeCompareValue': homeMomentumStats.opponent_offensive_rebounds,
      'favored': 'lower',
      'showDifference': true,
    },
    {
      'name': 'DRB',
      'title': 'Oppenent Defensive rebounds per game',
      'away': awayMomentumStats.opponent_defensive_rebounds,
      'home': homeMomentumStats.opponent_defensive_rebounds,
      'awayCompareValue': awayMomentumStats.opponent_defensive_rebounds,
      'homeCompareValue': homeMomentumStats.opponent_defensive_rebounds,
      'favored': 'lower',
      'showDifference': true,
    },
    {
      'name': 'AST',
      'title': 'Oppenent Assists per game',
      'away': awayMomentumStats.opponent_assists,
      'home': homeMomentumStats.opponent_assists,
      'awayCompareValue': awayMomentumStats.opponent_assists,
      'homeCompareValue': homeMomentumStats.opponent_assists,
      'favored': 'lower',
      'showDifference': true,
    },
    {
      'name': 'STL',
      'title': 'Oppenent Steals per game',
      'away': awayMomentumStats.opponent_steals,
      'home': homeMomentumStats.opponent_steals,
      'awayCompareValue': awayMomentumStats.opponent_steals,
      'homeCompareValue': homeMomentumStats.opponent_steals,
      'favored': 'lower',
      'showDifference': true,
    },
    {
      'name': 'BLK',
      'title': 'Oppenent Blocks per game',
      'away': awayMomentumStats.opponent_blocks,
      'home': homeMomentumStats.opponent_blocks,
      'awayCompareValue': awayMomentumStats.opponent_blocks,
      'homeCompareValue': homeMomentumStats.opponent_blocks,
      'favored': 'lower',
      'showDifference': true,
    },
    {
      'name': 'TOV',
      'title': 'Oppenent Turnovers per game',
      'away': awayMomentumStats.opponent_turnovers,
      'home': homeMomentumStats.opponent_turnovers,
      'awayCompareValue': awayMomentumStats.opponent_turnovers,
      'homeCompareValue': homeMomentumStats.opponent_turnovers,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'PF',
      'title': 'Oppenent Turnovers per game',
      'away': awayMomentumStats.opponent_fouls,
      'home': homeMomentumStats.opponent_fouls,
      'awayCompareValue': awayMomentumStats.opponent_fouls,
      'homeCompareValue': homeMomentumStats.opponent_fouls,
      'favored': 'higher',
      'showDifference': true,
    },
  ];

  const sortedHomeGames = Object.values(homeTeamGames).sort(function(a, b) {
    return a.start_date < b.start_date ? -1 : 1;
  });

  const sortedAwayGames = Object.values(awayTeamGames).sort(function(a, b) {
    return a.start_date < b.start_date ? -1 : 1;
  });


  return (
    <div style = {{'padding': 20}}>
      <div style = {{'display': 'flex', 'justifyContent': 'space-between', 'marginBottom': '10px', 'flexWrap': 'nowrap'}}>
        <Typography style = {{'textOverflow': 'ellipsis', 'whiteSpace': 'nowrap', 'overflow': 'hidden', 'margin': '0px 5px'}}variant = 'h5'>{CBB.getTeamName('away')}</Typography>
        <Typography style = {{'textOverflow': 'ellipsis', 'whiteSpace': 'nowrap', 'overflow': 'hidden', 'margin': '0px 5px'}}variant = 'h5'>{CBB.getTeamName('home')}</Typography>
      </div>
      {
        momentumData === null ?
        <Paper elevation = {3} style = {{'padding': 10}}>
          <div>
            <Typography variant = 'h5'><Skeleton /></Typography>
            <Typography variant = 'h5'><Skeleton /></Typography>
            <Typography variant = 'h5'><Skeleton /></Typography>
            <Typography variant = 'h5'><Skeleton /></Typography>
            <Typography variant = 'h5'><Skeleton /></Typography>
          </div>
        </Paper>
        : ''
      }
      {
        momentumData !== null ?
        <div>
          <Typography style = {{'textAlign': 'center', 'margin': '10px 0px'}} variant = 'h6'>Last 5 game stat comparison</Typography>
          <Paper elevation = {3} style = {{'padding': 10, 'marginBottom': 10}}>
            <div style = {{'display': 'flex', 'justifyContent': 'space-between', 'marginBottom': '10px', 'flexWrap': 'nowrap'}}>
              <table>
                {
                  sortedAwayGames.map((cbb_game) => {
                    const CBB_ = new HelperCBB({
                      'cbb_game': cbb_game,
                    });

                    const won = (cbb_game.home_score > cbb_game.away_score && cbb_game.home_team_id === game.away_team_id) || (cbb_game.home_score < cbb_game.away_score && cbb_game.away_team_id === game.away_team_id);

                    return (<tr>
                      <td style = {{'padding': '0px 5px'}}><Typography variant = 'caption'>{moment(cbb_game.start_datetime).format('M/D')}</Typography></td>
                      <td style = {{'padding': '0px 5px'}}><Typography variant = 'caption'>{CBB_.getTeamName('away')} @ {CBB_.getTeamName('home')}</Typography></td>
                      <td style = {{'padding': '0px 5px'}}><Typography variant = 'caption'>{won ? 'W' : 'L'}</Typography></td>
                      <td style = {{'padding': '0px 5px'}}><Typography variant = 'caption'>{cbb_game.away_score} - {cbb_game.home_score}</Typography></td>
                    </tr>);
                  })
                }
              </table>
              <table>
                {
                  sortedHomeGames.map((cbb_game) => {
                    const CBB_ = new HelperCBB({
                      'cbb_game': cbb_game,
                    });

                    const won = (cbb_game.home_score > cbb_game.away_score && cbb_game.home_team_id === game.home_team_id) || (cbb_game.home_score < cbb_game.away_score && cbb_game.away_team_id === game.home_team_id);

                    return (<tr>
                      <td style = {{'padding': '0px 5px'}}><Typography variant = 'caption'>{moment(cbb_game.start_datetime).format('M/D')}</Typography></td>
                      <td style = {{'padding': '0px 5px'}}><Typography variant = 'caption'>{CBB_.getTeamName('away')} @ {CBB_.getTeamName('home')}</Typography></td>
                      <td style = {{'padding': '0px 5px'}}><Typography variant = 'caption'>{won ? 'W' : 'L'}</Typography></td>
                      <td style = {{'padding': '0px 5px'}}><Typography variant = 'caption'>{cbb_game.away_score} - {cbb_game.home_score}</Typography></td>
                    </tr>);
                  })
                }
              </table>
            </div>
            <div style = {{'display': 'flex', 'justifyContent': 'space-between', 'marginBottom': '10px', 'flexWrap': 'nowrap'}}>
              <Typography variant = 'caption'>Offense is trending {awayMomentumStats.offensive_rating > awayStats.offensive_rating ? 'up' : 'down'}. Defense is trending {awayMomentumStats.defensive_rating < awayStats.defensive_rating ? 'up' : 'down'}.</Typography>
              <Typography variant = 'caption'>Offense is trending {homeMomentumStats.offensive_rating > homeStats.offensive_rating ? 'up' : 'down'}. Defense is trending {homeMomentumStats.defensive_rating < homeStats.defensive_rating ? 'up' : 'down'}.</Typography>
            </div>
            {//<Typography style = {{'margin': '10px 0px'}} variant = 'body2'>Below shows the averages of the last 5 games. Next to each statisic shows the team's season average.</Typography>
            }
          </Paper>
          <CompareStatistic paper = {true} rows = {overviewRows} />

          <Typography style = {{'textAlign': 'center', 'margin': '10px 0px'}} variant = 'body1'>Win / Loss Margin</Typography>
          <CompareStatistic paper = {true} rows = {marginRows} />

          <Typography style = {{'textAlign': 'center', 'margin': '10px 0px'}} variant = 'body1'>Offense</Typography>
          <CompareStatistic paper = {true} rows = {offenseRows} />

          <Typography style = {{'textAlign': 'center', 'margin': '10px 0px'}} variant = 'body1'>Special</Typography>
          <CompareStatistic paper = {true} rows = {specialRows} />

          <Typography style = {{'textAlign': 'center', 'margin': '10px 0px'}} variant = 'body1'>Opponent stats against</Typography>
          <CompareStatistic paper = {true} rows = {opponentRows} />
        </div>
        : ''
      }
    </div>
  );
}

export default Betting;