'use client';

import React from 'react';

import { Tooltip, Typography } from '@mui/material';

import RankSpan from '@/components/generic/RankSpan';
import Organization from '@/components/helpers/Organization';
import CBB from '@/components/helpers/CBB';
import CFB from '@/components/helpers/CFB';
import { StatisticRanking as StatsCBB } from '@/types/cbb';
import { StatisticRanking as StatsCFB } from '@/types/cfb';

// todo the types; StatsCBB | StatsCFB, but TS is annoying in this scenario, need to add type guard or something, so use any for now

const Team = ({ organization_id, division_id, season, teamStats }: { organization_id: string, division_id: string, season: number, teamStats: any }) => {
  const getMax = () => {
    if (Organization.isCFB()) {
      return CFB.getNumberOfTeams({ division_id, season });
    }

    return CBB.getNumberOfD1Teams(season);
  };

  const maxTeams = getMax();

  const getSections = () => {
    // Ones up here are shared by both CBB and CFB (for now)
    const marginRows = [
      {
        name: 'Win MR',
        title: 'Avg. Win margin',
        value: teamStats.win_margin,
        rank: teamStats.win_margin_rank,
      },
      {
        name: 'Loss MR',
        title: 'Avg. Loss margin',
        value: teamStats.loss_margin,
        rank: teamStats.loss_margin_rank,
      },
      {
        name: 'Conf. W MR',
        title: 'Avg. Conference win margin',
        value: teamStats.confwin_margin,
        rank: teamStats.confwin_margin_rank,
      },
      {
        name: 'Conf. L MR',
        title: 'Avg. Conference loss margin',
        value: teamStats.confloss_margin,
        rank: teamStats.confloss_margin_rank,
      },
    ];

    const recordRows = [
      {
        name: 'Wins',
        title: 'Total wins',
        value: teamStats.wins,
        rank: teamStats.wins_rank,
      },
      {
        name: 'Losses',
        title: 'Total losses',
        value: teamStats.losses,
        rank: teamStats.losses_rank,
      },
      {
        name: 'Conf. wins',
        title: 'Conference wins',
        value: teamStats.confwins,
        rank: teamStats.confwins_rank,
      },
      {
        name: 'Conf. losses',
        title: 'Conference losses',
        value: teamStats.conflosses,
        rank: teamStats.conflosses_rank,
      },
      {
        name: 'Neut. wins',
        title: 'Neutral wins',
        value: teamStats.neutralwins,
        rank: teamStats.neutralwins_rank,
      },
      {
        name: 'Neut. losses',
        title: 'Neutral losses',
        value: teamStats.neutrallosses,
        rank: teamStats.neutrallosses_rank,
      },
      {
        name: 'Home wins',
        title: 'Home wins',
        value: teamStats.homewins,
        rank: teamStats.homewins_rank,
      },
      {
        name: 'Home losses',
        title: 'Home losses',
        value: teamStats.homelosses,
        rank: teamStats.homelosses_rank,
      },
      {
        name: 'Road wins',
        title: 'Road wins',
        value: teamStats.roadwins,
        rank: teamStats.roadwins_rank,
      },
      {
        name: 'Road losses',
        title: 'Road losses',
        value: teamStats.roadlosses,
        rank: teamStats.roadlosses_rank,
      },
    ];

    if (Organization.isCFB()) {
      return [
        {
          name: 'Efficiency',
          rows: [
            {
              name: 'PTS',
              title: 'Points',
              value: teamStats.points,
              rank: teamStats.points_rank,
            },
            {
              name: 'QBR(c)',
              title: 'Passing rating (college)',
              value: teamStats.passing_rating_college,
              rank: teamStats.passing_rating_college_rank,
            },
            {
              name: 'QBR(p)',
              title: 'Passing rating (pro)',
              value: teamStats.passing_rating_pro,
              rank: teamStats.passing_rating_pro_rank,
            },
            {
              name: 'YPP',
              title: 'Yards per play',
              value: teamStats.yards_per_play,
              rank: teamStats.yards_per_play_rank,
            },
            {
              name: 'PPP',
              title: 'Points per play',
              value: teamStats.points_per_play,
              rank: teamStats.points_per_play_rank,
            },
            // {
            //   name: 'D-DVOA',
            //   title: 'Defensive DVOA',
            //   value: teamStats.defensive_dvoa,
            //   rank: teamStats.defensive_dvoa_rank,
            // },
            // {
            //   name: 'O-DVOA',
            //   title: 'Offensive DVOA',
            //   value: teamStats.offensive_dvoa,
            //   rank: teamStats.offensive_dvoa_rank,
            // },
          ],
        },
        {
          name: 'Passing',
          rows: [
            {
              name: 'Pass att.',
              title: 'Passing attempts',
              value: teamStats.passing_attempts,
              rank: teamStats.passing_attempts_rank,
            },
            {
              name: 'Pass comp.',
              title: 'Passing completions',
              value: teamStats.passing_completions,
              rank: teamStats.passing_completions_rank,
            },
            {
              name: 'Pass yards',
              title: 'Passing yards',
              value: teamStats.passing_yards,
              rank: teamStats.passing_yards_rank,
            },
            {
              name: 'Pass comp. %',
              title: 'Passing completions percentage',
              value: teamStats.passing_completion_percentage,
              rank: teamStats.passing_completion_percentage_rank,
            },
            {
              name: 'Pass yards per att.',
              title: 'Passing yard per attempt',
              value: teamStats.passing_yards_per_attempt,
              rank: teamStats.passing_yards_per_attempt_rank,
            },
            {
              name: 'Pass yards per comp.',
              title: 'Passing yards per completion',
              value: teamStats.passing_yards_per_completion,
              rank: teamStats.passing_yards_per_completion_rank,
            },
            {
              name: 'Pass TD',
              title: 'Passing touchdowns',
              value: teamStats.passing_touchdowns,
              rank: teamStats.passing_touchdowns_rank,
            },
            {
              name: 'Pass int.',
              title: 'Passing interceptions',
              value: teamStats.passing_interceptions,
              rank: teamStats.passing_interceptions_rank,
            },
            {
              name: 'QBR(p)',
              title: 'Quarter back rating (pro)',
              value: teamStats.passing_rating_pro,
              rank: teamStats.passing_rating_pro_rank,
            },
            {
              name: 'QBR(c)',
              title: 'Quarter back rating (college)',
              value: teamStats.passing_rating_college,
              rank: teamStats.passing_rating_college_rank,
            },
            {
              name: 'Pass long',
              title: 'Passing long',
              value: teamStats.passing_long,
              rank: teamStats.passing_long_rank,
            },
          ],
        },
        {
          name: 'Rushing',
          rows: [
            {
              name: 'Rush att.',
              title: 'Rushing attempts',
              value: teamStats.rushing_attempts,
              rank: teamStats.rushing_attempts_rank,
            },
            {
              name: 'Rush yards',
              title: 'Rushing yards',
              value: teamStats.rushing_yards,
              rank: teamStats.rushing_yards_rank,
            },
            {
              name: 'Rush yards per att.',
              title: 'Rushing yards per attempt',
              value: teamStats.rushing_yards_per_attempt,
              rank: teamStats.rushing_yards_per_attempt_rank,
            },
            {
              name: 'Rush TD',
              title: 'Rushing touchdowns',
              value: teamStats.rushing_touchdowns,
              rank: teamStats.rushing_touchdowns_rank,
            },
            {
              name: 'Rush long',
              title: 'Rushing long',
              value: teamStats.rushing_long,
              rank: teamStats.rushing_long_rank,
            },
          ],
        },
        {
          name: 'Recieving',
          rows: [
            {
              name: 'Receptions',
              title: '# of receptions',
              value: teamStats.receptions,
              rank: teamStats.receptions_rank,
            },
            {
              name: 'Rec. yards',
              title: 'Recieving yards',
              value: teamStats.receiving_yards,
              rank: teamStats.receiving_yards_rank,
            },
            {
              name: 'Rec. yards per recep.',
              title: 'Receiving yards per reception',
              value: teamStats.receiving_yards_per_reception,
              rank: teamStats.receiving_yards_per_reception_rank,
            },
            {
              name: 'Rec. TD',
              title: 'Receiving touchdowns',
              value: teamStats.receiving_touchdowns,
              rank: teamStats.receiving_touchdowns_rank,
            },
            {
              name: 'Rec. long',
              title: 'Receiving long',
              value: teamStats.receiving_long,
              rank: teamStats.receiving_long_rank,
            },
          ],
        },
        {
          name: 'Margin',
          rows: marginRows,
        },
        {
          name: 'Record',
          rows: recordRows,
        },
        {
          name: 'Defensive',
          rows: [
            {
              name: 'Opp. PTS',
              title: 'Opponent points',
              value: teamStats.opponent_points,
              rank: teamStats.opponent_points_rank,
            },
            {
              name: 'Opp. YPP',
              title: 'Opponent Yards per play',
              value: teamStats.opponent_yards_per_play,
              rank: teamStats.opponent_yards_per_play_rank,
            },
            {
              name: 'Opp. PPP',
              title: 'Opponent Points per play',
              value: teamStats.opponent_points_per_play,
              rank: teamStats.opponent_points_per_play_rank,
            },
            {
              name: 'Opp. Pass att.',
              title: 'Opponent Passing attempts',
              value: teamStats.opponent_passing_attempts,
              rank: teamStats.opponent_passing_attempts_rank,
            },
            {
              name: 'Opp. Pass comp.',
              title: 'Opponent Passing completions',
              value: teamStats.opponent_passing_completions,
              rank: teamStats.opponent_passing_completions_rank,
            },
            {
              name: 'Opp. Pass yards',
              title: 'Opponent Passing yards',
              value: teamStats.opponent_passing_yards,
              rank: teamStats.opponent_passing_yards_rank,
            },
            {
              name: 'Opp. Pass comp. %',
              title: 'Opponent Passing completions percentage',
              value: teamStats.opponent_passing_completion_percentage,
              rank: teamStats.opponent_passing_completion_percentage_rank,
            },
            {
              name: 'Opp. Pass yards per att.',
              title: 'Opponent Passing yard per attempt',
              value: teamStats.opponent_passing_yards_per_attempt,
              rank: teamStats.opponent_passing_yards_per_attempt_rank,
            },
            {
              name: 'Opp. Pass yards per comp.',
              title: 'Opponent Passing yards per completion',
              value: teamStats.opponent_passing_yards_per_completion,
              rank: teamStats.opponent_passing_yards_per_completion_rank,
            },
            {
              name: 'Opp. Pass TD',
              title: 'Opponent Passing touchdowns',
              value: teamStats.opponent_passing_touchdowns,
              rank: teamStats.opponent_passing_touchdowns_rank,
            },
            {
              name: 'Opp. Pass int.',
              title: 'Opponent Passing interceptions',
              value: teamStats.opponent_passing_interceptions,
              rank: teamStats.opponent_passing_interceptions_rank,
            },
            {
              name: 'Opp. QBR(p)',
              title: 'Opponent Quarter back rating (pro)',
              value: teamStats.opponent_passing_rating_pro,
              rank: teamStats.opponent_passing_rating_pro_rank,
            },
            {
              name: 'Opp. QBR(c)',
              title: 'Opponent Quarter back rating (college)',
              value: teamStats.opponent_passing_rating_college,
              rank: teamStats.opponent_passing_rating_college_rank,
            },
            {
              name: 'Opp. Pass long',
              title: 'Opponent Passing long',
              value: teamStats.opponent_passing_long,
              rank: teamStats.opponent_passing_long_rank,
            },
            {
              name: 'Opp. Rush att.',
              title: 'Opponent Rushing attempts',
              value: teamStats.opponent_rushing_attempts,
              rank: teamStats.opponent_rushing_attempts_rank,
            },
            {
              name: 'Opp. Rush yards',
              title: 'Opponent Rushing yards',
              value: teamStats.opponent_rushing_yards,
              rank: teamStats.opponent_rushing_yards_rank,
            },
            {
              name: 'Opp. Rush yards per att.',
              title: 'Opponent Rushing yards per attempt',
              value: teamStats.opponent_rushing_yards_per_attempt,
              rank: teamStats.opponent_rushing_yards_per_attempt_rank,
            },
            {
              name: 'Opp. Rush TD',
              title: 'Opponent Rushing touchdowns',
              value: teamStats.opponent_rushing_touchdowns,
              rank: teamStats.opponent_rushing_touchdowns_rank,
            },
            {
              name: 'Opp. Rush long',
              title: 'Opponent Rushing long',
              value: teamStats.opponent_rushing_long,
              rank: teamStats.opponent_rushing_long_rank,
            },
            {
              name: 'Opp. Receptions',
              title: 'Opponent # of receptions',
              value: teamStats.opponent_receptions,
              rank: teamStats.opponent_receptions_rank,
            },
            {
              name: 'Opp. Rec. yards',
              title: 'Opponent Recieving yards',
              value: teamStats.opponent_receiving_yards,
              rank: teamStats.opponent_receiving_yards_rank,
            },
            {
              name: 'Opp. Rec. yards per recep.',
              title: 'Opponent Receiving yards per reception',
              value: teamStats.opponent_receiving_yards_per_reception,
              rank: teamStats.opponent_receiving_yards_per_reception_rank,
            },
            {
              name: 'Opp. Rec. TD',
              title: 'Opponent Receiving touchdowns',
              value: teamStats.opponent_receiving_touchdowns,
              rank: teamStats.opponent_receiving_touchdowns_rank,
            },
            {
              name: 'Opp. Rec. long',
              title: 'Opponent Receiving long',
              value: teamStats.opponent_receiving_long,
              rank: teamStats.opponent_receiving_long_rank,
            },
          ],
        },
      ];
    }

    // defaulting to CBB
    return [
      {
        name: 'Efficiency',
        rows: [
          {
            name: 'aEM',
            title: 'Adjusted Efficiency margin',
            value: teamStats.adjusted_efficiency_rating,
            rank: teamStats.adjusted_efficiency_rating_rank,
          },
          {
            name: 'SOS',
            title: 'Strength of schedule',
            value: teamStats.opponent_efficiency_rating,
            rank: teamStats.opponent_efficiency_rating_rank,
          },
          {
            name: 'ORT',
            title: 'Offensive rating',
            value: teamStats.offensive_rating,
            rank: teamStats.offensive_rating_rank,
          },
          {
            name: 'DRT',
            title: 'Defensive rating',
            value: teamStats.defensive_rating,
            rank: teamStats.defensive_rating_rank,
          },
          {
            name: 'PTS Off.',
            title: 'Avg points scored',
            value: teamStats.points,
            rank: teamStats.points_rank,
          },
          {
            name: 'PTS Def.',
            title: 'Avg points allowed',
            value: teamStats.opponent_points,
            rank: teamStats.opponent_points_rank,
          },
        ],
      },
      {
        name: 'Offense',
        rows: [
          {
            name: 'FG',
            title: 'Field goals per game',
            value: teamStats.field_goal,
            rank: teamStats.field_goal_rank,
          },
          {
            name: 'FGA',
            title: 'Field goal attempts per game',
            value: teamStats.field_goal_attempts,
            rank: teamStats.field_goal_attempts_rank,
          },
          {
            name: 'FG%',
            title: 'Field goal percentage',
            value: teamStats.field_goal_percentage || `${0}%`,
            rank: teamStats.field_goal_percentage_rank,
          },
          {
            name: '2P',
            title: '2 point field goals per game',
            value: teamStats.two_point_field_goal,
            rank: teamStats.two_point_field_goal_rank,
          },
          {
            name: '2PA',
            title: '2 point field goal attempts per game',
            value: teamStats.two_point_field_goal_attempts,
            rank: teamStats.two_point_field_goal_attempts_rank,
          },
          {
            name: '2P%',
            title: '2 point field goal percentage',
            value: teamStats.two_point_field_goal_percentage || `${0}%`,
            rank: teamStats.two_point_field_goal_percentage_rank,
          },
          {
            name: '3P',
            title: '3 point field goals per game',
            value: teamStats.three_point_field_goal,
            rank: teamStats.three_point_field_goal_rank,
          },
          {
            name: '3PA',
            title: '3 point field goal attempts per game',
            value: teamStats.three_point_field_goal_attempts,
            rank: teamStats.three_point_field_goal_attempts_rank,
          },
          {
            name: '3P%',
            title: '3 point field goal percentage',
            value: teamStats.three_point_field_goal_percentage || `${0}%`,
            rank: teamStats.three_point_field_goal_percentage_rank,
          },
          {
            name: 'FT',
            title: 'Free throws per game',
            value: teamStats.free_throws,
            rank: teamStats.free_throws_rank,
          },
          {
            name: 'FTA',
            title: 'Free throw attempts per game',
            value: teamStats.free_throw_attempts,
            rank: teamStats.free_throw_attempts_rank,
          },
          {
            name: 'FT%',
            title: 'Free throw percentage',
            value: teamStats.free_throw_percentage || `${0}%`,
            rank: teamStats.free_throw_percentage_rank,
          },
        ],
      },
      {
        name: 'Special',
        rows: [
          {
            name: 'ORB',
            title: 'Offensive rebounds per game',
            value: teamStats.offensive_rebounds,
            rank: teamStats.offensive_rebounds_rank,
          },
          {
            name: 'DRB',
            title: 'Defensive rebounds per game',
            value: teamStats.defensive_rebounds,
            rank: teamStats.defensive_rebounds_rank,
          },
          {
            name: 'AST',
            title: 'Assists per game',
            value: teamStats.assists,
            rank: teamStats.assists_rank,
          },
          {
            name: 'STL',
            title: 'Steals per game',
            value: teamStats.steals,
            rank: teamStats.steals_rank,
          },
          {
            name: 'BLK',
            title: 'Blocks per game',
            value: teamStats.blocks,
            rank: teamStats.blocks_rank,
          },
          {
            name: 'TOV',
            title: 'Turnovers per game',
            value: teamStats.turnovers,
            rank: teamStats.turnovers_rank,
          },
          {
            name: 'PF',
            title: 'Turnovers per game',
            value: teamStats.fouls,
            rank: teamStats.fouls_rank,
          },
          {
            name: 'FE',
            title: 'Fatigue rating',
            value: teamStats.fatigue,
            rank: teamStats.fatigue_rank,
          },
          {
            name: 'DES',
            title: 'Desperation rating',
            value: teamStats.desperation,
            rank: teamStats.desperation_rank,
          },
          {
            name: 'OVC',
            title: 'Over confidence rating',
            value: teamStats.over_confidence,
            rank: teamStats.over_confidence_rank,
          },
        ],
      },
      {
        name: 'Margin',
        rows: marginRows,
      },
      {
        name: 'Record',
        rows: recordRows,
      },
      {
        name: 'Defensive',
        rows: [
          {
            name: 'FG',
            title: 'Oppenent field goals per game',
            value: teamStats.opponent_field_goal,
            rank: teamStats.opponent_field_goal_rank,
          },
          {
            name: 'FGA',
            title: 'Oppenent field goal attempts per game',
            value: teamStats.opponent_field_goal_attempts,
            rank: teamStats.opponent_field_goal_attempts_rank,
          },
          {
            name: 'FG%',
            title: 'Oppenent field goal percentage',
            value: teamStats.opponent_field_goal_percentage || `${0}%`,
            rank: teamStats.opponent_field_goal_percentage_rank,
          },
          {
            name: 'ORB',
            title: 'Oppenent Offensive rebounds per game',
            value: teamStats.opponent_offensive_rebounds,
            rank: teamStats.opponent_offensive_rebounds_rank,
          },
          {
            name: 'DRB',
            title: 'Oppenent Defensive rebounds per game',
            value: teamStats.opponent_defensive_rebounds,
            rank: teamStats.opponent_defensive_rebounds_rank,
          },
          {
            name: 'AST',
            title: 'Oppenent Assists per game',
            value: teamStats.opponent_assists,
            rank: teamStats.opponent_assists_rank,
          },
          {
            name: 'STL',
            title: 'Oppenent Steals per game',
            value: teamStats.opponent_steals,
            rank: teamStats.opponent_steals_rank,
          },
          {
            name: 'BLK',
            title: 'Oppenent Blocks per game',
            value: teamStats.opponent_blocks,
            rank: teamStats.opponent_blocks_rank,
          },
          {
            name: 'TOV',
            title: 'Oppenent Turnovers per game',
            value: teamStats.opponent_turnovers,
            rank: teamStats.opponent_turnovers_rank,
          },
          {
            name: 'PF',
            title: 'Oppenent Turnovers per game',
            value: teamStats.opponent_fouls,
            rank: teamStats.opponent_fouls_rank,
          },
        ],
      },
    ];
  };

  const sections = getSections();

  const getStatBlock = (statistic) => {
    return (
      <div key = {`${statistic.name}-div`} style = {{
        textAlign: 'center', flex: '1', minWidth: 100, maxWidth: 100, margin: 10,
      }}>
        <Tooltip key={statistic.name} disableFocusListener placement = 'top' title={statistic.title}><Typography color = {'text.secondary'} variant='body1'>{statistic.name}</Typography></Tooltip>
        {/* <hr style = {{'padding': 0, 'margin': 'auto', 'width': 50}} /> */}
        <div><Typography variant='caption'>{statistic.value || 0}</Typography>{statistic.rank ? <RankSpan rank = {statistic.rank} useOrdinal = {true} max = {maxTeams} /> : ''}</div>
      </div>
    );
  };


  return (
    <div style = {{ padding: '0px 5px' }}>
      {sections.map(({ name, rows }, sectionIndex) => {
        return (
          <>
            <Typography variant='h6'>{name}</Typography>
            <div style = {{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
              {rows.map((row) => {
                return getStatBlock(row);
              })}
            </div>
            {sectionIndex < sections.length - 1 ? <hr /> : ''}
          </>
        );
      })}
    </div>
  );
};

export default Team;
