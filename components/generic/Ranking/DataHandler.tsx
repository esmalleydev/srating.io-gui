'use client';

import { setDataKey } from '@/redux/features/ranking-slice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import Organization from '@/components/helpers/Organization';
import { CBBRankingTable } from '@/types/cbb';
import { CFBRankingTable } from '@/types/cfb';
import { useEffect } from 'react';

const getData = ({ view }) => {
  const data = useAppSelector((state) => state.rankingReducer.data);
  const positions = useAppSelector((state) => state.displayReducer.positions);
  const selectedConferences = useAppSelector((state) => state.displayReducer.conferences);
  const hideCommitted = useAppSelector((state) => state.rankingReducer.hideCommitted);
  const hideUnderTwoMPG = useAppSelector((state) => state.rankingReducer.hideUnderTwoMPG);
  const filterCommittedConf = useAppSelector((state) => state.rankingReducer.filterCommittedConf);
  const filterOriginalConf = useAppSelector((state) => state.rankingReducer.filterOriginalConf);
  const conferences = useAppSelector((state) => state.dictionaryReducer.conference);
  const isCBB = Organization.isCBB();
  const isCFB = Organization.isCFB();

  const args = {
    view, data, positions, selectedConferences, hideCommitted, hideUnderTwoMPG, filterCommittedConf, filterOriginalConf, conferences,
  };

  // you have to pass the functions the same arguments or on re-render it complains about hooks being different (re-rendering from CFB to CBB organization)
  if (isCBB) {
    return formatCBBData(args);
  }
  if (isCFB) {
    return formatCFBData(args);
  }

  return { rows: [], lastUpdated: null };
};

const formatCBBData = (args) => {
  const {
    view, data, positions, selectedConferences, hideCommitted, hideUnderTwoMPG, filterCommittedConf, filterOriginalConf, conferences,
  } = args;
  const rows: CBBRankingTable[] = [];
  let lastUpdated: string | null = null;

  for (const id in data) {
    // Fixes - TypeError: Cannot add property name, object is not extensible
    const row = { ...data[id] };

    if (
      view !== 'transfer' &&
      selectedConferences.length &&
      selectedConferences.indexOf(row.conference_id) === -1
    ) {
      continue;
    }

    // if transfer and conference is not in original or new conf conference, remove them
    if (
      view === 'transfer' &&
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

    if (view === 'player' || view === 'transfer') {
      if (hideUnderTwoMPG && row.minutes_per_game < 2) {
        continue;
      }
    }

    if (view === 'team') {
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
    } else if (view === 'player' || view === 'transfer') {
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
    } else if (view === 'conference') {
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
    } else if (view === 'coach') {
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

const formatCFBData = (args) => {
  const { view, data, positions, selectedConferences, hideUnderTwoMPG, conferences } = args;
  const rows: CFBRankingTable[] = [];
  let lastUpdated: string | null = null;

  for (const id in data) {
    // Fixes - TypeError: Cannot add property name, object is not extensible
    const row = { ...data[id] };

    if (
      selectedConferences.length &&
      selectedConferences.indexOf(row.conference_id) === -1
    ) {
      continue;
    }

    if (view === 'player') {
      if (hideUnderTwoMPG && row.minutes_per_game < 2) {
        continue;
      }
    }

    if (view === 'team') {
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
        elo: row.elo,
        elo_rank: (row.statistic_ranking && row.statistic_ranking.elo_rank) || null,
        elo_sos: (row.statistic_ranking && row.statistic_ranking.elo_sos) || null, // this is eSoS
        elo_sos_rank: (row.statistic_ranking && row.statistic_ranking.elo_sos_rank) || null,
        minutes_played: (row.statistic_ranking && row.statistic_ranking.minutes_played) || null,
        points: (row.statistic_ranking && row.statistic_ranking.points) || null,
        yards_per_play: (row.statistic_ranking && row.statistic_ranking.yards_per_play) || null,
        points_per_play: (row.statistic_ranking && row.statistic_ranking.points_per_play) || null,
        successful_pass_plays: (row.statistic_ranking && row.statistic_ranking.successful_pass_plays) || null,
        successful_rush_plays: (row.statistic_ranking && row.statistic_ranking.successful_rush_plays) || null,
        offensive_dvoa: (row.statistic_ranking && row.statistic_ranking.offensive_dvoa) || null,
        defensive_dvoa: (row.statistic_ranking && row.statistic_ranking.defensive_dvoa) || null,
        first_downs: (row.statistic_ranking && row.statistic_ranking.first_downs) || null,
        third_down_conversions: (row.statistic_ranking && row.statistic_ranking.third_down_conversions) || null,
        third_down_attempts: (row.statistic_ranking && row.statistic_ranking.third_down_attempts) || null,
        fourth_down_conversions: (row.statistic_ranking && row.statistic_ranking.fourth_down_conversions) || null,
        fourth_down_attempts: (row.statistic_ranking && row.statistic_ranking.fourth_down_attempts) || null,
        penalties: (row.statistic_ranking && row.statistic_ranking.penalties) || null,
        penalty_yards: (row.statistic_ranking && row.statistic_ranking.penalty_yards) || null,
        time_of_possession_seconds: (row.statistic_ranking && row.statistic_ranking.time_of_possession_seconds) || null,
        passing_attempts: (row.statistic_ranking && row.statistic_ranking.passing_attempts) || null,
        passing_completions: (row.statistic_ranking && row.statistic_ranking.passing_completions) || null,
        passing_yards: (row.statistic_ranking && row.statistic_ranking.passing_yards) || null,
        passing_completion_percentage: (row.statistic_ranking && row.statistic_ranking.passing_completion_percentage) || null,
        passing_yards_per_attempt: (row.statistic_ranking && row.statistic_ranking.passing_yards_per_attempt) || null,
        passing_yards_per_completion: (row.statistic_ranking && row.statistic_ranking.passing_yards_per_completion) || null,
        passing_touchdowns: (row.statistic_ranking && row.statistic_ranking.passing_touchdowns) || null,
        passing_interceptions: (row.statistic_ranking && row.statistic_ranking.passing_interceptions) || null,
        passing_rating_pro: (row.statistic_ranking && row.statistic_ranking.passing_rating_pro) || null,
        passing_rating_college: (row.statistic_ranking && row.statistic_ranking.passing_rating_college) || null,
        passing_long: (row.statistic_ranking && row.statistic_ranking.passing_long) || null,
        rushing_attempts: (row.statistic_ranking && row.statistic_ranking.rushing_attempts) || null,
        rushing_yards: (row.statistic_ranking && row.statistic_ranking.rushing_yards) || null,
        rushing_yards_per_attempt: (row.statistic_ranking && row.statistic_ranking.rushing_yards_per_attempt) || null,
        rushing_touchdowns: (row.statistic_ranking && row.statistic_ranking.rushing_touchdowns) || null,
        rushing_long: (row.statistic_ranking && row.statistic_ranking.rushing_long) || null,
        receptions: (row.statistic_ranking && row.statistic_ranking.receptions) || null,
        receiving_yards: (row.statistic_ranking && row.statistic_ranking.receiving_yards) || null,
        receiving_yards_per_reception: (row.statistic_ranking && row.statistic_ranking.receiving_yards_per_reception) || null,
        receiving_touchdowns: (row.statistic_ranking && row.statistic_ranking.receiving_touchdowns) || null,
        receiving_long: (row.statistic_ranking && row.statistic_ranking.receiving_long) || null,
        punt_returns: (row.statistic_ranking && row.statistic_ranking.punt_returns) || null,
        punt_return_yards: (row.statistic_ranking && row.statistic_ranking.punt_return_yards) || null,
        punt_return_yards_per_attempt: (row.statistic_ranking && row.statistic_ranking.punt_return_yards_per_attempt) || null,
        punt_return_touchdowns: (row.statistic_ranking && row.statistic_ranking.punt_return_touchdowns) || null,
        punt_return_long: (row.statistic_ranking && row.statistic_ranking.punt_return_long) || null,
        kick_returns: (row.statistic_ranking && row.statistic_ranking.kick_returns) || null,
        kick_return_yards: (row.statistic_ranking && row.statistic_ranking.kick_return_yards) || null,
        kick_return_yards_per_attempt: (row.statistic_ranking && row.statistic_ranking.kick_return_yards_per_attempt) || null,
        kick_return_touchdowns: (row.statistic_ranking && row.statistic_ranking.kick_return_touchdowns) || null,
        kick_return_long: (row.statistic_ranking && row.statistic_ranking.kick_return_long) || null,
        punts: (row.statistic_ranking && row.statistic_ranking.punts) || null,
        punt_yards: (row.statistic_ranking && row.statistic_ranking.punt_yards) || null,
        punt_average: (row.statistic_ranking && row.statistic_ranking.punt_average) || null,
        punt_long: (row.statistic_ranking && row.statistic_ranking.punt_long) || null,
        field_goals_attempted: (row.statistic_ranking && row.statistic_ranking.field_goals_attempted) || null,
        field_goals_made: (row.statistic_ranking && row.statistic_ranking.field_goals_made) || null,
        field_goal_percentage: (row.statistic_ranking && row.statistic_ranking.field_goal_percentage) || null,
        field_goals_longest_made: (row.statistic_ranking && row.statistic_ranking.field_goals_longest_made) || null,
        extra_points_attempted: (row.statistic_ranking && row.statistic_ranking.extra_points_attempted) || null,
        extra_points_made: (row.statistic_ranking && row.statistic_ranking.extra_points_made) || null,
        interceptions: (row.statistic_ranking && row.statistic_ranking.interceptions) || null,
        interception_return_yards: (row.statistic_ranking && row.statistic_ranking.interception_return_yards) || null,
        interception_return_touchdowns: (row.statistic_ranking && row.statistic_ranking.interception_return_touchdowns) || null,
        solo_tackles: (row.statistic_ranking && row.statistic_ranking.solo_tackles) || null,
        assisted_tackles: (row.statistic_ranking && row.statistic_ranking.assisted_tackles) || null,
        tackles_for_loss: (row.statistic_ranking && row.statistic_ranking.tackles_for_loss) || null,
        sacks: (row.statistic_ranking && row.statistic_ranking.sacks) || null,
        passes_defended: (row.statistic_ranking && row.statistic_ranking.passes_defended) || null,
        fumbles_recovered: (row.statistic_ranking && row.statistic_ranking.fumbles_recovered) || null,
        fumble_return_touchdowns: (row.statistic_ranking && row.statistic_ranking.fumble_return_touchdowns) || null,
        quarterback_hurries: (row.statistic_ranking && row.statistic_ranking.quarterback_hurries) || null,
        fumbles: (row.statistic_ranking && row.statistic_ranking.fumbles) || null,
        fumbles_lost: (row.statistic_ranking && row.statistic_ranking.fumbles_lost) || null,
        opponent_points: (row.statistic_ranking && row.statistic_ranking.opponent_points) || null,
        opponent_yards_per_play: (row.statistic_ranking && row.statistic_ranking.opponent_yards_per_play) || null,
        opponent_points_per_play: (row.statistic_ranking && row.statistic_ranking.opponent_points_per_play) || null,
        opponent_successful_pass_plays: (row.statistic_ranking && row.statistic_ranking.opponent_successful_pass_plays) || null,
        opponent_successful_rush_plays: (row.statistic_ranking && row.statistic_ranking.opponent_successful_rush_plays) || null,
        opponent_offensive_dvoa: (row.statistic_ranking && row.statistic_ranking.opponent_offensive_dvoa) || null,
        opponent_defensive_dvoa: (row.statistic_ranking && row.statistic_ranking.opponent_defensive_dvoa) || null,
        opponent_first_downs: (row.statistic_ranking && row.statistic_ranking.opponent_first_downs) || null,
        opponent_third_down_conversions: (row.statistic_ranking && row.statistic_ranking.opponent_third_down_conversions) || null,
        opponent_third_down_attempts: (row.statistic_ranking && row.statistic_ranking.opponent_third_down_attempts) || null,
        opponent_fourth_down_conversions: (row.statistic_ranking && row.statistic_ranking.opponent_fourth_down_conversions) || null,
        opponent_fourth_down_attempts: (row.statistic_ranking && row.statistic_ranking.opponent_fourth_down_attempts) || null,
        opponent_penalties: (row.statistic_ranking && row.statistic_ranking.opponent_penalties) || null,
        opponent_penalty_yards: (row.statistic_ranking && row.statistic_ranking.opponent_penalty_yards) || null,
        opponent_time_of_possession_seconds: (row.statistic_ranking && row.statistic_ranking.opponent_time_of_possession_seconds) || null,
        opponent_passing_attempts: (row.statistic_ranking && row.statistic_ranking.opponent_passing_attempts) || null,
        opponent_passing_completions: (row.statistic_ranking && row.statistic_ranking.opponent_passing_completions) || null,
        opponent_passing_yards: (row.statistic_ranking && row.statistic_ranking.opponent_passing_yards) || null,
        opponent_passing_completion_percentage: (row.statistic_ranking && row.statistic_ranking.opponent_passing_completion_percentage) || null,
        opponent_passing_yards_per_attempt: (row.statistic_ranking && row.statistic_ranking.opponent_passing_yards_per_attempt) || null,
        opponent_passing_yards_per_completion: (row.statistic_ranking && row.statistic_ranking.opponent_passing_yards_per_completion) || null,
        opponent_passing_touchdowns: (row.statistic_ranking && row.statistic_ranking.opponent_passing_touchdowns) || null,
        opponent_passing_interceptions: (row.statistic_ranking && row.statistic_ranking.opponent_passing_interceptions) || null,
        opponent_passing_rating_pro: (row.statistic_ranking && row.statistic_ranking.opponent_passing_rating_pro) || null,
        opponent_passing_rating_college: (row.statistic_ranking && row.statistic_ranking.opponent_passing_rating_college) || null,
        opponent_passing_long: (row.statistic_ranking && row.statistic_ranking.opponent_passing_long) || null,
        opponent_rushing_attempts: (row.statistic_ranking && row.statistic_ranking.opponent_rushing_attempts) || null,
        opponent_rushing_yards: (row.statistic_ranking && row.statistic_ranking.opponent_rushing_yards) || null,
        opponent_rushing_yards_per_attempt: (row.statistic_ranking && row.statistic_ranking.opponent_rushing_yards_per_attempt) || null,
        opponent_rushing_touchdowns: (row.statistic_ranking && row.statistic_ranking.opponent_rushing_touchdowns) || null,
        opponent_rushing_long: (row.statistic_ranking && row.statistic_ranking.opponent_rushing_long) || null,
        opponent_receptions: (row.statistic_ranking && row.statistic_ranking.opponent_receptions) || null,
        opponent_receiving_yards: (row.statistic_ranking && row.statistic_ranking.opponent_receiving_yards) || null,
        opponent_receiving_yards_per_reception: (row.statistic_ranking && row.statistic_ranking.opponent_receiving_yards_per_reception) || null,
        opponent_receiving_touchdowns: (row.statistic_ranking && row.statistic_ranking.opponent_receiving_touchdowns) || null,
        opponent_receiving_long: (row.statistic_ranking && row.statistic_ranking.opponent_receiving_long) || null,
        opponent_punt_returns: (row.statistic_ranking && row.statistic_ranking.opponent_punt_returns) || null,
        opponent_punt_return_yards: (row.statistic_ranking && row.statistic_ranking.opponent_punt_return_yards) || null,
        opponent_punt_return_yards_per_attempt: (row.statistic_ranking && row.statistic_ranking.opponent_punt_return_yards_per_attempt) || null,
        opponent_punt_return_touchdowns: (row.statistic_ranking && row.statistic_ranking.opponent_punt_return_touchdowns) || null,
        opponent_punt_return_long: (row.statistic_ranking && row.statistic_ranking.opponent_punt_return_long) || null,
        opponent_kick_returns: (row.statistic_ranking && row.statistic_ranking.opponent_kick_returns) || null,
        opponent_kick_return_yards: (row.statistic_ranking && row.statistic_ranking.opponent_kick_return_yards) || null,
        opponent_kick_return_yards_per_attempt: (row.statistic_ranking && row.statistic_ranking.opponent_kick_return_yards_per_attempt) || null,
        opponent_kick_return_touchdowns: (row.statistic_ranking && row.statistic_ranking.opponent_kick_return_touchdowns) || null,
        opponent_kick_return_long: (row.statistic_ranking && row.statistic_ranking.opponent_kick_return_long) || null,
        opponent_punts: (row.statistic_ranking && row.statistic_ranking.opponent_punts) || null,
        opponent_punt_yards: (row.statistic_ranking && row.statistic_ranking.opponent_punt_yards) || null,
        opponent_punt_average: (row.statistic_ranking && row.statistic_ranking.opponent_punt_average) || null,
        opponent_punt_long: (row.statistic_ranking && row.statistic_ranking.opponent_punt_long) || null,
        opponent_field_goals_attempted: (row.statistic_ranking && row.statistic_ranking.opponent_field_goals_attempted) || null,
        opponent_field_goals_made: (row.statistic_ranking && row.statistic_ranking.opponent_field_goals_made) || null,
        opponent_field_goal_percentage: (row.statistic_ranking && row.statistic_ranking.opponent_field_goal_percentage) || null,
        opponent_field_goals_longest_made: (row.statistic_ranking && row.statistic_ranking.opponent_field_goals_longest_made) || null,
        opponent_extra_points_attempted: (row.statistic_ranking && row.statistic_ranking.opponent_extra_points_attempted) || null,
        opponent_extra_points_made: (row.statistic_ranking && row.statistic_ranking.opponent_extra_points_made) || null,
        opponent_interceptions: (row.statistic_ranking && row.statistic_ranking.opponent_interceptions) || null,
        opponent_interception_return_yards: (row.statistic_ranking && row.statistic_ranking.opponent_interception_return_yards) || null,
        opponent_interception_return_touchdowns: (row.statistic_ranking && row.statistic_ranking.opponent_interception_return_touchdowns) || null,
        opponent_solo_tackles: (row.statistic_ranking && row.statistic_ranking.opponent_solo_tackles) || null,
        opponent_assisted_tackles: (row.statistic_ranking && row.statistic_ranking.opponent_assisted_tackles) || null,
        opponent_tackles_for_loss: (row.statistic_ranking && row.statistic_ranking.opponent_tackles_for_loss) || null,
        opponent_sacks: (row.statistic_ranking && row.statistic_ranking.opponent_sacks) || null,
        opponent_passes_defended: (row.statistic_ranking && row.statistic_ranking.opponent_passes_defended) || null,
        opponent_fumbles_recovered: (row.statistic_ranking && row.statistic_ranking.opponent_fumbles_recovered) || null,
        opponent_fumble_return_touchdowns: (row.statistic_ranking && row.statistic_ranking.opponent_fumble_return_touchdowns) || null,
        opponent_quarterback_hurries: (row.statistic_ranking && row.statistic_ranking.opponent_quarterback_hurries) || null,
        opponent_fumbles: (row.statistic_ranking && row.statistic_ranking.opponent_fumbles) || null,
        opponent_fumbles_lost: (row.statistic_ranking && row.statistic_ranking.opponent_fumbles_lost) || null,
        // wins_rank: (row.statistic_ranking && row.statistic_ranking.wins_rank) || null,
        losses_rank: (row.statistic_ranking && row.statistic_ranking.losses_rank) || null,
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
        fatigue_rank: (row.statistic_ranking && row.statistic_ranking.fatigue_rank) || null,
        desperation_rank: (row.statistic_ranking && row.statistic_ranking.desperation_rank) || null,
        over_confidence_rank: (row.statistic_ranking && row.statistic_ranking.over_confidence_rank) || null,
        minutes_played_rank: (row.statistic_ranking && row.statistic_ranking.minutes_played_rank) || null,
        points_rank: (row.statistic_ranking && row.statistic_ranking.points_rank) || null,
        yards_per_play_rank: (row.statistic_ranking && row.statistic_ranking.yards_per_play_rank) || null,
        points_per_play_rank: (row.statistic_ranking && row.statistic_ranking.points_per_play_rank) || null,
        successful_pass_plays_rank: (row.statistic_ranking && row.statistic_ranking.successful_pass_plays_rank) || null,
        successful_rush_plays_rank: (row.statistic_ranking && row.statistic_ranking.successful_rush_plays_rank) || null,
        offensive_dvoa_rank: (row.statistic_ranking && row.statistic_ranking.offensive_dvoa_rank) || null,
        defensive_dvoa_rank: (row.statistic_ranking && row.statistic_ranking.defensive_dvoa_rank) || null,
        first_downs_rank: (row.statistic_ranking && row.statistic_ranking.first_downs_rank) || null,
        third_down_conversions_rank: (row.statistic_ranking && row.statistic_ranking.third_down_conversions_rank) || null,
        third_down_attempts_rank: (row.statistic_ranking && row.statistic_ranking.third_down_attempts_rank) || null,
        fourth_down_conversions_rank: (row.statistic_ranking && row.statistic_ranking.fourth_down_conversions_rank) || null,
        fourth_down_attempts_rank: (row.statistic_ranking && row.statistic_ranking.fourth_down_attempts_rank) || null,
        penalties_rank: (row.statistic_ranking && row.statistic_ranking.penalties_rank) || null,
        penalty_yards_rank: (row.statistic_ranking && row.statistic_ranking.penalty_yards_rank) || null,
        time_of_possession_seconds_rank: (row.statistic_ranking && row.statistic_ranking.time_of_possession_seconds_rank) || null,
        passing_attempts_rank: (row.statistic_ranking && row.statistic_ranking.passing_attempts_rank) || null,
        passing_completions_rank: (row.statistic_ranking && row.statistic_ranking.passing_completions_rank) || null,
        passing_yards_rank: (row.statistic_ranking && row.statistic_ranking.passing_yards_rank) || null,
        passing_completion_percentage_rank: (row.statistic_ranking && row.statistic_ranking.passing_completion_percentage_rank) || null,
        passing_yards_per_attempt_rank: (row.statistic_ranking && row.statistic_ranking.passing_yards_per_attempt_rank) || null,
        passing_yards_per_completion_rank: (row.statistic_ranking && row.statistic_ranking.passing_yards_per_completion_rank) || null,
        passing_touchdowns_rank: (row.statistic_ranking && row.statistic_ranking.passing_touchdowns_rank) || null,
        passing_interceptions_rank: (row.statistic_ranking && row.statistic_ranking.passing_interceptions_rank) || null,
        passing_rating_pro_rank: (row.statistic_ranking && row.statistic_ranking.passing_rating_pro_rank) || null,
        passing_rating_college_rank: (row.statistic_ranking && row.statistic_ranking.passing_rating_college_rank) || null,
        passing_long_rank: (row.statistic_ranking && row.statistic_ranking.passing_long_rank) || null,
        rushing_attempts_rank: (row.statistic_ranking && row.statistic_ranking.rushing_attempts_rank) || null,
        rushing_yards_rank: (row.statistic_ranking && row.statistic_ranking.rushing_yards_rank) || null,
        rushing_yards_per_attempt_rank: (row.statistic_ranking && row.statistic_ranking.rushing_yards_per_attempt_rank) || null,
        rushing_touchdowns_rank: (row.statistic_ranking && row.statistic_ranking.rushing_touchdowns_rank) || null,
        rushing_long_rank: (row.statistic_ranking && row.statistic_ranking.rushing_long_rank) || null,
        receptions_rank: (row.statistic_ranking && row.statistic_ranking.receptions_rank) || null,
        receiving_yards_rank: (row.statistic_ranking && row.statistic_ranking.receiving_yards_rank) || null,
        receiving_yards_per_reception_rank: (row.statistic_ranking && row.statistic_ranking.receiving_yards_per_reception_rank) || null,
        receiving_touchdowns_rank: (row.statistic_ranking && row.statistic_ranking.receiving_touchdowns_rank) || null,
        receiving_long_rank: (row.statistic_ranking && row.statistic_ranking.receiving_long_rank) || null,
        punt_returns_rank: (row.statistic_ranking && row.statistic_ranking.punt_returns_rank) || null,
        punt_return_yards_rank: (row.statistic_ranking && row.statistic_ranking.punt_return_yards_rank) || null,
        punt_return_yards_per_attempt_rank: (row.statistic_ranking && row.statistic_ranking.punt_return_yards_per_attempt_rank) || null,
        punt_return_touchdowns_rank: (row.statistic_ranking && row.statistic_ranking.punt_return_touchdowns_rank) || null,
        punt_return_long_rank: (row.statistic_ranking && row.statistic_ranking.punt_return_long_rank) || null,
        kick_returns_rank: (row.statistic_ranking && row.statistic_ranking.kick_returns_rank) || null,
        kick_return_yards_rank: (row.statistic_ranking && row.statistic_ranking.kick_return_yards_rank) || null,
        kick_return_yards_per_attempt_rank: (row.statistic_ranking && row.statistic_ranking.kick_return_yards_per_attempt_rank) || null,
        kick_return_touchdowns_rank: (row.statistic_ranking && row.statistic_ranking.kick_return_touchdowns_rank) || null,
        kick_return_long_rank: (row.statistic_ranking && row.statistic_ranking.kick_return_long_rank) || null,
        punts_rank: (row.statistic_ranking && row.statistic_ranking.punts_rank) || null,
        punt_yards_rank: (row.statistic_ranking && row.statistic_ranking.punt_yards_rank) || null,
        punt_average_rank: (row.statistic_ranking && row.statistic_ranking.punt_average_rank) || null,
        punt_long_rank: (row.statistic_ranking && row.statistic_ranking.punt_long_rank) || null,
        field_goals_attempted_rank: (row.statistic_ranking && row.statistic_ranking.field_goals_attempted_rank) || null,
        field_goals_made_rank: (row.statistic_ranking && row.statistic_ranking.field_goals_made_rank) || null,
        field_goal_percentage_rank: (row.statistic_ranking && row.statistic_ranking.field_goal_percentage_rank) || null,
        field_goals_longest_made_rank: (row.statistic_ranking && row.statistic_ranking.field_goals_longest_made_rank) || null,
        extra_points_attempted_rank: (row.statistic_ranking && row.statistic_ranking.extra_points_attempted_rank) || null,
        extra_points_made_rank: (row.statistic_ranking && row.statistic_ranking.extra_points_made_rank) || null,
        interceptions_rank: (row.statistic_ranking && row.statistic_ranking.interceptions_rank) || null,
        interception_return_yards_rank: (row.statistic_ranking && row.statistic_ranking.interception_return_yards_rank) || null,
        interception_return_touchdowns_rank: (row.statistic_ranking && row.statistic_ranking.interception_return_touchdowns_rank) || null,
        solo_tackles_rank: (row.statistic_ranking && row.statistic_ranking.solo_tackles_rank) || null,
        assisted_tackles_rank: (row.statistic_ranking && row.statistic_ranking.assisted_tackles_rank) || null,
        tackles_for_loss_rank: (row.statistic_ranking && row.statistic_ranking.tackles_for_loss_rank) || null,
        sacks_rank: (row.statistic_ranking && row.statistic_ranking.sacks_rank) || null,
        passes_defended_rank: (row.statistic_ranking && row.statistic_ranking.passes_defended_rank) || null,
        fumbles_recovered_rank: (row.statistic_ranking && row.statistic_ranking.fumbles_recovered_rank) || null,
        fumble_return_touchdowns_rank: (row.statistic_ranking && row.statistic_ranking.fumble_return_touchdowns_rank) || null,
        quarterback_hurries_rank: (row.statistic_ranking && row.statistic_ranking.quarterback_hurries_rank) || null,
        fumbles_rank: (row.statistic_ranking && row.statistic_ranking.fumbles_rank) || null,
        fumbles_lost_rank: (row.statistic_ranking && row.statistic_ranking.fumbles_lost_rank) || null,
        opponent_points_rank: (row.statistic_ranking && row.statistic_ranking.opponent_points_rank) || null,
        opponent_yards_per_play_rank: (row.statistic_ranking && row.statistic_ranking.opponent_yards_per_play_rank) || null,
        opponent_points_per_play_rank: (row.statistic_ranking && row.statistic_ranking.opponent_points_per_play_rank) || null,
        opponent_successful_pass_plays_rank: (row.statistic_ranking && row.statistic_ranking.opponent_successful_pass_plays_rank) || null,
        opponent_successful_rush_plays_rank: (row.statistic_ranking && row.statistic_ranking.opponent_successful_rush_plays_rank) || null,
        opponent_offensive_dvoa_rank: (row.statistic_ranking && row.statistic_ranking.opponent_offensive_dvoa_rank) || null,
        opponent_defensive_dvoa_rank: (row.statistic_ranking && row.statistic_ranking.opponent_defensive_dvoa_rank) || null,
        opponent_first_downs_rank: (row.statistic_ranking && row.statistic_ranking.opponent_first_downs_rank) || null,
        opponent_third_down_conversions_rank: (row.statistic_ranking && row.statistic_ranking.opponent_third_down_conversions_rank) || null,
        opponent_third_down_attempts_rank: (row.statistic_ranking && row.statistic_ranking.opponent_third_down_attempts_rank) || null,
        opponent_fourth_down_conversions_rank: (row.statistic_ranking && row.statistic_ranking.opponent_fourth_down_conversions_rank) || null,
        opponent_fourth_down_attempts_rank: (row.statistic_ranking && row.statistic_ranking.opponent_fourth_down_attempts_rank) || null,
        opponent_penalties_rank: (row.statistic_ranking && row.statistic_ranking.opponent_penalties_rank) || null,
        opponent_penalty_yards_rank: (row.statistic_ranking && row.statistic_ranking.opponent_penalty_yards_rank) || null,
        opponent_time_of_possession_seconds_rank: (row.statistic_ranking && row.statistic_ranking.opponent_time_of_possession_seconds_rank) || null,
        opponent_passing_attempts_rank: (row.statistic_ranking && row.statistic_ranking.opponent_passing_attempts_rank) || null,
        opponent_passing_completions_rank: (row.statistic_ranking && row.statistic_ranking.opponent_passing_completions_rank) || null,
        opponent_passing_yards_rank: (row.statistic_ranking && row.statistic_ranking.opponent_passing_yards_rank) || null,
        opponent_passing_completion_percentage_rank: (row.statistic_ranking && row.statistic_ranking.opponent_passing_completion_percentage_rank) || null,
        opponent_passing_yards_per_attempt_rank: (row.statistic_ranking && row.statistic_ranking.opponent_passing_yards_per_attempt_rank) || null,
        opponent_passing_yards_per_completion_rank: (row.statistic_ranking && row.statistic_ranking.opponent_passing_yards_per_completion_rank) || null,
        opponent_passing_touchdowns_rank: (row.statistic_ranking && row.statistic_ranking.opponent_passing_touchdowns_rank) || null,
        opponent_passing_interceptions_rank: (row.statistic_ranking && row.statistic_ranking.opponent_passing_interceptions_rank) || null,
        opponent_passing_rating_pro_rank: (row.statistic_ranking && row.statistic_ranking.opponent_passing_rating_pro_rank) || null,
        opponent_passing_rating_college_rank: (row.statistic_ranking && row.statistic_ranking.opponent_passing_rating_college_rank) || null,
        opponent_passing_long_rank: (row.statistic_ranking && row.statistic_ranking.opponent_passing_long_rank) || null,
        opponent_rushing_attempts_rank: (row.statistic_ranking && row.statistic_ranking.opponent_rushing_attempts_rank) || null,
        opponent_rushing_yards_rank: (row.statistic_ranking && row.statistic_ranking.opponent_rushing_yards_rank) || null,
        opponent_rushing_yards_per_attempt_rank: (row.statistic_ranking && row.statistic_ranking.opponent_rushing_yards_per_attempt_rank) || null,
        opponent_rushing_touchdowns_rank: (row.statistic_ranking && row.statistic_ranking.opponent_rushing_touchdowns_rank) || null,
        opponent_rushing_long_rank: (row.statistic_ranking && row.statistic_ranking.opponent_rushing_long_rank) || null,
        opponent_receptions_rank: (row.statistic_ranking && row.statistic_ranking.opponent_receptions_rank) || null,
        opponent_receiving_yards_rank: (row.statistic_ranking && row.statistic_ranking.opponent_receiving_yards_rank) || null,
        opponent_receiving_yards_per_reception_rank: (row.statistic_ranking && row.statistic_ranking.opponent_receiving_yards_per_reception_rank) || null,
        opponent_receiving_touchdowns_rank: (row.statistic_ranking && row.statistic_ranking.opponent_receiving_touchdowns_rank) || null,
        opponent_receiving_long_rank: (row.statistic_ranking && row.statistic_ranking.opponent_receiving_long_rank) || null,
        opponent_punt_returns_rank: (row.statistic_ranking && row.statistic_ranking.opponent_punt_returns_rank) || null,
        opponent_punt_return_yards_rank: (row.statistic_ranking && row.statistic_ranking.opponent_punt_return_yards_rank) || null,
        opponent_punt_return_yards_per_attempt_rank: (row.statistic_ranking && row.statistic_ranking.opponent_punt_return_yards_per_attempt_rank) || null,
        opponent_punt_return_touchdowns_rank: (row.statistic_ranking && row.statistic_ranking.opponent_punt_return_touchdowns_rank) || null,
        opponent_punt_return_long_rank: (row.statistic_ranking && row.statistic_ranking.opponent_punt_return_long_rank) || null,
        opponent_kick_returns_rank: (row.statistic_ranking && row.statistic_ranking.opponent_kick_returns_rank) || null,
        opponent_kick_return_yards_rank: (row.statistic_ranking && row.statistic_ranking.opponent_kick_return_yards_rank) || null,
        opponent_kick_return_yards_per_attempt_rank: (row.statistic_ranking && row.statistic_ranking.opponent_kick_return_yards_per_attempt_rank) || null,
        opponent_kick_return_touchdowns_rank: (row.statistic_ranking && row.statistic_ranking.opponent_kick_return_touchdowns_rank) || null,
        opponent_kick_return_long_rank: (row.statistic_ranking && row.statistic_ranking.opponent_kick_return_long_rank) || null,
        opponent_punts_rank: (row.statistic_ranking && row.statistic_ranking.opponent_punts_rank) || null,
        opponent_punt_yards_rank: (row.statistic_ranking && row.statistic_ranking.opponent_punt_yards_rank) || null,
        opponent_punt_average_rank: (row.statistic_ranking && row.statistic_ranking.opponent_punt_average_rank) || null,
        opponent_punt_long_rank: (row.statistic_ranking && row.statistic_ranking.opponent_punt_long_rank) || null,
        opponent_field_goals_attempted_rank: (row.statistic_ranking && row.statistic_ranking.opponent_field_goals_attempted_rank) || null,
        opponent_field_goals_made_rank: (row.statistic_ranking && row.statistic_ranking.opponent_field_goals_made_rank) || null,
        opponent_field_goal_percentage_rank: (row.statistic_ranking && row.statistic_ranking.opponent_field_goal_percentage_rank) || null,
        opponent_field_goals_longest_made_rank: (row.statistic_ranking && row.statistic_ranking.opponent_field_goals_longest_made_rank) || null,
        opponent_extra_points_attempted_rank: (row.statistic_ranking && row.statistic_ranking.opponent_extra_points_attempted_rank) || null,
        opponent_extra_points_made_rank: (row.statistic_ranking && row.statistic_ranking.opponent_extra_points_made_rank) || null,
        opponent_interceptions_rank: (row.statistic_ranking && row.statistic_ranking.opponent_interceptions_rank) || null,
        opponent_interception_return_yards_rank: (row.statistic_ranking && row.statistic_ranking.opponent_interception_return_yards_rank) || null,
        opponent_interception_return_touchdowns_rank: (row.statistic_ranking && row.statistic_ranking.opponent_interception_return_touchdowns_rank) || null,
        opponent_solo_tackles_rank: (row.statistic_ranking && row.statistic_ranking.opponent_solo_tackles_rank) || null,
        opponent_assisted_tackles_rank: (row.statistic_ranking && row.statistic_ranking.opponent_assisted_tackles_rank) || null,
        opponent_tackles_for_loss_rank: (row.statistic_ranking && row.statistic_ranking.opponent_tackles_for_loss_rank) || null,
        opponent_sacks_rank: (row.statistic_ranking && row.statistic_ranking.opponent_sacks_rank) || null,
        opponent_passes_defended_rank: (row.statistic_ranking && row.statistic_ranking.opponent_passes_defended_rank) || null,
        opponent_fumbles_recovered_rank: (row.statistic_ranking && row.statistic_ranking.opponent_fumbles_recovered_rank) || null,
        opponent_fumble_return_touchdowns_rank: (row.statistic_ranking && row.statistic_ranking.opponent_fumble_return_touchdowns_rank) || null,
        opponent_quarterback_hurries_rank: (row.statistic_ranking && row.statistic_ranking.opponent_quarterback_hurries_rank) || null,
        opponent_fumbles_rank: (row.statistic_ranking && row.statistic_ranking.opponent_fumbles_rank) || null,
        opponent_fumbles_lost_rank: (row.statistic_ranking && row.statistic_ranking.opponent_fumbles_lost_rank) || null,
      });
    } else if (view === 'player') {
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
    } else if (view === 'conference') {
      if (
        !lastUpdated ||
        lastUpdated < row.date_of_rank
      ) {
        lastUpdated = row.date_of_rank;
      }
      row.name = conferences[row.conference_id].code;

      rows.push(row);
    } else if (view === 'coach') {
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


export const getRows = ({ view }) => {
  return getData({ view }).rows;
};

export const getLastUpdated = ({ view }) => {
  return getData({ view }).lastUpdated;
};


const DataHandler = ({ data }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setDataKey({ key: 'data', value: data }));
  }, [dispatch]);

  return null;
};

export default DataHandler;
