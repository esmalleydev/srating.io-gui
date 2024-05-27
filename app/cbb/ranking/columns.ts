import { RankingColumns } from '@/types/cbb';


export const getHeaderColumns = ({ rankView }: {rankView: string}) => {
  const headCells: RankingColumns = {
    'composite_rank': {
      id: 'composite_rank',
      numeric: true,
      label: 'Rk',
      tooltip: 'srating.io Rank',
      'sticky': true,
      'disabled': true,
      'sort': 'lower',
    },
    'name': {
      id: 'name',
      numeric: false,
      label: (rankView === 'player' || rankView === 'transfer' ? 'Player' : (rankView === 'conference' ? 'Conference' : (rankView === 'coach' ? 'Coach': 'Team'))),
      tooltip: (rankView === 'player' || rankView === 'transfer' ? 'Player name' : (rankView === 'conference' ? 'Conference name' : (rankView === 'coach' ? 'Coach name': 'Team name'))),
      'sticky': true,
      'disabled': true,
    },
  };

  if (rankView !== 'coach') {
    Object.assign(headCells, {
      'field_goal': {
        id: 'field_goal',
        numeric: true,
        label: 'FG',
        tooltip: (rankView === 'player' || rankView === 'transfer' ? 'Total field goals made in season' : 'Average field goals per game'),
        'sort': 'higher',
      },
      'field_goal_attempts': {
        id: 'field_goal_attempts',
        numeric: true,
        label: 'FGA',
        tooltip: (rankView === 'player' || rankView === 'transfer' ? 'Total field goal attempts in season' : 'Average field goal attempts per game'),
        'sort': 'higher',
      },
      'field_goal_percentage': {
        id: 'field_goal_percentage',
        numeric: true,
        label: 'FG%',
        tooltip: 'Field goal percentage',
        'sort': 'higher',
      },
      'two_point_field_goal': {
        id: 'two_point_field_goal',
        numeric: true,
        label: '2FG',
        tooltip: (rankView === 'player' || rankView === 'transfer' ? 'Total two point field goals made in season' : 'Average two point field goals per game'),
        'sort': 'higher',
      },
      'two_point_field_goal_attempts': {
        id: 'two_point_field_goal_attempts',
        numeric: true,
        label: '2FGA',
        tooltip: (rankView === 'player' || rankView === 'transfer' ? 'Total two point field goal attempts in season' : 'Average two point field goal attempts per game'),
        'sort': 'higher',
      },
      'two_point_field_goal_percentage': {
        id: 'two_point_field_goal_percentage',
        numeric: true,
        label: '2FG%',
        tooltip: 'Two point field goal percentage',
        'sort': 'higher',
      },
      'three_point_field_goal': {
        id: 'three_point_field_goal',
        numeric: true,
        label: '3FG',
        tooltip: (rankView === 'player' || rankView === 'transfer' ? 'Total three point field goals made in season' : 'Average three point field goals per game'),
        'sort': 'higher',
      },
      'three_point_field_goal_attempts': {
        id: 'three_point_field_goal_attempts',
        numeric: true,
        label: '3FGA',
        tooltip: (rankView === 'player' || rankView === 'transfer' ? 'Total three field goal attempts in season' : 'Average three field goal attempts per game'),
        'sort': 'higher',
      },
      'three_point_field_goal_percentage': {
        id: 'three_point_field_goal_percentage',
        numeric: true,
        label: '3FG%',
        tooltip: 'Three field goal percentage',
        'sort': 'higher',
      },
      'free_throws': {
        id: 'free_throws',
        numeric: true,
        label: 'FT',
        tooltip: (rankView === 'player' || rankView === 'transfer' ? 'Total free throws made in season' : 'Average free throws per game'),
        'sort': 'higher',
      },
      'free_throw_attempts': {
        id: 'free_throw_attempts',
        numeric: true,
        label: 'FTA',
        tooltip: (rankView === 'player' || rankView === 'transfer' ? 'Total free throw attempts in season' : 'Average free throw attempts per game'),
        'sort': 'higher',
      },
      'free_throw_percentage': {
        id: 'free_throw_percentage',
        numeric: true,
        label: 'FT%',
        tooltip: 'Free throw percentage',
        'sort': 'higher',
      },
      'offensive_rebounds': {
        id: 'offensive_rebounds',
        numeric: true,
        label: 'ORB',
        tooltip: (rankView === 'player' || rankView === 'transfer' ? 'Total offensive rebounds in season' : 'Average offensive rebounds per game'),
        'sort': 'higher',
      },
      'defensive_rebounds': {
        id: 'defensive_rebounds',
        numeric: true,
        label: 'DRB',
        tooltip: (rankView === 'player' || rankView === 'transfer' ? 'Total defensive rebounds in season' : 'Average defensive rebounds per game'),
        'sort': 'higher',
      },
      'total_rebounds': {
        id: 'total_rebounds',
        numeric: true,
        label: 'TRB',
        tooltip: (rankView === 'player' || rankView === 'transfer' ? 'Total rebounds in season' : 'Average total rebounds per game'),
        'sort': 'higher',
      },
      'assists': {
        id: 'assists',
        numeric: true,
        label: 'AST',
        tooltip: (rankView === 'player' || rankView === 'transfer' ? 'Total assists in season' : 'Average assists per game'),
        'sort': 'higher',
      },
      'steals': {
        id: 'steals',
        numeric: true,
        label: 'STL',
        tooltip: (rankView === 'player' || rankView === 'transfer' ? 'Total steals in season' : 'Average steals per game'),
        'sort': 'higher',
      },
      'blocks': {
        id: 'blocks',
        numeric: true,
        label: 'BLK',
        tooltip: (rankView === 'player' || rankView === 'transfer' ? 'Total blocks in season' : 'Average blocks per game'),
        'sort': 'higher',
      },
      'turnovers': {
        id: 'turnovers',
        numeric: true,
        label: 'TOV',
        tooltip: (rankView === 'player' || rankView === 'transfer' ? 'Total turnovers in season' : 'Average turnovers per game'),
        'sort': 'lower',
      },
      'fouls': {
        id: 'fouls',
        numeric: true,
        label: 'PF',
        tooltip: (rankView === 'player' || rankView === 'transfer' ? 'Total fouls in season' : 'Average fouls per game'),
        'sort': 'lower',
      },
      'points': {
        id: 'points',
        numeric: true,
        label: 'PTS',
        tooltip: (rankView === 'player' || rankView === 'transfer' ? 'Total points in season' : 'Average points per game'),
        'sort': 'higher',
      },
      'offensive_rating': {
        id: 'offensive_rating',
        numeric: true,
        label: 'ORT',
        tooltip: 'Offensive rating ((PTS / Poss) * 100)',
        'sort': 'higher',
      },
      'defensive_rating': {
        id: 'defensive_rating',
        numeric: true,
        label: 'DRT',
        tooltip: 'Defensive rating ((Opp. PTS / Opp. Poss) * 100)',
        'sort': 'lower',
      },
      'efficiency_rating': {
        id: 'efficiency_rating',
        numeric: true,
        label: (rankView === 'team' ? 'EM' : 'ERT'),
        tooltip: (rankView === 'team' ? 'Efficiency margin (Offensive rating - Defensive rating)' : 'Efficiency rating'),
        'sort': 'higher',
      },
    });
  }

  if (rankView === 'team') {
    Object.assign(headCells, {
      // 'adj_elo': {
      //   id: 'adj_elo',
      //   numeric: true,
      //   label: 'adj sRating',
      //   tooltip: 'srating.io aELO rating',
      //   'sort': 'higher',
      // },
      'conference_code': {
        id: 'conference_code',
        numeric: false,
        label: 'Conf.',
        tooltip: 'Conference',
      },
      'ap_rank': {
        id: 'ap_rank',
        numeric: true,
        label: 'AP',
        tooltip: 'Associated Press rank',
        'sort': 'lower',
      },
      'wins': {
        id: 'wins',
        numeric: false,
        label: 'W/L',
        tooltip: 'Win/Loss',
        'sort': 'higher',
      },
      'conf_record': {
        id: 'conf_record',
        numeric: false,
        label: 'CR',
        tooltip: 'Conference Record Win/Loss',
        'sort': 'higher',
      },
      'neutralwins': {
        id: 'neutralwins',
        numeric: true,
        label: 'Neut. wins',
        tooltip: 'Neutral wins',
        sort: 'higher',
      },
      'neutrallosses': {
        id: 'neutrallosses',
        numeric: true,
        label: 'Neut. losses',
        tooltip: 'Neutral losses',
        sort: 'lower',
      },
      'homewins': {
        id: 'homewins',
        numeric: true,
        label: 'Home wins',
        tooltip: 'Home wins',
        sort: 'higher',
      },
      'homelosses': {
        id: 'homelosses',
        numeric: true,
        label: 'Home losses',
        tooltip: 'Home losses',
        sort: 'lower',
      },
      'roadwins': {
        id: 'roadwins',
        numeric: true,
        label: 'Road wins',
        tooltip: 'Road wins',
        sort: 'higher',
      },
      'roadlosses': {
        id: 'roadlosses',
        numeric: true,
        label: 'Road losses',
        tooltip: 'Road losses',
        sort: 'lower',
      },
      'streak': {
        id: 'streak',
        numeric: true,
        label: 'Streak',
        tooltip: 'Number of wins or losses in a row (negative for loss)',
        sort: 'higher',
      },
      'win_margin': {
        id: 'win_margin',
        numeric: true,
        label: 'Win margin',
        tooltip: 'Win margin',
        sort: 'higher',
      },
      'loss_margin': {
        id: 'loss_margin',
        numeric: true,
        label: 'Loss margin',
        tooltip: 'Loss margin',
        sort: 'lower',
      },
      'confwin_margin': {
        id: 'confwin_margin',
        numeric: true,
        label: 'C Win margin',
        tooltip: 'Conference Win margin',
        sort: 'higher',
      },
      'confloss_margin': {
        id: 'confloss_margin',
        numeric: true,
        label: 'C Loss margin',
        tooltip: 'Conference Loss margin',
        sort: 'lower',
      },
      'kenpom_rank': {
        id: 'kenpom_rank',
        numeric: true,
        label: 'KP',
        tooltip: 'kenpom.com rank',
        'sort': 'lower',
      },
      'srs_rank': {
        id: 'srs_rank',
        numeric: true,
        label: 'SRS',
        tooltip: 'Simple rating system rank',
        'sort': 'lower',
      },
      'net_rank': {
        id: 'net_rank',
        numeric: true,
        label: 'NET',
        tooltip: 'NET rank',
        'sort': 'lower',
      },
      'elo': {
        id: 'elo',
        numeric: true,
        label: 'SR',
        tooltip: 'srating.io ELO rating',
        'sort': 'higher',
      },
      'coaches_rank': {
        id: 'coaches_rank',
        numeric: true,
        label: 'Coaches',
        tooltip: 'Coaches poll rank',
        'sort': 'lower',
      },
      'possessions': {
        id: 'possessions',
        numeric: true,
        label: 'Poss.',
        tooltip: 'Average possessions per game',
        'sort': 'higher',
      },
      'pace': {
        id: 'pace',
        numeric: true,
        label: 'Pace',
        tooltip: 'Average pace per game',
        'sort': 'higher',
      },
      'adjusted_efficiency_rating': {
        id: 'adjusted_efficiency_rating',
        numeric: true,
        label: 'aEM',
        tooltip: 'Adjusted Efficiency margin (Offensive rating - Defensive rating) + aSOS',
        'sort': 'higher',
      },
      'opponent_offensive_rating': {
        id: 'opponent_offensive_rating',
        numeric: true,
        label: 'oORT',
        tooltip: 'Opponent average Offensive rating',
        'sort': 'higher',
      },
      'opponent_defensive_rating': {
        id: 'opponent_defensive_rating',
        numeric: true,
        label: 'oDRT',
        tooltip: 'Opponent average Defensive rating ',
        'sort': 'lower',
      },
      'opponent_efficiency_rating': {
        id: 'opponent_efficiency_rating',
        numeric: true,
        label: 'aSOS',
        tooltip: 'Strength of schedule (Opponent Efficiency margin (oORT - oDRT))',
        'sort': 'higher',
      },
      'elo_sos': {
        id: 'elo_sos',
        numeric: true,
        label: 'eSOS',
        tooltip: 'Strength of schedule (opponent elo)',
        'sort': 'higher',
      },
      'opponent_field_goal': {
        id: 'opponent_field_goal',
        numeric: true,
        label: 'Opp. FG',
        tooltip: 'Opponent average field goals per game',
        'sort': 'lower',
      },
      'opponent_field_goal_attempts': {
        id: 'opponent_field_goal_attempts',
        numeric: true,
        label: 'Opp. FGA',
        tooltip: 'Opponent average field goal attempts per game',
        'sort': 'lower',
      },
      'opponent_field_goal_percentage': {
        id: 'opponent_field_goal_percentage',
        numeric: true,
        label: 'Opp. FG%',
        tooltip: 'Opponent average field goal percentage per game',
        'sort': 'lower',
      },
      'opponent_two_point_field_goal': {
        id: 'opponent_two_point_field_goal',
        numeric: true,
        label: 'Opp. 2FG',
        tooltip: 'Opponent average two point field goals per game',
        'sort': 'lower',
      },
      'opponent_two_point_field_goal_attempts': {
        id: 'opponent_two_point_field_goal_attempts',
        numeric: true,
        label: 'Opp. 2FGA',
        tooltip: 'Opponent average two point field goal attempts per game',
        'sort': 'lower',
      },
      'opponent_two_point_field_goal_percentage': {
        id: 'opponent_two_point_field_goal_percentage',
        numeric: true,
        label: 'Opp. 2FG%',
        tooltip: 'Opponent average two point field goal percentage per game',
        'sort': 'lower',
      },
      'opponent_three_point_field_goal': {
        id: 'opponent_three_point_field_goal',
        numeric: true,
        label: 'Opp. 3FG',
        tooltip: 'Opponent average three point field goals per game',
        'sort': 'lower',
      },
      'opponent_three_point_field_goal_attempts': {
        id: 'opponent_three_point_field_goal_attempts',
        numeric: true,
        label: 'Opp. 3FGA',
        tooltip: 'Opponent average three point field goal attempts per game',
        'sort': 'lower',
      },
      'opponent_three_point_field_goal_percentage': {
        id: 'opponent_three_point_field_goal_percentage',
        numeric: true,
        label: 'Opp. 3FG%',
        tooltip: 'Opponent average three point field goal percentage per game',
        'sort': 'lower',
      },
      'opponent_free_throws': {
        id: 'opponent_free_throws',
        numeric: true,
        label: 'Opp. FT',
        tooltip: 'Opponent average free throws per game',
        'sort': 'lower',
      },
      'opponent_free_throw_attempts': {
        id: 'opponent_free_throw_attempts',
        numeric: true,
        label: 'Opp. FTA',
        tooltip: 'Opponent average free throw attempts per game',
        'sort': 'lower',
      },
      'opponent_free_throw_percentage': {
        id: 'opponent_free_throw_percentage',
        numeric: true,
        label: 'Opp. FT%',
        tooltip: 'Opponent average free throw percentage per game',
        'sort': 'lower',
      },
      'opponent_offensive_rebounds': {
        id: 'opponent_offensive_rebounds',
        numeric: true,
        label: 'Opp. ORB',
        tooltip: 'Opponent average offensive rebounds per game',
        'sort': 'lower',
      },
      'opponent_defensive_rebounds': {
        id: 'opponent_defensive_rebounds',
        numeric: true,
        label: 'Opp. DRB',
        tooltip: 'Opponent average defensive rebounds per game',
        'sort': 'lower',
      },
      'opponent_total_rebounds': {
        id: 'opponent_total_rebounds',
        numeric: true,
        label: 'Opp. TRB',
        tooltip: 'Opponent average total rebounds per game',
        'sort': 'lower',
      },
      'opponent_assists': {
        id: 'opponent_assists',
        numeric: true,
        label: 'Opp. AST',
        tooltip: 'Opponent average assists per game',
        'sort': 'lower',
      },
      'opponent_steals': {
        id: 'opponent_steals',
        numeric: true,
        label: 'Opp. STL',
        tooltip: 'Opponent average steals per game',
        'sort': 'lower',
      },
      'opponent_blocks': {
        id: 'opponent_blocks',
        numeric: true,
        label: 'Opp. BLK',
        tooltip: 'Opponent average blocks per game',
        'sort': 'lower',
      },
      'opponent_turnovers': {
        id: 'opponent_turnovers',
        numeric: true,
        label: 'Opp. TOV',
        tooltip: 'Opponent average turnovers per game',
        'sort': 'higher',
      },
      'opponent_fouls': {
        id: 'opponent_fouls',
        numeric: true,
        label: 'Opp. PF',
        tooltip: 'Opponent average fouls per game',
        'sort': 'higher',
      },
      'opponent_points': {
        id: 'opponent_points',
        numeric: true,
        label: 'Opp. PTS',
        tooltip: 'Opponent average points per game',
        'sort': 'lower',
      },
      'opponent_possessions': {
        id: 'opponent_possessions',
        numeric: true,
        label: 'Opp. Poss.',
        tooltip: 'Opponent average possessions per game',
        'sort': 'lower',
      },
    });
  } else if (rankView === 'player' || rankView === 'transfer') {
    if (rankView === 'transfer') {
      Object.assign(headCells, {
        'committed': {
          id: 'committed',
          numeric: false,
          label: 'Committed',
          tooltip: 'Player committed',
        },
        'committed_team_name': {
          id: 'committed_team_name',
          numeric: false,
          label: 'New team',
          tooltip: 'New (committed) team name',
        },
      });
    }
    Object.assign(headCells, {
      'team_name': {
        id: 'team_name',
        numeric: false,
        label: (rankView === 'transfer' ? 'Prev. team' : 'Team'),
        tooltip: (rankView === 'transfer' ? 'Previous team name' : 'Team name'),
      },
      'games': {
        id: 'games',
        numeric: false,
        label: 'G',
        tooltip: 'Games played',
      },
      'position': {
        id: 'position',
        numeric: false,
        label: 'Position',
        tooltip: 'Player position',
      },
      'number': {
        id: 'number',
        numeric: false,
        label: 'Number',
        tooltip: 'Jersey number',
      },
      'height': {
        id: 'height',
        numeric: false,
        label: 'Height',
        tooltip: 'Player height',
      },
      'minutes_played': {
        id: 'minutes_played',
        numeric: true,
        label: 'MP',
        tooltip: 'Total minutes played',
        'sort': 'higher',
      },
      'minutes_per_game': {
        id: 'minutes_per_game',
        numeric: true,
        label: 'MPG',
        tooltip: 'Minutes played per game',
        'sort': 'higher',
      },
      'points_per_game': {
        id: 'points_per_game',
        numeric: true,
        label: 'PPG',
        tooltip: 'Points per game',
        'sort': 'higher',
      },
      'offensive_rebounds_per_game': {
        id: 'offensive_rebounds_per_game',
        numeric: true,
        label: 'ORB-G',
        tooltip: 'Offensive rebounds per game',
        'sort': 'higher',
      },
      'defensive_rebounds_per_game': {
        id: 'defensive_rebounds_per_game',
        numeric: true,
        label: 'DRB-G',
        tooltip: 'Defensive rebounds per game',
        'sort': 'higher',
      },
      'total_rebounds_per_game': {
        id: 'total_rebounds_per_game',
        numeric: true,
        label: 'TRB-G',
        tooltip: 'Total rebounds per game',
        'sort': 'higher',
      },
      'assists_per_game': {
        id: 'assists_per_game',
        numeric: true,
        label: 'AST-G',
        tooltip: 'Assists per game',
        'sort': 'higher',
      },
      'steals_per_game': {
        id: 'steals_per_game',
        numeric: true,
        label: 'STL-G',
        tooltip: 'Steals per game',
        'sort': 'higher',
      },
      'blocks_per_game': {
        id: 'blocks_per_game',
        numeric: true,
        label: 'BLK-G',
        tooltip: 'Blocks per game',
        'sort': 'higher',
      },
      'turnovers_per_game': {
        id: 'turnovers_per_game',
        numeric: true,
        label: 'TO-G',
        tooltip: 'Blocks per game',
        'sort': 'higher',
      },
      'fouls_per_game': {
        id: 'fouls_per_game',
        numeric: true,
        label: 'PF-G',
        tooltip: 'Fouls per game',
        'sort': 'higher',
      },
      'player_efficiency_rating': {
        id: 'player_efficiency_rating',
        numeric: true,
        label: 'PER',
        tooltip: 'Player efficiency rating metric',
        'sort': 'higher',
      },
      'true_shooting_percentage': {
        id: 'true_shooting_percentage',
        numeric: true,
        label: 'TS%',
        tooltip: 'True shooting percentage, takes into account all field goals and free throws.',
        'sort': 'higher',
      },
      'effective_field_goal_percentage': {
        id: 'effective_field_goal_percentage',
        numeric: true,
        label: 'eFG%',
        tooltip: 'Effective field goal percentage, adjusted field goal % since 3 points greater than 2.',
        'sort': 'higher',
      },
      'offensive_rebound_percentage': {
        id: 'offensive_rebound_percentage',
        numeric: true,
        label: 'ORB%',
        tooltip: 'Offensive rebound percentage, estimate of % of offensive rebounds player had while on floor.',
        'sort': 'higher',
      },
      'defensive_rebound_percentage': {
        id: 'defensive_rebound_percentage',
        numeric: true,
        label: 'DRB%',
        tooltip: 'Defensive rebound percentage, estimate of % of defensive rebounds player had while on floor.',
        'sort': 'higher',
      },
      'total_rebound_percentage': {
        id: 'total_rebound_percentage',
        numeric: true,
        label: 'TRB%',
        tooltip: 'Total rebound percentage, estimate of % of total rebounds player had while on floor.',
        'sort': 'higher',
      },
      'assist_percentage': {
        id: 'assist_percentage',
        numeric: true,
        label: 'AST%',
        tooltip: 'Assist percentage, estimate of % of assists player had while on floor.',
        'sort': 'higher',
      },
      'steal_percentage': {
        id: 'steal_percentage',
        numeric: true,
        label: 'STL%',
        tooltip: 'Steal percentage, estimate of % of steals player had while on floor.',
        'sort': 'higher',
      },
      'block_percentage': {
        id: 'block_percentage',
        numeric: true,
        label: 'BLK%',
        tooltip: 'Block percentage, estimate of % of blocks player had while on floor.',
        'sort': 'higher',
      },
      'turnover_percentage': {
        id: 'turnover_percentage',
        numeric: true,
        label: 'TOV%',
        tooltip: 'Turnover percentage, estimate of % of turnovers player had while on floor.',
        'sort': 'higher',
      },
      'usage_percentage': {
        id: 'usage_percentage',
        numeric: true,
        label: 'USG%',
        tooltip: 'Usage percentage, estimate of % of plays ran through player while on floor.',
        'sort': 'higher',
      },
    });
  } else if (rankView === 'conference') {
    Object.assign(headCells, {
      // 'adj_elo': {
      //   id: 'adj_elo',
      //   numeric: true,
      //   label: 'adj sRating',
      //   tooltip: 'srating.io aELO rating',
      //   'sort': 'higher',
      // },
      'elo': {
        id: 'elo',
        numeric: true,
        label: 'SR',
        tooltip: 'srating.io ELO rating',
        'sort': 'higher',
      },
      'wins': {
        id: 'wins',
        numeric: false,
        label: 'W',
        tooltip: 'Avg. Wins',
        'sort': 'higher',
      },
      'losses': {
        id: 'losses',
        numeric: false,
        label: 'L',
        tooltip: 'Avg. Losses',
        'sort': 'lower',
      },
      'nonconfwins': {
        id: 'nonconfwins',
        numeric: false,
        label: 'NONC W',
        tooltip: 'Non-Conference Avg. Wins',
        'sort': 'higher',
      },
      'nonconflosses': {
        id: 'nonconflosses',
        numeric: false,
        label: 'NONC L',
        tooltip: 'Non-Conference Avg. Losses',
        'sort': 'lower',
      },
      'nonconfwin_margin': {
        id: 'nonconfwin_margin',
        numeric: false,
        label: 'NONC W Margin',
        tooltip: 'Non-Conference Avg. Win Margin',
        'sort': 'higher',
      },
      'nonconfloss_margin': {
        id: 'nonconfloss_margin',
        numeric: false,
        label: 'NONC L Margin',
        tooltip: 'Non-Conference Avg. Loss Margin',
        'sort': 'lower',
      },
      'possessions': {
        id: 'possessions',
        numeric: true,
        label: 'Poss.',
        tooltip: 'Average possessions per game',
        'sort': 'higher',
      },
      'pace': {
        id: 'pace',
        numeric: true,
        label: 'Pace',
        tooltip: 'Average pace per game',
        'sort': 'higher',
      },
      'adjusted_efficiency_rating': {
        id: 'adjusted_efficiency_rating',
        numeric: true,
        label: 'aEM',
        tooltip: 'Adjusted Efficiency margin (Offensive rating - Defensive rating) + aSOS',
        'sort': 'higher',
      },
      'opponent_offensive_rating': {
        id: 'opponent_offensive_rating',
        numeric: true,
        label: 'oORT',
        tooltip: 'Opponent average Offensive rating',
        'sort': 'higher',
      },
      'opponent_defensive_rating': {
        id: 'opponent_defensive_rating',
        numeric: true,
        label: 'oDRT',
        tooltip: 'Opponent average Defensive rating ',
        'sort': 'lower',
      },
      'opponent_efficiency_rating': {
        id: 'opponent_efficiency_rating',
        numeric: true,
        label: 'aSOS',
        tooltip: 'Strength of schedule (Opponent Efficiency margin (oORT - oDRT))',
        'sort': 'higher',
      },
      'elo_sos': {
        id: 'elo_sos',
        numeric: true,
        label: 'eSOS',
        tooltip: 'Strength of schedule (opponent elo)',
        'sort': 'higher',
      },
      'opponent_field_goal': {
        id: 'opponent_field_goal',
        numeric: true,
        label: 'Opp. FG',
        tooltip: 'Opponent average field goals per game',
        'sort': 'lower',
      },
      'opponent_field_goal_attempts': {
        id: 'opponent_field_goal_attempts',
        numeric: true,
        label: 'Opp. FGA',
        tooltip: 'Opponent average field goal attempts per game',
        'sort': 'lower',
      },
      'opponent_field_goal_percentage': {
        id: 'opponent_field_goal_percentage',
        numeric: true,
        label: 'Opp. FG%',
        tooltip: 'Opponent average field goal percentage per game',
        'sort': 'lower',
      },
      'opponent_two_point_field_goal': {
        id: 'opponent_two_point_field_goal',
        numeric: true,
        label: 'Opp. 2FG',
        tooltip: 'Opponent average two point field goals per game',
        'sort': 'lower',
      },
      'opponent_two_point_field_goal_attempts': {
        id: 'opponent_two_point_field_goal_attempts',
        numeric: true,
        label: 'Opp. 2FGA',
        tooltip: 'Opponent average two point field goal attempts per game',
        'sort': 'lower',
      },
      'opponent_two_point_field_goal_percentage': {
        id: 'opponent_two_point_field_goal_percentage',
        numeric: true,
        label: 'Opp. 2FG%',
        tooltip: 'Opponent average two point field goal percentage per game',
        'sort': 'lower',
      },
      'opponent_three_point_field_goal': {
        id: 'opponent_three_point_field_goal',
        numeric: true,
        label: 'Opp. 3FG',
        tooltip: 'Opponent average three point field goals per game',
        'sort': 'lower',
      },
      'opponent_three_point_field_goal_attempts': {
        id: 'opponent_three_point_field_goal_attempts',
        numeric: true,
        label: 'Opp. 3FGA',
        tooltip: 'Opponent average three point field goal attempts per game',
        'sort': 'lower',
      },
      'opponent_three_point_field_goal_percentage': {
        id: 'opponent_three_point_field_goal_percentage',
        numeric: true,
        label: 'Opp. 3FG%',
        tooltip: 'Opponent average three point field goal percentage per game',
        'sort': 'lower',
      },
      'opponent_free_throws': {
        id: 'opponent_free_throws',
        numeric: true,
        label: 'Opp. FT',
        tooltip: 'Opponent average free throws per game',
        'sort': 'lower',
      },
      'opponent_free_throw_attempts': {
        id: 'opponent_free_throw_attempts',
        numeric: true,
        label: 'Opp. FTA',
        tooltip: 'Opponent average free throw attempts per game',
        'sort': 'lower',
      },
      'opponent_free_throw_percentage': {
        id: 'opponent_free_throw_percentage',
        numeric: true,
        label: 'Opp. FT%',
        tooltip: 'Opponent average free throw percentage per game',
        'sort': 'lower',
      },
      'opponent_offensive_rebounds': {
        id: 'opponent_offensive_rebounds',
        numeric: true,
        label: 'Opp. ORB',
        tooltip: 'Opponent average offensive rebounds per game',
        'sort': 'lower',
      },
      'opponent_defensive_rebounds': {
        id: 'opponent_defensive_rebounds',
        numeric: true,
        label: 'Opp. DRB',
        tooltip: 'Opponent average defensive rebounds per game',
        'sort': 'lower',
      },
      'opponent_total_rebounds': {
        id: 'opponent_total_rebounds',
        numeric: true,
        label: 'Opp. TRB',
        tooltip: 'Opponent average total rebounds per game',
        'sort': 'lower',
      },
      'opponent_assists': {
        id: 'opponent_assists',
        numeric: true,
        label: 'Opp. AST',
        tooltip: 'Opponent average assists per game',
        'sort': 'lower',
      },
      'opponent_steals': {
        id: 'opponent_steals',
        numeric: true,
        label: 'Opp. STL',
        tooltip: 'Opponent average steals per game',
        'sort': 'lower',
      },
      'opponent_blocks': {
        id: 'opponent_blocks',
        numeric: true,
        label: 'Opp. BLK',
        tooltip: 'Opponent average blocks per game',
        'sort': 'lower',
      },
      'opponent_turnovers': {
        id: 'opponent_turnovers',
        numeric: true,
        label: 'Opp. TOV',
        tooltip: 'Opponent average turnovers per game',
        'sort': 'higher',
      },
      'opponent_fouls': {
        id: 'opponent_fouls',
        numeric: true,
        label: 'Opp. PF',
        tooltip: 'Opponent average fouls per game',
        'sort': 'higher',
      },
      'opponent_points': {
        id: 'opponent_points',
        numeric: true,
        label: 'Opp. PTS',
        tooltip: 'Opponent average points per game',
        'sort': 'lower',
      },
      'opponent_possessions': {
        id: 'opponent_possessions',
        numeric: true,
        label: 'Opp. Poss.',
        tooltip: 'Opponent average possessions per game',
        'sort': 'lower',
      },
    });
  } else if (rankView === 'coach') {
    Object.assign(headCells, {
      'team_name': {
        id: 'team_name',
        numeric: false,
        label: 'Team',
        tooltip: 'Team name',
      },
      'games': {
        id: 'games',
        numeric: true,
        label: 'G',
        tooltip: 'Total games',
        'sort': 'higher',
      },
      'elo': {
        id: 'elo',
        numeric: true,
        label: 'SR',
        tooltip: 'srating.io ELO rating',
        'sort': 'higher',
      },
      'wins': {
        id: 'wins',
        numeric: false,
        label: 'W',
        tooltip: 'Total Wins',
        'sort': 'higher',
      },
      'losses': {
        id: 'losses',
        numeric: false,
        label: 'L',
        tooltip: 'Total Losses',
        'sort': 'lower',
      },
      'confwins': {
        id: 'confwins',
        numeric: false,
        label: 'CONF W',
        tooltip: 'Conference Total Wins',
        'sort': 'higher',
      },
      'conflosses': {
        id: 'conflosses',
        numeric: false,
        label: 'CONF L',
        tooltip: 'Conference Total Losses',
        'sort': 'lower',
      },
      'nonconfwins': {
        id: 'nonconfwins',
        numeric: false,
        label: 'NONC W',
        tooltip: 'Non-Conference Total Wins',
        'sort': 'higher',
      },
      'nonconflosses': {
        id: 'nonconflosses',
        numeric: false,
        label: 'NONC L',
        tooltip: 'Non-Conference Total Losses',
        'sort': 'lower',
      },
      'neutralwins': {
        id: 'neutralwins',
        numeric: true,
        label: 'Neut. wins',
        tooltip: 'Neutral wins',
        sort: 'higher',
      },
      'neutrallosses': {
        id: 'neutrallosses',
        numeric: true,
        label: 'Neut. losses',
        tooltip: 'Neutral losses',
        sort: 'lower',
      },
      'homewins': {
        id: 'homewins',
        numeric: true,
        label: 'Home wins',
        tooltip: 'Home wins',
        sort: 'higher',
      },
      'homelosses': {
        id: 'homelosses',
        numeric: true,
        label: 'Home losses',
        tooltip: 'Home losses',
        sort: 'lower',
      },
      'roadwins': {
        id: 'roadwins',
        numeric: true,
        label: 'Road wins',
        tooltip: 'Road wins',
        sort: 'higher',
      },
      'roadlosses': {
        id: 'roadlosses',
        numeric: true,
        label: 'Road losses',
        tooltip: 'Road losses',
        sort: 'lower',
      },
      'elo_sos': {
        id: 'elo_sos',
        numeric: true,
        label: 'eSOS',
        tooltip: 'Strength of schedule (opponent elo)',
        'sort': 'higher',
      },
      'win_percentage': {
        id: 'win_percentage',
        numeric: true,
        label: 'W%',
        tooltip: 'Win percentage',
        'sort': 'higher',
      },
      'conf_win_percentage': {
        id: 'conf_win_percentage',
        numeric: true,
        label: 'C%',
        tooltip: 'Conference win percentage',
        'sort': 'higher',
      },
      'nonconf_win_percentage': {
        id: 'non_conf_win_percentage',
        numeric: true,
        label: 'NON C%',
        tooltip: 'Non-Conference win percentage',
        'sort': 'higher',
      },
      'home_win_percentage': {
        id: 'home_win_percentage',
        numeric: true,
        label: 'H%',
        tooltip: 'Home win percentage',
        'sort': 'higher',
      },
      'road_win_percentage': {
        id: 'road_win_percentage',
        numeric: true,
        label: 'R%',
        tooltip: 'Road win percentage',
        'sort': 'higher',
      },
      'neutral_win_percentage': {
        id: 'neutral_win_percentage',
        numeric: true,
        label: 'N%',
        tooltip: 'Neutral win percentage',
        'sort': 'higher',
      },
    });
  }

  return headCells;
};
