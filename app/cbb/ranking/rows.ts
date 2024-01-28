

interface rowDatatype {
  team_id: string;
  composite_rank: number;
  ap_rank: number,
  name: string;
  wins: string;
  conf_record: string;
  conf: string;
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
};

export const getRowsData = ({ data, rankView, conferences, positions }) => {
  let rows: rowDatatype[] = [];
  let lastUpdated: string | null = null;

  for (let id in data) {
    let row = data[id];

    if (
      conferences.length &&
      conferences.indexOf(row.conference) === -1
    ) {
      continue;
    }

    if (rankView === 'team') {
      if (
        row.last_ranking &&
        (
          !lastUpdated ||
          lastUpdated < row.last_ranking.date_of_rank
        )
      ) {
        lastUpdated = row.last_ranking.date_of_rank;
      }

      const wins = (row.cbb_statistic_ranking && row.cbb_statistic_ranking.wins) || 0;
      const losses = (row.cbb_statistic_ranking && row.cbb_statistic_ranking.losses) || 0;
      const confwins = (row.cbb_statistic_ranking && row.cbb_statistic_ranking.confwins) || 0;
      const conflosses = (row.cbb_statistic_ranking && row.cbb_statistic_ranking.conflosses) || 0;

      rows.push({
        'team_id': row.team_id,
        'composite_rank': (row.last_ranking && row.last_ranking.composite_rank) || null,
        'ap_rank': (row.last_ranking && row.last_ranking.ap_rank) || null,
        'name': row.alt_name,
        'wins': wins + '-' + losses,
        'conf_record': confwins + '-' + conflosses,
        'conf': row.conference,
        'elo_rank': (row.last_ranking && row.last_ranking.elo_rank) || null,
        'elo': row.elo,
        // 'adj_elo': +(+row.elo - +(row.cbb_statistic_ranking && row.cbb_statistic_ranking.elo_sos)).toFixed(2),
        'kenpom_rank': (row.last_ranking && row.last_ranking.kenpom_rank) || null,
        'srs_rank': (row.last_ranking && row.last_ranking.srs_rank) || null,
        'net_rank': (row.last_ranking && row.last_ranking.net_rank) || null,
        'coaches_rank': (row.last_ranking && row.last_ranking.coaches_rank) || null,
        'field_goal': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.field_goal) || null,
        'field_goal_attempts': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.field_goal_attempts) || null,
        'field_goal_percentage': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.field_goal_percentage) || null,
        'two_point_field_goal': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.two_point_field_goal) || null,
        'two_point_field_goal_attempts': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.two_point_field_goal_attempts) || null,
        'two_point_field_goal_percentage': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.two_point_field_goal_percentage) || null,
        'three_point_field_goal': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.three_point_field_goal) || null,
        'three_point_field_goal_attempts': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.three_point_field_goal_attempts) || null,
        'three_point_field_goal_percentage': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.three_point_field_goal_percentage) || null,
        'free_throws': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.free_throws) || null,
        'free_throw_attempts': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.free_throw_attempts) || null,
        'free_throw_percentage': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.free_throw_percentage) || null,
        'offensive_rebounds': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.offensive_rebounds) || null,
        'defensive_rebounds': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.defensive_rebounds) || null,
        'total_rebounds': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.total_rebounds) || null,
        'assists': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.assists) || null,
        'steals': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.steals) || null,
        'blocks': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.blocks) || null,
        'turnovers': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.turnovers) || null,
        'fouls': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.fouls) || null,
        'points': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.points) || null,
        'possessions': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.possessions) || null,
        'pace': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.pace) || null,
        'offensive_rating': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.offensive_rating) || null,
        'defensive_rating': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.defensive_rating) || null,
        'efficiency_rating': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.efficiency_rating) || null,
        'adjusted_efficiency_rating': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.adjusted_efficiency_rating) || null,
        'opponent_field_goal': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_field_goal) || null,
        'opponent_field_goal_attempts': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_field_goal_attempts) || null,
        'opponent_field_goal_percentage': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_field_goal_percentage) || null,
        'opponent_two_point_field_goal': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_two_point_field_goal) || null,
        'opponent_two_point_field_goal_attempts': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_two_point_field_goal_attempts) || null,
        'opponent_two_point_field_goal_percentage': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_two_point_field_goal_percentage) || null,
        'opponent_three_point_field_goal': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_three_point_field_goal) || null,
        'opponent_three_point_field_goal_attempts': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_three_point_field_goal_attempts) || null,
        'opponent_three_point_field_goal_percentage': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_three_point_field_goal_percentage) || null,
        'opponent_free_throws': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_free_throws) || null,
        'opponent_free_throw_attempts': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_free_throw_attempts) || null,
        'opponent_free_throw_percentage': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_free_throw_percentage) || null,
        'opponent_offensive_rebounds': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_offensive_rebounds) || null,
        'opponent_defensive_rebounds': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_defensive_rebounds) || null,
        'opponent_total_rebounds': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_total_rebounds) || null,
        'opponent_assists': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_assists) || null,
        'opponent_steals': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_steals) || null,
        'opponent_blocks': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_blocks) || null,
        'opponent_turnovers': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_turnovers) || null,
        'opponent_fouls': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_fouls) || null,
        'opponent_points': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_points) || null,
        'opponent_possessions': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_possessions) || null,
        'opponent_offensive_rating': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_offensive_rating) || null,
        'opponent_defensive_rating': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_defensive_rating) || null,
        'opponent_efficiency_rating': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_efficiency_rating) || null, // this is aSOS in the gui
        'elo_sos': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.elo_sos) || null, // this is eSoS
        'field_goal_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.field_goal_rank) || null,
        'field_goal_attempts_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.field_goal_attempts_rank) || null,
        'field_goal_percentage_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.field_goal_percentage_rank) || null,
        'two_point_field_goal_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.two_point_field_goal_rank) || null,
        'two_point_field_goal_attempts_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.two_point_field_goal_attempts_rank) || null,
        'two_point_field_goal_percentage_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.two_point_field_goal_percentage_rank) || null,
        'three_point_field_goal_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.three_point_field_goal_rank) || null,
        'three_point_field_goal_attempts_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.three_point_field_goal_attempts_rank) || null,
        'three_point_field_goal_percentage_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.three_point_field_goal_percentage_rank) || null,
        'free_throws_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.free_throws_rank) || null,
        'free_throw_attempts_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.free_throw_attempts_rank) || null,
        'free_throw_percentage_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.free_throw_percentage_rank) || null,
        'offensive_rebounds_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.offensive_rebounds_rank) || null,
        'defensive_rebounds_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.defensive_rebounds_rank) || null,
        'total_rebounds_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.total_rebounds_rank) || null,
        'assists_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.assists_rank) || null,
        'steals_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.steals_rank) || null,
        'blocks_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.blocks_rank) || null,
        'turnovers_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.turnovers_rank) || null,
        'fouls_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.fouls_rank) || null,
        'points_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.points_rank) || null,
        'possessions_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.possessions_rank) || null,
        'pace_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.pace_rank) || null,
        'offensive_rating_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.offensive_rating_rank) || null,
        'defensive_rating_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.defensive_rating_rank) || null,
        'efficiency_rating_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.efficiency_rating_rank) || null,
        'adjusted_efficiency_rating_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.adjusted_efficiency_rating_rank) || null,
        'opponent_field_goal_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_field_goal_rank) || null,
        'opponent_field_goal_attempts_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_field_goal_attempts_rank) || null,
        'opponent_field_goal_percentage_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_field_goal_percentage_rank) || null,
        'opponent_two_point_field_goal_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_two_point_field_goal_rank) || null,
        'opponent_two_point_field_goal_attempts_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_two_point_field_goal_attempts_rank) || null,
        'opponent_two_point_field_goal_percentage_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_two_point_field_goal_percentage_rank) || null,
        'opponent_three_point_field_goal_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_three_point_field_goal_rank) || null,
        'opponent_three_point_field_goal_attempts_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_three_point_field_goal_attempts_rank) || null,
        'opponent_three_point_field_goal_percentage_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_three_point_field_goal_percentage_rank) || null,
        'opponent_free_throws_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_free_throws_rank) || null,
        'opponent_free_throw_attempts_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_free_throw_attempts_rank) || null,
        'opponent_free_throw_percentage_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_free_throw_percentage_rank) || null,
        'opponent_offensive_rebounds_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_offensive_rebounds_rank) || null,
        'opponent_defensive_rebounds_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_defensive_rebounds_rank) || null,
        'opponent_total_rebounds_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_total_rebounds_rank) || null,
        'opponent_assists_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_assists_rank) || null,
        'opponent_steals_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_steals_rank) || null,
        'opponent_blocks_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_blocks_rank) || null,
        'opponent_turnovers_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_turnovers_rank) || null,
        'opponent_fouls_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_fouls_rank) || null,
        'opponent_points_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_points_rank) || null,
        'opponent_possessions_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_possessions_rank) || null,
        'opponent_offensive_rating_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_offensive_rating_rank) || null,
        'opponent_defensive_rating_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_defensive_rating_rank) || null,
        'opponent_efficiency_rating_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_efficiency_rating_rank) || null,
        'elo_sos_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.elo_sos_rank) || null,
      });
    } else if (rankView === 'player') {
      if (
        !lastUpdated ||
        lastUpdated < row.date_of_rank
      ) {
        lastUpdated = row.date_of_rank;
      }
        
      row.name = row.player ? (row.player.first_name + ' ' + row.player.last_name) : null;
      row.number = row.player ? row.player.number : null;
      row.position = row.player ? row.player.position : null;
      row.height = row.player ? row.player.height : null;
      row.conf = row.conference;
      row.composite_rank = row.efficiency_rating_rank;

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
      row.name = row.conference;
      row.composite_rank = row.adjusted_efficiency_rating_rank;

      // row.adj_elo = +(+row.elo - +row.elo_sos).toFixed(2);

      rows.push(row);
    }
  }

  return { rows, lastUpdated };
};