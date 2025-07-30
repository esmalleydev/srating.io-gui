'use client';

/* eslint-disable no-nested-ternary */

import { PlayerBoxscore } from '@/types/cbb';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import Organization from '@/components/helpers/Organization';
import HelperGame from '@/components/helpers/Game';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { setLoading } from '@/redux/features/display-slice';
import { footerNavigationHeight } from '@/components/generic/FooterNavigation';
import { headerBarHeight } from '@/components/generic/Header';
import { LinearProgress } from '@mui/material';
import { useTheme } from '@/components/hooks/useTheme';
import moment from 'moment';
import { getNavHeaderHeight } from '../../NavBar';
import { getSubNavHeaderHeight } from '../../SubNavbar';
import RankTable from '@/components/generic/RankTable';

/**
 * The main wrapper div for all the contents
 */
const Contents = ({ children }): React.JSX.Element => {
  return (
    <div style = {{ padding: 5 }}>
      {children}
    </div>
  );
};


const ClientSkeleton = () => {
  const paddingTop = getNavHeaderHeight() + getSubNavHeaderHeight();

  const heightToRemove = paddingTop + footerNavigationHeight + headerBarHeight + 84;
  return (
    <Contents>
      <div style = {{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: `calc(100vh - ${heightToRemove}px)`,
      }}>
        <LinearProgress color = 'secondary' style={{ width: '50%' }} />
      </div>
    </Contents>
  );
};

const Client = ({ organization_id, gamelogs }) => {
  const dispatch = useAppDispatch();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const theme = useTheme();

  // const player = useAppSelector((state) => state.playerReducer.player);
  const organizations = useAppSelector((state) => state.dictionaryReducer.organization);
  const path = Organization.getPath({ organizations, organization_id });
  const playerColumns = ['game_details', 'minutes_played', 'points', 'fg', 'two_fg', 'three_fg', 'ft', 'offensive_rebounds', 'defensive_rebounds', 'assists', 'steals', 'blocks', 'turnovers', 'fouls'];
  const season = useAppSelector((state) => state.playerReducer.season);
  const subview = useAppSelector((state) => state.playerReducer.subview);

  const playerBoxscoreHeaderColumns = {
    game_details: {
      id: 'game_details',
      numeric: false,
      label: 'Game',
      tooltip: 'Game',
      sticky: true,
    },
    minutes_played: {
      id: 'minutes_played',
      label: 'MP',
      tooltip: 'Minutes played',
      sort: 'higher',
      numeric: true,
    },
    points: {
      id: 'points',
      label: 'PTS',
      tooltip: 'Points',
      sort: 'higher',
      numeric: true,
    },
    fg: {
      id: 'fg',
      label: 'FG',
      tooltip: 'Field goals',
      sort: 'higher',
      numeric: true,
    },
    two_fg: {
      id: 'two_fg',
      label: '2P',
      tooltip: '2 point field goals',
      sort: 'higher',
      numeric: true,
    },
    three_fg: {
      id: 'three_fg',
      label: '3P',
      tooltip: '3 point field goals',
      sort: 'higher',
      numeric: true,
    },
    ft: {
      id: 'ft',
      label: 'FT',
      tooltip: 'Free throws',
      sort: 'higher',
      numeric: true,
    },
    offensive_rebounds: {
      id: 'offensive_rebounds',
      label: 'ORB',
      tooltip: 'Offensive rebounds',
      sort: 'higher',
      numeric: true,
    },
    defensive_rebounds: {
      id: 'defensive_rebounds',
      label: 'DRB',
      tooltip: 'Defensive rebounds',
      sort: 'higher',
      numeric: true,
    },
    assists: {
      id: 'assists',
      label: 'AST',
      tooltip: 'Assists',
      sort: 'higher',
      numeric: true,
    },
    steals: {
      id: 'steals',
      label: 'STL',
      tooltip: 'Steals',
      sort: 'higher',
      numeric: true,
    },
    blocks: {
      id: 'blocks',
      label: 'BLK',
      tooltip: 'Blocks',
      sort: 'higher',
      numeric: true,
    },
    turnovers: {
      id: 'turnovers',
      label: 'TOV',
      tooltip: 'Turnovers',
      sort: 'higher',
      numeric: true,
    },
    fouls: {
      id: 'fouls',
      label: 'PF',
      title: 'Personal fouls',
      sort: 'higher',
      numeric: true,
    },
  };


  const handleClick = (player_boxscore_id) => {
    if (!player_boxscore_id) {
      console.warn('Missing player_boxscore_id');
      return;
    }

    let game_id = null;
    if (player_boxscore_id in gamelogs) {
      game_id = gamelogs[player_boxscore_id].game_id;
    }

    dispatch(setLoading(true));
    startTransition(() => {
      router.push(`/${path}/games/${game_id}`);
    });
  };

  type FooterRow = Partial<PlayerBoxscore> & {
    game_details?: React.JSX.Element | string;
    fg?: string;
    fg_secondary?: string;
    two_fg?: string;
    two_fg_secondary?: string;
    three_fg?: string;
    three_fg_secondary?: string;
    ft?: string;
    ft_secondary?: string;
  }

  const footerRow: FooterRow = {
    game_details: 'Total',
  };

  const playerRows: object[] = [];

  for (const player_boxscore_id in gamelogs) {
    const row = gamelogs[player_boxscore_id];

    if (!row.game) {
      continue;
    }

    if (
      (subview && +subview !== +row.season) ||
      (!subview && season !== row.season)
    ) {
      continue;
    }

    const formattedRow = { ...row } as FooterRow;

    const won = (row.game.home_score > row.game.away_score && row.game.home_team_id === row.team_id) || (row.game.home_score < row.game.away_score && row.game.away_team_id === row.team_id);
    const Game = new HelperGame({
      game: row.game,
    });

    let opponent: string | null = null;
    if (row.game.home_team_id !== row.team_id) {
      opponent = Game.getTeamNameShort('home');
    } else {
      opponent = Game.getTeamNameShort('away');
    }

    const spanStyle = {
      color: theme.mode === 'light' ? theme.error.main : theme.error.dark,
    };

    if (won) {
      spanStyle.color = theme.mode === 'light' ? theme.success.main : theme.success.dark;
    }

    formattedRow.game_details = (
      <div style = {{ display: 'flex', flexDirection: 'column' }}>
        <div>
          {moment(`${row.game.start_date.split('T')[0]} 12:00:00`).format('MMM Do YYYY')}
        </div>
        <div style = {{ color: theme.grey[500] }}>
          {row.game.home_team_id !== row.team_id ? '@ ' : ''}{opponent} <span style = {spanStyle}>{Game.isFinal() ? (won ? 'W' : 'L') : Game.getTime()}</span> {`${row.game.home_score}-${row.game.away_score}`}
        </div>
      </div>
    );

    formattedRow.fg = `${row.field_goal || 0}-${row.field_goal_attempts || 0}`;
    formattedRow.fg_secondary = `${row.field_goal_percentage || 0}%`;

    formattedRow.two_fg = `${row.two_point_field_goal || 0}-${row.two_point_field_goal_attempts || 0}`;
    formattedRow.two_fg_secondary = `${row.two_point_field_goal_percentage || 0}%`;

    formattedRow.three_fg = `${row.three_point_field_goal || 0}-${row.three_point_field_goal_attempts || 0}`;
    formattedRow.three_fg_secondary = `${row.three_point_field_goal_percentage || 0}%`;

    formattedRow.ft = `${row.free_throws || 0}-${row.free_throw_attempts || 0}`;
    formattedRow.ft_secondary = `${row.free_throw_percentage || 0}%`;

    for (const key in row) {
      if (!(key in footerRow)) {
        footerRow[key] = row[key];
      } else {
        footerRow[key] = +(+footerRow[key] + +row[key]).toFixed(2);
      }
    }

    playerRows.push(formattedRow);
  }

  footerRow.fg = `${footerRow.field_goal || 0}-${footerRow.field_goal_attempts || 0}`;
  footerRow.fg_secondary = footerRow.field_goal_attempts !== undefined && footerRow.field_goal_attempts > 0 ? `${(((footerRow.field_goal || 0) / footerRow.field_goal_attempts) * 100).toFixed(2)}%` : '0%';

  footerRow.two_fg = `${footerRow.two_point_field_goal || 0}-${footerRow.two_point_field_goal_attempts || 0}`;
  footerRow.two_fg_secondary = footerRow.two_point_field_goal_attempts !== undefined && footerRow.two_point_field_goal_attempts > 0 ? `${(((footerRow.two_point_field_goal || 0) / footerRow.two_point_field_goal_attempts) * 100).toFixed(2)}%` : '0%';

  footerRow.three_fg = `${footerRow.three_point_field_goal || 0}-${footerRow.three_point_field_goal_attempts || 0}`;
  footerRow.three_fg_secondary = footerRow.three_point_field_goal_attempts !== undefined && footerRow.three_point_field_goal_attempts > 0 ? `${(((footerRow.three_point_field_goal || 0) / footerRow.three_point_field_goal_attempts) * 100).toFixed(2)}%` : '0%';

  footerRow.ft = `${footerRow.free_throws || 0}-${footerRow.free_throw_attempts || 0}`;
  footerRow.ft_secondary = footerRow.free_throw_attempts !== undefined && footerRow.free_throw_attempts > 0 ? `${(((footerRow.free_throws || 0) / footerRow.free_throw_attempts) * 100).toFixed(2)}%` : '0%';

  const descendingComparator = (a, b, orderBy, direction_) => {
    if ((orderBy in a) && b[orderBy] === null) {
      return 1;
    }
    if (a[orderBy] === null && (orderBy in b)) {
      return -1;
    }

    let a_value = a[orderBy];
    let b_value = b[orderBy];
    if (orderBy === 'game_details') {
      a_value = +a.game.start_timestamp;
      b_value = +b.game.start_timestamp;
    }

    const direction = direction_ || 'lower';


    if (b_value < a_value) {
      return direction === 'higher' ? 1 : -1;
    }
    if (b_value > a_value) {
      return direction === 'higher' ? -1 : 1;
    }
    return 0;
  };

  const getComparator = (order, orderBy, direction) => {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy, direction)
      : (a, b) => -descendingComparator(a, b, orderBy, direction);
  };

  return (
    <Contents>
      <RankTable
        rows={playerRows}
        footerRow={footerRow}
        columns={playerBoxscoreHeaderColumns}
        displayColumns={playerColumns}
        rowKey = 'player_boxscore_id'
        defaultSortOrder = 'desc'
        defaultSortOrderBy = 'game_details'
        sessionStorageKey = {`${path}.PLAYER.GAMELOG`}
        secondaryKey = 'secondary'
        handleRowClick={handleClick}
        customSortComparator={getComparator}
        />
    </Contents>
  );
};

export { Client, ClientSkeleton };
