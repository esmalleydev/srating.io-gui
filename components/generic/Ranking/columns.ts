
import Organization from '@/components/helpers/Organization';

export const getViewableColumns = (
  {
    organization_id,
    view,
    columnView,
    customColumns,
    positions,
  } :
  {
    organization_id: string;
    view: string;
    columnView: string;
    customColumns: string[];
    positions: string[];
  },
): string[] => {
  if (columnView === 'custom') {
    return customColumns;
  }

  if (organization_id === Organization.getCBBID()) {
    if (columnView === 'composite') {
      if (view === 'team') {
        return ['rank', 'name', 'rank_delta_combo', 'record', 'conf_record', 'elo', 'adjusted_efficiency_rating', 'elo_sos', 'offensive_rating', 'defensive_rating', 'opponent_efficiency_rating', 'streak', 'conference_code'];
      }
      if (view === 'player') {
        return ['rank', 'name', 'team_name', 'rank_delta_combo', 'elo', 'efficiency_rating', 'offensive_rating', 'defensive_rating', 'player_efficiency_rating', 'minutes_per_game', 'points_per_game', 'usage_percentage', 'true_shooting_percentage'];
      }
      if (view === 'conference') {
        return ['rank', 'name', 'rank_delta_combo', 'adjusted_efficiency_rating', 'elo', 'elo_sos', 'opponent_efficiency_rating', 'offensive_rating', 'defensive_rating', 'nonconfwins'];
      }
      if (view === 'transfer') {
        return ['rank', 'name', 'team_name', 'rank_delta_combo', 'committed_team_name', 'elo', 'efficiency_rating', 'offensive_rating', 'defensive_rating', 'player_efficiency_rating', 'minutes_per_game', 'points_per_game', 'usage_percentage', 'true_shooting_percentage'];
      }
      if (view === 'coach') {
        return [
          'rank',
          'name',
          'team_name',
          'rank_delta_combo',
          'elo',
          'elo_sos',
          'games',
          'win_percentage',
          'conf_win_percentage',
          'nonconf_win_percentage',
          'home_win_percentage',
          'road_win_percentage',
          'neutral_win_percentage',
        ];
      }
    } else if (columnView === 'offense') {
      if (view === 'team') {
        return ['rank', 'name', 'offensive_rating', 'points', 'field_goal_percentage', 'two_point_field_goal_percentage', 'three_point_field_goal_percentage', 'free_throw_percentage', 'offensive_rebounds', 'assists', 'turnovers', 'possessions', 'pace'];
      }
      if (view === 'player' || view === 'transfer') {
        return ['rank', 'name', 'offensive_rating', 'points_per_game', 'field_goal_percentage', 'two_point_field_goal_percentage', 'three_point_field_goal_percentage', 'free_throw_percentage', 'offensive_rebounds_per_game', 'assists_per_game', 'turnovers_per_game', 'turnover_percentage'];
      }
      if (view === 'conference') {
        return ['rank', 'name', 'offensive_rating', 'points', 'field_goal_percentage', 'two_point_field_goal_percentage', 'three_point_field_goal_percentage', 'free_throw_percentage', 'offensive_rebounds', 'assists', 'turnovers', 'possessions', 'pace'];
      }
    } else if (columnView === 'defense') {
      if (view === 'team') {
        return ['rank', 'name', 'defensive_rating', 'defensive_rebounds', 'steals', 'blocks', 'opponent_points', 'opponent_field_goal_percentage', 'opponent_two_point_field_goal_percentage', 'opponent_three_point_field_goal_percentage', 'fouls'];
      }
      if (view === 'player' || view === 'transfer') {
        return ['rank', 'name', 'defensive_rating', 'defensive_rebounds_per_game', 'steals_per_game', 'blocks_per_game', 'fouls_per_game', 'defensive_rebound_percentage', 'steal_percentage', 'block_percentage'];
      }
      if (view === 'conference') {
        return ['rank', 'name', 'defensive_rating', 'defensive_rebounds', 'steals', 'blocks', 'opponent_points', 'opponent_field_goal_percentage', 'opponent_two_point_field_goal_percentage', 'opponent_three_point_field_goal_percentage', 'fouls'];
      }
    }
  }

  if (organization_id === Organization.getCFBID()) {
    if (columnView === 'composite') {
      if (view === 'team') {
        return ['rank', 'name', 'rank_delta_combo', 'record', 'conf_record', 'elo', 'passing_rating_college', 'yards_per_play', 'points_per_play', 'points', 'opponent_points', 'elo_sos', 'conference_code'];
      }
      if (
        view === 'player' &&
        positions &&
        positions.includes('QB')
      ) {
        return ['rank', 'name', 'team_name', 'rank_delta_combo', 'elo', 'passing_rating_college', 'passing_attempts', 'passing_completions', 'passing_yards', 'passing_completion_percentage', 'passing_yards_per_attempt', 'passing_yards_per_completion', 'passing_touchdowns', 'passing_interceptions'];
      }
      if (
        view === 'player' &&
        positions &&
        positions.includes('rushing')
      ) {
        return ['rank', 'name', 'team_name', 'rank_delta_combo', 'elo', 'rushing_attempts', 'rushing_yards', 'rushing_yards_per_attempt', 'rushing_touchdowns', 'rushing_long'];
      }
      if (
        view === 'player' &&
        positions &&
        positions.includes('receiving')
      ) {
        return ['rank', 'name', 'team_name', 'rank_delta_combo', 'elo', 'receptions', 'receiving_yards', 'receiving_yards_per_reception', 'receiving_touchdowns', 'receiving_long'];
      }
      if (view === 'conference') {
        return ['rank', 'name', 'rank_delta_combo', 'elo', 'passing_rating_college', 'points', 'yards_per_play', 'points_per_play'];
      }
      if (view === 'coach') {
        return [
          'rank',
          'name',
          'team_name',
          'rank_delta_combo',
          'elo',
          'elo_sos',
          'games',
          'win_percentage',
          'conf_win_percentage',
          'nonconf_win_percentage',
          'home_win_percentage',
          'road_win_percentage',
          'neutral_win_percentage',
        ];
      }
    } else if (columnView === 'offense') {
      if (view === 'team' || view === 'conference') {
        return ['rank', 'name', 'passing_rating_college', 'passing_yards_per_attempt', 'rushing_yards_per_attempt', 'passing_attempts', 'passing_completions', 'passing_yards', 'passing_completion_percentage', 'passing_yards_per_completion', 'passing_touchdowns', 'passing_interceptions', 'passing_long', 'rushing_attempts', 'rushing_yards', 'rushing_touchdowns', 'rushing_long'];
      }
    } else if (columnView === 'passing') {
      return ['rank', 'name', 'passing_rating_college', 'passing_rating_pro', 'passing_attempts_per_game', 'passing_completions_per_game', 'passing_yards_per_game', 'passing_completion_percentage', 'passing_yards_per_attempt', 'passing_yards_per_completion', 'passing_touchdowns_per_game', 'passing_interceptions_per_game', 'passing_long'];
    } else if (columnView === 'rushing') {
      if (view === 'team' || view === 'conference') {
        return ['rank', 'name', 'rushing_attempts', 'rushing_yards', 'rushing_yards_per_attempt', 'rushing_touchdowns', 'rushing_long'];
      }

      if (view === 'player') {
        return ['rank', 'name', 'rushing_attempts_per_game', 'rushing_yards_per_game', 'rushing_yards_per_attempt', 'rushing_touchdowns_per_game', 'rushing_long'];
      }
    } else if (columnView === 'receiving') {
      if (view === 'team' || view === 'conference') {
        return ['rank', 'name', 'receptions', 'receiving_yards', 'receiving_yards_per_reception', 'receiving_touchdowns', 'receiving_long'];
      }

      if (view === 'player') {
        return ['rank', 'name', 'receptions_per_game', 'receiving_yards_per_game', 'receiving_yards_per_reception', 'receiving_touchdowns_per_game', 'receiving_long'];
      }
    } else if (columnView === 'defense') {
      if (view === 'team' || view === 'conference') {
        return ['rank', 'name', 'opponent_points', 'opponent_yards_per_play', 'opponent_points_per_play', 'opponent_passing_completion_percentage', 'opponent_passing_yards_per_attempt', 'opponent_rushing_yards_per_attempt'];
      }
    }
  }

  return [];
};
