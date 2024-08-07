'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import {
  Box, SortDirection, Table, TableBody, TableContainer, TableHead, TableRow, TableCell, Paper, TableSortLabel, Tooltip, Typography, Chip,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { visuallyHidden } from '@mui/utils';

import HelperTeam from '@/components/helpers/Team';
import HelperCBB from '@/components/helpers/CBB';
import { teamColumns } from '@/components/generic/CBB/columns';
import RankSpan from '@/components/generic/CBB/RankSpan';
import utilsSorter from '@/components/utils/Sorter';
import { Dimensions, useWindowDimensions } from '@/components/hooks/useWindowDimensions';

const Sorter = new utilsSorter();

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  // '&:hover td': {
  //   backgroundColor: theme.palette.mode === 'light' ? theme.palette.info.light : theme.palette.info.dark,
  // },
  // '&:hover': {
  //   cursor: 'pointer',
  // }
}));

const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'light' ? theme.palette.info.light : theme.palette.info.dark,
}));

const TableView = ({ teams, season }) => {
  const theme = useTheme();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const { width } = useWindowDimensions() as Dimensions;
  const breakPoint = 425;

  const CBB = new HelperCBB();

  const [view, setView] = useState<string | null>('overview');
  const [order, setOrder] = useState<string>('asc');
  const [orderBy, setOrderBy] = useState<string>('composite_rank');

  const getColumns = () => {
    if (view === 'overview') {
      return ['composite_rank', 'name', 'record', 'conf_record', 'elo', 'adjusted_efficiency_rating', 'elo_sos', 'offensive_rating', 'defensive_rating', 'opponent_efficiency_rating', 'streak'];
    } if (view === 'offensive') {
      return ['composite_rank', 'name', 'offensive_rating', 'points', 'field_goal_percentage', 'two_point_field_goal_percentage', 'three_point_field_goal_percentage', 'free_throw_percentage', 'offensive_rebounds', 'assists', 'turnovers', 'possessions', 'pace'];
    } if (view === 'defensive') {
      return ['composite_rank', 'name', 'defensive_rating', 'defensive_rebounds', 'steals', 'blocks', 'opponent_points', 'opponent_field_goal_percentage', 'opponent_two_point_field_goal_percentage', 'opponent_three_point_field_goal_percentage', 'fouls'];
    }
    return [];
  };


  const headCells = teamColumns;

  const statDisplay = [
    {
      label: 'Overview',
      value: 'overview',
    },
    {
      label: 'Offensive',
      value: 'offensive',
    },
    {
      label: 'Defensive',
      value: 'defensive',
    },
  ];

  const statDisplayChips: React.JSX.Element[] = [];

  const handleView = (value) => {
    sessionStorage.setItem('CBB.COMPARE.TEAM.VIEW', value);
    setView(value);
  };

  for (let i = 0; i < statDisplay.length; i++) {
    statDisplayChips.push(
      <Chip
        key = {statDisplay[i].value}
        sx = {{ margin: '5px 5px 10px 5px' }}
        variant = {view === statDisplay[i].value ? 'filled' : 'outlined'}
        color = {view === statDisplay[i].value ? 'success' : 'primary'}
        onClick = {() => { handleView(statDisplay[i].value); }}
        label = {statDisplay[i].label}
      />,
    );
  }


  const handleSort = (id) => {
    const isAsc = orderBy === id && order === 'asc';
    sessionStorage.setItem('CBB.COMPARE.TEAM.ORDER', (isAsc ? 'desc' : 'asc'));
    sessionStorage.setItem('CBB.COMPARE.TEAM.ORDERBY', id);
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(id);
  };



  const getTable = () => {
    let b = 0;

    // todo TS
    const rows: any = [];

    for (const team_id in teams) {
      const data = { ...teams[team_id].stats, ...teams[team_id].rankings };
      data.elo = teams[team_id].elo ? teams[team_id].elo.elo : 0;
      data.record = `${teams[team_id].stats.wins}-${teams[team_id].stats.losses}`;
      data.conf_record = `${teams[team_id].stats.confwins}-${teams[team_id].stats.conflosses}`;
      rows.push(data);
    }

    let rankCellMaxWidth = 50;
    if (width <= breakPoint) {
      rankCellMaxWidth = 30;
    }

    const teamCellWidth = 50;

    const row_containers = rows.sort(Sorter.getComparator(order, orderBy, (headCells[orderBy] && headCells[orderBy].sort))).slice().map((row) => {
      const columns = getColumns();

      // const tdStyle = {
      //   'padding': '4px 5px',
      //   'backgroundColor': theme.palette.mode === 'light' ? (b % 2 === 0 ? theme.palette.grey[200] : theme.palette.grey[300]) : (b % 2 === 0 ? theme.palette.grey[800] : theme.palette.grey[900]),
      // };

      b++;

      const tdStyle: React.CSSProperties = {
        padding: '4px 5px',
        backgroundColor: theme.palette.mode === 'light' ? (b % 2 === 0 ? theme.palette.grey[200] : theme.palette.grey[300]) : (b % 2 === 0 ? theme.palette.grey[800] : theme.palette.grey[900]),
        border: 0,
        borderTop: 0,
        borderLeft: 0,
        borderBottom: 0,
      };

      if (width <= breakPoint) {
        tdStyle.fontSize = '12px';
      }

      const rankCellStyle: React.CSSProperties = {
        position: 'sticky',
        left: 0,
        textAlign: 'center',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        maxWidth: rankCellMaxWidth,
        minWidth: rankCellMaxWidth,
      };


      const teamCellStyle: React.CSSProperties = {
        position: 'sticky',
        minWidth: teamCellWidth,
        maxWidth: teamCellWidth,
        left: rankCellMaxWidth,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        borderRight: `3px solid ${theme.palette.mode === 'light' ? theme.palette.info.light : theme.palette.info.dark}`,
      };

      const tableCells: React.JSX.Element[] = [];

      for (let i = 0; i < columns.length; i++) {
        if (columns[i] === 'name') {
          const teamHelper = new HelperTeam({ team: teams[row.team_id] });
          tableCells.push(<TableCell key = {i} sx = {({ ...tdStyle, ...teamCellStyle })}>{teamHelper.getNameShort()}</TableCell>);
        } else if (columns[i] === 'composite_rank') {
          tableCells.push(<TableCell key = {i} sx = {({ ...tdStyle, ...rankCellStyle })}>{row[columns[i]]}</TableCell>);
        } else {
          tableCells.push(<TableCell key = {i} sx = {tdStyle}>{row[columns[i]] !== null ? row[columns[i]] : '-'}{row[`${columns[i]}_rank`] && row[columns[i]] !== null ? <RankSpan rank = {row[`${columns[i]}_rank`]} useOrdinal = {true} max = {CBB.getNumberOfD1Teams(season)} /> : ''}</TableCell>);
        }
      }

      return (
        <StyledTableRow
          key={row.team_id}
          // sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          // onClick={() => {handleClick(row.team_id)}}
        >
          {tableCells}
        </StyledTableRow>
      );
    });
    return (
      <TableContainer component={Paper}>
        <Table size="small" aria-label="team stats table">
          <TableHead>
            <TableRow>
              {getColumns().map((column) => {
                const headCell = headCells[column];
                const tdStyle: React.CSSProperties = {
                  padding: '4px 5px',
                  border: 0,
                };

                if (width <= breakPoint) {
                  tdStyle.fontSize = '13px';
                }

                if (headCell.sticky) {
                  tdStyle.position = 'sticky';
                  tdStyle.zIndex = 3;
                } else {
                  tdStyle.whiteSpace = 'nowrap';
                }

                if (headCell.id === 'composite_rank') {
                  tdStyle.left = 0;
                  tdStyle.maxWidth = rankCellMaxWidth;
                  tdStyle.minWidth = rankCellMaxWidth;
                }

                if (headCell.id === 'name') {
                  tdStyle.borderRight = `3px solid ${theme.palette.mode === 'light' ? theme.palette.info.light : theme.palette.info.dark}`;
                  tdStyle.minWidth = teamCellWidth;
                  tdStyle.maxWidth = teamCellWidth;
                  tdStyle.left = rankCellMaxWidth;
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
                        // hideSortIcon = {!showSortArrow}
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
      <div style = {{ display: 'flex', justifyContent: 'center' }}>
        {statDisplayChips}
      </div>
        {getTable()}
    </div>
  );
};

export default TableView;
