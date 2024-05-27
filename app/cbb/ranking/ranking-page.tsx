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

import CheckIcon from '@mui/icons-material/Check';
import HelpIcon from '@mui/icons-material/Help';

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
import AdditionalOptions from '@/components/generic/CBB/Ranking/AdditionalOptions';
import { setOrder, setOrderBy, setTableScrollTop } from '@/redux/features/ranking-slice';
import { Link } from '@mui/material';
import Legend from '@/components/generic/CBB/Ranking/Legend';
import FloatingButtons from '@/components/generic/CBB/Ranking/FloatingButtons';


// TODO Filter out people who play under x minutes?
// TODO ADD A POWER 5 CONF quick button TO THIS

// todo store horizontal scroll position


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


const Ranking = ({ data, generated, rankView }) => {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const theme = useTheme();
  const [isPending, startTransition] = useTransition();
  const dispatch = useAppDispatch();
  const selectedConferences = useAppSelector(state => state.displayReducer.conferences);
  const conferences = useAppSelector(state => state.dictionaryReducer.conference);
  const positions = useAppSelector(state => state.displayReducer.positions);
  const order = useAppSelector(state => state.rankingReducer.order);
  const orderBy = useAppSelector(state => state.rankingReducer.orderBy);
  const hideCommitted = useAppSelector(state => state.rankingReducer.hideCommitted);
  const hideUnderTwoMPG = useAppSelector(state => state.rankingReducer.hideUnderTwoMPG);
  const filterCommittedConf = useAppSelector(state => state.rankingReducer.filterCommittedConf);
  const filterOriginalConf = useAppSelector(state => state.rankingReducer.filterOriginalConf);
  const tableScrollTop = useAppSelector(state => state.rankingReducer.tableScrollTop);
  const tableFullscreen = useAppSelector(state => state.rankingReducer.tableFullscreen);

  // todo grab this on page load
  const seasons = [2024,2023,2022,2021,2020,2019,2018,2017,2016,2015,2014,2013,2012,2011];

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

  const [loading, setLoading] = useState(false);
  const [spin, setSpin] = useState(false);
  const [legendOpen, setLegendOpen] = useState(false);
  const [season, setSeason] = useState(searchParams?.get('season') || new HelperCBB().getCurrentSeason());
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
    const localRankView = localStorage.getItem('CBB.RANKING.VIEW') || null;
    const localRankCols = localStorage.getItem('CBB.RANKING.COLUMNS.' + rankView) || null;

    // since the coach view does not have off or def chips, reset it
    let view_ = localRankView ? localRankView : 'composite';
    if (rankView === 'coach' && view_ !== 'composite' && view_ !== 'custom') {
      view_ = 'composite';
    }

    setView(view_);
    setCustomColumns(localRankCols ?  JSON.parse(localRankCols) : ['composite_rank', 'name']);
  }, []);



  const rankViewOptions = [
    {'value': 'team', 'label': 'Team rankings'},
    {'value': 'player', 'label': 'Player rankings'},
    {'value': 'conference', 'label': 'Conference rankings'},
    {'value': 'transfer', 'label': 'Transfer rankings'},
    {'value': 'coach', 'label': 'Coach rankings'},
  ];

  const handleRankView = (newRankView) => {
    localStorage.removeItem('CBB.RANKING.COLUMNS.' + rankView);

    if (searchParams) {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      current.set('view', newRankView);
      current.delete('hideCommitted');
      current.delete('hideUnderTwoMPG');
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
    dispatch(setOrder('asc'));
    dispatch(setOrderBy('composite_rank'));
    dispatch(setTableScrollTop(0));
    setView('composite');
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
  for (let i = 0; i < selectedConferences.length; i++) {
    const conference = conferences[selectedConferences[i]]
    confChips.push(<Chip key = {selectedConferences[i]} sx = {{'margin': '5px'}} label={conference.code} onDelete={() => {dispatch(updateConferences(selectedConferences[i]))}} />);
  }

  let positionChips: React.JSX.Element[] = [];
  for (let i = 0; i < positions.length; i++) {
    positionChips.push(<Chip key = {positions[i]} sx = {{'margin': '5px'}} label={positions[i]} onDelete={() => {dispatch(updatePositions(positions[i]))}} />);
  }

  const handleTeam = (team_id) => {
    if (tableRef && tableRef.current) {
      dispatch(setTableScrollTop(tableRef.current.scrollTop));
    }
    setSpin(true);
    startTransition(() => {
      router.push('/cbb/team/' + team_id+'?season='+season);
      setSpin(false);
    });
  }

  const handlePlayer = (player_id) => {
    if (tableRef && tableRef.current) {
      dispatch(setTableScrollTop(tableRef.current.scrollTop));
    }
    setSpin(true);
    startTransition(() => {
      router.push('/cbb/player/' + player_id+'?season='+season);
      setSpin(false);
    });
  }

  const handleCoach = (coach_id) => {
    if (tableRef && tableRef.current) {
      dispatch(setTableScrollTop(tableRef.current.scrollTop));
    }
    setSpin(true);
    startTransition(() => {
      router.push('/cbb/coach/' + coach_id+'?season='+season);
      setSpin(false);
    });
  }

  const getColumns = () => {
    if (view === 'composite') {
      if (rankView === 'team') {
        return ['composite_rank', 'name', 'wins', 'conf_record', 'elo', 'adjusted_efficiency_rating', 'elo_sos', 'offensive_rating', 'defensive_rating', 'opponent_efficiency_rating', 'streak', 'conference_code'];
      } else if (rankView === 'player') {
        return ['composite_rank', 'name', 'team_name', 'efficiency_rating', 'offensive_rating', 'defensive_rating', 'player_efficiency_rating', 'minutes_per_game', 'points_per_game', 'usage_percentage', 'true_shooting_percentage'];
      } else if (rankView === 'conference') {
        return ['composite_rank', 'name', 'adjusted_efficiency_rating', 'elo', 'elo_sos', 'opponent_efficiency_rating', 'offensive_rating', 'defensive_rating', 'nonconfwins'];
      } else if (rankView === 'transfer') {
        return ['composite_rank', 'name', 'team_name', 'committed_team_name', 'efficiency_rating', 'offensive_rating', 'defensive_rating', 'player_efficiency_rating', 'minutes_per_game', 'points_per_game', 'usage_percentage', 'true_shooting_percentage'];
      } else if (rankView === 'coach') {
        return [
          'composite_rank',
          'name',
          'team_name',
          'elo',
          'games',
          // 'wins',
          // 'losses',
          // 'nonconfwins',
          // 'nonconflosses',
          // 'neutralwins',
          // 'neutrallosses',
          // 'homewins',
          // 'homelosses',
          // 'roadwins',
          // 'roadlosses',
          'win_percentage',
          'conf_win_percentage',
          'nonconf_win_percentage',
          'home_win_percentage',
          'road_win_percentage',
          'neutral_win_percentage',
        ];
      }
    } else if (view === 'offense') {
      if (rankView === 'team') {
        return ['composite_rank', 'name', 'offensive_rating', 'points', 'field_goal_percentage', 'two_point_field_goal_percentage', 'three_point_field_goal_percentage', 'free_throw_percentage', 'offensive_rebounds', 'assists', 'turnovers', 'possessions', 'pace'];
      } else if (rankView === 'player' || rankView === 'transfer') {
        return ['composite_rank', 'name', 'offensive_rating', 'points_per_game', 'field_goal_percentage', 'two_point_field_goal_percentage', 'three_point_field_goal_percentage', 'free_throw_percentage', 'offensive_rebounds_per_game', 'assists_per_game', 'turnovers_per_game', 'turnover_percentage'];
      } else if (rankView === 'conference') {
        return ['composite_rank', 'name','offensive_rating', 'points', 'field_goal_percentage', 'two_point_field_goal_percentage', 'three_point_field_goal_percentage', 'free_throw_percentage', 'offensive_rebounds', 'assists', 'turnovers', 'possessions', 'pace'];
      }
    } else if (view === 'defense') {
      if (rankView === 'team') {
        return ['composite_rank', 'name', 'defensive_rating', 'defensive_rebounds', 'steals', 'blocks', 'opponent_points', 'opponent_field_goal_percentage', 'opponent_two_point_field_goal_percentage', 'opponent_three_point_field_goal_percentage', 'fouls'];
      } else if (rankView === 'player' || rankView === 'transfer') {
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
  
  const rowsData = getRowsData({ data, rankView, selectedConferences, positions, hideCommitted, hideUnderTwoMPG, filterCommittedConf, filterOriginalConf });

  let rows = rowsData.rows;
  let lastUpdated = rowsData.lastUpdated;

  const row_length_before_filter = (rankView === 'transfer' ? 5300 : Object.keys(data).length);
  const allRows = rows;
  
  if (filteredRows !== null && filteredRows !== false) {
    rows = filteredRows;
  }

  const handleSort = (id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (tableRef && tableRef.current) {
      setTableHorizontalScroll(tableRef.current.scrollLeft);
    }
    dispatch(setOrder(isAsc ? 'desc' : 'asc'));
    dispatch(setOrderBy(id));
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
    if ((rankView !== 'coach' && orderBy === 'wins') || orderBy === 'conf_record') {
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
          if ((rankView === 'player' || rankView === 'transfer') && (props as any).item.player_id) {
            handlePlayer((props as any).item.player_id);
          } else if (rankView === 'team' && (props as any).item.team_id) {
            handleTeam((props as any).item.team_id);
          } else if (rankView === 'conference' && (props as any).item.conference_id) {
            dispatch(updateConferences((props as any).item.conference_id));
            handleRankView('team');
          } else if (rankView === 'coach' && (props as any).item.coach_id) {
            handleCoach((props as any).item.coach_id);
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
    rankCellMaxWidth = 35;
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
      } else if (columns[i] === 'committed') {
        tableCells.push(<TableCell key = {i} sx = {tdStyle}>{row[columns[i]] === 1 ? <CheckIcon fontSize='small' color = 'success' /> : '-'}</TableCell>);
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
    'maxHeight': height - (tableFullscreen ? 100 : 280) - (width < 380 ? 30 : 0) - (tableFullscreen ? 0 : confHeightModifier) - 40,
    'height': height - (tableFullscreen ? 100 : 280) - (width < 380 ? 30 : 0) - (tableFullscreen ? 0 : confHeightModifier) - 40,
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

  const getLastUpdated = (): string => {
    if (!lastUpdated) {
      return '';
    }

    if (rankView === 'transfer') {
      let date = moment();
      date = date.subtract(1, 'days');
      return date.format('MMMM Do YYYY');
    }

    return moment(lastUpdated.split('T')[0]).format('MMMM Do YYYY');
  };

  const handleLegend = () => {
    setLegendOpen(!legendOpen);
  };


  return (
    <div>
      <BackdropLoader open = {spin} />
      <Legend open = {legendOpen} onClose={handleLegend} columns={getColumns()} rankView={rankView} />
      {
        loading ? 
        <div style = {{'display': 'flex', 'justifyContent': 'center'}}><CircularProgress /></div> :
        <div>
          <FloatingButtons />
          {
          !tableFullscreen ? 
            <div style = {{'padding': '5px 20px 0px 20px'}}>
              <div style = {{'display': 'flex', 'justifyContent': 'right', 'flexWrap': 'wrap'}}>
                <OptionPicker title = 'View' options = {rankViewOptions} selected = {rankView} actionHandler = {handleRankView} />
                <SeasonPicker selected = {season} actionHandler = {handleSeason} seasons = {seasons} />
              </div>
              <Typography variant = 'h5'>{'College basketball ' + rankView + ' rankings.'}</Typography>
              {
                lastUpdated ?
                <div style = {{'display': 'flex', 'alignItems': 'center', 'alignContent': 'center'}}>
                  <Typography color="text.secondary" variant = 'body1' style = {{'fontStyle': 'italic'}}>{'Last updated: ' + getLastUpdated()}</Typography>
                  <HelpIcon style = {{'margin': '0px 5px'}} fontSize='small' color = 'info' />
                  <Typography color="text.secondary" variant = 'body1' style = {{'fontStyle': 'italic'}}><Link style = {{'cursor': 'pointer'}} underline="hover" onClick = {handleLegend}>{'Legend'}</Link></Typography>
                </div> : 
                ''
              }
              <div style = {{'display': 'flex', 'justifyContent': 'center', 'flexWrap': 'wrap'}}>
                <Chip sx = {{'margin': '5px'}} label='Composite' variant={view !== 'composite' ? 'outlined' : 'filled'} color={view !== 'composite' ? 'primary' : 'success'} onClick={() => handleRankingView('composite')} />
                {rankView !== 'coach' ? <Chip sx = {{'margin': '5px'}} label='Offense' variant={view !== 'offense' ? 'outlined' : 'filled'} color={view !== 'offense' ? 'primary' : 'success'} onClick={() => handleRankingView('offense')} /> : ''}
                {rankView !== 'coach' ? <Chip sx = {{'margin': '5px'}} label='Defense' variant={view !== 'defense' ? 'outlined' : 'filled'} color={view !== 'defense' ? 'primary' : 'success'} onClick={() => handleRankingView('defense')} /> : ''}
                <Chip sx = {{'margin': '5px'}} label='Custom' variant={view !== 'custom' ? 'outlined' : 'filled'} color={view !== 'custom' ? 'primary' : 'success'} onClick={() => {setCustomColumnsOpen(true)}} />
                <ColumnPicker key = {rankView} options = {headCells} open = {customColumnsOpen} selected = {customColumns} saveHandler = {handlCustomColumnsSave} closeHandler = {handlCustomColumnsExit} />
              </div>
              <div style = {{'display': 'flex', 'justifyContent': 'space-between', 'alignItems': 'baseline', 'marginTop': '10px'}}>
                <div style={{'display': 'flex', 'alignItems': 'center',}}>
                  {rankView === 'player' || rankView === 'transfer' ? <AdditionalOptions view = {rankView} /> : ''}
                  {rankView !== 'conference' ? <ConferencePicker /> : ''}
                  {rankView === 'player' || rankView === 'transfer' ? <PositionPicker selected = {positions} /> : ''}
                </div>
                <RankSearch rows = {allRows} callback = {handleSearch} rankView = {rankView} />
              </div>
              {confChips}
              {positionChips}
            </div>
          : ''
          }
          <div style = {{'padding': width < 600 ? (tableFullscreen ? '10px' : '0px') + ' 10px 0px 10px' : (tableFullscreen ? '10px' : '0px') + ' 20px 0px 20px'}}>
            {rows.length ? <TableVirtuoso scrollerRef={scrollerRef} initialScrollTop={tableScrollTop} style={tableStyle} data={rows} components={TableComponents} fixedHeaderContent={getTableHeader} itemContent={getTableContents} /> : <div><Typography variant='h6' style = {{'textAlign': 'center'}}>No results :(</Typography></div>}
          </div>
        </div>
      }
    </div>
  );
};



export default Ranking;
