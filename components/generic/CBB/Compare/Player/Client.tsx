'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import {
  Typography, Chip,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setLoading } from '@/redux/features/display-slice';
import { LinearProgress } from '@mui/material';
import { getHeaderHeight } from '../Header/ClientWrapper';
import { getSubNavHeaderHeight } from '../SubNavBar';
import { footerNavigationHeight } from '@/components/generic/FooterNavigation';
import { headerBarHeight } from '@/components/generic/Header';
import RankTable from '@/components/generic/RankTable';
import HelperTeam from '@/components/helpers/Team';
import { getHeaderColumns } from '@/components/generic/Ranking/columns';
import Organization from '@/components/helpers/Organization';
import { PlayerStatisticRanking } from '@/types/cbb';


/**
 * The main wrapper div for all the contents
 */
const Contents = ({ children }): React.JSX.Element => {
  return (
    <div style = {{ padding: '0px 5px 20px 5px', textAlign: 'center' }}>
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

const Client = ({ teams }) => {
  const sessionStorageKey = 'CBB.COMPARE.PLAYER';
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [view, setView] = useState<string | null>('overview');

  const dispatch = useAppDispatch();
  const hideLowerBench = useAppSelector((state) => state.compareReducer.hideLowerBench);
  const topPlayersOnly = useAppSelector((state) => state.compareReducer.topPlayersOnly);

  const guards: string[] = [];
  const forwards: string[] = [];
  const centers: string[] = [];
  let topPlayers: string[] = [];
  const player_id_x_stats = {};
  const players = {};
  const team_id_x_stats = {};

  for (const team_id in teams) {
    const team = teams[team_id];

    if (!(team_id in team_id_x_stats)) {
      team_id_x_stats[team_id] = [];
    }

    if (team.playerStats && team.playerStats.players) {
      for (const player_id in team.playerStats.players) {
        const player = team.playerStats.players[player_id];

        if (player.position === 'F') {
          forwards.push(player_id);
        }
        if (player.position === 'C') {
          centers.push(player_id);
        }
        if (player.position === 'G') {
          guards.push(player_id);
        }

        players[player_id] = player;
      }
    }

    if (team.playerStats && team.playerStats.player_statistic_rankings) {
      for (const player_statistic_ranking_id in team.playerStats.player_statistic_rankings) {
        const row = team.playerStats.player_statistic_rankings[player_statistic_ranking_id];

        if (!(row.player_id in players)) {
          continue;
        }

        row.height = players[row.player_id].height;
        team_id_x_stats[team_id].push(row);
        player_id_x_stats[row.player_id] = row;
      }
    }
  }

  for (const team_id in team_id_x_stats) {
    team_id_x_stats[team_id].sort((a, b) => {
      if (
        (!a.minutes_per_game && !b.minutes_per_game) ||
        (a.minutes_per_game === b.minutes_per_game)
      ) {
        return 0;
      }
      return a.minutes_per_game > b.minutes_per_game ? -1 : 1;
    });

    if (team_id_x_stats[team_id].length) {
      topPlayers = topPlayers.concat(team_id_x_stats[team_id].map((row) => row.player_id).slice(0, 6));
    }
  }

  const getColumns = () => {
    if (view === 'overview') {
      return ['name', 'team_name', 'height', 'minutes_per_game', 'points_per_game', 'player_efficiency_rating', 'efficiency_rating', 'offensive_rating', 'defensive_rating', 'effective_field_goal_percentage', 'true_shooting_percentage', 'usage_percentage'];
    } if (view === 'offensive') {
      return ['name', 'team_name', 'field_goal_percentage', 'two_point_field_goal_percentage', 'three_point_field_goal_percentage', 'free_throw_percentage', 'assist_percentage', 'turnover_percentage'];
    } if (view === 'defensive') {
      return ['name', 'team_name', 'offensive_rebound_percentage', 'defensive_rebound_percentage', 'steal_percentage', 'block_percentage'];
    }
    return [];
  };

  const handleClick = (player_id) => {
    dispatch(setLoading(true));
    startTransition(() => {
      router.push(`/cbb/player/${player_id}`);
    });
  };


  const headCells = getHeaderColumns({ organization_id: Organization.getCBBID(), view: 'player' });

  headCells.team_name.sticky = true;

  const statDisplay = [
    {
      label: 'Overview',
      value: 'overview',
    },
    {
      label: 'Offense',
      value: 'offensive',
    },
    {
      label: 'Defense',
      value: 'defensive',
    },
  ];

  const statDisplayChips: React.JSX.Element[] = [];

  const handleView = (value) => {
    sessionStorage.setItem(`${sessionStorageKey}.VIEW`, value);
    setView(value);
  };

  for (let i = 0; i < statDisplay.length; i++) {
    statDisplayChips.push(
      <Chip
        key = {statDisplay[i].value}
        sx = {{ margin: '5px 5px 10px 5px' }}
        variant = {view === statDisplay[i].value ? 'filled' : 'outlined'}
        color = {view === statDisplay[i].value ? 'success' : 'primary'}
        onClick = {() => { handleView(statDisplay[i].value); }}
        label = {statDisplay[i].label}
      />,
    );
  }

  const getTable = (player_ids) => {
    const rows: PlayerStatisticRanking[] = [];

    for (let i = 0; i < player_ids.length; i++) {
      if (player_ids[i] in player_id_x_stats) {
        const stats = player_id_x_stats[player_ids[i]];

        if (hideLowerBench && stats.minutes_per_game < 3) {
          continue;
        }

        const player = (player_ids[i] in players && players[player_ids[i]]) || null;

        if (!player) {
          continue;
        }

        stats.name = `${player.first_name.charAt(0)}. ${player.last_name}`;

        const teamHelper = new HelperTeam({ team: teams[stats.team_id] });
        stats.team_name = teamHelper.getNameShort();

        rows.push(stats);
      }
    }

    return (
      <RankTable
        rows={rows}
        columns={headCells}
        displayColumns={getColumns()}
        rowKey = 'player_id'
        defaultSortOrder = 'asc'
        defaultSortOrderBy = 'minutes_per_game'
        sessionStorageKey = {sessionStorageKey}
        numberOfStickyColumns = {2}
        getRankSpanMax = {() => 5300} // todo update when implementing CFB compare tool
        handleRowClick={handleClick}
      />
    );
  };

  return (
    <Contents>
      <div style = {{ display: 'flex', justifyContent: 'center' }}>
        {statDisplayChips}
      </div>
      {
        topPlayersOnly ?
          <>
            <Typography variant='h6'>Each team top 6 MPG</Typography>
            {getTable(topPlayers)}
          </> :
          <>
            {
            guards.length ?
              <>
              <Typography variant='h6'>Guards</Typography>
              {getTable(guards)}
              </>
              : ''
            }
            {
            forwards.length ?
              <>
              <Typography variant='h6'>Forwards</Typography>
              {getTable(forwards)}
              </>
              : ''
            }
            {
            centers.length ?
              <>
              <Typography variant='h6'>Centers</Typography>
              {getTable(centers)}
              </>
              : ''
            }
          </>
      }
    </Contents>
  );
};

export { Client, ClientSkeleton };
