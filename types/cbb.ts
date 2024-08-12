
export interface Team {
  team_id: string;
  char6: string;
  code: string;
  name: string;
  alt_name: string;
  primary_color: string;
  secondary_color: string;
  guid: string;
  deleted: number;
}

export type Teams = {[team_id: string]: Team};

export interface Game {
  cbb_game_id: string;
  season: number;
  away_team_id: string;
  home_team_id: string;
  network: string;
  home_team_rating: number;
  away_team_rating: number;
  away_score: number;
  home_score: number;
  status: string;
  current_period: string;
  clock: string;
  start_date: string;
  start_datetime: string;
  start_timestamp: number;
  attendance: number;
  neutral_site: number;
  is_conf_game: number;
  boxscore: number;
  guid: string;
  deleted: number;
  teams: Team;
}

export type Games = {
  [cbb_game_id: string]: Game;
};

export interface Boxscore {
  cbb_boxscore_id: string;
  cbb_game_id: string;
  team_id: string;
  season: number;
  minutes_played: number;
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
  final: number;
}

export interface Player {
  player_id: string;
  first_name: string;
  last_name: string;
  position: string;
  height: string;
  weight: string;
  number: string;
  hometown: string;
  guid: string;
  deleted: number;
}

export type Players = {[player_id: string]: Player};

export interface PlayerBoxscore {
  cbb_player_boxscore_id: string;
  cbb_game_id: string;
  team_id: string;
  player_id: string;
  season: number;
  first_name: string;
  last_name: string;
  position: string;
  minutes_played: number;
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
}

export interface ScoreIntervals {
  cbb_game_score_interval_id: string;
  cbb_game_id: string;
  away_score: number;
  home_score: number;
  current_period: string;
  clock: string;
  money_line_away: number;
  money_line_home: number;
  spread_away: number;
  spread_home: number;
  over: number;
  under: number;
  date_of_entry: string;
}

export interface PlaybyPlay {
  cbb_game_pbp_id: string;
  cbb_game_id: string;
  team_id: string;
  current_period: string;
  clock: string;
  description: string;
  away_score: number;
  home_score: number;
  score_difference: number;
  shooter_player_id: string;
  assist_player_id: string;
  offensive_rebound_player_id: string;
  defensive_rebound_player_id: string;
  block_player_id: string;
  shot_x: number;
  shot_y: number;
  shot_made: number;
  date_of_entry: string;
  order: number;
}


export interface RankingColumns {
  [key: string]: {
    id: string;
    numeric: boolean;
    label: string;
    tooltip: string;
    sort?: string;
    sticky?: boolean;
    disabled?: boolean;
  }
}

export interface StatisticRanking {
  statistic_ranking_id: string;
  organization_id: string;
  division_id: string;
  sport_statistic_id: string;
  season: number;
  team_id: string;
  rank: number;
  elo_rank: number;
  kenpom_rank: number;
  srs_rank: number;
  ap_rank: number;
  coaches_rank: number;
  net_rank: number;
  total_games?: number;
  games?: number;
  wins?: number;
  losses?: number;
  confwins?: number;
  conflosses?: number;
  neutralwins?: number;
  neutrallosses?: number;
  homewins?: number;
  homelosses?: number;
  roadwins?: number;
  roadlosses?: number;
  streak?: number;
  win_margin?: number;
  loss_margin?: number;
  confwin_margin?: number;
  confloss_margin?: number;
  fatigue?: number;
  desperation?: number;
  over_confidence?: number;
  minutes_played?: number;
  field_goal?: number;
  field_goal_attempts?: number;
  field_goal_percentage?: number;
  two_point_field_goal?: number;
  two_point_field_goal_attempts?: number;
  two_point_field_goal_percentage?: number;
  three_point_field_goal?: number;
  three_point_field_goal_attempts?: number;
  three_point_field_goal_percentage?: number;
  free_throws?: number;
  free_throw_attempts?: number;
  free_throw_percentage?: number;
  offensive_rebounds?: number;
  defensive_rebounds?: number;
  total_rebounds?: number;
  assists?: number;
  steals?: number;
  blocks?: number;
  turnovers?: number;
  fouls?: number;
  points?: number;
  possessions?: number;
  pace?: number;
  offensive_rating?: number;
  defensive_rating?: number;
  efficiency_rating?: number;
  adjusted_efficiency_rating?: number;
  opponent_field_goal?: number;
  opponent_field_goal_attempts?: number;
  opponent_field_goal_percentage?: number;
  opponent_two_point_field_goal?: number;
  opponent_two_point_field_goal_attempts?: number;
  opponent_two_point_field_goal_percentage?: number;
  opponent_three_point_field_goal?: number;
  opponent_three_point_field_goal_attempts?: number;
  opponent_three_point_field_goal_percentage?: number;
  opponent_free_throws?: number;
  opponent_free_throw_attempts?: number;
  opponent_free_throw_percentage?: number;
  opponent_offensive_rebounds?: number;
  opponent_defensive_rebounds?: number;
  opponent_total_rebounds?: number;
  opponent_assists?: number;
  opponent_steals?: number;
  opponent_blocks?: number;
  opponent_turnovers?: number;
  opponent_fouls?: number;
  opponent_points?: number;
  opponent_possessions?: number;
  opponent_pace?: number;
  opponent_offensive_rating?: number;
  opponent_defensive_rating?: number;
  opponent_efficiency_rating?: number;
  elo_sos?: number;
  wins_rank?: number;
  losses_rank?: number;
  confwins_rank?: number;
  conflosses_rank?: number;
  neutralwins_rank?: number;
  neutrallosses_rank?: number;
  homewins_rank?: number;
  homelosses_rank?: number;
  roadwins_rank?: number;
  roadlosses_rank?: number;
  streak_rank?: number;
  win_margin_rank?: number;
  loss_margin_rank?: number;
  confwin_margin_rank?: number;
  confloss_margin_rank?: number;
  fatigue_rank?: number;
  desperation_rank?: number;
  over_confidence_rank?: number;
  minutes_played_rank?: number;
  field_goal_rank?: number;
  field_goal_attempts_rank?: number;
  field_goal_percentage_rank?: number;
  two_point_field_goal_rank?: number;
  two_point_field_goal_attempts_rank?: number;
  two_point_field_goal_percentage_rank?: number;
  three_point_field_goal_rank?: number;
  three_point_field_goal_attempts_rank?: number;
  three_point_field_goal_percentage_rank?: number;
  free_throws_rank?: number;
  free_throw_attempts_rank?: number;
  free_throw_percentage_rank?: number;
  offensive_rebounds_rank?: number;
  defensive_rebounds_rank?: number;
  total_rebounds_rank?: number;
  assists_rank?: number;
  steals_rank?: number;
  blocks_rank?: number;
  turnovers_rank?: number;
  fouls_rank?: number;
  points_rank?: number;
  possessions_rank?: number;
  pace_rank?: number;
  offensive_rating_rank?: number;
  defensive_rating_rank?: number;
  efficiency_rating_rank?: number;
  adjusted_efficiency_rating_rank?: number;
  opponent_field_goal_rank?: number;
  opponent_field_goal_attempts_rank?: number;
  opponent_field_goal_percentage_rank?: number;
  opponent_two_point_field_goal_rank?: number;
  opponent_two_point_field_goal_attempts_rank?: number;
  opponent_two_point_field_goal_percentage_rank?: number;
  opponent_three_point_field_goal_rank?: number;
  opponent_three_point_field_goal_attempts_rank?: number;
  opponent_three_point_field_goal_percentage_rank?: number;
  opponent_free_throws_rank?: number;
  opponent_free_throw_attempts_rank?: number;
  opponent_free_throw_percentage_rank?: number;
  opponent_offensive_rebounds_rank?: number;
  opponent_defensive_rebounds_rank?: number;
  opponent_total_rebounds_rank?: number;
  opponent_assists_rank?: number;
  opponent_steals_rank?: number;
  opponent_blocks_rank?: number;
  opponent_turnovers_rank?: number;
  opponent_fouls_rank?: number;
  opponent_points_rank?: number;
  opponent_possessions_rank?: number;
  opponent_pace_rank?: number;
  opponent_offensive_rating_rank?: number;
  opponent_defensive_rating_rank?: number;
  opponent_efficiency_rating_rank?: number;
  elo_sos_rank?: number;
  guid: string;
  date_of_rank: string;
  current: number;
  deleted: number;
}

export type StatisticRankings = {[statistic_ranking_id: string]: StatisticRanking};

export interface ConferenceStatisticRanking {
  cbb_conference_statistic_ranking_id: string;
  season: number;
  conference_id: string;
  elo: number;
  total_games: number;
  games: number;
  wins: number;
  losses: number;
  nonconfwins: number;
  nonconflosses: number;
  neutralwins: number;
  neutrallosses: number;
  homewins: number;
  homelosses: number;
  roadwins: number;
  roadlosses: number;
  win_margin: number;
  loss_margin: number;
  nonconfwin_margin: number;
  nonconfloss_margin: number;
  minutes_played: number;
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
  opponent_pace: number;
  opponent_offensive_rating: number;
  opponent_defensive_rating: number;
  opponent_efficiency_rating: number;
  elo_sos: number;
  elo_rank: number;
  wins_rank: number;
  losses_rank: number;
  nonconfwins_rank: number;
  nonconflosses_rank: number;
  neutralwins_rank: number;
  neutrallosses_rank: number;
  homewins_rank: number;
  homelosses_rank: number;
  roadwins_rank: number;
  roadlosses_rank: number;
  win_margin_rank: number;
  loss_margin_rank: number;
  nonconfwin_margin_rank: number;
  nonconfloss_margin_rank: number;
  minutes_played_rank: number;
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
  opponent_pace_rank: number;
  opponent_offensive_rating_rank: number;
  opponent_defensive_rating_rank: number;
  opponent_efficiency_rating_rank: number;
  elo_sos_rank: number;
  guid: string;
  date_of_rank: string;
  current: number;
  deleted: number;
}

export type ConferenceStatisticRankings = {[cbb_conference_statistic_ranking_id: string]: ConferenceStatisticRanking};

export interface LeagueStatistic {
  cbb_league_statistic_id: string;
  season: number;
  elo: number;
  games: number;
  wins: number;
  losses: number;
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
  fatigue: number;
  desperation: number;
  over_confidence: number;
  minutes_played: number;
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
  opponent_pace: number;
  opponent_offensive_rating: number;
  opponent_defensive_rating: number;
  opponent_efficiency_rating: number;
  guid: string;
  date_of_rank: string;
  current: number;
  deleted: number;
}

export type LeagueStatistics = {[cbb_conference_statistic_ranking_id: string]: LeagueStatistic};

export interface LeaguePlayerStatistic {
  cbb_league_player_statistic_id: string;
  season: number;
  date_of_rank: string;
  minutes_played: number;
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
  offensive_rating: number | null;
  defensive_rating: number | null;
  efficiency_rating: number | null;
  unadjusted_player_efficiency_rating: number | null;
  adjusted_player_efficiency_rating: number | null;
  true_shooting_percentage: number;
  effective_field_goal_percentage: number;
  offensive_rebound_percentage: number;
  defensive_rebound_percentage: number;
  total_rebound_percentage: number;
  assist_percentage: number;
  steal_percentage: number;
  block_percentage: number;
  turnover_percentage: number;
  usage_percentage: number;
  team_possessions: number;
  team_pace: number;
  guid: string;
  current: number;
  deleted: number;
}

export type LeaguePlayerStatistics = {[cbb_conference_statistic_ranking_id: string]: LeaguePlayerStatistic};

export interface CoachStatistic {
  cbb_coach_statistic_ranking_id: string;
  season: number;
  coach_id: string;
  rank: number;
  elo: number;
  games: number;
  wins: number;
  losses: number;
  confwins: number;
  conflosses: number;
  nonconfwins: number;
  nonconflosses: number;
  neutralwins: number;
  neutrallosses: number;
  homewins: number;
  homelosses: number;
  roadwins: number;
  roadlosses: number;
  elo_sos: number;
  win_percentage: number;
  conf_win_percentage: number;
  nonconf_win_percentage: number;
  home_win_percentage: number;
  road_win_percentage: number;
  neutral_win_percentage: number;
  elo_rank: number;
  wins_rank: number;
  losses_rank: number;
  confwins_rank: number;
  conflosses_rank: number;
  nonconfwins_rank: number;
  nonconflosses_rank: number;
  neutralwins_rank: number;
  neutrallosses_rank: number;
  homewins_rank: number;
  homelosses_rank: number;
  roadwins_rank: number;
  roadlosses_rank: number;
  elo_sos_rank: number;
  win_percentage_rank: number;
  conf_win_percentage_rank: number;
  nonconf_win_percentage_rank: number;
  home_win_percentage_rank: number;
  road_win_percentage_rank: number;
  neutral_win_percentage_rank: number;
  guid: string;
  date_of_rank: string;
  current: number;
  deleted: number;
}

export type CoachStatistics = {[cbb_coach_statistic_ranking_id: string]: CoachStatistic};

export interface TeamSeasonConference {
  team_season_conference_id: string;
  organization_id: string;
  team_id: string;
  season: number;
  conference_id: string;
  division_id: string;
  guid: string;
  deleted: number;
}

export type TeamSeasonConferences = {[coach_team_season_id: string]: TeamSeasonConference};

export interface TransferPlayerSeason {
  cbb_transfer_player_season_id: string;
  player_id: string;
  season: number;
  committed_team_id: string | null;
  committed: number;
  guid: string;
  deleted: number;
}

export type TransferPlayerSeasons = {[coach_team_season_id: string]: TransferPlayerSeason};

export interface Organization {
  organization_id: string;
  code: string;
  name: string;
  guid: string;
  inactive: number;
  deleted: number;
}

export interface Division {
  division_id: string;
  code: string;
  name: string;
  guid: string;
  inactive: number;
  deleted: number;
}

export interface Conference {
  conference_id: string;
  code: string;
  name: string;
  guid: string;
  inactive: number;
  deleted: number;
}

export interface Coach {
  coach_id: string;
  first_name: string;
  last_name: string;
  deleted: number;
}

export type Coaches = {[coach_id: string]: Coach};

export interface CoachTeamSeason {
  coach_team_season_id: string;
  coach_id: string;
  team_id: string;
  season: number;
  start_date: string;
  end_date: string;
  guid: string;
  deleted: number
}

export type CoachTeamSeasons = {[coach_team_season_id: string]: CoachTeamSeason};

export interface CoachElo {
  cbb_coach_elo_id: string;
  coach_id: string;
  cbb_game_id: string;
  season: number;
  elo: number;
  current: number;
  date_of_entry: string;
  updated_at: string;
  guid: string;
  deleted: number;
}

export type CoachElos = {[cbb_coach_elo_id: string]: CoachElo};

export interface Elo {
  cbb_elo_id: string;
  team_id: string;
  cbb_game_id: string;
  season: number;
  elo: number;
  current: number;
  date_of_entry: string;
  updated_at: string;
  guid: string;
  deleted: number;
}

export type Elos = {[cbb_coach_elo_id: string]: Elo};
