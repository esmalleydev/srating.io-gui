
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