
import Organization from '@/components/helpers/Organization';

export const getViewableColumns = ({ organization_id, view, columnView, customColumns }) => {
  if (columnView === 'custom') {
    return customColumns;
  }

  if (organization_id === Organization.getCBBID()) {
    if (columnView === 'composite') {
      if (view === 'team') {
        return ['rank', 'name', 'rank_delta_combo', 'record', 'conf_record', 'elo', 'adjusted_efficiency_rating', 'elo_sos', 'offensive_rating', 'defensive_rating', 'opponent_efficiency_rating', 'streak', 'conference_code'];
      }
      if (view === 'player') {
        return ['rank', 'name', 'rank_delta_combo', 'team_name', 'elo', 'efficiency_rating', 'offensive_rating', 'defensive_rating', 'player_efficiency_rating', 'minutes_per_game', 'points_per_game', 'usage_percentage', 'true_shooting_percentage'];
      }
      if (view === 'conference') {
        return ['rank', 'name', 'rank_delta_combo', 'adjusted_efficiency_rating', 'elo', 'elo_sos', 'opponent_efficiency_rating', 'offensive_rating', 'defensive_rating', 'nonconfwins'];
      }
      if (view === 'transfer') {
        return ['rank', 'name', 'rank_delta_combo', 'team_name', 'committed_team_name', 'elo', 'efficiency_rating', 'offensive_rating', 'defensive_rating', 'player_efficiency_rating', 'minutes_per_game', 'points_per_game', 'usage_percentage', 'true_shooting_percentage'];
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
        return ['rank', 'name', 'rank_delta_combo', 'record', 'conf_record', 'elo', 'passing_rating_college', 'points', 'yards_per_play', 'points_per_play', 'elo_sos', 'conference_code'];
      }
      if (view === 'player') {
        return ['rank', 'name', 'rank_delta_combo', 'team_name', 'passing_rating_college'];
      }
      if (view === 'conference') {
        return ['rank', 'name', 'rank_delta_combo', 'elo', 'record', 'passing_rating_college', 'points', 'yards_per_play', 'points_per_play'];
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
    } else if (columnView === 'passing') {
      if (view === 'team' || view === 'player' || view === 'conference') {
        return ['rank', 'name', 'passing_rating_college', 'passing_rating_pro', 'passing_attempts', 'passing_completions', 'passing_yards', 'passing_completion_percentage', 'passing_yards_per_attempt', 'passing_yards_per_completion', 'passing_touchdowns', 'passing_interceptions', 'passing_long'];
      }
    } else if (columnView === 'rushing') {
      if (view === 'team' || view === 'player' || view === 'conference') {
        return ['rank', 'name', 'rushing_attempts', 'rushing_yards', 'rushing_yards_per_attempt', 'rushing_touchdowns', 'rushing_long'];
      }
    } else if (columnView === 'receiving') {
      if (view === 'team' || view === 'player' || view === 'conference') {
        return ['rank', 'name', 'receptions', 'receiving_yards', 'receiving_yards_per_reception', 'receiving_touchdowns', 'receiving_long'];
      }
    }
  }

  return [];
};
