'use client';

import React, { useState } from 'react';

import { useAppSelector } from '@/redux/hooks';
import { LinearProgress } from '@mui/material';
import { getHeaderHeight } from '../../Header/ClientWrapper';
import { getNavHeaderHeight } from '../../NavBar';
import { footerNavigationHeight } from '@/components/generic/FooterNavigation';
import { headerBarHeight } from '@/components/generic/Header';
import RankTable from '@/components/generic/RankTable';
import HelperTeam from '@/components/helpers/Team';
import Organization from '@/components/helpers/Organization';
import { PlayerStatisticRanking } from '@/types/cbb';
import Typography from '@/components/ux/text/Typography';
import Chip from '@/components/ux/container/Chip';
import TableColumns from '@/components/helpers/TableColumns';
import Objector from '@/components/utils/Objector';
import Navigation from '@/components/helpers/Navigation';


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
  const paddingTop = getHeaderHeight() + getNavHeaderHeight();

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

const Client = ({ player_statistic_rankings, players }) => {
  // console.time('Player.Client')
  // console.time('Player.Client.logic')
  const organization_id = useAppSelector((state) => state.organizationReducer.organization_id);
  const organizations = useAppSelector((state) => state.dictionaryReducer.organization);
  const path = Organization.getPath({ organizations, organization_id });
  const sessionStorageKey = `${path}.COMPARE.PLAYER`;
  const [view, setView] = useState<string | null>('overview');
  const teams = useAppSelector((state) => state.compareReducer.teams);
  const hideLowerBench = useAppSelector((state) => state.compareReducer.hideLowerBench);
  const topPlayersOnly = useAppSelector((state) => state.compareReducer.topPlayersOnly);

  const navigation = new Navigation();

  // useEffect(() => {
  //   console.timeEnd('Player.Client')
  // })

  const guards: string[] = [];
  const forwards: string[] = [];
  const centers: string[] = [];
  let topPlayers: string[] = [];
  const player_id_x_stats = {};
  const team_id_x_stats = {};

  for (const player_id in players) {
    const player = players[player_id];

    if (player.position === 'F') {
      forwards.push(player_id);
    }
    if (player.position === 'C') {
      centers.push(player_id);
    }
    if (player.position === 'G') {
      guards.push(player_id);
    }
  }

  for (const player_statistic_ranking_id in player_statistic_rankings) {
    const row = player_statistic_rankings[player_statistic_ranking_id];

    if (!(row.team_id in team_id_x_stats)) {
      team_id_x_stats[row.team_id] = [];
    }

    if (!(row.player_id in players)) {
      continue;
    }

    row.height = players[row.player_id].height;
    team_id_x_stats[row.team_id].push(row);
    player_id_x_stats[row.player_id] = row;
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

  const handleClick = (player_id: string) => {
    navigation.player(`/${path}/player/${player_id}`);
  };


  const headCells = Objector.deepClone(TableColumns.getColumns({ organization_id, view: 'player' }));

  headCells.team_name.sticky = true;
  headCells.team_name.widths = {
    default: 50,
    425: 45,
  };

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
        style = {{ margin: '5px 5px 10px 5px' }}
        filled = {view === statDisplay[i].value}
        value = {statDisplay[i].value }
        onClick = {() => { handleView(statDisplay[i].value); }}
        title = {statDisplay[i].label}
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
        getRankSpanMax = {() => 5300} // todo update when implementing CFB compare tool
        handleRowClick={handleClick}
      />
    );
  };

  // console.timeEnd('Player.Client.logic')
  return (
    <Contents>
      <div style = {{ display: 'flex', justifyContent: 'center' }}>
        {statDisplayChips}
      </div>
      {
        topPlayersOnly ?
          <>
            <Typography type='h6'>Each team top 6 MPG</Typography>
            {getTable(topPlayers)}
          </> :
          <>
            {
            guards.length ?
              <>
              <Typography type='h6'>Guards</Typography>
              {getTable(guards)}
              </>
              : ''
            }
            {
            forwards.length ?
              <>
              <Typography type='h6'>Forwards</Typography>
              {getTable(forwards)}
              </>
              : ''
            }
            {
            centers.length ?
              <>
              <Typography type='h6'>Centers</Typography>
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
