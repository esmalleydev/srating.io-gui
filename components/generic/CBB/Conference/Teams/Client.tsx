'use client';
import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { Box, SortDirection, Table, TableBody, TableContainer, TableHead, TableRow, TableCell, Paper, TableSortLabel, Tooltip } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { visuallyHidden } from '@mui/utils';

import HelperCBB from '@/components/helpers/CBB';
import HelperTeam from '@/components/helpers/Team';
import RankSpan from '@/components/generic/CBB/RankSpan';
import utilsSorter from  '@/components/utils/Sorter';
import { Dimensions, useWindowDimensions } from '@/components/hooks/useWindowDimensions';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setLoading } from '@/redux/features/display-slice';

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

const Client = ({ conference_id, season }) => {
  const dispatch = useAppDispatch();
  const teams = useAppSelector(state => state.conferenceReducer.teams);
  const team_season_conferences = useAppSelector(state => state.conferenceReducer.team_season_conferences);
  const cbb_statistic_rankings = useAppSelector(state => state.conferenceReducer.cbb_statistic_rankings);
  const cbb_rankings = useAppSelector(state => state.conferenceReducer.cbb_rankings);

  // console.log(cbb_statistic_rankings)

  const theme = useTheme();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const { width } = useWindowDimensions() as Dimensions;
  const breakPoint = 425;

  const [order, setOrder] = useState<string>('asc');
  const [orderBy, setOrderBy] = useState<string>('composite_rank');

  const CBB = new HelperCBB();

  const rows: any = [];

  const team_id_x_cbb_statistic_ranking_id = {};
  const team_id_x_cbb_ranking_id = {};

  for (let cbb_statistic_ranking_id in cbb_statistic_rankings) {
    const row = cbb_statistic_rankings[cbb_statistic_ranking_id];
    team_id_x_cbb_statistic_ranking_id[row.team_id] = cbb_statistic_ranking_id;
  }

  for (let cbb_ranking_id in cbb_rankings) {
    const row = cbb_rankings[cbb_ranking_id];
    team_id_x_cbb_ranking_id[row.team_id] = cbb_ranking_id;
  }

  for (let team_id in teams) {
    const team = teams[team_id];

    const stats = cbb_statistic_rankings[team_id_x_cbb_statistic_ranking_id[team.team_id]];
    const rankings = cbb_rankings[team_id_x_cbb_ranking_id[team.team_id]];

    const row = Object.assign({
      'record': stats.wins + '-' + stats.losses,
      'conf_record': stats.confwins + '-' + stats.conflosses,
    }, rankings, stats);
  
    rows.push(row);
  }

  const getColumns = () => {
    return ['composite_rank', 'team', 'record', 'conf_record', 'adjusted_efficiency_rating', 'offensive_rating', 'defensive_rating'];
  };

  const handleClick = (team_id, season) => {
    dispatch(setLoading(true));
    startTransition(() => {
      router.push('/cbb/team/' + team_id + '?season=' + season);
    });
  };


  const headCells = {
    'composite_rank': {
      id: 'composite_rank',
      numeric: true,
      label: 'Rk',
      tooltip: 'srating.io Rank',
      'sticky': true,
      'disabled': true,
      'sort': 'lower',
    },
    'team': {
      id: 'team',
      numeric: false,
      label: 'Team',
      tooltip: 'Team',
      sticky: false,
    },
    'record': {
      id: 'record',
      numeric: false,
      label: 'W/L',
      tooltip: 'Record',
      sticky: false,
    },
    'conf_record': {
      id: 'conf_record',
      numeric: false,
      label: 'CR',
      tooltip: 'Conference record',
      sticky: false,
    },
    'adjusted_efficiency_rating': {
      id: 'adjusted_efficiency_rating',
      numeric: true,
      label: 'aEM',
      tooltip: 'Adjusted Efficiency margin (Offensive rating - Defensive rating) + aSOS',
      'sort': 'higher',
    },
    'points': {
      id: 'points',
      numeric: true,
      label: 'PTS',
      tooltip: 'Average points per game',
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
  };


  const handleSort = (id) => {
    const isAsc = orderBy === id && order === 'asc';
    sessionStorage.setItem('CBB.CONFERENCE.SEASONS.ORDER', (isAsc ? 'desc' : 'asc'));
    sessionStorage.setItem('CBB.CONFERENCE.SEASONS.ORDERBY', id);
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

      const rankCellStyle: React.CSSProperties = {
        'textAlign': 'center',
        'position': 'sticky',
        'left': 0,
        'maxWidth': rankCellMaxWidth
      };
  
      if (width <= breakPoint) {
        tdStyle.fontSize = '12px';
      }
  

      const tableCells: React.JSX.Element[] = [];

      for (let i = 0; i < columns.length; i++) {
        if (columns[i] === 'composite_rank') {
          tableCells.push(<TableCell key = {i} sx = {Object.assign({}, tdStyle, rankCellStyle)}>{row[columns[i]]}</TableCell>);
        } else if (columns[i] === 'team') {
          const teamHelper = new HelperTeam({'team': teams[row.team_id]});
          tableCells.push(<TableCell key = {i} sx = {tdStyle}>{teamHelper.getName()}</TableCell>);
        } else {
          tableCells.push(<TableCell key = {i} sx = {tdStyle}>{row[columns[i]] !== null ? row[columns[i]] : '-'}{row[columns[i] + '_rank'] && row[columns[i]] !== null ? <RankSpan rank = {row[columns[i] + '_rank']} useOrdinal = {true} max = {CBB.getNumberOfD1Teams(row.season)} />  : ''}</TableCell>);
        }
      } 

      return (
        <StyledTableRow
          key={row.team_id}
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
      
                if (column === 'composite_rank') {
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
    </div>
  );
}

export default Client;
