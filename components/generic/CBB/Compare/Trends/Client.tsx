'use client';

import React from 'react';
import { Typography, Paper } from '@mui/material';

import HelperTeam from '@/components/helpers/Team';

import PreviousMatchupTile from '@/components/generic/Game/PreviousMatchups/Tile';
import { Game, Team, Games } from '@/types/general';
import { LinearProgress } from '@mui/material';
import { getHeaderHeight } from '../Header/ClientWrapper';
import { getSubNavHeaderHeight } from '../SubNavBar';
import { footerNavigationHeight } from '@/components/generic/FooterNavigation';
import { headerBarHeight } from '@/components/generic/Header';

/**
 * The main wrapper div for all the contents
 */
const Contents = ({ children }): React.JSX.Element => {
  return (
    <div style = {{ padding: '0px 10px' }}>
      {children}
    </div>
  );
};


const ClientSkeleton = () => {
  const paddingTop = getHeaderHeight() + getSubNavHeaderHeight();

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

const Client = ({ games, teams, home_team_id, away_team_id }: {games: Games, teams: Team[], home_team_id: string, away_team_id: string}) => {
  const previousMatchupContainers: React.JSX.Element[] = [];
  const summaryPRContainers: React.JSX.Element[] = [];

  if (games && !Object.keys(games).length) {
    previousMatchupContainers.push(<Paper key = {1} elevation = {3} style = {{ padding: 10 }}><Typography variant = 'body1'>Could not find any previous games :(</Typography></Paper>);
  } else if (games) {
    const sorted_matchups: Game[] = Object.values(games).sort((a, b) => {
      return a.start_date > b.start_date ? -1 : 1;
    });

    let away_wins = 0;
    let home_wins = 0;

    let home_points = 0;
    let away_points = 0;

    let lastThree_away_wins = 0;
    let lastThree_home_wins = 0;

    let lastThree_home_points = 0;
    let lastThree_away_points = 0;

    let lastTen_away_wins = 0;
    let lastTen_home_wins = 0;

    let lastTen_home_points = 0;
    let lastTen_away_points = 0;

    for (let i = 0; i < sorted_matchups.length; i++) {
      const sortedGame = sorted_matchups[i];

      const lastThree = sorted_matchups.length > 3 && i < 3;
      const lastTen = sorted_matchups.length > 10 && i < 10;

      const awayScore = sortedGame.away_score || 0;
      const homeScore = sortedGame.home_score || 0;

      if (awayScore > homeScore) {
        if (sortedGame.away_team_id === away_team_id) {
          away_wins++;
          away_points += awayScore - homeScore;
          if (lastThree) {
            lastThree_away_wins++;
            lastThree_away_points += awayScore - homeScore;
          }
          if (lastTen) {
            lastTen_away_wins++;
            lastTen_away_points += awayScore - homeScore;
          }
        } else if (sortedGame.away_team_id === home_team_id) {
          home_wins++;
          home_points += awayScore - homeScore;
          if (lastThree) {
            lastThree_home_wins++;
            lastThree_home_points += awayScore - homeScore;
          }
          if (lastTen) {
            lastTen_home_wins++;
            lastTen_home_points += awayScore - homeScore;
          }
        }
      } else if (awayScore < homeScore) {
        if (sortedGame.home_team_id === away_team_id) {
          away_wins++;
          away_points += homeScore - awayScore;
          if (lastThree) {
            lastThree_away_wins++;
            lastThree_away_points += homeScore - awayScore;
          }
          if (lastTen) {
            lastTen_away_wins++;
            lastTen_away_points += homeScore - awayScore;
          }
        } else if (sortedGame.home_team_id === home_team_id) {
          home_wins++;
          home_points += homeScore - awayScore;
          if (lastThree) {
            lastThree_home_wins++;
            lastThree_home_points += homeScore - awayScore;
          }
          if (lastTen) {
            lastTen_home_wins++;
            lastTen_home_points += homeScore - awayScore;
          }
        }
      }
      previousMatchupContainers.push(<PreviousMatchupTile game = {sorted_matchups[i]} />);
    }

    if (sorted_matchups.length > 5) {
      if (lastThree_home_wins >= lastThree_away_wins) {
        summaryPRContainers.push(<Typography variant = 'body2'>{new HelperTeam({ team: teams[home_team_id] }).getName()} has won {lastThree_home_wins} of last 3 by an average of {(lastThree_home_points / lastThree_home_wins).toFixed(2)} pts.</Typography>);
      } else {
        summaryPRContainers.push(<Typography variant = 'body2'>{new HelperTeam({ team: teams[away_team_id] }).getName()} has won {lastThree_away_wins} of last 3 by an average of {(lastThree_away_points / lastThree_away_wins).toFixed(2)} pts.</Typography>);
      }
    }

    if (sorted_matchups.length > 10) {
      if (lastTen_home_wins >= lastTen_away_wins) {
        summaryPRContainers.push(<Typography variant = 'body2'>{new HelperTeam({ team: teams[home_team_id] }).getName()} has won {lastTen_home_wins} of last 10 by an average of {(lastTen_home_points / lastTen_home_wins).toFixed(2)} pts.</Typography>);
      } else {
        summaryPRContainers.push(<Typography variant = 'body2'>{new HelperTeam({ team: teams[away_team_id] }).getName()} has won {lastTen_away_wins} of last 10 by an average of {(lastTen_away_points / lastTen_away_wins).toFixed(2)} pts.</Typography>);
      }
    }

    if (home_wins >= away_wins) {
      summaryPRContainers.push(<Typography variant = 'body2'>{new HelperTeam({ team: teams[home_team_id] }).getName()} has won {home_wins} of last {sorted_matchups.length} by an average of {(home_points / home_wins).toFixed(2)} pts.</Typography>);
    } else {
      summaryPRContainers.push(<Typography variant = 'body2'>{new HelperTeam({ team: teams[away_team_id] }).getName()} has won {away_wins} of last {sorted_matchups.length} by an average of {(away_points / away_wins).toFixed(2)} pts.</Typography>);
    }
  }


  return (
    <Contents>
      {summaryPRContainers}
      {
        games !== null ?
        <div style = {{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
          {previousMatchupContainers}
        </div>
          : ''
      }
    </Contents>
  );
};

export { Client, ClientSkeleton };
