'use client';
import React from 'react';
import { useWindowDimensions, Dimensions } from '@/components/hooks/useWindowDimensions';

import moment from 'moment';

import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';

import CompareStatistic from '@/components/generic/CompareStatistic';

import HelperCBB from '@/components/helpers/CBB';
import { Game, Games } from '@/types/cbb';


// TODO update to show differential from season averages, build it into stats compare component?


const Client = ({cbb_game, momentumData, stats}) => {
  const { width } = useWindowDimensions() as Dimensions;

  const CBB = new HelperCBB({
    'cbb_game': cbb_game,
  });


  const awayStats = (cbb_game.away_team_id in stats) ? stats[cbb_game.away_team_id] : {};
  const homeStats = (cbb_game.home_team_id in stats) ? stats[cbb_game.home_team_id] : {};


  const awayMomentumStats = (momentumData && momentumData[cbb_game.away_team_id] && momentumData[cbb_game.away_team_id].stats) || {}; 
  const homeMomentumStats = (momentumData && momentumData[cbb_game.home_team_id] && momentumData[cbb_game.home_team_id].stats) || {};

  const awayTeamGames: Games = (momentumData && momentumData[cbb_game.away_team_id] && momentumData[cbb_game.away_team_id].cbb_games) || {}; 
  const homeTeamGames: Games = (momentumData && momentumData[cbb_game.home_team_id] && momentumData[cbb_game.home_team_id].cbb_games) || {}; 


  const overviewRows = [
    {
      'name': 'Record',
      'title': 'Record',
      'away': awayMomentumStats.wins + '-' + awayMomentumStats.losses,
      'home': homeMomentumStats.wins + '-' + homeMomentumStats.losses,
      'awayCompareValue': awayMomentumStats.wins,
      'homeCompareValue': homeMomentumStats.wins,
      'favored': 'higher',
      'showDifference': true,
      'precision': 0,
    },
    {
      'name': 'ORT',
      'title': 'Offensive rating',
      'away': awayMomentumStats.offensive_rating,
      'home': homeMomentumStats.offensive_rating,
      'awayCompareValue': awayMomentumStats.offensive_rating,
      'homeCompareValue': homeMomentumStats.offensive_rating,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'DRT',
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
      'title': 'Avg points scored',
      'away': awayMomentumStats.points,
      'home': homeMomentumStats.points,
      'awayCompareValue': awayMomentumStats.points,
      'homeCompareValue': homeMomentumStats.points,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'PTS Def.',
      'title': 'Avg points allowed',
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
      'title': 'Avg. Win margin',
      'away': awayMomentumStats.win_margin,
      'home': homeMomentumStats.win_margin,
      'awayCompareValue': awayMomentumStats.win_margin,
      'homeCompareValue': homeMomentumStats.win_margin,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'Loss MR',
      'title': 'Avg. Loss margin',
      'away': awayMomentumStats.loss_margin,
      'home': homeMomentumStats.loss_margin,
      'awayCompareValue': awayMomentumStats.loss_margin,
      'homeCompareValue': homeMomentumStats.loss_margin,
      'favored': 'lower',
      'showDifference': true,
    },
    {
      'name': 'Conf. W MR',
      'title': 'Avg. Conference win margin',
      'away': awayMomentumStats.confwin_margin,
      'home': homeMomentumStats.confwin_margin,
      'awayCompareValue': awayMomentumStats.confwin_margin,
      'homeCompareValue': homeMomentumStats.confwin_margin,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'Conf. L MR',
      'title': 'Avg. Conference loss margin',
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
      'title': 'Pace',
      'tooltip': 'Possesions per game',
      'away': awayMomentumStats.possessions,
      'home': homeMomentumStats.possessions,
      'awayCompareValue': awayMomentumStats.possessions,
      'homeCompareValue': homeMomentumStats.possessions,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'FG',
      'title': 'FG',
      'tooltip': 'Field goals per game',
      'away': awayMomentumStats.field_goal,
      'home': homeMomentumStats.field_goal,
      'awayCompareValue': awayMomentumStats.field_goal,
      'homeCompareValue': homeMomentumStats.field_goal,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'FGA',
      'title': 'FGA',
      'tooltip': 'Field goal attempts per game',
      'away': awayMomentumStats.field_goal_attempts,
      'home': homeMomentumStats.field_goal_attempts,
      'awayCompareValue': awayMomentumStats.field_goal_attempts,
      'homeCompareValue': homeMomentumStats.field_goal_attempts,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'FG%',
      'title': 'FG%',
      'tooltip': 'Field goal percentage',
      'away': awayMomentumStats.field_goal_percentage + '%',
      'home': homeMomentumStats.field_goal_percentage + '%',
      'awayCompareValue': awayMomentumStats.field_goal_percentage,
      'homeCompareValue': homeMomentumStats.field_goal_percentage,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': '2P',
      'title': '2P',
      'tooltip': '2 point field goals per game',
      'away': awayMomentumStats.two_point_field_goal,
      'home': homeMomentumStats.two_point_field_goal,
      'awayCompareValue': awayMomentumStats.two_point_field_goal,
      'homeCompareValue': homeMomentumStats.two_point_field_goal,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': '2PA',
      'title': '2PA',
      'tooltip': '2 point field goal attempts per game',
      'away': awayMomentumStats.two_point_field_goal_attempts,
      'home': homeMomentumStats.two_point_field_goal_attempts,
      'awayCompareValue': awayMomentumStats.two_point_field_goal_attempts,
      'homeCompareValue': homeMomentumStats.two_point_field_goal_attempts,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': '2P%',
      'title': '2P%',
      'tooltip': '2 point field goal percentage',
      'away': awayMomentumStats.two_point_field_goal_percentage + '%',
      'home': homeMomentumStats.two_point_field_goal_percentage + '%',
      'awayCompareValue': awayMomentumStats.two_point_field_goal_percentage,
      'homeCompareValue': homeMomentumStats.two_point_field_goal_percentage,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': '3P',
      'title': '3P',
      'tooltip': '3 point field goals per game',
      'away': awayMomentumStats.three_point_field_goal,
      'home': homeMomentumStats.three_point_field_goal,
      'awayCompareValue': awayMomentumStats.three_point_field_goal,
      'homeCompareValue': homeMomentumStats.three_point_field_goal,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': '3PA',
      'title': '3PA',
      'tooltip': '3 point field goal attempts per game',
      'away': awayMomentumStats.three_point_field_goal_attempts,
      'home': homeMomentumStats.three_point_field_goal_attempts,
      'awayCompareValue': awayMomentumStats.three_point_field_goal_attempts,
      'homeCompareValue': homeMomentumStats.three_point_field_goal_attempts,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': '3P%',
      'title': '3P%',
      'tooltip': '3 point field goal percentage',
      'away': awayMomentumStats.three_point_field_goal_percentage + '%',
      'home': homeMomentumStats.three_point_field_goal_percentage + '%',
      'awayCompareValue': awayMomentumStats.three_point_field_goal_percentage,
      'homeCompareValue': homeMomentumStats.three_point_field_goal_percentage,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'FT',
      'title': 'FT',
      'tooltip': 'Free throws per game',
      'away': awayMomentumStats.free_throws,
      'home': homeMomentumStats.free_throws,
      'awayCompareValue': awayMomentumStats.free_throws,
      'homeCompareValue': homeMomentumStats.free_throws,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'FTA',
      'title': 'FTA',
      'tooltip': 'Free throw attempts per game',
      'away': awayMomentumStats.free_throw_attempts,
      'home': homeMomentumStats.free_throw_attempts,
      'awayCompareValue': awayMomentumStats.free_throw_attempts,
      'homeCompareValue': homeMomentumStats.free_throw_attempts,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'FT%',
      'title': 'FT%',
      'tooltip': 'Free throw percentage',
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
      'title': 'ORB',
      'tooltip': 'Offensive rebounds per game',
      'away': awayMomentumStats.offensive_rebounds,
      'home': homeMomentumStats.offensive_rebounds,
      'awayCompareValue': awayMomentumStats.offensive_rebounds,
      'homeCompareValue': homeMomentumStats.offensive_rebounds,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'DRB',
      'title': 'DRB',
      'tooltip': 'Defensive rebounds per game',
      'away': awayMomentumStats.defensive_rebounds,
      'home': homeMomentumStats.defensive_rebounds,
      'awayCompareValue': awayMomentumStats.defensive_rebounds,
      'homeCompareValue': homeMomentumStats.defensive_rebounds,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'AST',
      'title': 'AST',
      'tooltip': 'Assists per game',
      'away': awayMomentumStats.assists,
      'home': homeMomentumStats.assists,
      'awayCompareValue': awayMomentumStats.assists,
      'homeCompareValue': homeMomentumStats.assists,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'STL',
      'title': 'STL',
      'tooltip': 'Steals per game',
      'away': awayMomentumStats.steals,
      'home': homeMomentumStats.steals,
      'awayCompareValue': awayMomentumStats.steals,
      'homeCompareValue': homeMomentumStats.steals,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'BLK',
      'title': 'BLK',
      'tooltip': 'Blocks per game',
      'away': awayMomentumStats.blocks,
      'home': homeMomentumStats.blocks,
      'awayCompareValue': awayMomentumStats.blocks,
      'homeCompareValue': homeMomentumStats.blocks,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'TOV',
      'title': 'TOV',
      'tooltip': 'Turnovers per game',
      'away': awayMomentumStats.turnovers,
      'home': homeMomentumStats.turnovers,
      'awayCompareValue': awayMomentumStats.turnovers,
      'homeCompareValue': homeMomentumStats.turnovers,
      'favored': 'lower',
      'showDifference': true,
    },
    {
      'name': 'PF',
      'title': 'PF',
      'tooltip': 'Turnovers per game',
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
      'title': 'FG',
      'tooltip': 'Oppenent field goals per game',
      'away': awayMomentumStats.opponent_field_goal,
      'home': homeMomentumStats.opponent_field_goal,
      'awayCompareValue': awayMomentumStats.opponent_field_goal,
      'homeCompareValue': homeMomentumStats.opponent_field_goal,
      'favored': 'lower',
      'showDifference': true,
    },
    {
      'name': 'FGA',
      'title': 'FGA',
      'tooltip': 'Oppenent field goal attempts per game',
      'away': awayMomentumStats.opponent_field_goal_attempts,
      'home': homeMomentumStats.opponent_field_goal_attempts,
      'awayCompareValue': awayMomentumStats.opponent_field_goal_attempts,
      'homeCompareValue': homeMomentumStats.opponent_field_goal_attempts,
      'favored': 'lower',
      'showDifference': true,
    },
    {
      'name': 'FG%',
      'title': 'FG%',
      'tooltip': 'Oppenent field goal percentage',
      'away': awayMomentumStats.opponent_field_goal_percentage + '%',
      'home': homeMomentumStats.opponent_field_goal_percentage + '%',
      'awayCompareValue': awayMomentumStats.opponent_field_goal_percentage,
      'homeCompareValue': homeMomentumStats.opponent_field_goal_percentage,
      'favored': 'lower',
      'showDifference': true,
    },
    {
      'name': 'ORB',
      'title': 'ORB',
      'tooltip': 'Oppenent Offensive rebounds per game',
      'away': awayMomentumStats.opponent_offensive_rebounds,
      'home': homeMomentumStats.opponent_offensive_rebounds,
      'awayCompareValue': awayMomentumStats.opponent_offensive_rebounds,
      'homeCompareValue': homeMomentumStats.opponent_offensive_rebounds,
      'favored': 'lower',
      'showDifference': true,
    },
    {
      'name': 'DRB',
      'title': 'DRB',
      'tooltip': 'Oppenent Defensive rebounds per game',
      'away': awayMomentumStats.opponent_defensive_rebounds,
      'home': homeMomentumStats.opponent_defensive_rebounds,
      'awayCompareValue': awayMomentumStats.opponent_defensive_rebounds,
      'homeCompareValue': homeMomentumStats.opponent_defensive_rebounds,
      'favored': 'lower',
      'showDifference': true,
    },
    {
      'name': 'AST',
      'title': 'AST',
      'tooltip': 'Oppenent Assists per game',
      'away': awayMomentumStats.opponent_assists,
      'home': homeMomentumStats.opponent_assists,
      'awayCompareValue': awayMomentumStats.opponent_assists,
      'homeCompareValue': homeMomentumStats.opponent_assists,
      'favored': 'lower',
      'showDifference': true,
    },
    {
      'name': 'STL',
      'title': 'STL',
      'tooltip': 'Oppenent Steals per game',
      'away': awayMomentumStats.opponent_steals,
      'home': homeMomentumStats.opponent_steals,
      'awayCompareValue': awayMomentumStats.opponent_steals,
      'homeCompareValue': homeMomentumStats.opponent_steals,
      'favored': 'lower',
      'showDifference': true,
    },
    {
      'name': 'BLK',
      'title': 'BLK',
      'tooltip': 'Oppenent Blocks per game',
      'away': awayMomentumStats.opponent_blocks,
      'home': homeMomentumStats.opponent_blocks,
      'awayCompareValue': awayMomentumStats.opponent_blocks,
      'homeCompareValue': homeMomentumStats.opponent_blocks,
      'favored': 'lower',
      'showDifference': true,
    },
    {
      'name': 'TOV',
      'title': 'TOV',
      'tooltip': 'Oppenent Turnovers per game',
      'away': awayMomentumStats.opponent_turnovers,
      'home': homeMomentumStats.opponent_turnovers,
      'awayCompareValue': awayMomentumStats.opponent_turnovers,
      'homeCompareValue': homeMomentumStats.opponent_turnovers,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'PF',
      'title': 'PF',
      'tooltip': 'Oppenent Turnovers per game',
      'away': awayMomentumStats.opponent_fouls,
      'home': homeMomentumStats.opponent_fouls,
      'awayCompareValue': awayMomentumStats.opponent_fouls,
      'homeCompareValue': homeMomentumStats.opponent_fouls,
      'favored': 'higher',
      'showDifference': true,
    },
  ];

  const sortedHomeGames: Game[] = Object.values(homeTeamGames).sort(function(a, b) {
    return a.start_date < b.start_date ? -1 : 1;
  });

  const sortedAwayGames: Game[] = Object.values(awayTeamGames).sort(function(a, b) {
    return a.start_date < b.start_date ? -1 : 1;
  });

  const flexContainerStyle: React.CSSProperties = {
    'display': 'flex',
    'flexFlow': 'row wrap',
    'justifyContent': 'space-evenly',
    'marginBottom': '10px',
    'flexWrap': 'nowrap',
  };

  if (width < 700) {
    flexContainerStyle.flexDirection = 'column';
  }

  let moreThanOneGame = false;

  if (momentumData) {
    for (let team_id in momentumData) {
      let counter = Object.keys(momentumData[team_id].cbb_games).length;
      if (counter > 1) {
        moreThanOneGame = true;
      }
    }
  }


  return (
    <div>
      <div style = {{'padding': '0px 5px 20px 5px'}}>
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
          momentumData !== null && moreThanOneGame ?
          <div>
            <Typography style = {{'textAlign': 'center', 'margin': '10px 0px'}} variant = 'h6'>Last 5 game stat comparison</Typography>
              <div style = {flexContainerStyle}>
              <Paper elevation = {3} style = {{'padding': 10, 'margin': '0px 5px 10px 5px'}}>
                <table style = {{'width': '100%'}}>
                  <tr>
                    <th colSpan = {3}><Typography variant = 'caption'>{CBB.getTeamName('away')}</Typography></th>
                  </tr>
                  {
                    sortedAwayGames.map((cbb_game_) => {
                      const CBB_ = new HelperCBB({
                        'cbb_game': cbb_game_,
                      });

                      const won = (cbb_game_.home_score > cbb_game_.away_score && cbb_game_.home_team_id === cbb_game.away_team_id) || (cbb_game_.home_score < cbb_game_.away_score && cbb_game_.away_team_id === cbb_game.away_team_id);

                      return (<tr>
                        <td style = {{'padding': '0px 5px'}}><Typography variant = 'caption'>{moment(cbb_game_.start_datetime).format('M/D')}</Typography></td>
                        <td style = {{'padding': '0px 5px'}}><Typography variant = 'caption'>{cbb_game_.away_team_id === cbb_game.away_team_id ? '@ ' + CBB_.getTeamName('home') : 'vs ' +CBB_.getTeamName('away')}</Typography></td>
                        <td style = {{'padding': '0px 5px', 'textAlign': 'right'}}><Typography variant = 'caption'>{won ? 'W' : 'L'} {cbb_game_.away_score} - {cbb_game_.home_score}</Typography></td>
                      </tr>);
                    })
                  }
                </table>
                <Typography variant = 'caption'>{CBB.getTeamName('away')} offense is trending {awayMomentumStats.offensive_rating > awayStats.offensive_rating ? 'up' : 'down'}, Defense is trending {awayMomentumStats.defensive_rating < awayStats.defensive_rating ? 'up' : 'down'}.</Typography>
                </Paper>
                <Paper elevation = {3} style = {{'padding': 10, 'margin': '0px 5px 10px 5px'}}>
                <table style = {{'width': '100%'}}>
                  <tr>
                    <th colSpan = {3}><Typography variant = 'caption'>{CBB.getTeamName('home')}</Typography></th>
                  </tr>
                  {
                    sortedHomeGames.map((cbb_game_) => {
                      const CBB_ = new HelperCBB({
                        'cbb_game': cbb_game_,
                      });

                      const won = (cbb_game_.home_score > cbb_game_.away_score && cbb_game_.home_team_id === cbb_game.home_team_id) || (cbb_game_.home_score < cbb_game_.away_score && cbb_game_.away_team_id === cbb_game.home_team_id);

                      return (<tr>
                        <td style = {{'padding': '0px 5px'}}><Typography variant = 'caption'>{moment(cbb_game_.start_datetime).format('M/D')}</Typography></td>
                        <td style = {{'padding': '0px 5px'}}><Typography variant = 'caption'>{cbb_game_.home_team_id === cbb_game.home_team_id ? '@ ' + CBB_.getTeamName('away') : 'vs ' +CBB_.getTeamName('home')}</Typography></td>
                        <td style = {{'padding': '0px 5px', 'textAlign': 'right'}}><Typography variant = 'caption'>{won ? 'W' : 'L'} {cbb_game_.away_score} - {cbb_game_.home_score}</Typography></td>
                      </tr>);
                    })
                  }
                </table>
                <Typography variant = 'caption'>{CBB.getTeamName('home')} offense is trending {homeMomentumStats.offensive_rating > homeStats.offensive_rating ? 'up' : 'down'}. Defense is trending {homeMomentumStats.defensive_rating < homeStats.defensive_rating ? 'up' : 'down'}.</Typography>
                </Paper>
              </div>
              {//<Typography style = {{'margin': '10px 0px'}} variant = 'body2'>Below shows the averages of the last 5 games. Next to each statisic shows the team's season average.</Typography>
              }
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
        {
          momentumData !== null && !moreThanOneGame ?
          <div style={{'textAlign': 'center'}}>
            <Typography variant = 'h5'>Not enough data to determine momentum yet.</Typography>
          </div>
          : ''
        }
      </div>
    </div>
  );
}

export default Client;
