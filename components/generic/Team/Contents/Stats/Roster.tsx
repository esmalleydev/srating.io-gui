'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import Skeleton from '@mui/material/Skeleton';


import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setLoading } from '@/redux/features/display-slice';
import { PlayerStatisticRanking } from '@/types/cbb';
import Organization from '@/components/helpers/Organization';
import Alert from '@/components/generic/Alert';
import RankTable from '@/components/generic/RankTable';
import Chip from '@/components/ux/container/Chip';
import Typography from '@/components/ux/text/Typography';
import TableColumns from '@/components/helpers/TableColumns';
import Paper from '@/components/ux/container/Paper';


const Roster = ({ organization_id, rosterStats }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // todo for CFB, split this into position ( 3 sections QB / Passing, Rushing, Receiving, Maybe defense? (opp_ stats?))

  const [view, setView] = useState<string | null>('overview');

  const { players, player_statistic_rankings } = rosterStats;
  const organizations = useAppSelector((state) => state.dictionaryReducer.organization);
  const path = Organization.getPath({ organizations, organization_id });

  useEffect(() => {
    setView(sessionStorage.getItem(`${path}.TEAM.ROSTER.VIEW`) ? sessionStorage.getItem(`${path}.TEAM.ROSTER.VIEW`) : 'overview');
  }, []);


  const getColumns = () => {
    if (Organization.getCBBID() === organization_id) {
      if (view === 'overview') {
        return ['rank', 'name', 'games', 'minutes_per_game', 'points_per_game', 'player_efficiency_rating', 'efficiency_rating', 'offensive_rating', 'defensive_rating', 'effective_field_goal_percentage', 'true_shooting_percentage', 'usage_percentage'];
      }
      if (view === 'offensive') {
        return ['rank', 'name', 'field_goal_percentage', 'two_point_field_goal_percentage', 'three_point_field_goal_percentage', 'free_throw_percentage', 'assist_percentage', 'turnover_percentage', 'assists_per_game', 'turnovers_per_game'];
      }
      if (view === 'defensive') {
        return ['rank', 'name', 'offensive_rebounds_per_game', 'defensive_rebounds_per_game', 'steals_per_game', 'blocks_per_game', 'offensive_rebound_percentage', 'defensive_rebound_percentage', 'steal_percentage', 'block_percentage', 'fouls_per_game'];
      }
    }

    if (Organization.getCFBID() === organization_id) {
      // todo when this is implemented updated the rankSpanMax on the RankTable from the hardcoded 5300
      if (view === 'overview') {
        return ['rank', 'name', 'position', 'games'];
      }
      if (view === 'offensive') {
        return ['rank', 'name', 'position', 'games'];
      }
      if (view === 'defensive') {
        return ['rank', 'name', 'position', 'games'];
      }
    }
    return [];
  };

  const columns = TableColumns.getColumns({ organization_id, view: 'player' });

  const handleClick = (player_id) => {
    dispatch(setLoading(true));
    startTransition(() => {
      router.push(`/${path}/player/${player_id}`);
    });
  };

  const rows: PlayerStatisticRanking[] = [];

  for (const player_statistic_ranking_id in player_statistic_rankings) {
    const row = player_statistic_rankings[player_statistic_ranking_id];

    if (!(row.player_id in players)) {
      continue;
    }

    const player = players[row.player_id];

    if (!player) {
      continue;
    }

    row.name = `${player.first_name.charAt(0)}. ${player.last_name}`;

    rows.push(row);
  }

  if (!rows.length && players && Object.keys(players).length) {
    for (const player_id in players) {
      const player = players[player_id];
      player.name = `${player.first_name.charAt(0)}. ${player.last_name}`;
      rows.push(player);
    }
  }

  const statDisplay = [
    {
      label: 'Overview',
      value: 'overview',
    },
    {
      label: 'Offensive',
      value: 'offensive',
    },
    {
      label: 'Defensive',
      value: 'defensive',
    },
  ];

  const statDisplayChips: React.JSX.Element[] = [];

  const handleView = (value: string) => {
    sessionStorage.setItem(`${path}.TEAM.ROSTER.VIEW`, value);
    setView(value);
  };

  for (let i = 0; i < statDisplay.length; i++) {
    statDisplayChips.push(
      <Chip
        key = {statDisplay[i].value}
        style = {{ margin: '5px 5px 10px 5px' }}
        filled = {view === statDisplay[i].value}
        value = {statDisplay[i].value}
        onClick = {() => { handleView(statDisplay[i].value); }}
        title = {statDisplay[i].label}
      />,
    );
  }


  const getDisplay = () => {
    if (player_statistic_rankings === null) {
      return (
        <Paper elevation = {3} style = {{ padding: 10 }}>
          <div>
            <Typography type = 'h5'><Skeleton /></Typography>
            <Typography type = 'h5'><Skeleton /></Typography>
            <Typography type = 'h5'><Skeleton /></Typography>
            <Typography type = 'h5'><Skeleton /></Typography>
            <Typography type = 'h5'><Skeleton /></Typography>
            <Typography type = 'h5'><Skeleton /></Typography>
            <Typography type = 'h5'><Skeleton /></Typography>
            <Typography type = 'h5'><Skeleton /></Typography>
            <Typography type = 'h5'><Skeleton /></Typography>
            <Typography type = 'h5'><Skeleton /></Typography>
            <Typography type = 'h5'><Skeleton /></Typography>
            <Typography type = 'h5'><Skeleton /></Typography>
          </div>
        </Paper>
      );
    }

    if (player_statistic_rankings !== null && Object.keys(players).length === 0) {
      return (
        <Typography style = {{ textAlign: 'center', margin: '10px 0px' }} type = 'h5'>No player data yet :(</Typography>
      );
    }

    return (
      <>
        <div style = {{ textAlign: 'center' }}>{statDisplayChips}</div>
        <div style = {{ padding: '0px 5px' }}>
          <RankTable
            rows={rows}
            columns={columns}
            displayColumns={getColumns()}
            rowKey = 'player_id'
            defaultSortOrder = 'asc'
            defaultSortOrderBy = 'minutes_per_game'
            sessionStorageKey = {`${path}.TEAM.ROSTER`}
            getRankSpanMax = {() => 5300}
            handleRowClick={handleClick}
           />
        </div>
      </>
    );
  };


  return (
    <div style = {{ paddingTop: 10 }}>
      {getDisplay()}
    </div>
  );
};


export default Roster;
