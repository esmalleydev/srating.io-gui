'use client';

import { useState } from 'react';

import CBB from '@/components/helpers/CBB';
import Organization from '@/components/helpers/Organization';
import CFB from '@/components/helpers/CFB';
import RankTable from '@/components/generic/RankTable';
import HelperTeam from '@/components/helpers/Team';
import { Dimensions, useWindowDimensions } from '@/components/hooks/useWindowDimensions';
import { CBBRankingTable } from '@/types/cbb';
import { CFBRankingTable } from '@/types/cfb';
import Chip from '@/components/ux/container/Chip';
import TableColumns from '@/components/helpers/TableColumns';



const TableView = ({ organization_id, division_id, teams, season }) => {
  const sessionStorageKey = 'CBB.COMPARE.TEAM';
  const breakPoint = 425;
  const { width } = useWindowDimensions() as Dimensions;
  let numberOfTeams = CBB.getNumberOfD1Teams(season);

  if (organization_id === Organization.getCFBID()) {
    numberOfTeams = CFB.getNumberOfTeams({ division_id, season });
  }

  const [view, setView] = useState<string | null>('overview');

  const getColumns = () => {
    if (view === 'overview') {
      return ['rank', 'name', 'record', 'conf_record', 'elo', 'adjusted_efficiency_rating', 'elo_sos', 'offensive_rating', 'defensive_rating', 'opponent_efficiency_rating', 'streak'];
    } if (view === 'offensive') {
      return ['rank', 'name', 'offensive_rating', 'points', 'field_goal_percentage', 'two_point_field_goal_percentage', 'three_point_field_goal_percentage', 'free_throw_percentage', 'offensive_rebounds', 'assists', 'turnovers', 'possessions', 'pace'];
    } if (view === 'defensive') {
      return ['rank', 'name', 'defensive_rating', 'defensive_rebounds', 'steals', 'blocks', 'opponent_points', 'opponent_field_goal_percentage', 'opponent_two_point_field_goal_percentage', 'opponent_three_point_field_goal_percentage', 'fouls'];
    }
    return [];
  };


  const headCells = TableColumns.getColumns({ organization_id: Organization.getCBBID(), view: 'team' });

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
        value = {statDisplay[i].value}
        onClick = {() => { handleView(statDisplay[i].value); }}
        title = {statDisplay[i].label}
      />,
    );
  }

  // todo TS
  const rows: CBBRankingTable[] | CFBRankingTable[] = [];

  for (const team_id in teams) {
    const data = { ...teams[team_id].stats, ...teams[team_id].rankings };
    data.elo = teams[team_id].elo ? teams[team_id].elo.elo : 0;
    data.record = `${teams[team_id].stats.wins}-${teams[team_id].stats.losses}`;
    data.conf_record = `${teams[team_id].stats.confwins}-${teams[team_id].stats.conflosses}`;

    const teamHelper = new HelperTeam({ team: teams[team_id] });
    data.name = teamHelper.getNameShort();

    rows.push(data);
  }

  let stickyWidths = [50];
  if (width <= breakPoint) {
    stickyWidths = [40];
  }

  stickyWidths.push(50);

  return (
    <div style = {{ padding: '0px 5px 20px 5px', textAlign: 'center' }}>
      <div style = {{ display: 'flex', justifyContent: 'center' }}>
        {statDisplayChips}
      </div>
        <RankTable
          rows={rows}
          columns={headCells}
          displayColumns={getColumns()}
          rowKey = 'team_id'
          defaultSortOrder = 'asc'
          defaultSortOrderBy = 'rank'
          sessionStorageKey = {sessionStorageKey}
          stickyWidths={stickyWidths}
          numberOfStickyColumns = {2}
          getRankSpanMax = {() => numberOfTeams}
        />
    </div>
  );
};

export default TableView;
