'use client';
import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { Box, SortDirection, Table, TableBody, TableContainer, TableHead, TableRow, TableCell, Paper, TableSortLabel, Tooltip, Typography, Chip } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { visuallyHidden } from '@mui/utils';

import HelperTeam from '@/components/helpers/Team';
import RankSpan from '@/components/generic/CBB/RankSpan';
import utilsSorter from  '@/components/utils/Sorter';
import { Dimensions, useWindowDimensions } from '@/components/hooks/useWindowDimensions';
import BackdropLoader from '@/components/generic/BackdropLoader';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

const Sorter = new utilsSorter();

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
  }
}));

const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  'backgroundColor':  theme.palette.mode === 'light' ? theme.palette.info.light : theme.palette.info.dark,
}));

const Client = ({ coach_team_seasons, teams, cbb_statistic_rankings }) => {
  const theme = useTheme();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const { width } = useWindowDimensions() as Dimensions;
  const breakPoint = 425;

  const [order, setOrder] = useState<string>('desc');
  const [orderBy, setOrderBy] = useState<string>('season');
  const [spin, setSpin] = useState(false);

  const rows: any = [];

  const team_id_x_season_x_cbb_statistic_ranking = {};

  for (let cbb_statistic_ranking_id in cbb_statistic_rankings) {
    const row = cbb_statistic_rankings[cbb_statistic_ranking_id];

    if (!(row.team_id in team_id_x_season_x_cbb_statistic_ranking)) {
      team_id_x_season_x_cbb_statistic_ranking[row.team_id] = {};
    }

    team_id_x_season_x_cbb_statistic_ranking[row.team_id][row.season] = row;
  }

  for (let coach_team_season_id in coach_team_seasons) {
    const coach_team_season = coach_team_seasons[coach_team_season_id];

    const row: any = {
      'season': coach_team_season.season,
      'team_id': coach_team_season.team_id,
    };

    if (
      coach_team_season.team_id in team_id_x_season_x_cbb_statistic_ranking &&
      coach_team_season.season in team_id_x_season_x_cbb_statistic_ranking[coach_team_season.team_id]
    ) {
      const stats = team_id_x_season_x_cbb_statistic_ranking[coach_team_season.team_id][coach_team_season.season];

      row.wins = stats.wins || 0;
      row.losses = stats.losses || 0;
    }

    rows.push(row);
  }


  // starting elo, ending elo?
  const getColumns = () => {
    return ['season', 'team', 'wins', 'losses'];
  };

  const handleClick = (team_id, season) => {
    setSpin(true);
    startTransition(() => {
      router.push('/cbb/team/' + team_id + '?season=' + season);
      setSpin(false);
    });
  };


  const headCells = {
    'season': {
      id: 'season',
      numeric: true,
      label: 'Season',
      tooltip: 'Season',
      sticky: false,
    },
    'team': {
      id: 'team',
      numeric: false,
      label: 'Team',
      tooltip: 'Team',
      sticky: false,
    },
    'wins': {
      id: 'wins',
      numeric: true,
      label: 'Wins',
      tooltip: 'Wins',
      sticky: false,
    },
    'losses': {
      id: 'losses',
      numeric: true,
      label: 'Losses',
      tooltip: 'Losses',
      sticky: false,
    },
  };


  const handleSort = (id) => {
    const isAsc = orderBy === id && order === 'asc';
    sessionStorage.setItem('CBB.COACH.SEASONS.ORDER', (isAsc ? 'desc' : 'asc'));
    sessionStorage.setItem('CBB.COACH.SEASONS.ORDERBY', id);
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(id);
  };

  // todo this makes no sense...doesnt actually match what is in the gui
  const seasonCellMaxWidth = 25;

  const getTable = () => {
    let b = 0;

    const row_containers = rows.sort(Sorter.getComparator(order, orderBy, (headCells[orderBy] && headCells[orderBy].sort))).slice().map((row) => {
      let columns = getColumns();

      // const tdStyle = {
      //   'padding': '4px 5px',
      //   'backgroundColor': theme.palette.mode === 'light' ? (b % 2 === 0 ? theme.palette.grey[200] : theme.palette.grey[300]) : (b % 2 === 0 ? theme.palette.grey[800] : theme.palette.grey[900]),
      // };

      b++;

      const tdStyle: React.CSSProperties = {
        'padding': '4px 5px',
        'backgroundColor': theme.palette.mode === 'light' ? (b % 2 === 0 ? theme.palette.grey[200] : theme.palette.grey[300]) : (b % 2 === 0 ? theme.palette.grey[800] : theme.palette.grey[900]),
        border: 0,
        'borderTop': 0,
        'borderLeft': 0,
        'borderBottom': 0,
      };
  
      if (width <= breakPoint) {
        tdStyle.fontSize = '12px';
      }
  

      const tableCells: React.JSX.Element[] = [];

      for (let i = 0; i < columns.length; i++) {
        if (columns[i] === 'season') {
          tableCells.push(<TableCell key = {i} sx = {Object.assign(tdStyle, {'maxWidth': seasonCellMaxWidth, 'minWidth': seasonCellMaxWidth, 'width': seasonCellMaxWidth})}>{row[columns[i]] || 0}</TableCell>);
        } else if (columns[i] === 'team') {
          const teamHelper = new HelperTeam({'team': teams[row.team_id]});
          tableCells.push(<TableCell key = {i} sx = {tdStyle}>{teamHelper.getName()}</TableCell>);
        } else {
          tableCells.push(<TableCell key = {i} sx = {tdStyle}>{row[columns[i]] || 0}</TableCell>);
        }
      } 

      return (
        <StyledTableRow
          key={row.season}
          onClick={() => {handleClick(row.team_id, row.season)}}
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
                  'padding': '4px 5px',
                  'border': 0,
                  'whiteSpace': 'nowrap',
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
                        direction={orderBy === headCell.id ?  (order as 'asc' | 'desc') : 'asc'}
                        onClick={() => {handleSort(headCell.id)}}
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
    <div style = {{'padding': '0px 5px 20px 5px', 'textAlign': 'center'}}>
      {getTable()}
      <BackdropLoader open = {spin} />
    </div>
  );
}

export default Client;
