'use client';
import React, { useState, useEffect, useRef, useTransition, MutableRefObject } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useWindowDimensions, Dimensions } from '@/components/hooks/useWindowDimensions';


import moment from 'moment';

import { TableVirtuoso } from 'react-virtuoso';

import CircularProgress from '@mui/material/CircularProgress';

import Typography from '@mui/material/Typography';

import Chip from '@mui/material/Chip';
import { styled, useTheme } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { SortDirection } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import { visuallyHidden } from '@mui/utils';

import OptionPicker from '@/components/generic/OptionPicker';
import SeasonPicker from '@/components/generic/CBB/SeasonPicker';
import ConferencePicker from '@/components/generic/CBB/ConferencePicker';
import ColumnPicker from '@/components/generic/CBB/ColumnPicker';

import HelperCBB from '@/components/helpers/CBB';
import BackdropLoader from '@/components/generic/BackdropLoader';
import RankSpan from '@/components/generic/CBB/RankSpan';
import RankSearch from '@/components/generic/RankSearch';
import PositionPicker from '@/components/generic/CBB/PositionPicker';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { clearPositions, updateConferences, updatePositions } from '@/redux/features/display-slice';
import { getHeaderColumns } from './columns';
import { getRowsData } from './rows';


// TODO Filter out people who play under x minutes?
// TODO ADD A POWER 5 CONF quick button TO THIS


const StyledTableRow = styled(TableRow)(({ theme }) => ({
  // '&:nth-of-type(odd)': {
  //   backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[300] : theme.palette.grey[900],
  // },
  // '&:nth-of-type(even)': {
  //   backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
  // },
  '&:last-child td, &:last-child th': {
    // border: 0,
  },
  '&:hover td': {
    backgroundColor: theme.palette.mode === 'light' ? theme.palette.info.light : theme.palette.info.dark,
  },
  'border': 0,
  '&:hover': {
    cursor: 'pointer',
  }
}));

const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  'backgroundColor':  theme.palette.mode === 'light' ? theme.palette.info.light : theme.palette.info.dark,
}));


const Ranking = (props) => {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const theme = useTheme();
  const [isPending, startTransition] = useTransition();
  const dispatch = useAppDispatch();
  const conferences = useAppSelector(state => state.displayReducer.conferences);
  const positions = useAppSelector(state => state.displayReducer.positions);

  interface TableComponentsType {
    Scroller: React.ComponentType<any>;
    Table: React.ComponentType<any>;
    TableHead: React.ComponentType<any>;
    TableRow: React.ComponentType<any>;
    TableBody: React.ComponentType<any>;
    FillerRow: React.ComponentType<{ height: number }>;
  };

  const { height, width } = useWindowDimensions() as Dimensions;
  const breakPoint = 425;

  const data = props.data;

  const [loading, setLoading] = useState(false);
  const [spin, setSpin] = useState(false);
  const [firstRender, setFirstRender] = useState(true);
  const [season, setSeason] = useState(searchParams?.get('season') || new HelperCBB().getCurrentSeason());
  const [rankView, setRankView] = useState(searchParams?.get('view') || 'team');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('composite_rank');
  const [view, setView] = useState('composite');
  const [customColumns, setCustomColumns] = useState(['composite_rank', 'name']);
  const [customColumnsOpen, setCustomColumnsOpen] = useState(false);
  const [filteredRows, setFilteredRows] = useState(null);

  const [tableHorizontalScroll, setTableHorizontalScroll] = useState(0);
  const tableRef: MutableRefObject<HTMLDivElement | null> = useRef(null);

  const scrollerRef = React.useCallback(
    (element) => {
      if (element) {
        tableRef.current = element;
      } else {
        tableRef.current = null;
      }
    },
    []
  );
  
  useEffect(() => {
    if (tableRef.current) {
      setTimeout(function() {
        tableRef.current?.scrollTo({'left': tableHorizontalScroll});
      }, 0);
    }
  }, [tableHorizontalScroll, order, orderBy]);


  useEffect(() => {
    setFirstRender(false);
    const localRankView = localStorage.getItem('CBB.RANKING.VIEW') || null;
    const localRankCols = localStorage.getItem('CBB.RANKING.COLUMNS.' + rankView) || null;
    setView(localRankView ? localRankView : 'composite');
    setCustomColumns(localRankCols ?  JSON.parse(localRankCols) : ['composite_rank', 'name']);
  }, []);

  if (firstRender) {
    return (
      <div>
        <div style = {{'display': 'flex', 'justifyContent': 'center'}}>
          <CircularProgress />
        </div>
      </div>
    );
  }

  const rankViewOptions = [
    {'value': 'team', 'label': 'Team rankings'},
    {'value': 'player', 'label': 'Player rankings'},
    {'value': 'conference', 'label': 'Conference rankings'},
  ];

  const handleRankView = (newRankView) => {
    localStorage.removeItem('CBB.RANKING.COLUMNS.' + rankView);

    if (searchParams) {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      current.set('view', newRankView);
      const search = current.toString();
      const query = search ? `?${search}` : "";
      setLoading(true);
      startTransition(() => {
        router.push(`${pathName}${query}`);
        setLoading(false);
      });
    }

    setCustomColumns(['composite_rank', 'name']);
    dispatch(clearPositions());
    setOrder('asc');
    setOrderBy('composite_rank');
    setView('composite');
    setRankView(newRankView);
  }

  const handleSeason = (season) => {
    if (searchParams) {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      current.set('season', season);
      const search = current.toString();
      const query = search ? `?${search}` : "";
      setLoading(true);
      startTransition(() => {
        router.push(`${pathName}${query}`);
        setLoading(false);
      });
    }

    setSeason(season);
  }

  let confChips: React.JSX.Element[] = [];
  for (let i = 0; i < conferences.length; i++) {
    confChips.push(<Chip sx = {{'margin': '5px'}} label={conferences[i]} onDelete={() => {dispatch(updateConferences(conferences[i]))}} />);
  }

  let positionChips: React.JSX.Element[] = [];
  for (let i = 0; i < positions.length; i++) {
    positionChips.push(<Chip sx = {{'margin': '5px'}} label={positions[i]} onDelete={() => {dispatch(updatePositions(positions[i]))}} />);
  }

  const handleTeam = (team_id) => {
    setSpin(true);
    startTransition(() => {
      router.push('/cbb/team/' + team_id+'?season='+season);
      setSpin(false);
    });
  }

  const handlePlayer = (player_id) => {
    setSpin(true);
    startTransition(() => {
      router.push('/cbb/player/' + player_id+'?season='+season);
      setSpin(false);
    });
  }

  const getColumns = () => {
    if (view === 'composite') {
      if (rankView === 'team') {
        return ['composite_rank', 'name', 'wins', 'conf_record', 'elo', 'adjusted_efficiency_rating', 'elo_sos', 'offensive_rating', 'defensive_rating', 'opponent_efficiency_rating', 'streak', 'conf'];
      } else if (rankView === 'player') {
        return ['composite_rank', 'name', 'team_name', 'efficiency_rating', 'offensive_rating', 'defensive_rating', 'player_efficiency_rating', 'minutes_per_game', 'points_per_game', 'usage_percentage', 'true_shooting_percentage'];
      } else if (rankView === 'conference') {
        return ['composite_rank', 'name', 'adjusted_efficiency_rating', 'elo', 'elo_sos', 'opponent_efficiency_rating', 'offensive_rating', 'defensive_rating', 'nonconfwins'];
      }
    } else if (view === 'offense') {
      if (rankView === 'team') {
        return ['composite_rank', 'name', 'offensive_rating', 'points', 'field_goal_percentage', 'two_point_field_goal_percentage', 'three_point_field_goal_percentage', 'free_throw_percentage', 'offensive_rebounds', 'assists', 'turnovers', 'possessions', 'pace'];
      } else if (rankView === 'player') {
        return ['composite_rank', 'name', 'offensive_rating', 'points_per_game', 'field_goal_percentage', 'two_point_field_goal_percentage', 'three_point_field_goal_percentage', 'free_throw_percentage', 'offensive_rebounds_per_game', 'assists_per_game', 'turnovers_per_game', 'turnover_percentage'];
      } else if (rankView === 'conference') {
        return ['composite_rank', 'name','offensive_rating', 'points', 'field_goal_percentage', 'two_point_field_goal_percentage', 'three_point_field_goal_percentage', 'free_throw_percentage', 'offensive_rebounds', 'assists', 'turnovers', 'possessions', 'pace'];
      }
    } else if (view === 'defense') {
      if (rankView === 'team') {
        return ['composite_rank', 'name', 'defensive_rating', 'defensive_rebounds', 'steals', 'blocks', 'opponent_points', 'opponent_field_goal_percentage', 'opponent_two_point_field_goal_percentage', 'opponent_three_point_field_goal_percentage', 'fouls'];
      } else if (rankView === 'player') {
        return ['composite_rank', 'name', 'defensive_rating', 'defensive_rebounds_per_game', 'steals_per_game', 'blocks_per_game', 'fouls_per_game', 'defensive_rebound_percentage', 'steal_percentage', 'block_percentage'];
      } else if (rankView === 'conference') {
        return ['composite_rank', 'name', 'defensive_rating', 'defensive_rebounds', 'steals', 'blocks', 'opponent_points', 'opponent_field_goal_percentage', 'opponent_two_point_field_goal_percentage', 'opponent_three_point_field_goal_percentage', 'fouls'];
      }
    } else if (view === 'custom') {
      return customColumns;
    }

    return [];
  };

  const headCells = getHeaderColumns({rankView});
  
  const rowsData = getRowsData({ data, rankView, conferences, positions });
  let rows = rowsData.rows;
  let lastUpdated = rowsData.lastUpdated;

  const row_length_before_filter = Object.keys(data).length;
  const allRows = rows;
  
  if (filteredRows !== null && filteredRows !== false) {
    rows = filteredRows;
  }

  const handleSort = (id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (tableRef && tableRef.current) {
      setTableHorizontalScroll(tableRef.current.scrollLeft);
    }
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(id);
  };

  const descendingComparator = (a, b, orderBy) => {
    if ((orderBy in a) && b[orderBy] === null) {
      return 1;
    }
    if (a[orderBy] === null && (orderBy in b)) {
      return -1;
    }

    let a_value = a[orderBy];
    let b_value = b[orderBy];
    if (orderBy === 'wins' || orderBy === 'conf_record') {
      a_value = +a[orderBy].split('-')[0];
      b_value = +b[orderBy].split('-')[0];
    }

    const direction = (headCells[orderBy] && headCells[orderBy].sort) || 'lower';

    if (b_value < a_value) {
      return direction === 'higher' ? 1 : -1;
    }
    if (b_value > a_value) {
      return direction === 'higher' ? -1 : 1;
    }
    return 0;
  }

  const getComparator = (order, orderBy) => {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  const handleRankingView = (value) => {
    localStorage.setItem('CBB.RANKING.VIEW', value);
    setView(value);
  };

  if (rows && rows.length) {
    rows = rows.sort(getComparator(order, orderBy)).slice();
  }

  const handlCustomColumnsSave = (columns) => {
    setCustomColumnsOpen(false);
    localStorage.setItem('CBB.RANKING.COLUMNS.' + rankView, JSON.stringify(columns));
    setCustomColumns(columns);
    handleRankingView('custom');
  };

  const handlCustomColumnsExit = () => {
    setCustomColumnsOpen(false);
  };


  const TableComponents: TableComponentsType = {
    Scroller: React.forwardRef<HTMLDivElement>((props, ref) => {
      return (
        <TableContainer component={Paper} {...props} ref={ref} />
      );
    }),
    Table: (props) => <Table {...props} style={{ borderCollapse: 'separate' }} />,
    TableHead: TableHead,
    TableRow: React.forwardRef<HTMLTableRowElement>((props, ref) => {
      return (
        <StyledTableRow {...props} ref={ref} onClick={() => {
          if (rankView === 'player' && (props as any).item.player_id) {
            handlePlayer((props as any).item.player_id);
          } else if (rankView === 'team' && (props as any).item.team_id) {
            handleTeam((props as any).item.team_id);
          } else if (rankView === 'conference' && (props as any).item.conference) {
            dispatch(updateConferences((props as any).item.conference));
            handleRankView('team');
          }
        }} />
      );
    }),
    TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => <TableBody {...props} ref={ref} />),
    // https://github.com/petyosi/react-virtuoso/issues/609
    // set the colspan below to the amount of columns you have.
    FillerRow: ({ height }) => {
      return (
        <TableRow>
          <TableCell
            colSpan={getColumns().length}
            style={{ height: height, padding: 0, border: 0 }}
          ></TableCell>
        </TableRow>
      );
    },
  }

  let rankCellMaxWidth = 50;
  if (width <= breakPoint) {
    rankCellMaxWidth = 30;
  }

  const getTableHeader = () => {
    return (
      <TableRow>
        {getColumns().map((column) => {
          const headCell = headCells[column];
          const tdStyle: React.CSSProperties = {
            'padding': '4px 5px',
            'border': 0,
          };

          if (width <= breakPoint) {
            tdStyle.fontSize = '13px';
          }

          if (headCell.sticky) {
            tdStyle.position = 'sticky';
            tdStyle.left = (headCell.id === 'name' ? rankCellMaxWidth : 0);
            tdStyle.zIndex = 3;
          } else {
            tdStyle.whiteSpace = 'nowrap';
          }

          if (headCell.id === 'conf_record' || headCell.id === 'wins') {
            tdStyle.minWidth = 41;
          }

          if (headCell.id === 'name') {
            tdStyle.borderRight = '3px solid ' + (theme.palette.mode === 'light' ? theme.palette.info.light : theme.palette.info.dark);
          }

          let showSortArrow = true;
          if (width <= breakPoint && (headCell.id === 'composite_rank' || headCell.id === 'wins' || headCell.id === 'conf_record')) {
            showSortArrow = false;
            if (headCell.id === 'composite_rank') {
              tdStyle.maxWidth = rankCellMaxWidth;
              tdStyle.minWidth = rankCellMaxWidth;
            }
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
                  active={orderBy === headCell.id && showSortArrow}
                  hideSortIcon = {!showSortArrow}
                  direction={orderBy === headCell.id ? (order as 'asc' | 'desc') : 'asc'}
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
    );
  }


  const getTableContents = (index, row) => {
    let columns = getColumns();

    const tdStyle: React.CSSProperties = {
      'padding': '4px 5px',
      'backgroundColor': theme.palette.mode === 'light' ? (index % 2 === 0 ? theme.palette.grey[200] : theme.palette.grey[300]) : (index % 2 === 0 ? theme.palette.grey[800] : theme.palette.grey[900]),
      border: 0,
      'borderTop': 0,
      'borderLeft': 0,
      'borderBottom': 0,
    };

    if (width <= breakPoint) {
      tdStyle.fontSize = '12px';
    }


    const teamCellStyle: React.CSSProperties = {
      position: 'sticky',
      left: rankCellMaxWidth,
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      minWidth: 125,
      maxWidth: 125,
      borderRight: '3px solid ' + (theme.palette.mode === 'light' ? theme.palette.info.light : theme.palette.info.dark),
    };

    const conferenceCellStyle: React.CSSProperties = {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      maxWidth: 100,
    };

    const rankCellStyle: React.CSSProperties = {
      'textAlign': 'center',
      'position': 'sticky',
      'left': 0,
      'maxWidth': rankCellMaxWidth
    };

    if (width <= breakPoint) {
      teamCellStyle.minWidth = 85;
      teamCellStyle.maxWidth = 85;
    }

    const tableCells: React.JSX.Element[] = [];

    for (let i = 0; i < columns.length; i++) {
      if (columns[i] === 'team_name') {
        tableCells.push(<TableCell title = {row[columns[i]]} key = {i} sx = {Object.assign({}, tdStyle, {
          'minWidth': 85,
          'maxWidth': 85,
          'overflow': 'hidden',
          'whiteSpace': 'nowrap',
          'textOverflow': 'ellipsis',
        })}>{row[columns[i]]}</TableCell>);
      } else if (columns[i] === 'name') {
        tableCells.push(<TableCell key = {i} sx = {Object.assign({}, tdStyle, teamCellStyle)}>{row[columns[i]]}</TableCell>);
      } else if (columns[i] === 'composite_rank') {
        tableCells.push(<TableCell key = {i} sx = {Object.assign({}, tdStyle, rankCellStyle)}>{row[columns[i]]}</TableCell>);
      } else if (columns[i] === 'conf') {
        tableCells.push(<TableCell key = {i} sx = {Object.assign({}, tdStyle, conferenceCellStyle)}>{row[columns[i]]}</TableCell>);
      } else {
        tableCells.push(<TableCell key = {i} sx = {tdStyle}>{row[columns[i]] !== null ? row[columns[i]] : '-'}{row[columns[i] + '_rank'] && row[columns[i]] !== null ? <RankSpan rank = {row[columns[i] + '_rank']} useOrdinal = {(rankView !== 'player')} max = {row_length_before_filter} />  : ''}</TableCell>);
      }
    } 

    return (
      <React.Fragment>
        {tableCells}
      </React.Fragment>
    );
  }

  let confHeightModifier = 0;
  if (confChips.length) {
    if (confChips.length < 4) {
      confHeightModifier = 40;
    } else {
      confHeightModifier = 80;
    }
  }


  const tableStyle = {
    'maxHeight': height - 280 - (width < 380 ? 30 : 0) - confHeightModifier - 40,
    'height': height - 280 - (width < 380 ? 30 : 0) - confHeightModifier - 40,
  };

  if ((rows.length + 2) * 26 < tableStyle.height) {
    tableStyle.height = (rows.length + 2) * 26;
  }

  if (height < 450) {
    tableStyle.maxHeight = 250;
    tableStyle.height = 250;
  }

  const handleSearch = (filteredRows) => {
    setFilteredRows(filteredRows);
  };


  return (
    <div>
      {spin ? <BackdropLoader /> : ''}
      {
        loading ? 
        <div style = {{'display': 'flex', 'justifyContent': 'center'}}><CircularProgress /></div> :
        <div>
          <div style = {{'padding': '5px 20px 0px 20px'}}>
            <div style = {{'display': 'flex', 'justifyContent': 'right', 'flexWrap': 'wrap'}}>
              <OptionPicker title = 'View' options = {rankViewOptions} selected = {rankView} actionHandler = {handleRankView} />
              <SeasonPicker selected = {season} actionHandler = {handleSeason} />
            </div>
            <Typography variant = 'h5'>College basketball rankings.</Typography>
            {lastUpdated ? <Typography color="text.secondary" variant = 'body1' style = {{'fontStyle': 'italic'}}>Last updated: {moment(lastUpdated.split('T')[0]).format('MMMM Do YYYY')}</Typography> : ''}
            <div style = {{'display': 'flex', 'justifyContent': 'center', 'flexWrap': 'wrap'}}>
              <Chip sx = {{'margin': '5px'}} label='Composite' variant={view !== 'composite' ? 'outlined' : 'filled'} color={view !== 'composite' ? 'primary' : 'success'} onClick={() => handleRankingView('composite')} />
              <Chip sx = {{'margin': '5px'}} label='Offense' variant={view !== 'offense' ? 'outlined' : 'filled'} color={view !== 'offense' ? 'primary' : 'success'} onClick={() => handleRankingView('offense')} />
              <Chip sx = {{'margin': '5px'}} label='Defense' variant={view !== 'defense' ? 'outlined' : 'filled'} color={view !== 'defense' ? 'primary' : 'success'} onClick={() => handleRankingView('defense')} />
              <Chip sx = {{'margin': '5px'}} label='Custom' variant={view !== 'custom' ? 'outlined' : 'filled'} color={view !== 'custom' ? 'primary' : 'success'} onClick={() => {setCustomColumnsOpen(true)}} />
              <ColumnPicker key = {rankView} options = {headCells} open = {customColumnsOpen} selected = {customColumns} saveHandler = {handlCustomColumnsSave} closeHandler = {handlCustomColumnsExit} />
            </div>
            <div style = {{'display': 'flex', 'justifyContent': 'space-between', 'alignItems': 'center', 'marginTop': '10px'}}>
              <div style={{'display': 'flex'}}>
                {rankView === 'player' || rankView === 'team' ? <ConferencePicker /> : ''}
                {rankView === 'player' ? <PositionPicker selected = {positions} /> : ''}
              </div>
              <RankSearch rows = {allRows} callback = {handleSearch} />
            </div>
            {confChips}
            {positionChips}
          </div>
          <div style = {{'padding': width < 600 ? '0px 10px' : '0px 20px'}}>
            {rows.length ? <TableVirtuoso scrollerRef={scrollerRef}  /*onScroll={(e) => console.log(e.target.scrollLeft)}*/ style={tableStyle} data={rows} components={TableComponents} fixedHeaderContent={getTableHeader} itemContent={getTableContents} /> : <div><Typography variant='h6' style = {{'textAlign': 'center'}}>No results :(</Typography></div>}
          </div>
        </div>
      }
    </div>
  );
};



export default Ranking;
