import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';

import HelperCBB from '../../../helpers/CBB';

// TODO put the difference in the green width column +5 pts or -2 fouls, to do the math for people
  
const Matchup = (props) => {
  const self = this;

  const awayTeam = props.awayTeam;
  const homeTeam = props.homeTeam;

  const awayStats = props.awayStats || {};
  const homeStats = props.homeStats || {};

  const theme = useTheme();

  const game = props.game;

  const CBB = new HelperCBB({
    'cbb_game': game,
  });

  const overviewRows = [
    {
      'name': 'Win %',
      'away': game.away_team_rating * 100 + '%',
      'home': game.home_team_rating * 100 + '%',
      'awayCompareValue': game.away_team_rating,
      'homeCompareValue': game.home_team_rating,
      'favored': 'higher',
    },
    {
      'name': 'Record',
      'away': awayStats.wins + '-' + awayStats.losses,
      'home': homeStats.wins + '-' + homeStats.losses,
      'awayCompareValue': awayStats.wins,
      'homeCompareValue': homeStats.wins,
      'favored': 'higher',
    },
    {
      'name': 'Streak',
      'away': (awayStats.streak < 0 ? 'L' : 'W') + Math.abs(awayStats.streak),
      'home': (homeStats.streak < 0 ? 'L' : 'W') + Math.abs(homeStats.streak),
      'awayCompareValue': awayStats.streak,
      'homeCompareValue': homeStats.streak,
      // 'favored': 'higher',
    },
    {
      'name': 'Rank',
      'away': (awayTeam.ranking && awayTeam.ranking.composite_rank) || '-',
      'home': (homeTeam.ranking && homeTeam.ranking.composite_rank) || '-',
      'awayCompareValue': (awayTeam.ranking && awayTeam.ranking.composite_rank) || Infinity,
      'homeCompareValue': (homeTeam.ranking && homeTeam.ranking.composite_rank) || Infinity,
      'favored': 'lower',
    },
    {
      'name': 'Elo',
      'away': awayStats.elo,
      'home': homeStats.elo,
      'awayCompareValue': awayStats.elo,
      'homeCompareValue': homeStats.elo,
      'favored': 'higher',
    },
    {
      'name': 'AP',
      'away': (awayTeam.ranking && awayTeam.ranking.ap_rank) || '-',
      'home': (homeTeam.ranking && homeTeam.ranking.ap_rank) || '-',
      'awayCompareValue': (awayTeam.ranking && awayTeam.ranking.ap_rank) || Infinity,
      'homeCompareValue': (homeTeam.ranking && homeTeam.ranking.ap_rank) || Infinity,
      'favored': 'lower',
    },
    {
      'name': 'KP',
      'away': (awayTeam.ranking && awayTeam.ranking.kenpom_rank) || '-',
      'home': (homeTeam.ranking && homeTeam.ranking.kenpom_rank) || '-',
      'awayCompareValue': (awayTeam.ranking && awayTeam.ranking.kenpom_rank) || Infinity,
      'homeCompareValue': (homeTeam.ranking && homeTeam.ranking.kenpom_rank) || Infinity,
      'favored': 'lower',
    },
    {
      'name': 'SRS',
      'away': (awayTeam.ranking && awayTeam.ranking.srs_rank) || '-',
      'home': (homeTeam.ranking && homeTeam.ranking.srs_rank) || '-',
      'awayCompareValue': (awayTeam.ranking && awayTeam.ranking.srs_rank) || Infinity,
      'homeCompareValue': (homeTeam.ranking && homeTeam.ranking.srs_rank) || Infinity,
      'favored': 'lower',
    },
    {
      'name': 'PTS Off.',
      'away': awayStats.points,
      'home': homeStats.points,
      'awayCompareValue': awayStats.points,
      'homeCompareValue': homeStats.points,
      'favored': 'higher',
    },
    {
      'name': 'PTS Def.',
      'away': awayStats.opponent_points,
      'home': homeStats.opponent_points,
      'awayCompareValue': awayStats.opponent_points,
      'homeCompareValue': homeStats.opponent_points,
      'favored': 'lower',
    },
    {
      'name': 'Win MR',
      'title': 'Win margin; Average points won by.',
      'away': awayStats.win_margin,
      'home': homeStats.win_margin,
      'awayCompareValue': awayStats.win_margin,
      'homeCompareValue': homeStats.win_margin,
      'favored': 'higher',
    },
    {
      'name': 'Loss MR',
      'title': 'Loss margin; Average points lost by.',
      'away': awayStats.loss_margin,
      'home': homeStats.loss_margin,
      'awayCompareValue': awayStats.loss_margin,
      'homeCompareValue': homeStats.loss_margin,
      'favored': 'lower',
    },
    {
      'name': 'Conf. W MR',
      'title': 'Conference win margin; Average points won by.',
      'away': awayStats.confwin_margin,
      'home': homeStats.confwin_margin,
      'awayCompareValue': awayStats.confwin_margin,
      'homeCompareValue': homeStats.confwin_margin,
      'favored': 'higher',
    },
    {
      'name': 'Conf. L MR',
      'title': 'Conference loss margin; Average points lost by.',
      'away': awayStats.confloss_margin,
      'home': homeStats.confloss_margin,
      'awayCompareValue': awayStats.confloss_margin,
      'homeCompareValue': homeStats.confloss_margin,
      'favored': 'lower',
    },
  ];

  const offenseRows = [
    {
      'name': 'FG',
      'title': 'Field goals per game',
      'away': awayStats.field_goal,
      'home': homeStats.field_goal,
      'awayCompareValue': awayStats.field_goal,
      'homeCompareValue': homeStats.field_goal,
      'favored': 'higher',
    },
    {
      'name': 'FGA',
      'title': 'Field goal attempts per game',
      'away': awayStats.field_goal_attempts,
      'home': homeStats.field_goal_attempts,
      'awayCompareValue': awayStats.field_goal_attempts,
      'homeCompareValue': homeStats.field_goal_attempts,
      'favored': 'higher',
    },
    {
      'name': 'FG%',
      'title': 'Field goal percentage',
      'away': awayStats.field_goal_percentage + '%',
      'home': homeStats.field_goal_percentage + '%',
      'awayCompareValue': awayStats.field_goal_percentage,
      'homeCompareValue': homeStats.field_goal_percentage,
      'favored': 'higher',
    },
    {
      'name': '2P',
      'title': '2 point field goals per game',
      'away': awayStats.two_point_field_goal,
      'home': homeStats.two_point_field_goal,
      'awayCompareValue': awayStats.two_point_field_goal,
      'homeCompareValue': homeStats.two_point_field_goal,
      'favored': 'higher',
    },
    {
      'name': '2PA',
      'title': '2 point field goal attempts per game',
      'away': awayStats.two_point_field_goal_attempts,
      'home': homeStats.two_point_field_goal_attempts,
      'awayCompareValue': awayStats.two_point_field_goal_attempts,
      'homeCompareValue': homeStats.two_point_field_goal_attempts,
      'favored': 'higher',
    },
    {
      'name': '2P%',
      'title': '2 point field goal percentage',
      'away': awayStats.two_point_field_goal_percentage + '%',
      'home': homeStats.two_point_field_goal_percentage + '%',
      'awayCompareValue': awayStats.two_point_field_goal_percentage,
      'homeCompareValue': homeStats.two_point_field_goal_percentage,
      'favored': 'higher',
    },
    {
      'name': '3P',
      'title': '3 point field goals per game',
      'away': awayStats.three_point_field_goal,
      'home': homeStats.three_point_field_goal,
      'awayCompareValue': awayStats.three_point_field_goal,
      'homeCompareValue': homeStats.three_point_field_goal,
      'favored': 'higher',
    },
    {
      'name': '3PA',
      'title': '3 point field goal attempts per game',
      'away': awayStats.three_point_field_goal_attempts,
      'home': homeStats.three_point_field_goal_attempts,
      'awayCompareValue': awayStats.three_point_field_goal_attempts,
      'homeCompareValue': homeStats.three_point_field_goal_attempts,
      'favored': 'higher',
    },
    {
      'name': '3P%',
      'title': '3 point field goal percentage',
      'away': awayStats.three_point_field_goal_percentage + '%',
      'home': homeStats.three_point_field_goal_percentage + '%',
      'awayCompareValue': awayStats.three_point_field_goal_percentage,
      'homeCompareValue': homeStats.three_point_field_goal_percentage,
      'favored': 'higher',
    },
    {
      'name': 'FT',
      'title': 'Free throws per game',
      'away': awayStats.free_throws,
      'home': homeStats.free_throws,
      'awayCompareValue': awayStats.free_throws,
      'homeCompareValue': homeStats.free_throws,
      'favored': 'higher',
    },
    {
      'name': 'FTA',
      'title': 'Free throw attempts per game',
      'away': awayStats.free_throw_attempts,
      'home': homeStats.free_throw_attempts,
      'awayCompareValue': awayStats.free_throw_attempts,
      'homeCompareValue': homeStats.free_throw_attempts,
      'favored': 'higher',
    },
    {
      'name': 'FT%',
      'title': 'Free throw percentage',
      'away': awayStats.free_throw_percentage + '%',
      'home': homeStats.free_throw_percentage + '%',
      'awayCompareValue': awayStats.free_throw_percentage,
      'homeCompareValue': homeStats.free_throw_percentage,
      'favored': 'higher',
    },
  ];

  const specialRows = [
    {
      'name': 'ORB',
      'title': 'Offensive rebounds per game',
      'away': awayStats.offensive_rebounds,
      'home': homeStats.offensive_rebounds,
      'awayCompareValue': awayStats.offensive_rebounds,
      'homeCompareValue': homeStats.offensive_rebounds,
      'favored': 'higher',
    },
    {
      'name': 'DRB',
      'title': 'Defensive rebounds per game',
      'away': awayStats.defensive_rebounds,
      'home': homeStats.defensive_rebounds,
      'awayCompareValue': awayStats.defensive_rebounds,
      'homeCompareValue': homeStats.defensive_rebounds,
      'favored': 'higher',
    },
    {
      'name': 'AST',
      'title': 'Assists per game',
      'away': awayStats.assists,
      'home': homeStats.assists,
      'awayCompareValue': awayStats.assists,
      'homeCompareValue': homeStats.assists,
      'favored': 'higher',
    },
    {
      'name': 'STL',
      'title': 'Steals per game',
      'away': awayStats.steals,
      'home': homeStats.steals,
      'awayCompareValue': awayStats.steals,
      'homeCompareValue': homeStats.steals,
      'favored': 'higher',
    },
    {
      'name': 'BLK',
      'title': 'Blocks per game',
      'away': awayStats.blocks,
      'home': homeStats.blocks,
      'awayCompareValue': awayStats.blocks,
      'homeCompareValue': homeStats.blocks,
      'favored': 'higher',
    },
    {
      'name': 'TOV',
      'title': 'Turnovers per game',
      'away': awayStats.turnovers,
      'home': homeStats.turnovers,
      'awayCompareValue': awayStats.turnovers,
      'homeCompareValue': homeStats.turnovers,
      'favored': 'lower',
    },
    {
      'name': 'PF',
      'title': 'Turnovers per game',
      'away': awayStats.fouls,
      'home': homeStats.fouls,
      'awayCompareValue': awayStats.fouls,
      'homeCompareValue': homeStats.fouls,
      'favored': 'lower',
    },
  ];

  const opponentRows = [
    {
      'name': 'FG',
      'title': 'Oppenent field goals per game',
      'away': awayStats.opponent_field_goal,
      'home': homeStats.opponent_field_goal,
      'awayCompareValue': awayStats.opponent_field_goal,
      'homeCompareValue': homeStats.opponent_field_goal,
      'favored': 'higher',
    },
    {
      'name': 'FGA',
      'title': 'Oppenent field goal attempts per game',
      'away': awayStats.opponent_field_goal_attempts,
      'home': homeStats.opponent_field_goal_attempts,
      'awayCompareValue': awayStats.opponent_field_goal_attempts,
      'homeCompareValue': homeStats.opponent_field_goal_attempts,
      'favored': 'higher',
    },
    {
      'name': 'FG%',
      'title': 'Oppenent field goal percentage',
      'away': awayStats.opponent_field_goal_percentage + '%',
      'home': homeStats.opponent_field_goal_percentage + '%',
      'awayCompareValue': awayStats.opponent_field_goal_percentage,
      'homeCompareValue': homeStats.opponent_field_goal_percentage,
      'favored': 'higher',
    },
    {
      'name': 'ORB',
      'title': 'Oppenent Offensive rebounds per game',
      'away': awayStats.opponent_offensive_rebounds,
      'home': homeStats.opponent_offensive_rebounds,
      'awayCompareValue': awayStats.opponent_offensive_rebounds,
      'homeCompareValue': homeStats.opponent_offensive_rebounds,
      'favored': 'higher',
    },
    {
      'name': 'DRB',
      'title': 'Oppenent Defensive rebounds per game',
      'away': awayStats.opponent_defensive_rebounds,
      'home': homeStats.opponent_defensive_rebounds,
      'awayCompareValue': awayStats.opponent_defensive_rebounds,
      'homeCompareValue': homeStats.opponent_defensive_rebounds,
      'favored': 'higher',
    },
    {
      'name': 'AST',
      'title': 'Oppenent Assists per game',
      'away': awayStats.opponent_assists,
      'home': homeStats.opponent_assists,
      'awayCompareValue': awayStats.opponent_assists,
      'homeCompareValue': homeStats.opponent_assists,
      'favored': 'higher',
    },
    {
      'name': 'STL',
      'title': 'Oppenent Steals per game',
      'away': awayStats.opponent_steals,
      'home': homeStats.opponent_steals,
      'awayCompareValue': awayStats.opponent_steals,
      'homeCompareValue': homeStats.opponent_steals,
      'favored': 'higher',
    },
    {
      'name': 'BLK',
      'title': 'Oppenent Blocks per game',
      'away': awayStats.opponent_blocks,
      'home': homeStats.opponent_blocks,
      'awayCompareValue': awayStats.opponent_blocks,
      'homeCompareValue': homeStats.opponent_blocks,
      'favored': 'higher',
    },
    {
      'name': 'TOV',
      'title': 'Oppenent Turnovers per game',
      'away': awayStats.opponent_turnovers,
      'home': homeStats.opponent_turnovers,
      'awayCompareValue': awayStats.opponent_turnovers,
      'homeCompareValue': homeStats.opponent_turnovers,
      'favored': 'lower',
    },
    {
      'name': 'PF',
      'title': 'Oppenent Turnovers per game',
      'away': awayStats.opponent_fouls,
      'home': homeStats.opponent_fouls,
      'awayCompareValue': awayStats.opponent_fouls,
      'homeCompareValue': homeStats.opponent_fouls,
      'favored': 'lower',
    },
  ];


  const getColor = (row, base) => {
    if (row.favored === 'lower') {
      if (+row.awayCompareValue < +row.homeCompareValue) {
        return base === 'away' ? theme.palette.success.main : theme.palette.error.main;
      }
      if (+row.awayCompareValue > +row.homeCompareValue) {
        return base === 'home' ? theme.palette.success.main : theme.palette.error.main;
      }
    }

    if (row.favored === 'higher') {
      if (+row.awayCompareValue > +row.homeCompareValue) {
        return base === 'away' ? theme.palette.success.main : theme.palette.error.main;
      }
      if (+row.awayCompareValue < +row.homeCompareValue) {
        return base === 'home' ? theme.palette.success.main : theme.palette.error.main;
      }
    }

    return theme.palette.primary.light;
  };

  const getPercentage = (row, base) => {
    if (row.favored === 'lower') {
      let total = +row.awayCompareValue + +row.homeCompareValue;
      if (+row.awayCompareValue < +row.homeCompareValue) {
        return base === 'away' ? 100 * (+row.homeCompareValue / total) + '%' : 100 * (+row.awayCompareValue / total) + '%';
      }
      if (+row.awayCompareValue > +row.homeCompareValue) {
        return base === 'home' ? 100 * (+row.awayCompareValue / total) + '%' : 100 * (+row.homeCompareValue / total) + '%';
      }
    }

    if (row.favored === 'higher') {
      let total = +row.awayCompareValue + +row.homeCompareValue;
      if (+row.awayCompareValue > +row.homeCompareValue) {
        return base === 'away' ? 100 * (+row.awayCompareValue / total) + '%' : 100 * (+row.homeCompareValue / total) + '%';
      }
      if (+row.awayCompareValue < +row.homeCompareValue) {
        return base === 'home' ? 100 * (+row.homeCompareValue / total) + '%' : 100 * (+row.awayCompareValue / total) + '%';
      }
    }

    return '50%';
  };

  // to make the widths relevant, need a max value to compare it to
  // ex: % percentage based stats should be out of 100

  // const difference = (a, b) => {
  //   if (a === b) {
  //     return 50;
  //   }

  //   const percentage = 100 * (Math.abs(a - b) / (Math.abs(a + b) / 2));
  //   return percentage >= 100 ? 99 : percentage;
  // };
  
  const flexContainerStyle = {
    'display': 'flex',
    'justifyContent': 'space-between',
  };

  const leftFlexColumnStyle = {
    'margin': '5px 0px',
  };

  const middleFlexColumnStyle = {
    'textAlign': 'center',
    'flexGrow': '1',
  };

  const rightFlexColumnStyle = {
    'margin': '5px 0px',
    'textAlign': 'right',
  };

  const middleSubFlexContainerStyle = {
    'display': 'flex',
    'margin': '5px 0px',
  };

  const middleSubFlexLeftColumn = {
    'width': '100%',
    'display': 'flex',
    'margin': '0px 10px',
    'justifyContent': 'flex-end',
  };

  const middleSubFlexMiddleColumn = {
    'minWidth': '80px',
  };

  const middleSubFlexRightColumn = {
    'width': '100%',
    'display': 'flex',
    'margin': '0px 10px',
  };

  return (
    <div style = {{'padding': 20}}>
      <div style = {{'display': 'flex', 'justifyContent': 'space-around', 'marginBottom': '10px'}}>
        <Typography variant = 'h5'>{CBB.getTeamName('away')}</Typography>
        <Typography variant = 'h5'>{CBB.getTeamName('home')}</Typography>
      </div>
      <Paper elevation = {3} style = {{'padding': 10}}>
        <div style = {flexContainerStyle}>
          <div>
          {overviewRows.map((row) => (
            <Typography style = {leftFlexColumnStyle} variant = 'body2'>{row.away}</Typography>
          ))}
          </div>
          <div style = {middleFlexColumnStyle}>
          {overviewRows.map((row) => (
            <div style = {middleSubFlexContainerStyle}>
              <div style = {middleSubFlexLeftColumn}><div style = {{'width': getPercentage(row, 'away'), 'backgroundColor': getColor(row, 'away')}}></div></div>
              <Tooltip key={row.name} disableFocusListener placement = 'top' title={row.title || row.name}><Typography style = {middleSubFlexMiddleColumn} variant = 'body2'>{row.name}</Typography></Tooltip>
              <div style = {middleSubFlexRightColumn}><div style = {{'width': getPercentage(row, 'home'), 'backgroundColor': getColor(row, 'home')}}></div></div>
            </div>
          ))}
          </div>
          <div>
          {overviewRows.map((row) => (
            <Typography style = {rightFlexColumnStyle} variant = 'body2'>{row.home}</Typography>
          ))}
          </div>
        </div>
      </Paper>

      <Typography style = {{'textAlign': 'center', 'margin': '10px 0px'}} variant = 'body1'>Offense</Typography>
      <Paper elevation = {3} style = {{'padding': 10}}>
        <div style = {flexContainerStyle}>
          <div>
          {offenseRows.map((row) => (
            <Typography style = {leftFlexColumnStyle} variant = 'body2'>{row.away}</Typography>
          ))}
          </div>
          <div style = {middleFlexColumnStyle}>
          {offenseRows.map((row) => (
            <div style = {middleSubFlexContainerStyle}>
              <div style = {middleSubFlexLeftColumn}><div style = {{'width': getPercentage(row, 'away'), 'backgroundColor': getColor(row, 'away')}}></div></div>
              <Typography style = {middleSubFlexMiddleColumn} variant = 'body2'>{row.name}</Typography>
              <div style = {middleSubFlexRightColumn}><div style = {{'width': getPercentage(row, 'home'), 'backgroundColor': getColor(row, 'home')}}></div></div>
            </div>
          ))}
          </div>
          <div>
          {offenseRows.map((row) => (
            <Typography style = {rightFlexColumnStyle} variant = 'body2'>{row.home}</Typography>
          ))}
          </div>
        </div>
      </Paper>

      <Typography style = {{'textAlign': 'center', 'margin': '10px 0px'}} variant = 'body1'>Special</Typography>
      <Paper elevation = {3} style = {{'padding': 10}}>
        <div style = {flexContainerStyle}>
          <div>
          {specialRows.map((row) => (
            <Typography style = {leftFlexColumnStyle} variant = 'body2'>{row.away}</Typography>
          ))}
          </div>
          <div style = {middleFlexColumnStyle}>
          {specialRows.map((row) => (
            <div style = {middleSubFlexContainerStyle}>
              <div style = {middleSubFlexLeftColumn}><div style = {{'width': getPercentage(row, 'away'), 'backgroundColor': getColor(row, 'away')}}></div></div>
              <Typography style = {middleSubFlexMiddleColumn} variant = 'body2'>{row.name}</Typography>
              <div style = {middleSubFlexRightColumn}><div style = {{'width': getPercentage(row, 'home'), 'backgroundColor': getColor(row, 'home')}}></div></div>
            </div>
          ))}
          </div>
          <div>
          {specialRows.map((row) => (
            <Typography style = {rightFlexColumnStyle} variant = 'body2'>{row.home}</Typography>
          ))}
          </div>
        </div>
      </Paper>

      <Typography style = {{'textAlign': 'center', 'margin': '10px 0px'}} variant = 'body1'>Opponent stats against</Typography>
      <Paper elevation = {3} style = {{'padding': 10}}>
        <div style = {flexContainerStyle}>
          <div>
          {opponentRows.map((row) => (
            <Typography style = {leftFlexColumnStyle} variant = 'body2'>{row.away}</Typography>
          ))}
          </div>
          <div style = {middleFlexColumnStyle}>
          {opponentRows.map((row) => (
            <div style = {middleSubFlexContainerStyle}>
              <div style = {middleSubFlexLeftColumn}><div style = {{'width': getPercentage(row, 'away'), 'backgroundColor': getColor(row, 'away')}}></div></div>
              <Typography style = {middleSubFlexMiddleColumn} variant = 'body2'>{row.name}</Typography>
              <div style = {middleSubFlexRightColumn}><div style = {{'width': getPercentage(row, 'home'), 'backgroundColor': getColor(row, 'home')}}></div></div>
            </div>
          ))}
          </div>
          <div>
          {opponentRows.map((row) => (
            <Typography style = {rightFlexColumnStyle} variant = 'body2'>{row.home}</Typography>
          ))}
          </div>
        </div>
      </Paper>
    </div>
  );
}

export default Matchup;