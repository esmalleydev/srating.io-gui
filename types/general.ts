export interface Organization {
  organization_id: string;
  code: string;
  name: string;
  guid: string;
  inactive: number;
  deleted: number;
}

export type Organizations = {[organization_id: string]: Organization};

export interface Division {
  division_id: string;
  code: string;
  name: string;
  guid: string;
  inactive: number;
  deleted: number;
}

export type Divisions = {[division_id: string]: Division};

export interface Conference {
  conference_id: string;
  code: string;
  name: string;
  guid: string;
  inactive: number;
  deleted: number;
}

export type Conferences = {[conference_id: string]: Conference};

export interface Team {
  team_id: string;
  char6: string;
  code: string;
  name: string;
  alt_name: string;
  primary_color: string;
  secondary_color: string;
  conference_id?: string;
  guid: string;
  deleted: number;
}

export type Teams = {[team_id: string]: Team};

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

export interface Prediction {
  prediction_id: string;
  game_id: string;
  season: number;
  home_percentage: number;
  away_percentage: number;
  home_score: number;
  away_score: number;
  live: number;
  current: number;
  date_of_entry: string;
  guid: string;
  deleted: number;
}

export type Predictions = {[prediction_id: string]: Prediction};

export interface Game {
  game_id: string;
  organization_id: string;
  division_id: string;
  season: number;
  away_team_id: string;
  home_team_id: string;
  network: string;
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
  prediction: Prediction;
  odds: Odds;
}

export type Games = {[game_id: string]: Game};

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
  coach_elo_id: string;
  coach_id: string;
  game_id: string;
  season: number;
  elo: number;
  current: number;
  date_of_entry: string;
  updated_at: string;
  guid: string;
  deleted: number;
}

export type CoachElos = {[coach_elo_id: string]: CoachElo};

export interface Elo {
  elo_id: string;
  team_id: string;
  game_id: string;
  season: number;
  elo: number;
  current: number;
  date_of_entry: string;
  updated_at: string;
  guid: string;
  deleted: number;
}

export type Elos = {[elo_id: string]: Elo};

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

export interface GamePulse {
  game_pulse_id: string;
  game_id: string;
  odds_id: string;
  away_score: number;
  home_score: number;
  current_period: string;
  clock: string;
  date_of_entry: string;
}

export type GamePulses = {[game_pulse_id: string]: GamePulse};

export interface Odds {
  odds_id: string;
  game_id: string;
  money_line_away: number;
  money_line_home: number;
  spread_away: number;
  spread_home: number;
  over: number;
  under: number;
  date_of_entry: string;
  live: number;
  current: number;
  guid: string;
  deleted: number;
}

export type Oddsz = {[odds_id: string]: Odds};

export interface CoachStatisticRanking {
  coach_statistic_ranking_id: string;
  organization_id: string;
  division_id: string;
  coach_statistic_id: string;
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

export type CoachStatisticRankings = {[coach_statistic_ranking_id: string]: CoachStatisticRanking};


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

