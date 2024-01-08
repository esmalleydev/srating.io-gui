
export interface Team {
  team_id: string;
  char6: string;
  code: string;
  name: string;
  alt_name: string;
  primary_color: string;
  secondary_color: string;
  cbb_d1: number;
  cbb: number;
  cfb: number;
  nba: number;
  nfl: number;
  nhl: number;
  guid: string;
  deleted: number;
};

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
};

export interface gamesDataType {
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
};

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
};

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
};

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
};
