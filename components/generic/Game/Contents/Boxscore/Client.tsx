'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import HelperGame from '@/components/helpers/Game';
import CompareStatistic from '@/components/generic/CompareStatistic';
import { Boxscore as BoxscoreCBB, PlayerBoxscore, PlayerBoxscores } from '@/types/cbb';
import { Boxscore as BoxscoreCFB } from '@/types/cfb';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setLoading } from '@/redux/features/display-slice';
import { LinearProgress } from '@mui/material';
import { getNavHeaderHeight, getSubNavHeaderHeight } from '@/components/generic/Game/NavBar';
import { footerNavigationHeight } from '@/components/generic/FooterNavigation';
import { headerBarHeight } from '@/components/generic/Header';
import CBB from '@/components/helpers/CBB';
import Organization from '@/components/helpers/Organization';
import CFB from '@/components/helpers/CFB';
// import ButtonSwitch from '../../ButtonSwitch';
import RankTable from '@/components/generic/RankTable';
import { Game, Players } from '@/types/general';
import Chip from '@/components/ux/container/Chip';
import Typography from '@/components/ux/text/Typography';
import Style from '@/components/utils/Style';
import { useTheme } from '@/components/hooks/useTheme';
import Paper from '@/components/ux/container/Paper';
import Color from '@/components/utils/Color';




/**
 * The main wrapper div for all the contents
 */
const Contents = ({ children }): React.JSX.Element => {
  return (
    <div>
      {children}
    </div>
  );
};


const ClientSkeleton = () => {
  const paddingTop = getNavHeaderHeight() + getSubNavHeaderHeight();

  const heightToRemove = paddingTop + footerNavigationHeight + headerBarHeight + 120;
  return (
    <Contents>
      <div style = {{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: `calc(100vh - ${heightToRemove}px)`,
      }}>
        <LinearProgress color = 'secondary' style={{ width: '50%' }} />
      </div>
    </Contents>
  );
};


const Client = (
  { game, boxscores, player_boxscores, players /* tag */ }:
  { game: Game; boxscores: BoxscoreCBB[] | BoxscoreCFB[]; player_boxscores: any; players: Players /* tag */ },
) => {
  const dispatch = useAppDispatch();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const theme = useTheme();

  let numberOfTeams = CBB.getNumberOfD1Teams(game.season);

  if (game.organization_id === Organization.getCFBID()) {
    numberOfTeams = CFB.getNumberOfTeams({ division_id: game.division_id, season: game.season });
  }

  const organizations = useAppSelector((state) => state.dictionaryReducer.organization);
  const path = Organization.getPath({ organizations, organization_id: game.organization_id });

  const [boxscore_team_id, set_boxscore_team_id] = useState(game.away_team_id);

  const playerColumns = ['name', 'minutes_played', 'points', 'fg', 'two_fg', 'three_fg', 'ft', 'offensive_rebounds', 'defensive_rebounds', 'assists', 'steals', 'blocks', 'turnovers', 'fouls'];

  let home_boxscore: BoxscoreCBB | BoxscoreCFB | null = null;
  let away_boxscore: BoxscoreCBB | BoxscoreCFB | null = null;

  for (const boxscore_id in boxscores) {
    const row = boxscores[boxscore_id];

    if (row.team_id === game.away_team_id) {
      away_boxscore = row;
    }

    if (row.team_id === game.home_team_id) {
      home_boxscore = row;
    }
  }

  const hasBoxscoreData = away_boxscore && home_boxscore && ('points' in away_boxscore) && ('points' in home_boxscore);

  const handleClick = (player_id) => {
    if (!player_id) {
      console.warn('Missing player_id');
      return;
    }
    dispatch(setLoading(true));
    startTransition(() => {
      router.push(`/${path}/player/${player_id}`);
    });
  };

  const Game = new HelperGame({
    game,
  });

  const gameColors = Game.getColors();

  const getBoxscoreSections = () => {
    if (!hasBoxscoreData) {
      return [];
    }

    if (game.organization_id === Organization.getCFBID()) {
      away_boxscore = away_boxscore as BoxscoreCFB;
      home_boxscore = home_boxscore as BoxscoreCFB;
      return [
        {
          name: 'Efficiency',
          rows: [
            {
              name: 'PTS',
              title: 'PTS',
              tooltip: 'Points',
              away: away_boxscore.points,
              home: home_boxscore.points,
              awayCompareValue: away_boxscore.points,
              homeCompareValue: home_boxscore.points,
              favored: 'higher',
              showDifference: true,
              precision: 0,
            },
            {
              name: 'QBR(c)',
              title: 'QBR(c)',
              away: away_boxscore.passing_rating_college,
              home: home_boxscore.passing_rating_college,
              awayCompareValue: away_boxscore.passing_rating_college,
              homeCompareValue: home_boxscore.passing_rating_college,
              favored: 'higher',
              showDifference: true,
              precision: 0,
            },
          ],
        },
        {
          name: 'Passing',
          rows: [
            {
              name: 'Att.',
              title: 'Attempts',
              away: away_boxscore.passing_attempts,
              home: home_boxscore.passing_attempts,
              awayCompareValue: away_boxscore.passing_attempts,
              homeCompareValue: home_boxscore.passing_attempts,
              favored: 'higher',
              showDifference: true,
              precision: 0,
            },
            {
              name: 'Comp.',
              title: 'Completions',
              away: away_boxscore.passing_completions,
              home: home_boxscore.passing_completions,
              awayCompareValue: away_boxscore.passing_completions,
              homeCompareValue: home_boxscore.passing_completions,
              favored: 'higher',
              showDifference: true,
              precision: 0,
            },
            {
              name: 'Yds',
              title: 'Yards',
              away: away_boxscore.passing_yards,
              home: home_boxscore.passing_yards,
              awayCompareValue: away_boxscore.passing_yards,
              homeCompareValue: home_boxscore.passing_yards,
              favored: 'higher',
              showDifference: true,
              precision: 0,
            },
            {
              name: 'Comp. %',
              title: 'Completion %',
              away: away_boxscore.passing_completion_percentage,
              home: home_boxscore.passing_completion_percentage,
              awayCompareValue: away_boxscore.passing_completion_percentage,
              homeCompareValue: home_boxscore.passing_completion_percentage,
              favored: 'higher',
              showDifference: true,
            },
            {
              name: 'Yds per att.',
              title: 'Yard per attempt',
              away: away_boxscore.passing_yards_per_attempt,
              home: home_boxscore.passing_yards_per_attempt,
              awayCompareValue: away_boxscore.passing_yards_per_attempt,
              homeCompareValue: home_boxscore.passing_yards_per_attempt,
              favored: 'higher',
              showDifference: true,
              precision: 0,
            },
            {
              name: 'Yds per comp.',
              title: 'Yards per completion',
              away: away_boxscore.passing_yards_per_completion,
              home: home_boxscore.passing_yards_per_completion,
              awayCompareValue: away_boxscore.passing_yards_per_completion,
              homeCompareValue: home_boxscore.passing_yards_per_completion,
              favored: 'higher',
              showDifference: true,
              precision: 0,
            },
            {
              name: 'TDs',
              title: 'Touchdowns',
              away: away_boxscore.passing_touchdowns,
              home: home_boxscore.passing_touchdowns,
              awayCompareValue: away_boxscore.passing_touchdowns,
              homeCompareValue: home_boxscore.passing_touchdowns,
              favored: 'higher',
              showDifference: true,
              precision: 0,
            },
            {
              name: 'INT',
              title: 'Interceptions',
              away: away_boxscore.passing_interceptions,
              home: home_boxscore.passing_interceptions,
              awayCompareValue: away_boxscore.passing_interceptions,
              homeCompareValue: home_boxscore.passing_interceptions,
              favored: 'higher',
              showDifference: true,
              precision: 0,
            },
            {
              name: 'Long',
              title: 'Long',
              away: away_boxscore.passing_long,
              home: home_boxscore.passing_long,
              awayCompareValue: away_boxscore.passing_long,
              homeCompareValue: home_boxscore.passing_long,
              favored: 'higher',
              showDifference: true,
              precision: 0,
            },
          ],
        },
        {
          name: 'Rushing',
          rows: [
            {
              name: 'Att.',
              title: 'Attempts',
              away: away_boxscore.rushing_attempts,
              home: home_boxscore.rushing_attempts,
              awayCompareValue: away_boxscore.rushing_attempts,
              homeCompareValue: home_boxscore.rushing_attempts,
              favored: 'higher',
              showDifference: true,
            },
            {
              name: 'Yds',
              title: 'Yards',
              away: away_boxscore.rushing_yards,
              home: home_boxscore.rushing_yards,
              awayCompareValue: away_boxscore.rushing_yards,
              homeCompareValue: home_boxscore.rushing_yards,
              favored: 'higher',
              showDifference: true,
            },
            {
              name: 'Yds per att.',
              title: 'Yards per attempt',
              away: away_boxscore.rushing_yards_per_attempt,
              home: home_boxscore.rushing_yards_per_attempt,
              awayCompareValue: away_boxscore.rushing_yards_per_attempt,
              homeCompareValue: home_boxscore.rushing_yards_per_attempt,
              favored: 'higher',
              showDifference: true,
            },
            {
              name: 'TDs',
              title: 'Touchdowns',
              away: away_boxscore.rushing_touchdowns,
              home: home_boxscore.rushing_touchdowns,
              awayCompareValue: away_boxscore.rushing_touchdowns,
              homeCompareValue: home_boxscore.rushing_touchdowns,
              favored: 'higher',
              showDifference: true,
            },
            {
              name: 'Long',
              title: 'Long',
              away: away_boxscore.rushing_long,
              home: home_boxscore.rushing_long,
              awayCompareValue: away_boxscore.rushing_long,
              homeCompareValue: home_boxscore.rushing_long,
              favored: 'higher',
              showDifference: true,
            },
          ],
        },
      ];
    }

    away_boxscore = away_boxscore as BoxscoreCBB;
    home_boxscore = home_boxscore as BoxscoreCBB;

    return [
      {
        name: 'Boxscore',
        rows: [
          {
            name: 'PTS',
            title: 'PTS',
            tooltip: 'Points',
            away: away_boxscore.points,
            home: home_boxscore.points,
            awayCompareValue: away_boxscore.points,
            homeCompareValue: home_boxscore.points,
            favored: 'higher',
            showDifference: true,
            precision: 0,
          },
          {
            name: 'FG',
            title: 'FG',
            tooltip: 'Field goals per game',
            away: away_boxscore.field_goal,
            home: home_boxscore.field_goal,
            awayCompareValue: away_boxscore.field_goal,
            homeCompareValue: home_boxscore.field_goal,
            favored: 'higher',
            showDifference: true,
            precision: 0,
          },
          {
            name: 'FGA',
            title: 'FGA',
            tooltip: 'Field goal attempts per game',
            away: away_boxscore.field_goal_attempts,
            home: home_boxscore.field_goal_attempts,
            awayCompareValue: away_boxscore.field_goal_attempts,
            homeCompareValue: home_boxscore.field_goal_attempts,
            favored: 'higher',
            showDifference: true,
            precision: 0,
          },
          {
            name: 'FG%',
            title: 'FG%',
            tooltip: 'Field goal percentage',
            away: away_boxscore.field_goal_percentage !== null ? `${away_boxscore.field_goal_percentage}%` : '',
            home: home_boxscore.field_goal_percentage !== null ? `${home_boxscore.field_goal_percentage}%` : '',
            awayCompareValue: away_boxscore.field_goal_percentage,
            homeCompareValue: home_boxscore.field_goal_percentage,
            favored: 'higher',
            showDifference: true,
          },
          {
            name: '2P',
            title: '2P',
            tooltip: '2 point field goals per game',
            away: away_boxscore.two_point_field_goal,
            home: home_boxscore.two_point_field_goal,
            awayCompareValue: away_boxscore.two_point_field_goal,
            homeCompareValue: home_boxscore.two_point_field_goal,
            favored: 'higher',
            showDifference: true,
            precision: 0,
          },
          {
            name: '2PA',
            title: '2PA',
            tooltip: '2 point field goal attempts per game',
            away: away_boxscore.two_point_field_goal_attempts,
            home: home_boxscore.two_point_field_goal_attempts,
            awayCompareValue: away_boxscore.two_point_field_goal_attempts,
            homeCompareValue: home_boxscore.two_point_field_goal_attempts,
            favored: 'higher',
            showDifference: true,
            precision: 0,
          },
          {
            name: '2P%',
            title: '2P%',
            tooltip: '2 point field goal percentage',
            away: away_boxscore.two_point_field_goal_percentage !== null ? `${away_boxscore.two_point_field_goal_percentage}%` : '',
            home: home_boxscore.two_point_field_goal_percentage !== null ? `${home_boxscore.two_point_field_goal_percentage}%` : '',
            awayCompareValue: away_boxscore.two_point_field_goal_percentage,
            homeCompareValue: home_boxscore.two_point_field_goal_percentage,
            favored: 'higher',
            showDifference: true,
          },
          {
            name: '3P',
            title: '3P',
            tooltip: '3 point field goals per game',
            away: away_boxscore.three_point_field_goal,
            home: home_boxscore.three_point_field_goal,
            awayCompareValue: away_boxscore.three_point_field_goal,
            homeCompareValue: home_boxscore.three_point_field_goal,
            favored: 'higher',
            showDifference: true,
            precision: 0,
          },
          {
            name: '3PA',
            title: '3PA',
            tooltip: '3 point field goal attempts per game',
            away: away_boxscore.three_point_field_goal_attempts,
            home: home_boxscore.three_point_field_goal_attempts,
            awayCompareValue: away_boxscore.three_point_field_goal_attempts,
            homeCompareValue: home_boxscore.three_point_field_goal_attempts,
            favored: 'higher',
            showDifference: true,
            precision: 0,
          },
          {
            name: '3P%',
            title: '3P%',
            tooltip: '3 point field goal percentage',
            away: away_boxscore.three_point_field_goal_percentage !== null ? `${away_boxscore.three_point_field_goal_percentage}%` : '',
            home: home_boxscore.three_point_field_goal_percentage !== null ? `${home_boxscore.three_point_field_goal_percentage}%` : '',
            awayCompareValue: away_boxscore.three_point_field_goal_percentage,
            homeCompareValue: home_boxscore.three_point_field_goal_percentage,
            favored: 'higher',
            showDifference: true,
          },
          {
            name: 'FT',
            title: 'FT',
            tooltip: 'Free throws per game',
            away: away_boxscore.free_throws,
            home: home_boxscore.free_throws,
            awayCompareValue: away_boxscore.free_throws,
            homeCompareValue: home_boxscore.free_throws,
            favored: 'higher',
            showDifference: true,
            precision: 0,
          },
          {
            name: 'FTA',
            title: 'FTA',
            tooltip: 'Free throw attempts per game',
            away: away_boxscore.free_throw_attempts,
            home: home_boxscore.free_throw_attempts,
            awayCompareValue: away_boxscore.free_throw_attempts,
            homeCompareValue: home_boxscore.free_throw_attempts,
            favored: 'higher',
            showDifference: true,
            precision: 0,
          },
          {
            name: 'FT%',
            title: 'FT%',
            tooltip: 'Free throw percentage',
            away: away_boxscore.free_throw_percentage !== null ? `${away_boxscore.free_throw_percentage}%` : '',
            home: home_boxscore.free_throw_percentage !== null ? `${home_boxscore.free_throw_percentage}%` : '',
            awayCompareValue: away_boxscore.free_throw_percentage,
            homeCompareValue: home_boxscore.free_throw_percentage,
            favored: 'higher',
            showDifference: true,
          },
          {
            name: 'ORB',
            title: 'ORB',
            tooltip: 'Offensive rebounds',
            away: away_boxscore.offensive_rebounds,
            home: home_boxscore.offensive_rebounds,
            awayCompareValue: away_boxscore.offensive_rebounds,
            homeCompareValue: home_boxscore.offensive_rebounds,
            favored: 'higher',
            showDifference: true,
            precision: 0,
          },
          {
            name: 'DRB',
            title: 'DRB',
            tooltip: 'Defensive rebounds',
            away: away_boxscore.defensive_rebounds,
            home: home_boxscore.defensive_rebounds,
            awayCompareValue: away_boxscore.defensive_rebounds,
            homeCompareValue: home_boxscore.defensive_rebounds,
            favored: 'higher',
            showDifference: true,
            precision: 0,
          },
          {
            name: 'AST',
            title: 'AST',
            tooltip: 'Assists',
            away: away_boxscore.assists,
            home: home_boxscore.assists,
            awayCompareValue: away_boxscore.assists,
            homeCompareValue: home_boxscore.assists,
            favored: 'higher',
            showDifference: true,
            precision: 0,
          },
          {
            name: 'STL',
            title: 'STL',
            tooltip: 'Steals',
            away: away_boxscore.steals,
            home: home_boxscore.steals,
            awayCompareValue: away_boxscore.steals,
            homeCompareValue: home_boxscore.steals,
            favored: 'higher',
            showDifference: true,
            precision: 0,
          },
          {
            name: 'BLK',
            title: 'BLK',
            tooltip: 'Blocks',
            away: away_boxscore.blocks,
            home: home_boxscore.blocks,
            awayCompareValue: away_boxscore.blocks,
            homeCompareValue: home_boxscore.blocks,
            favored: 'higher',
            showDifference: true,
            precision: 0,
          },
          {
            name: 'TOV',
            title: 'TOV',
            tooltip: 'Turnovers',
            away: away_boxscore.turnovers,
            home: home_boxscore.turnovers,
            awayCompareValue: away_boxscore.turnovers,
            homeCompareValue: home_boxscore.turnovers,
            favored: 'lower',
            showDifference: true,
            precision: 0,
          },
          {
            name: 'PF',
            title: 'PF',
            tooltip: 'Fouls',
            away: away_boxscore.fouls,
            home: home_boxscore.fouls,
            awayCompareValue: away_boxscore.fouls,
            homeCompareValue: home_boxscore.fouls,
            favored: 'lower',
            showDifference: true,
            precision: 0,
          },
        ],
      },
    ];
  };



  /**
   * Get the team boxscore content
   */
  const getBoxscoreContent = (): React.JSX.Element => {
    if (!hasBoxscoreData) {
      return <Typography style = {{ textAlign: 'center', margin: '10px 0px' }} type = 'h5'>No boxscore data yet...</Typography>;
    }

    const sections = getBoxscoreSections();

    return (
      sections.map((section) => {
        return (
          <React.Fragment key = {section.name}>
            <Typography style = {{ textAlign: 'center', margin: '10px 0px' }} type = 'body1'>{section.name}</Typography>
            <CompareStatistic max = {numberOfTeams} season = {game.season} paper = {true} rows = {section.rows} />
          </React.Fragment>
        );
      })
    );
  };


  /**
   * Get the player boxscore content
   */
  const getPlayerBoxscoreContent = (): React.JSX.Element => {
    if (game.organization_id === Organization.getCFBID()) {
      let homeQB: any = null;
      let awayQB: any = null;
      let homeBestRusher: any = null;
      let awayBestRusher: any = null;
      let homeBestReceiver: any = null;
      let awayBestReceiver: any = null;

      const StatBlock = ({ value, label }) => (
        <div style = {{ textAlign: 'center' }}>
          <Typography type = 'body1'>{value}</Typography>
          <Typography type = 'caption' style = {{ color: theme.text.secondary, textTransform: 'uppercase' }}>{label}</Typography>
        </div>
      );

      const PlayerStatRow = ({ name, number, initials, color, teamCode, blocks }) => {
        const rowStyle = {
          display: 'flex',
          alignItems: 'center',
          padding: '8px',
          margin: '4px',
        };

        const teamInfoStyle = {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        };

        const teamLogoStyle = {
          width: '32px',
          height: '32px',
          marginBottom: '0.25rem',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: color,
          color: Color.getTextColor('#ffffff', color),
        };

        const avatarContainerStyle = {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0px 10px',
        };

        const avatarStyle = {
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: color,
          color: Color.getTextColor('#ffffff', color),
        };

        const statsContainerStyle = {
          width: '100%',
          paddingLeft: '8px',
        };

        const statsGridStyle = {
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '0.25rem',
          marginTop: '0.5rem',
        };

        return (
          <div className={Style.getStyleClassName(rowStyle)}>
            {/* Team Logo and Rank */}
            <div className = {Style.getStyleClassName(teamInfoStyle)}>
              <div className = {Style.getStyleClassName(teamLogoStyle)}>
                <Typography type='caption'>{teamCode}</Typography>
              </div>
              {/* <img
                src={null}
                alt={`logo`}
                style={teamLogoStyle}
                onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/40/CCCCCC/FFFFFF?text=Err'; }}
              /> */}
              <Typography type='caption' style = {{ color: theme.text.secondary }}>#{number}</Typography>
            </div>

            {/* Player Avatar */}
            <div className={Style.getStyleClassName(avatarContainerStyle)}>
              <div className={Style.getStyleClassName(avatarStyle)}>
                {initials}
              </div>
            </div>

            {/* Player Name and Stats */}
            <div className={Style.getStyleClassName(statsContainerStyle)}>
              <Typography type='h6'>{name}</Typography>
              <div className={Style.getStyleClassName(statsGridStyle)}>
                {blocks.map((block) => {
                  return (
                    <StatBlock value={block.value} label={block.label} />
                  );
                })}
              </div>
            </div>
          </div>
        );
      };

      for (const player_boxscore_id in player_boxscores) {
        const row = player_boxscores[player_boxscore_id];

        let player_name = (row.first_name ? `${row.first_name.charAt(0)}. ` : '') + row.last_name;
        let player_number = '1';
        let initials = (row.first_name ? `${row.first_name.charAt(0)}` : '') + (row.last_name ? `${row.last_name.charAt(0)}` : '');

        if (row.player_id && players && row.player_id in players) {
          const player = players[row.player_id];
          player_name = (player.first_name ? `${player.first_name.charAt(0)}. ` : '') + player.last_name;
          initials = (player.first_name ? `${player.first_name.charAt(0)}` : '') + (player.last_name ? `${player.last_name.charAt(0)}` : '');
          player_number = player.number;
        }

        row.player_name = player_name;
        row.player_number = player_number;
        row.initials = initials;

        row.color = (row.team_id === game.away_team_id ? gameColors.awayColor : gameColors.homeColor);

        row.teamCode = (row.team_id === game.away_team_id ? Game.getTeamNameShort('away') : Game.getTeamNameShort('home'));

        if (row.team_id === game.away_team_id) {
          if (
            row.passing_yards &&
            (!awayQB || row.passing_yards > awayQB.passing_yards)
          ) {
            awayQB = row;
          }

          if (
            row.rushing_yards &&
            (!awayBestRusher || row.rushing_yards > awayBestRusher.rushing_yards)
          ) {
            awayBestRusher = row;
          }

          if (
            row.receiving_yards &&
            (!awayBestReceiver || row.receiving_yards > awayBestReceiver.receiving_yards)
          ) {
            awayBestReceiver = row;
          }
        }

        if (row.team_id === game.home_team_id) {
          if (
            row.passing_yards &&
            (!homeQB || row.passing_yards > homeQB.passing_yards)
          ) {
            homeQB = row;
          }

          if (
            row.rushing_yards &&
            (!homeBestRusher || row.rushing_yards > homeBestRusher.rushing_yards)
          ) {
            homeBestRusher = row;
          }

          if (
            row.receiving_yards &&
            (!homeBestReceiver || row.receiving_yards > homeBestReceiver.receiving_yards)
          ) {
            homeBestReceiver = row;
          }
        }
      }

      return (
        <>
          <div style = {{ textAlign: 'center' }}><Typography type = 'h6'>Top players</Typography></div>
          {
            homeQB || awayQB ?
            <div style = {{ maxWidth: 600, margin: 'auto' }}>
              <Typography type = 'body1' style = {{ color: theme.text.secondary }}>Passing</Typography>
              <Paper>
                {
                  homeQB ? PlayerStatRow({
                    name: homeQB.player_name,
                    number: homeQB.player_number,
                    initials: homeQB.initials,
                    color: homeQB.color,
                    teamCode: homeQB.teamCode,
                    blocks: [
                      { value: `${homeQB.passing_completions || 0}/${homeQB.passing_attempts}`, label: 'Comp/Att' },
                      { value: homeQB.passing_yards || 0, label: 'Yds' },
                      { value: homeQB.passing_touchdowns || 0, label: 'TD' },
                      { value: homeQB.passing_interceptions || 0, label: 'INT' },
                      { value: homeQB.passing_rating_college || 0, label: 'QBR' },
                    ],
                  })
                    : ''
                }
              </Paper>
              <Paper>
                {
                  awayQB ? PlayerStatRow({
                    name: awayQB.player_name,
                    number: awayQB.player_number,
                    initials: awayQB.initials,
                    color: awayQB.color,
                    teamCode: awayQB.teamCode,
                    blocks: [
                      { value: `${awayQB.passing_completions || 0}/${awayQB.passing_attempts}`, label: 'Comp/Att' },
                      { value: awayQB.passing_yards || 0, label: 'Yds' },
                      { value: awayQB.passing_touchdowns || 0, label: 'TD' },
                      { value: awayQB.passing_interceptions || 0, label: 'INT' },
                      { value: awayQB.passing_rating_college || 0, label: 'QBR' },
                    ],
                  })
                    : ''
                }
              </Paper>
            </div>
              : ''
          }
          {
            homeBestRusher || awayBestRusher ?
            <div style = {{ maxWidth: 600, margin: 'auto' }}>
              <Typography type = 'body1' style = {{ color: theme.text.secondary }}>Rushing</Typography>
              <Paper>
                {
                  homeBestRusher ? PlayerStatRow({
                    name: homeBestRusher.player_name,
                    number: homeBestRusher.player_number,
                    initials: homeBestRusher.initials,
                    color: homeBestRusher.color,
                    teamCode: homeBestRusher.teamCode,
                    blocks: [
                      { value: homeBestRusher.rushing_attempts || 0, label: 'Att' },
                      { value: homeBestRusher.rushing_yards || 0, label: 'Yds' },
                      { value: homeBestRusher.rushing_yards_per_attempt || 0, label: 'AVG' },
                      { value: homeBestRusher.rushing_touchdowns || 0, label: 'TD' },
                      { value: homeBestRusher.rushing_long || 0, label: 'Long' },
                      // { value: homeBestRusher.fumbles || 0, label: 'FUML' },
                    ],
                  })
                    : ''
                }
              </Paper>
              <Paper>
                {
                  awayBestRusher ? PlayerStatRow({
                    name: awayBestRusher.player_name,
                    number: awayBestRusher.player_number,
                    initials: awayBestRusher.initials,
                    color: awayBestRusher.color,
                    teamCode: awayBestRusher.teamCode,
                    blocks: [
                      { value: awayBestRusher.rushing_attempts || 0, label: 'Att' },
                      { value: awayBestRusher.rushing_yards || 0, label: 'Yds' },
                      { value: awayBestRusher.rushing_yards_per_attempt || 0, label: 'AVG' },
                      { value: awayBestRusher.rushing_touchdowns || 0, label: 'TD' },
                      { value: awayBestRusher.rushing_long || 0, label: 'Long' },
                      // { value: awayBestRusher.fumbles || 0, label: 'FUML' },
                    ],
                  })
                    : ''
                }
              </Paper>
            </div>
              : ''
          }
          {
            homeBestReceiver || awayBestReceiver ?
            <div style = {{ maxWidth: 600, margin: 'auto' }}>
              <Typography type = 'body1' style = {{ color: theme.text.secondary }}>Receiving</Typography>
              <Paper>
                {
                  homeBestReceiver ? PlayerStatRow({
                    name: homeBestReceiver.player_name,
                    number: homeBestReceiver.player_number,
                    initials: homeBestReceiver.initials,
                    color: homeBestReceiver.color,
                    teamCode: homeBestReceiver.teamCode,
                    blocks: [
                      { value: homeBestReceiver.receptions || 0, label: 'REC' },
                      // { value: `${homeBestReceiver.targets || 0}`, label: 'TGT' },
                      { value: homeBestReceiver.receiving_yards || 0, label: 'Yds' },
                      { value: homeBestReceiver.receiving_yards_per_reception || 0, label: 'AVG' },
                      { value: homeBestReceiver.receiving_touchdowns || 0, label: 'TD' },
                      { value: homeBestReceiver.receiving_long || 0, label: 'Long' },
                    ],
                  })
                    : ''
                }
              </Paper>
              <Paper>
                {
                  awayBestReceiver ? PlayerStatRow({
                    name: awayBestReceiver.player_name,
                    number: awayBestReceiver.player_number,
                    initials: awayBestReceiver.initials,
                    color: awayBestReceiver.color,
                    teamCode: awayBestReceiver.teamCode,
                    blocks: [
                      { value: awayBestReceiver.receptions || 0, label: 'REC' },
                      // { value: `${awayBestReceiver.targets || 0}`, label: 'TGT' },
                      { value: awayBestReceiver.receiving_yards || 0, label: 'Yds' },
                      { value: awayBestReceiver.receiving_yards_per_reception || 0, label: 'AVG' },
                      { value: awayBestReceiver.receiving_touchdowns || 0, label: 'TD' },
                      { value: awayBestReceiver.receiving_long || 0, label: 'Long' },
                    ],
                  })
                    : ''
                }
              </Paper>
            </div>
              : ''
          }
        </>
      );
    }
    if (game.organization_id === Organization.getCBBID()) {
      const playerBoxscoreHeaderColumns = {
        name: {
          id: 'name',
          numeric: false,
          label: 'Player',
          tooltip: 'Player',
          sticky: true,
        },
        minutes_played: {
          id: 'minutes_played',
          label: 'MP',
          tooltip: 'Minutes played',
          sort: 'higher',
          numeric: true,
        },
        points: {
          id: 'points',
          label: 'PTS',
          tooltip: 'Points',
          sort: 'higher',
          numeric: true,
        },
        fg: {
          id: 'fg',
          label: 'FG',
          tooltip: 'Field goals',
          sort: 'higher',
          numeric: true,
        },
        two_fg: {
          id: 'two_fg',
          label: '2P',
          tooltip: '2 point field goals',
          sort: 'higher',
          numeric: true,
        },
        three_fg: {
          id: 'three_fg',
          label: '3P',
          tooltip: '3 point field goals',
          sort: 'higher',
          numeric: true,
        },
        ft: {
          id: 'ft',
          label: 'FT',
          tooltip: 'Free throws',
          sort: 'higher',
          numeric: true,
        },
        offensive_rebounds: {
          id: 'offensive_rebounds',
          label: 'ORB',
          tooltip: 'Offensive rebounds',
          sort: 'higher',
          numeric: true,
        },
        defensive_rebounds: {
          id: 'defensive_rebounds',
          label: 'DRB',
          tooltip: 'Defensive rebounds',
          sort: 'higher',
          numeric: true,
        },
        assists: {
          id: 'assists',
          label: 'AST',
          tooltip: 'Assists',
          sort: 'higher',
          numeric: true,
        },
        steals: {
          id: 'steals',
          label: 'STL',
          tooltip: 'Steals',
          sort: 'higher',
          numeric: true,
        },
        blocks: {
          id: 'blocks',
          label: 'BLK',
          tooltip: 'Blocks',
          sort: 'higher',
          numeric: true,
        },
        turnovers: {
          id: 'turnovers',
          label: 'TOV',
          tooltip: 'Turnovers',
          sort: 'higher',
          numeric: true,
        },
        fouls: {
          id: 'fouls',
          label: 'PF',
          title: 'Personal fouls',
          sort: 'higher',
          numeric: true,
        },
      };

      const playerRows: object[] = [];

      type FooterRow = Partial<PlayerBoxscore> & {
        name?: string;
        fg?: string;
        fg_secondary?: string;
        two_fg?: string;
        two_fg_secondary?: string;
        three_fg?: string;
        three_fg_secondary?: string;
        ft?: string;
        ft_secondary?: string;
      }

      const footerRow: FooterRow = {
        name: 'Total',
      };


      for (const player_boxscore_id in player_boxscores) {
        const row = player_boxscores[player_boxscore_id];

        if (!row.minutes_played) {
          continue;
        }

        if (boxscore_team_id !== row.team_id) {
          continue;
        }

        let player_name = (row.first_name ? `${row.first_name.charAt(0)}. ` : '') + row.last_name;

        if (row.player_id && players && row.player_id in players) {
          const player = players[row.player_id];
          player_name = (player.first_name ? `${player.first_name.charAt(0)}. ` : '') + player.last_name;
        }

        const formattedRow = { ...row } as FooterRow;

        formattedRow.name = player_name;

        formattedRow.fg = `${row.field_goal || 0}-${row.field_goal_attempts || 0}`;
        formattedRow.fg_secondary = `${row.field_goal_percentage || 0}%`;

        formattedRow.two_fg = `${row.two_point_field_goal || 0}-${row.two_point_field_goal_attempts || 0}`;
        formattedRow.two_fg_secondary = `${row.two_point_field_goal_percentage || 0}%`;

        formattedRow.three_fg = `${row.three_point_field_goal || 0}-${row.three_point_field_goal_attempts || 0}`;
        formattedRow.three_fg_secondary = `${row.three_point_field_goal_percentage || 0}%`;

        formattedRow.ft = `${row.free_throws || 0}-${row.free_throw_attempts || 0}`;
        formattedRow.ft_secondary = `${row.free_throw_percentage || 0}%`;

        for (const key in row) {
          if (!(key in footerRow)) {
            footerRow[key] = row[key];
          } else {
            footerRow[key] = +(+footerRow[key] + +row[key]).toFixed(2);
          }
        }

        playerRows.push(formattedRow);
      }

      footerRow.fg = `${footerRow.field_goal || 0}-${footerRow.field_goal_attempts || 0}`;
      footerRow.fg_secondary = footerRow.field_goal_attempts !== undefined && footerRow.field_goal_attempts > 0 ? `${(((footerRow.field_goal || 0) / footerRow.field_goal_attempts) * 100).toFixed(2)}%` : '0%';

      footerRow.two_fg = `${footerRow.two_point_field_goal || 0}-${footerRow.two_point_field_goal_attempts || 0}`;
      footerRow.two_fg_secondary = footerRow.two_point_field_goal_attempts !== undefined && footerRow.two_point_field_goal_attempts > 0 ? `${(((footerRow.two_point_field_goal || 0) / footerRow.two_point_field_goal_attempts) * 100).toFixed(2)}%` : '0%';

      footerRow.three_fg = `${footerRow.three_point_field_goal || 0}-${footerRow.three_point_field_goal_attempts || 0}`;
      footerRow.three_fg_secondary = footerRow.three_point_field_goal_attempts !== undefined && footerRow.three_point_field_goal_attempts > 0 ? `${(((footerRow.three_point_field_goal || 0) / footerRow.three_point_field_goal_attempts) * 100).toFixed(2)}%` : '0%';

      footerRow.ft = `${footerRow.free_throws || 0}-${footerRow.free_throw_attempts || 0}`;
      footerRow.ft_secondary = footerRow.free_throw_attempts !== undefined && footerRow.free_throw_attempts > 0 ? `${(((footerRow.free_throws || 0) / footerRow.free_throw_attempts) * 100).toFixed(2)}%` : '0%';

      return (
        <>
          {/* <ButtonSwitch leftTitle={Game.getTeamName('away')} rightTitle={Game.getTeamName('home')} selected = {boxscore_team_id === 'away' ? 'left' : 'right'} handleClick={() => { set_boxscore_team_id(boxscore_team_id === 'away' ? 'home' : 'away'); }} /> */}
          <div style = {{ textAlign: 'center' }}>
            <Chip style = {{ margin: '0px 10px 10px 10px' }} filled = {boxscore_team_id === game.away_team_id} value = {game.away_team_id} onClick= {() => { set_boxscore_team_id(game.away_team_id); }} title = {Game.getTeamName('away')} />
            <Chip style = {{ margin: '0px 10px 10px 10px' }} filled = {boxscore_team_id === game.home_team_id} value = {game.home_team_id} onClick= {() => { set_boxscore_team_id(game.home_team_id); }} title = {Game.getTeamName('home')} />
          </div>
          <RankTable
            rows={playerRows}
            footerRow={footerRow}
            columns={playerBoxscoreHeaderColumns}
            displayColumns={playerColumns}
            rowKey = 'player_id'
            defaultSortOrder = 'asc'
            defaultSortOrderBy = 'minutes_played'
            sessionStorageKey = {`${path}.TEAM.ROSTER`}
            secondaryKey = 'secondary'
            handleRowClick={handleClick}
            />
        </>
      );
    }

    return <></>;
  };


  return (
    <Contents>
      <div>
        <div style = {{ padding: '10px 5px' }}>
          {getBoxscoreContent()}
        </div>
      </div>
      <div style = {{ padding: '0px 5px 10px 5px' }}>
        {getPlayerBoxscoreContent()}
      </div>
    </Contents>
  );
};

export { Client, ClientSkeleton };
