'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import {
  Box, SortDirection, Table, TableBody, TableContainer, TableHead, TableRow, TableCell, Paper, TableSortLabel, Tooltip,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { visuallyHidden } from '@mui/utils';

import HelperTeam from '@/components/helpers/Team';
import RankSpan from '@/components/generic/RankSpan';
import { Dimensions, useWindowDimensions } from '@/components/hooks/useWindowDimensions';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setLoading } from '@/redux/features/display-slice';
import Sorter from '@/components/utils/Sorter';
import CBB from '@/components/helpers/CBB';
import Organization from '@/components/helpers/Organization';
import CFB from '@/components/helpers/CFB';


const StyledTableRow = styled(TableRow)(({ theme }) => ({
  // hide last border
  // '&:last-child td, &:last-child th': {
  //   border: 0,
  // },
  '&:hover td': {
    backgroundColor: theme.palette.mode === 'light' ? theme.palette.info.light : theme.palette.info.dark,
  },
  '&:hover': {
    cursor: 'pointer',
  },
}));

const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'light' ? theme.palette.info.light : theme.palette.info.dark,
}));

const Client = ({ organization_id, division_id, coach_team_seasons, teams, statistic_rankings }) => {
  const theme = useTheme();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const dispatch = useAppDispatch();

  const { width } = useWindowDimensions() as Dimensions;
  const breakPoint = 425;

  const [order, setOrder] = useState<string>('desc');
  const [orderBy, setOrderBy] = useState<string>('season');

  const organizations = useAppSelector((state) => state.dictionaryReducer.organization);
  const path = Organization.getPath({ organizations, organization_id });

  const rows: any = [];

  const team_id_x_season_x_statistic_ranking = {};

  for (const statistic_ranking_id in statistic_rankings) {
    const row = statistic_rankings[statistic_ranking_id];

    if (!(row.team_id in team_id_x_season_x_statistic_ranking)) {
      team_id_x_season_x_statistic_ranking[row.team_id] = {};
    }

    team_id_x_season_x_statistic_ranking[row.team_id][row.season] = row;
  }

  for (const coach_team_season_id in coach_team_seasons) {
    const coach_team_season = coach_team_seasons[coach_team_season_id];

    const row: any = {
      season: coach_team_season.season,
      team_id: coach_team_season.team_id,
    };

    if (
      coach_team_season.team_id in team_id_x_season_x_statistic_ranking &&
      coach_team_season.season in team_id_x_season_x_statistic_ranking[coach_team_season.team_id]
    ) {
      const stats = team_id_x_season_x_statistic_ranking[coach_team_season.team_id][coach_team_season.season];

      row.record = `${stats.wins || 0} - ${stats.losses || 0}`;
      row.conf_record = (stats.confwins === null || stats.conflosses === null) ? '-' : `${stats.confwins || 0} - ${stats.conflosses || 0}`;

      Object.assign(row, stats);
    }

    rows.push(row);
  }


  // starting elo, ending elo?
  const getColumns = () => {
    if (organization_id === Organization.getCFBID()) {
      return ['season', 'team', 'record', 'conf_record', 'points', 'passing_rating_college', 'yards_per_play', 'points_per_play'];
    }
    return ['season', 'team', 'record', 'conf_record', 'adjusted_efficiency_rating', 'offensive_rating', 'defensive_rating'];
  };

  const handleClick = (team_id, season) => {
    dispatch(setLoading(true));
    startTransition(() => {
      router.push(`/${path}/team/${team_id}?season=${season}`);
    });
  };


  const headCells = {
    season: {
      id: 'season',
      numeric: true,
      label: 'Season',
      tooltip: 'Season',
      sticky: false,
    },
    team: {
      id: 'team',
      numeric: false,
      label: 'Team',
      tooltip: 'Team',
      sticky: false,
    },
    record: {
      id: 'record',
      numeric: false,
      label: 'W/L',
      tooltip: 'Record',
      sticky: false,
    },
    conf_record: {
      id: 'conf_record',
      numeric: false,
      label: 'CR',
      tooltip: 'Conference record',
      sticky: false,
    },
    adjusted_efficiency_rating: {
      id: 'adjusted_efficiency_rating',
      numeric: true,
      label: 'aEM',
      tooltip: 'Adjusted Efficiency margin (Offensive rating - Defensive rating) + aSOS',
      sort: 'higher',
    },
    points: {
      id: 'points',
      numeric: true,
      label: 'PTS',
      tooltip: 'Average points per game',
      sort: 'higher',
    },
    offensive_rating: {
      id: 'offensive_rating',
      numeric: true,
      label: 'ORT',
      tooltip: 'Offensive rating ((PTS / Poss) * 100)',
      sort: 'higher',
    },
    defensive_rating: {
      id: 'defensive_rating',
      numeric: true,
      label: 'DRT',
      tooltip: 'Defensive rating ((Opp. PTS / Opp. Poss) * 100)',
      sort: 'lower',
    },
    passing_rating_college: {
      id: 'passing_rating_college',
      numeric: true,
      label: 'QBR(c)',
      tooltip: 'Quarter back rating (college)',
      sort: 'higher',
    },
    yards_per_play: {
      id: 'yards_per_play',
      numeric: true,
      label: 'YPP',
      tooltip: 'Yards per play',
      sort: 'higher',
    },
    points_per_play: {
      id: 'points_per_play',
      numeric: true,
      label: 'PPP',
      tooltip: 'Points per play',
      sort: 'higher',
    },
  };


  const handleSort = (id) => {
    const isAsc = orderBy === id && order === 'asc';
    sessionStorage.setItem(`${path}.COACH.SEASONS.ORDER`, (isAsc ? 'desc' : 'asc'));
    sessionStorage.setItem(`${path}.COACH.SEASONS.ORDERBY`, id);
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(id);
  };

  const seasonCellMaxWidth = 75;

  const getTable = () => {
    let b = 0;

    const row_containers = rows.sort(Sorter.getComparator(order, orderBy, (headCells[orderBy] && headCells[orderBy].sort))).slice().map((row) => {
      const columns = getColumns();

      b++;

      let tdColor = (b % 2 === 0 ? theme.palette.grey[800] : theme.palette.grey[900]);

      if (theme.palette.mode === 'light') {
        tdColor = (b % 2 === 0 ? theme.palette.grey[200] : theme.palette.grey[300]);
      }

      const tdStyle: React.CSSProperties = {
        padding: '4px 5px',
        backgroundColor: tdColor,
        border: 0,
        borderTop: 0,
        borderLeft: 0,
        borderBottom: 0,
      };

      if (width <= breakPoint) {
        tdStyle.fontSize = '12px';
      }

      let numberOfTeams = CBB.getNumberOfD1Teams(row.season);

      if (organization_id === Organization.getCFBID()) {
        numberOfTeams = CFB.getNumberOfTeams({ division_id, season: row.season });
      }


      const tableCells: React.JSX.Element[] = [];

      for (let i = 0; i < columns.length; i++) {
        if (columns[i] === 'season') {
          tableCells.push(<TableCell key = {i} sx = {({ ...tdStyle, maxWidth: seasonCellMaxWidth, minWidth: seasonCellMaxWidth, width: seasonCellMaxWidth })}>{row[columns[i]] || 0}</TableCell>);
        } else if (columns[i] === 'team') {
          const teamHelper = new HelperTeam({ team: teams[row.team_id] });
          tableCells.push(<TableCell key = {i} sx = {tdStyle}>{teamHelper.getName()}</TableCell>);
        } else {
          tableCells.push(<TableCell key = {i} sx = {tdStyle}>{row[columns[i]] !== null ? row[columns[i]] : '-'}{row[`${columns[i]}_rank`] && row[columns[i]] !== null ? <RankSpan rank = {row[`${columns[i]}_rank`]} useOrdinal = {true} max = {numberOfTeams} /> : ''}</TableCell>);
        }
      }

      return (
        <StyledTableRow
          key={row.season}
          onClick={() => { handleClick(row.team_id, row.season); }}
        >
          {tableCells}
        </StyledTableRow>
      );
    });
    return (
      <TableContainer component={Paper}>
        <Table size="small" aria-label="coach season table" style={{ borderCollapse: 'separate' }}>
          <TableHead>
            <TableRow>
              {getColumns().map((column) => {
                const headCell = headCells[column];
                const tdStyle: React.CSSProperties = {
                  padding: '4px 5px',
                  border: 0,
                  whiteSpace: 'nowrap',
                };

                if (width <= breakPoint) {
                  tdStyle.fontSize = '13px';
                }

                if (column === 'season') {
                  tdStyle.maxWidth = seasonCellMaxWidth;
                  tdStyle.minWidth = seasonCellMaxWidth;
                  tdStyle.width = seasonCellMaxWidth;
                }

                return (
                  <Tooltip key={headCell.id} disableFocusListener placement = 'top' title={headCell.tooltip}>
                    <StyledTableHeadCell
                      sx = {tdStyle}
                      key={headCell.id}
                      align={'left'}
                      sortDirection={orderBy === headCell.id ? (order as SortDirection) : false}
                    >
                      <TableSortLabel
                        active={orderBy === headCell.id}
                        direction={orderBy === headCell.id ? (order as 'asc' | 'desc') : 'asc'}
                        onClick={() => { handleSort(headCell.id); }}
                      >
                        {headCell.label}
                        {orderBy === headCell.id ? (
                          <Box component="span" sx={visuallyHidden}>
                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                          </Box>
                        ) : null}
                      </TableSortLabel>
                    </StyledTableHeadCell>
                  </Tooltip>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {row_containers}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <div style = {{ padding: '0px 5px 20px 5px', textAlign: 'center' }}>
      {getTable()}
    </div>
  );
};

export default Client;
