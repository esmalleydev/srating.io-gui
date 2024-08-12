import { useAppSelector } from '@/redux/hooks';
import HelperCBB from '@/components/helpers/CBB';


export interface rowDatatype {
  team_id: string;
  rank: number;
  ap_rank: number,
  name: string;
  wins: string;
  conf_record: string;
  confwins: number;
  conflosses: number;
  neutralwins: number;
  neutrallosses: number;
  homewins: number;
  homelosses: number;
  roadwins: number;
  roadlosses: number;
  streak: number;
  win_margin: number;
  loss_margin: number;
  confwin_margin: number;
  confloss_margin: number;
  conference_id: string;
  conference_code?: string;
  elo_rank: number;
  elo: number;
  // adj_elo: number;
  elo_sos: number;
  elo_sos_rank: number;
  kenpom_rank: number;
  srs_rank: number;
  net_rank: number;
  coaches_rank: number;
  field_goal: number;
  field_goal_attempts: number;
  field_goal_percentage: number;
  two_point_field_goal: number;
  two_point_field_goal_attempts: number;
  two_point_field_goal_percentage: number;
  three_point_field_goal: number;
  three_point_field_goal_attempts: number;
  three_point_field_goal_percentage: number;
  free_throws: number;
  free_throw_attempts: number;
  free_throw_percentage: number;
  offensive_rebounds: number;
  defensive_rebounds: number;
  total_rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  fouls: number;
  points: number;
  possessions: number;
  pace: number;
  offensive_rating: number;
  defensive_rating: number;
  efficiency_rating: number;
  adjusted_efficiency_rating: number;
  opponent_field_goal: number;
  opponent_field_goal_attempts: number;
  opponent_field_goal_percentage: number;
  opponent_two_point_field_goal: number;
  opponent_two_point_field_goal_attempts: number;
  opponent_two_point_field_goal_percentage: number;
  opponent_three_point_field_goal: number;
  opponent_three_point_field_goal_attempts: number;
  opponent_three_point_field_goal_percentage: number;
  opponent_free_throws: number;
  opponent_free_throw_attempts: number;
  opponent_free_throw_percentage: number;
  opponent_offensive_rebounds: number;
  opponent_defensive_rebounds: number;
  opponent_total_rebounds: number;
  opponent_assists: number;
  opponent_steals: number;
  opponent_blocks: number;
  opponent_turnovers: number;
  opponent_fouls: number;
  opponent_points: number;
  opponent_possessions: number;
  opponent_offensive_rating: number;
  opponent_defensive_rating: number;
  opponent_efficiency_rating: number;
  confwins_rank: number;
  conflosses_rank: number;
  neutralwins_rank: number;
  neutrallosses_rank: number;
  homewins_rank: number;
  homelosses_rank: number;
  roadwins_rank: number;
  roadlosses_rank: number;
  streak_rank: number;
  win_margin_rank: number;
  loss_margin_rank: number;
  confwin_margin_rank: number;
  confloss_margin_rank: number;
  field_goal_rank: number;
  field_goal_attempts_rank: number;
  field_goal_percentage_rank: number;
  two_point_field_goal_rank: number;
  two_point_field_goal_attempts_rank: number;
  two_point_field_goal_percentage_rank: number;
  three_point_field_goal_rank: number;
  three_point_field_goal_attempts_rank: number;
  three_point_field_goal_percentage_rank: number;
  free_throws_rank: number;
  free_throw_attempts_rank: number;
  free_throw_percentage_rank: number;
  offensive_rebounds_rank: number;
  defensive_rebounds_rank: number;
  total_rebounds_rank: number;
  assists_rank: number;
  steals_rank: number;
  blocks_rank: number;
  turnovers_rank: number;
  fouls_rank: number;
  points_rank: number;
  possessions_rank: number;
  pace_rank: number;
  offensive_rating_rank: number;
  defensive_rating_rank: number;
  efficiency_rating_rank: number;
  adjusted_efficiency_rating_rank: number;
  opponent_field_goal_rank: number;
  opponent_field_goal_attempts_rank: number;
  opponent_field_goal_percentage_rank: number;
  opponent_two_point_field_goal_rank: number;
  opponent_two_point_field_goal_attempts_rank: number;
  opponent_two_point_field_goal_percentage_rank: number;
  opponent_three_point_field_goal_rank: number;
  opponent_three_point_field_goal_attempts_rank: number;
  opponent_three_point_field_goal_percentage_rank: number;
  opponent_free_throws_rank: number;
  opponent_free_throw_attempts_rank: number;
  opponent_free_throw_percentage_rank: number;
  opponent_offensive_rebounds_rank: number;
  opponent_defensive_rebounds_rank: number;
  opponent_total_rebounds_rank: number;
  opponent_assists_rank: number;
  opponent_steals_rank: number;
  opponent_blocks_rank: number;
  opponent_turnovers_rank: number;
  opponent_fouls_rank: number;
  opponent_points_rank: number;
  opponent_possessions_rank: number;
  opponent_offensive_rating_rank: number;
  opponent_defensive_rating_rank: number;
  opponent_efficiency_rating_rank: number;
  committed?: boolean;
  committed_team_id?: string;
  committed_team_name?: string;
  committed_conference_id?: string;
  team_name?: string;
}

export const getRowsData = ({
  data, rankView, selectedConferences, positions, hideCommitted, hideUnderTwoMPG, filterCommittedConf, filterOriginalConf, season,
}) => {
  const rows: rowDatatype[] = [];
  let lastUpdated: string | null = null;

  const CBB = new HelperCBB();

  const conferences = useAppSelector((state) => state.dictionaryReducer.conference);

  for (const id in data) {
    const row = data[id];

    if (
      rankView !== 'transfer' &&
      selectedConferences.length &&
      selectedConferences.indexOf(row.conference_id) === -1
    ) {
      continue;
    }

    // if transfer and conference is not in original or new conf conference, remove them
    if (
      rankView === 'transfer' &&
      selectedConferences.length &&
      (
        (
          filterOriginalConf && filterCommittedConf && (selectedConferences.indexOf(row.conference_id) === -1 && selectedConferences.indexOf(row.committed_conference_id) === -1)
        ) ||
        (
          (!filterCommittedConf && filterOriginalConf && selectedConferences.indexOf(row.conference_id) === -1) || (!filterOriginalConf && filterCommittedConf && selectedConferences.indexOf(row.committed_conference_id) === -1)
        )
      )
    ) {
      continue;
    }


    // transfers
    if (hideCommitted && +row.committed === 1) {
      continue;
    }

    if (rankView === 'player' || rankView === 'transfer') {
      if (hideUnderTwoMPG && row.minutes_per_game < 2) {
        continue;
      }
    }

    if (rankView === 'team') {
      if (
        row.statistic_ranking &&
        (
          !lastUpdated ||
          lastUpdated < row.statistic_ranking.date_of_rank
        )
      ) {
        lastUpdated = row.statistic_ranking.date_of_rank;
      }

      const wins = (row.statistic_ranking && row.statistic_ranking.wins) || 0;
      const losses = (row.statistic_ranking && row.statistic_ranking.losses) || 0;
      const confwins = (row.statistic_ranking && row.statistic_ranking.confwins) || 0;
      const conflosses = (row.statistic_ranking && row.statistic_ranking.conflosses) || 0;

      rows.push({
        team_id: row.team_id,
        rank: (row.statistic_ranking && row.statistic_ranking.rank) || null,
        ap_rank: (row.statistic_ranking && row.statistic_ranking.ap_rank) || null,
        name: row.alt_name,
        wins: `${wins}-${losses}`,
        conf_record: `${confwins}-${conflosses}`,
        confwins: (row.statistic_ranking && row.statistic_ranking.confwins) || null,
        conflosses: (row.statistic_ranking && row.statistic_ranking.conflosses) || null,
        neutralwins: (row.statistic_ranking && row.statistic_ranking.neutralwins) || null,
        neutrallosses: (row.statistic_ranking && row.statistic_ranking.neutrallosses) || null,
        homewins: (row.statistic_ranking && row.statistic_ranking.homewins) || null,
        homelosses: (row.statistic_ranking && row.statistic_ranking.homelosses) || null,
        roadwins: (row.statistic_ranking && row.statistic_ranking.roadwins) || null,
        roadlosses: (row.statistic_ranking && row.statistic_ranking.roadlosses) || null,
        streak: (row.statistic_ranking && row.statistic_ranking.streak) || null,
        win_margin: (row.statistic_ranking && row.statistic_ranking.win_margin) || null,
        loss_margin: (row.statistic_ranking && row.statistic_ranking.loss_margin) || null,
        confwin_margin: (row.statistic_ranking && row.statistic_ranking.confwin_margin) || null,
        confloss_margin: (row.statistic_ranking && row.statistic_ranking.confloss_margin) || null,
        conference_id: row.conference_id,
        conference_code: (row.conference_id && row.conference_id in conferences) ? conferences[row.conference_id].code : 'Unknown',
        elo_rank: (row.statistic_ranking && row.statistic_ranking.elo_rank) || null,
        elo: row.elo,
        // 'adj_elo': +(+row.elo - +(row.statistic_ranking && row.statistic_ranking.elo_sos)).toFixed(2),
        kenpom_rank: (row.statistic_ranking && row.statistic_ranking.kenpom_rank) || null,
        srs_rank: (row.statistic_ranking && row.statistic_ranking.srs_rank) || null,
        net_rank: (row.statistic_ranking && row.statistic_ranking.net_rank) || null,
        coaches_rank: (row.statistic_ranking && row.statistic_ranking.coaches_rank) || null,
        field_goal: (row.statistic_ranking && row.statistic_ranking.field_goal) || null,
        field_goal_attempts: (row.statistic_ranking && row.statistic_ranking.field_goal_attempts) || null,
        field_goal_percentage: (row.statistic_ranking && row.statistic_ranking.field_goal_percentage) || null,
        two_point_field_goal: (row.statistic_ranking && row.statistic_ranking.two_point_field_goal) || null,
        two_point_field_goal_attempts: (row.statistic_ranking && row.statistic_ranking.two_point_field_goal_attempts) || null,
        two_point_field_goal_percentage: (row.statistic_ranking && row.statistic_ranking.two_point_field_goal_percentage) || null,
        three_point_field_goal: (row.statistic_ranking && row.statistic_ranking.three_point_field_goal) || null,
        three_point_field_goal_attempts: (row.statistic_ranking && row.statistic_ranking.three_point_field_goal_attempts) || null,
        three_point_field_goal_percentage: (row.statistic_ranking && row.statistic_ranking.three_point_field_goal_percentage) || null,
        free_throws: (row.statistic_ranking && row.statistic_ranking.free_throws) || null,
        free_throw_attempts: (row.statistic_ranking && row.statistic_ranking.free_throw_attempts) || null,
        free_throw_percentage: (row.statistic_ranking && row.statistic_ranking.free_throw_percentage) || null,
        offensive_rebounds: (row.statistic_ranking && row.statistic_ranking.offensive_rebounds) || null,
        defensive_rebounds: (row.statistic_ranking && row.statistic_ranking.defensive_rebounds) || null,
        total_rebounds: (row.statistic_ranking && row.statistic_ranking.total_rebounds) || null,
        assists: (row.statistic_ranking && row.statistic_ranking.assists) || null,
        steals: (row.statistic_ranking && row.statistic_ranking.steals) || null,
        blocks: (row.statistic_ranking && row.statistic_ranking.blocks) || null,
        turnovers: (row.statistic_ranking && row.statistic_ranking.turnovers) || null,
        fouls: (row.statistic_ranking && row.statistic_ranking.fouls) || null,
        points: (row.statistic_ranking && row.statistic_ranking.points) || null,
        possessions: (row.statistic_ranking && row.statistic_ranking.possessions) || null,
        pace: (row.statistic_ranking && row.statistic_ranking.pace) || null,
        offensive_rating: (row.statistic_ranking && row.statistic_ranking.offensive_rating) || null,
        defensive_rating: (row.statistic_ranking && row.statistic_ranking.defensive_rating) || null,
        efficiency_rating: (row.statistic_ranking && row.statistic_ranking.efficiency_rating) || null,
        adjusted_efficiency_rating: (row.statistic_ranking && row.statistic_ranking.adjusted_efficiency_rating) || null,
        opponent_field_goal: (row.statistic_ranking && row.statistic_ranking.opponent_field_goal) || null,
        opponent_field_goal_attempts: (row.statistic_ranking && row.statistic_ranking.opponent_field_goal_attempts) || null,
        opponent_field_goal_percentage: (row.statistic_ranking && row.statistic_ranking.opponent_field_goal_percentage) || null,
        opponent_two_point_field_goal: (row.statistic_ranking && row.statistic_ranking.opponent_two_point_field_goal) || null,
        opponent_two_point_field_goal_attempts: (row.statistic_ranking && row.statistic_ranking.opponent_two_point_field_goal_attempts) || null,
        opponent_two_point_field_goal_percentage: (row.statistic_ranking && row.statistic_ranking.opponent_two_point_field_goal_percentage) || null,
        opponent_three_point_field_goal: (row.statistic_ranking && row.statistic_ranking.opponent_three_point_field_goal) || null,
        opponent_three_point_field_goal_attempts: (row.statistic_ranking && row.statistic_ranking.opponent_three_point_field_goal_attempts) || null,
        opponent_three_point_field_goal_percentage: (row.statistic_ranking && row.statistic_ranking.opponent_three_point_field_goal_percentage) || null,
        opponent_free_throws: (row.statistic_ranking && row.statistic_ranking.opponent_free_throws) || null,
        opponent_free_throw_attempts: (row.statistic_ranking && row.statistic_ranking.opponent_free_throw_attempts) || null,
        opponent_free_throw_percentage: (row.statistic_ranking && row.statistic_ranking.opponent_free_throw_percentage) || null,
        opponent_offensive_rebounds: (row.statistic_ranking && row.statistic_ranking.opponent_offensive_rebounds) || null,
        opponent_defensive_rebounds: (row.statistic_ranking && row.statistic_ranking.opponent_defensive_rebounds) || null,
        opponent_total_rebounds: (row.statistic_ranking && row.statistic_ranking.opponent_total_rebounds) || null,
        opponent_assists: (row.statistic_ranking && row.statistic_ranking.opponent_assists) || null,
        opponent_steals: (row.statistic_ranking && row.statistic_ranking.opponent_steals) || null,
        opponent_blocks: (row.statistic_ranking && row.statistic_ranking.opponent_blocks) || null,
        opponent_turnovers: (row.statistic_ranking && row.statistic_ranking.opponent_turnovers) || null,
        opponent_fouls: (row.statistic_ranking && row.statistic_ranking.opponent_fouls) || null,
        opponent_points: (row.statistic_ranking && row.statistic_ranking.opponent_points) || null,
        opponent_possessions: (row.statistic_ranking && row.statistic_ranking.opponent_possessions) || null,
        opponent_offensive_rating: (row.statistic_ranking && row.statistic_ranking.opponent_offensive_rating) || null,
        opponent_defensive_rating: (row.statistic_ranking && row.statistic_ranking.opponent_defensive_rating) || null,
        opponent_efficiency_rating: (row.statistic_ranking && row.statistic_ranking.opponent_efficiency_rating) || null, // this is aSOS in the gui
        elo_sos: (row.statistic_ranking && row.statistic_ranking.elo_sos) || null, // this is eSoS
        confwins_rank: (row.statistic_ranking && row.statistic_ranking.confwins_rank) || null,
        conflosses_rank: (row.statistic_ranking && row.statistic_ranking.conflosses_rank) || null,
        neutralwins_rank: (row.statistic_ranking && row.statistic_ranking.neutralwins_rank) || null,
        neutrallosses_rank: (row.statistic_ranking && row.statistic_ranking.neutrallosses_rank) || null,
        homewins_rank: (row.statistic_ranking && row.statistic_ranking.homewins_rank) || null,
        homelosses_rank: (row.statistic_ranking && row.statistic_ranking.homelosses_rank) || null,
        roadwins_rank: (row.statistic_ranking && row.statistic_ranking.roadwins_rank) || null,
        roadlosses_rank: (row.statistic_ranking && row.statistic_ranking.roadlosses_rank) || null,
        streak_rank: (row.statistic_ranking && row.statistic_ranking.streak_rank) || null,
        win_margin_rank: (row.statistic_ranking && row.statistic_ranking.win_margin_rank) || null,
        loss_margin_rank: (row.statistic_ranking && row.statistic_ranking.loss_margin_rank) || null,
        confwin_margin_rank: (row.statistic_ranking && row.statistic_ranking.confwin_margin_rank) || null,
        confloss_margin_rank: (row.statistic_ranking && row.statistic_ranking.confloss_margin_rank) || null,
        field_goal_rank: (row.statistic_ranking && row.statistic_ranking.field_goal_rank) || null,
        field_goal_attempts_rank: (row.statistic_ranking && row.statistic_ranking.field_goal_attempts_rank) || null,
        field_goal_percentage_rank: (row.statistic_ranking && row.statistic_ranking.field_goal_percentage_rank) || null,
        two_point_field_goal_rank: (row.statistic_ranking && row.statistic_ranking.two_point_field_goal_rank) || null,
        two_point_field_goal_attempts_rank: (row.statistic_ranking && row.statistic_ranking.two_point_field_goal_attempts_rank) || null,
        two_point_field_goal_percentage_rank: (row.statistic_ranking && row.statistic_ranking.two_point_field_goal_percentage_rank) || null,
        three_point_field_goal_rank: (row.statistic_ranking && row.statistic_ranking.three_point_field_goal_rank) || null,
        three_point_field_goal_attempts_rank: (row.statistic_ranking && row.statistic_ranking.three_point_field_goal_attempts_rank) || null,
        three_point_field_goal_percentage_rank: (row.statistic_ranking && row.statistic_ranking.three_point_field_goal_percentage_rank) || null,
        free_throws_rank: (row.statistic_ranking && row.statistic_ranking.free_throws_rank) || null,
        free_throw_attempts_rank: (row.statistic_ranking && row.statistic_ranking.free_throw_attempts_rank) || null,
        free_throw_percentage_rank: (row.statistic_ranking && row.statistic_ranking.free_throw_percentage_rank) || null,
        offensive_rebounds_rank: (row.statistic_ranking && row.statistic_ranking.offensive_rebounds_rank) || null,
        defensive_rebounds_rank: (row.statistic_ranking && row.statistic_ranking.defensive_rebounds_rank) || null,
        total_rebounds_rank: (row.statistic_ranking && row.statistic_ranking.total_rebounds_rank) || null,
        assists_rank: (row.statistic_ranking && row.statistic_ranking.assists_rank) || null,
        steals_rank: (row.statistic_ranking && row.statistic_ranking.steals_rank) || null,
        blocks_rank: (row.statistic_ranking && row.statistic_ranking.blocks_rank) || null,
        turnovers_rank: (row.statistic_ranking && row.statistic_ranking.turnovers_rank) || null,
        fouls_rank: (row.statistic_ranking && row.statistic_ranking.fouls_rank) || null,
        points_rank: (row.statistic_ranking && row.statistic_ranking.points_rank) || null,
        possessions_rank: (row.statistic_ranking && row.statistic_ranking.possessions_rank) || null,
        pace_rank: (row.statistic_ranking && row.statistic_ranking.pace_rank) || null,
        offensive_rating_rank: (row.statistic_ranking && row.statistic_ranking.offensive_rating_rank) || null,
        defensive_rating_rank: (row.statistic_ranking && row.statistic_ranking.defensive_rating_rank) || null,
        efficiency_rating_rank: (row.statistic_ranking && row.statistic_ranking.efficiency_rating_rank) || null,
        adjusted_efficiency_rating_rank: (row.statistic_ranking && row.statistic_ranking.adjusted_efficiency_rating_rank) || null,
        opponent_field_goal_rank: (row.statistic_ranking && row.statistic_ranking.opponent_field_goal_rank) || null,
        opponent_field_goal_attempts_rank: (row.statistic_ranking && row.statistic_ranking.opponent_field_goal_attempts_rank) || null,
        opponent_field_goal_percentage_rank: (row.statistic_ranking && row.statistic_ranking.opponent_field_goal_percentage_rank) || null,
        opponent_two_point_field_goal_rank: (row.statistic_ranking && row.statistic_ranking.opponent_two_point_field_goal_rank) || null,
        opponent_two_point_field_goal_attempts_rank: (row.statistic_ranking && row.statistic_ranking.opponent_two_point_field_goal_attempts_rank) || null,
        opponent_two_point_field_goal_percentage_rank: (row.statistic_ranking && row.statistic_ranking.opponent_two_point_field_goal_percentage_rank) || null,
        opponent_three_point_field_goal_rank: (row.statistic_ranking && row.statistic_ranking.opponent_three_point_field_goal_rank) || null,
        opponent_three_point_field_goal_attempts_rank: (row.statistic_ranking && row.statistic_ranking.opponent_three_point_field_goal_attempts_rank) || null,
        opponent_three_point_field_goal_percentage_rank: (row.statistic_ranking && row.statistic_ranking.opponent_three_point_field_goal_percentage_rank) || null,
        opponent_free_throws_rank: (row.statistic_ranking && row.statistic_ranking.opponent_free_throws_rank) || null,
        opponent_free_throw_attempts_rank: (row.statistic_ranking && row.statistic_ranking.opponent_free_throw_attempts_rank) || null,
        opponent_free_throw_percentage_rank: (row.statistic_ranking && row.statistic_ranking.opponent_free_throw_percentage_rank) || null,
        opponent_offensive_rebounds_rank: (row.statistic_ranking && row.statistic_ranking.opponent_offensive_rebounds_rank) || null,
        opponent_defensive_rebounds_rank: (row.statistic_ranking && row.statistic_ranking.opponent_defensive_rebounds_rank) || null,
        opponent_total_rebounds_rank: (row.statistic_ranking && row.statistic_ranking.opponent_total_rebounds_rank) || null,
        opponent_assists_rank: (row.statistic_ranking && row.statistic_ranking.opponent_assists_rank) || null,
        opponent_steals_rank: (row.statistic_ranking && row.statistic_ranking.opponent_steals_rank) || null,
        opponent_blocks_rank: (row.statistic_ranking && row.statistic_ranking.opponent_blocks_rank) || null,
        opponent_turnovers_rank: (row.statistic_ranking && row.statistic_ranking.opponent_turnovers_rank) || null,
        opponent_fouls_rank: (row.statistic_ranking && row.statistic_ranking.opponent_fouls_rank) || null,
        opponent_points_rank: (row.statistic_ranking && row.statistic_ranking.opponent_points_rank) || null,
        opponent_possessions_rank: (row.statistic_ranking && row.statistic_ranking.opponent_possessions_rank) || null,
        opponent_offensive_rating_rank: (row.statistic_ranking && row.statistic_ranking.opponent_offensive_rating_rank) || null,
        opponent_defensive_rating_rank: (row.statistic_ranking && row.statistic_ranking.opponent_defensive_rating_rank) || null,
        opponent_efficiency_rating_rank: (row.statistic_ranking && row.statistic_ranking.opponent_efficiency_rating_rank) || null,
        elo_sos_rank: (row.statistic_ranking && row.statistic_ranking.elo_sos_rank) || null,
      });
    } else if (rankView === 'player' || rankView === 'transfer') {
      if (
        !lastUpdated ||
        lastUpdated < row.date_of_rank
      ) {
        lastUpdated = row.date_of_rank;
      }

      row.name = row.player ? (`${row.player.first_name.charAt(0)}. ${row.player.last_name}`) : null;
      row.number = row.player ? row.player.number : null;
      row.position = row.player ? row.player.position : null;
      row.height = row.player ? row.player.height : null;

      if (row.conference_id && row.conference_id in conferences) {
        row.conference_code = conferences[row.conference_id].code;
      }

      row.rank = row.efficiency_rating_rank;

      if (
        positions.length &&
        positions.indexOf(row.position) === -1
      ) {
        continue;
      }

      rows.push(row);
    } else if (rankView === 'conference') {
      if (
        !lastUpdated ||
        lastUpdated < row.date_of_rank
      ) {
        lastUpdated = row.date_of_rank;
      }
      row.name = conferences[row.conference_id].code;
      row.rank = row.adjusted_efficiency_rating_rank;

      // row.adj_elo = +(+row.elo - +row.elo_sos).toFixed(2);

      rows.push(row);
    } else if (rankView === 'coach') {
      if (
        !lastUpdated ||
        lastUpdated < row.date_of_rank
      ) {
        lastUpdated = row.date_of_rank;
      }

      rows.push(row);
    }
  }

  return { rows, lastUpdated };
};
