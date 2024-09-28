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
import Organization from '@/components/helpers/Organization';
import CBB from '@/components/helpers/CBB';
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

const Client = ({ organization_id, division_id, conference_id, season }) => {
  const dispatch = useAppDispatch();
  const teams = useAppSelector((state) => state.conferenceReducer.teams);
  // const team_season_conferences = useAppSelector((state) => state.conferenceReducer.team_season_conferences);
  const statistic_rankings = useAppSelector((state) => state.conferenceReducer.statistic_rankings);
  const organizations = useAppSelector((state) => state.dictionaryReducer.organization);

  const theme = useTheme();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const { width } = useWindowDimensions() as Dimensions;
  const breakPoint = 425;

  const [order, setOrder] = useState<string>('asc');
  const [orderBy, setOrderBy] = useState<string>('rank');
  const path = Organization.getPath({ organizations, organization_id });
  let numberOfTeams = CBB.getNumberOfD1Teams(season);

  if (organization_id === Organization.getCFBID()) {
    numberOfTeams = CFB.getNumberOfTeams({ division_id, season });
  }

  const rows: any = [];

  const team_id_x_statistic_ranking_id = {};

  for (const statistic_ranking_id in statistic_rankings) {
    const row = statistic_rankings[statistic_ranking_id];
    team_id_x_statistic_ranking_id[row.team_id] = statistic_ranking_id;
  }


  for (const team_id in teams) {
    const team = teams[team_id];

    const stats = statistic_rankings[team_id_x_statistic_ranking_id[team.team_id]];

    const row = {
      record: `${stats.wins}-${stats.losses}`,
      conf_record: `${stats.confwins}-${stats.conflosses}`,
      ...stats,
    };

    rows.push(row);
  }

  const getColumns = () => {
    if (Organization.getCFBID() === organization_id) {
      return ['rank', 'team', 'record', 'conf_record', 'passing_rating_college', 'yards_per_play', 'points'];
    }
    return ['rank', 'team', 'record', 'conf_record', 'adjusted_efficiency_rating', 'offensive_rating', 'defensive_rating'];
  };

  const columns = getColumns();

  const handleClick = (team_id, season) => {
    dispatch(setLoading(true));
    startTransition(() => {
      router.push(`/${path}/team/${team_id}?season=${season}`);
    });
  };

  const getHeadCells = () => {
    if (Organization.getCFBID() === organization_id) {
      return {
        rank: {
          id: 'rank',
          numeric: true,
          label: 'Rk',
          tooltip: 'srating.io Rank',
          sticky: true,
          disabled: true,
          sort: 'lower',
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
        passing_rating_college: {
          id: 'passing_rating_college',
          numeric: true,
          label: 'QBR(c)',
          tooltip: 'Passing rating (college)',
          sort: 'higher',
        },
        yards_per_play: {
          id: 'yards_per_play',
          numeric: true,
          label: 'YPP',
          tooltip: 'Yards per play',
          sort: 'higher',
        },
        points: {
          id: 'points',
          numeric: true,
          label: 'PTS',
          tooltip: 'Average points per game',
          sort: 'higher',
        },
      };
    }
    return {
      rank: {
        id: 'rank',
        numeric: true,
        label: 'Rk',
        tooltip: 'srating.io Rank',
        sticky: true,
        disabled: true,
        sort: 'lower',
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
    };
  };


  const headCells = getHeadCells();


  const handleSort = (id) => {
    const isAsc = orderBy === id && order === 'asc';
    sessionStorage.setItem(`${path}.CONFERENCE.SEASONS.ORDER`, (isAsc ? 'desc' : 'asc'));
    sessionStorage.setItem(`${path}.CONFERENCE.SEASONS.ORDERBY`, id);
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(id);
  };

  let rankCellMaxWidth = 50;
  if (width <= breakPoint) {
    rankCellMaxWidth = 35;
  }

  const getTable = () => {
    let b = 0;

    const row_containers = rows.sort(Sorter.getComparator(order, orderBy, (headCells[orderBy] && headCells[orderBy].sort))).slice().map((row) => {
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

      const rankCellStyle: React.CSSProperties = {
        textAlign: 'center',
        position: 'sticky',
        left: 0,
        maxWidth: rankCellMaxWidth,
      };

      if (width <= breakPoint) {
        tdStyle.fontSize = '12px';
      }


      const tableCells: React.JSX.Element[] = [];

      for (let i = 0; i < columns.length; i++) {
        if (columns[i] === 'rank') {
          tableCells.push(<TableCell key = {i} sx = {({ ...tdStyle, ...rankCellStyle })}>{row[columns[i]]}</TableCell>);
        } else if (columns[i] === 'team') {
          const teamHelper = new HelperTeam({ team: teams[row.team_id] });
          tableCells.push(<TableCell key = {i} sx = {tdStyle}>{teamHelper.getName()}</TableCell>);
        } else {
          tableCells.push(<TableCell key = {i} sx = {tdStyle}>{row[columns[i]] !== null ? row[columns[i]] : '-'}{row[`${columns[i]}_rank`] && row[columns[i]] !== null ? <RankSpan rank = {row[`${columns[i]}_rank`]} useOrdinal = {true} max = {numberOfTeams} /> : ''}</TableCell>);
        }
      }

      return (
        <StyledTableRow
          key={row.team_id}
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
              {columns.map((column) => {
                const headCell = headCells[column];
                const tdStyle: React.CSSProperties = {
                  padding: '4px 5px',
                  border: 0,
                  whiteSpace: 'nowrap',
                };

                if (width <= breakPoint) {
                  tdStyle.fontSize = '13px';
                }

                if (column === 'rank') {
                  tdStyle.maxWidth = rankCellMaxWidth;
                  tdStyle.minWidth = rankCellMaxWidth;
                  tdStyle.width = rankCellMaxWidth;
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
