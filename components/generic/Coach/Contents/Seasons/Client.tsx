'use client';

import HelperTeam from '@/components/helpers/Team';
import { useAppSelector } from '@/redux/hooks';
import CBB from '@/components/helpers/CBB';
import Organization from '@/components/helpers/Organization';
import CFB from '@/components/helpers/CFB';
import RankTable from '@/components/generic/RankTable';
import TableColumns from '@/components/helpers/TableColumns';
import Navigation from '@/components/helpers/Navigation';



const Client = ({ organization_id, division_id, coach_team_seasons, teams, statistic_rankings }) => {
  const navigation = new Navigation();

  const organizations = useAppSelector((state) => state.dictionaryReducer.organization);
  const path = Organization.getPath({ organizations, organization_id });
  const sessionStorageKey = `${path}.COACH.SEASONS`;

  const rows: any = [];

  const team_id_x_season_x_statistic_ranking = {};

  for (const statistic_ranking_id in statistic_rankings) {
    const row = statistic_rankings[statistic_ranking_id];

    if (!(row.team_id in team_id_x_season_x_statistic_ranking)) {
      team_id_x_season_x_statistic_ranking[row.team_id] = {};
    }

    team_id_x_season_x_statistic_ranking[row.team_id][row.season] = row;
  }

  for (const coach_team_season_id in coach_team_seasons) {
    const coach_team_season = coach_team_seasons[coach_team_season_id];

    const row: any = {
      coach_team_season_id,
      season: coach_team_season.season,
      team_id: coach_team_season.team_id,
    };

    if (coach_team_season.team_id in teams) {
      const teamHelper = new HelperTeam({ team: teams[row.team_id] });
      row.name = teamHelper.getName();
    }

    if (
      coach_team_season.team_id in team_id_x_season_x_statistic_ranking &&
      coach_team_season.season in team_id_x_season_x_statistic_ranking[coach_team_season.team_id]
    ) {
      const stats = team_id_x_season_x_statistic_ranking[coach_team_season.team_id][coach_team_season.season];

      row.record = `${stats.wins || 0} - ${stats.losses || 0}`;
      row.conf_record = (stats.confwins === null || stats.conflosses === null) ? '-' : `${stats.confwins || 0} - ${stats.conflosses || 0}`;

      Object.assign(row, stats);
    }

    rows.push(row);
  }


  // starting elo, ending elo?
  const getColumns = () => {
    if (organization_id === Organization.getCFBID()) {
      return ['season', 'name', 'record', 'conf_record', 'points', 'passing_rating_college', 'yards_per_play', 'points_per_play'];
    }
    return ['season', 'name', 'record', 'conf_record', 'adjusted_efficiency_rating', 'offensive_rating', 'defensive_rating'];
  };

  const columns = TableColumns.getColumns({ organization_id, view: 'team' });

  columns.season = {
    id: 'season',
    numeric: true,
    label: 'Season',
    tooltip: 'Season',
    sort: 'higher',
    sticky: true,
    organization_ids: [],
    views: [],
    graphable: false,
    widths: {
      default: 70,
    },
  };

  const handleClick = (coach_team_season_id: string) => {
    const coach_team_season = coach_team_seasons[coach_team_season_id];
    navigation.team(`/${path}/team/${coach_team_season.team_id}?season=${coach_team_season.season}`);
  };

  const getRankSpanMax = (row) => {
    let numberOfTeams = CBB.getNumberOfD1Teams(row.season);

    if (organization_id === Organization.getCFBID()) {
      numberOfTeams = CFB.getNumberOfTeams({ division_id, season: row.season });
    }

    return numberOfTeams;
  };


  return (
    <div style = {{ padding: '0px 5px 20px 5px', textAlign: 'center' }}>
      <RankTable
        rows={rows}
        columns={columns}
        displayColumns={getColumns()}
        rowKey = 'coach_team_season_id'
        defaultSortOrder = 'asc'
        defaultSortOrderBy = 'season'
        defaultEmpty = '-'
        sessionStorageKey = {sessionStorageKey}
        getRankSpanMax={getRankSpanMax}
        handleRowClick={handleClick}
      />
    </div>
  );
};

export default Client;
