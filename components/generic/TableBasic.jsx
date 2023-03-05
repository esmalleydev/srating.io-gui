import React, { useState } from 'react';

import { styled, alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  'backgroundColor': theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[900],
}));


const TableBasic = (props) => {
  const self = this;

  const theme = useTheme();
  const [order, setOrder] = useState(props.order || 'asc');
  const [orderBy, setOrderBy] = useState(props.orderBy || null);

  const headCells = props.headCells;
  const rows = props.rows;

  const handleSort = (id) => {
    const isAsc = orderBy === id && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(id);
  };

  const descendingComparator = (a, b, orderBy) => {
    if (a[orderBy] && !b[orderBy]) {
      return 1;
    }
    if (!a[orderBy] && b[orderBy]) {
      return -1;
    }
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };

  const getComparator = (order, orderBy) => {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const rowsContainers = rows.sort(getComparator(order, orderBy)).slice().map((row) => {
    let teamCellStyle = {
      'cursor': 'pointer',
      'whiteSpace': 'nowrap',
    };

    if (width < 800) {
      teamCellStyle.position = 'sticky';
      teamCellStyle.left = 0;
      teamCellStyle.backgroundColor = (theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[900]);
    }

    return (
      <StyledTableRow
        key={row.cbb_game_id}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        <TableCell sx = {teamCellStyle} onClick={() => {handleGame(row.cbb_game_id)}}><div>{getTeamRank(row.game, row.pick) ? <sup style = {{'marginRight': '5px'}}>{getTeamRank(row.game, row.pick)}</sup> : ''}{getTeamName(row.game, row.pick)}</div></TableCell>
        <TableCell>{row.pick_ml}</TableCell>
        <TableCell>{getGameStartText(row)}</TableCell>
        <TableCell sx = {{'cursor': 'pointer', 'whiteSpace': 'nowrap'}} onClick={() => {handleGame(row.cbb_game_id)}}>
          <div>{getTeamRank(row.game, row.vs) ? <sup style = {{'marginRight': '5px'}}>{getTeamRank(row.game, row.vs)}</sup> : ''}{getTeamName(row.game, row.vs)}</div>
        </TableCell>
        <TableCell>{row.vs_ml}</TableCell>
        <TableCell>{row.chance}</TableCell>
        <TableCell>{row.status === 'final' ? (row.result ? <CheckCircleIcon color = 'success' /> : <CancelCircleIcon sx = {{'color': 'red'}} />) : '-'}</TableCell>
      </StyledTableRow>
    );
  });


  return (
    <TableContainer component={Paper}>
      <Table size = 'small'>
        <TableHead>
          <TableRow>
              {headCells.map((headCell) => (
                <StyledTableHeadCell
                  sx = {headCell.id == 'pick' ? {'position': 'sticky', 'left': 0, 'z-index': 3} : {}}
                  key={headCell.id}
                  align={'left'}
                  padding={headCell.padding}
                  sortDirection={orderBy === headCell.id ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : 'asc'}
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
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows}
          </TableBody>
        </Table>
    </TableContainer>
  );
}

export default TableBasic;
