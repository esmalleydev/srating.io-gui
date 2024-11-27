'use client';

import React, { ForwardRefExoticComponent, MutableRefObject, RefAttributes, useEffect, useRef, useState, useTransition } from 'react';

import { Dimensions, useWindowDimensions } from '@/components/hooks/useWindowDimensions';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { LinearProgress, useTheme } from '@mui/material';
import { TableVirtuoso } from 'react-virtuoso';


import Typography from '@mui/material/Typography';

import { styled } from '@mui/material/styles';

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
import { getHeaderColumns, getViewableColumns } from '../columns';
import { setDataKey } from '@/redux/features/ranking-slice';
import { useRouter } from 'next/navigation';
import { setLoading as setLoadingDisplay } from '@/redux/features/display-slice';
import { getConferenceChips } from '../ConferenceChips';
import RankSpan from '../../RankSpan';
import { getRows } from '../DataHandler';
import Organization from '@/components/helpers/Organization';
import { CBBRankingTable } from '@/types/cbb';
import { CFBRankingTable } from '@/types/cfb';

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
  border: 0,
  '&:hover': {
    cursor: 'pointer',
  },
}));

const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'light' ? theme.palette.info.light : theme.palette.info.dark,
}));


/**
 * The main wrapper div for all the contents
 */
const Contents = ({ children }): React.JSX.Element => {
  return (
    <div>
      {children}
    </div>
  );
};


const ClientSkeleton = () => {
  const heightToRemove = 400;
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

const Client = ({ generated, organization_id, division_id, season, view }) => {
  interface ItemType {
    player_id?: number;
    team_id?: number;
    conference_id?: number;
    coach_id?: number;
  }

  interface TableComponentsType {
    Scroller: ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & RefAttributes<HTMLDivElement>>;
    Table: React.ComponentType<React.TableHTMLAttributes<HTMLTableElement>>;
    TableHead: React.ComponentType<React.HTMLAttributes<HTMLTableSectionElement>>;
    TableRow: ForwardRefExoticComponent<React.HTMLAttributes<HTMLTableRowElement> & { item: ItemType } & RefAttributes<HTMLTableRowElement>>;
    TableBody: ForwardRefExoticComponent<React.HTMLAttributes<HTMLTableSectionElement> & RefAttributes<HTMLTableSectionElement>>;
    FillerRow: React.ComponentType<{ height: number }>;
  }

  interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
    item: ItemType;
  }

  const router = useRouter();
  const theme = useTheme();
  const [isPending, startTransition] = useTransition();
  const { height, width } = useWindowDimensions() as Dimensions;

  const breakPoint = 425;

  const dispatch = useAppDispatch();
  const organizations = useAppSelector((state) => state.dictionaryReducer.organization);
  const data = useAppSelector((state) => state.rankingReducer.data);
  const order = useAppSelector((state) => state.rankingReducer.order);
  const orderBy = useAppSelector((state) => state.rankingReducer.orderBy);
  const tableScrollTop = useAppSelector((state) => state.rankingReducer.tableScrollTop);
  const tableFullscreen = useAppSelector((state) => state.rankingReducer.tableFullscreen);
  const allRows = getRows({ view });
  const filteredRows = useAppSelector((state) => state.rankingReducer.filteredRows);
  const columnView = useAppSelector((state) => state.rankingReducer.columnView);
  const customColumns = useAppSelector((state) => state.rankingReducer.customColumns);

  const tableColumns = getViewableColumns({ organization_id, view, columnView, customColumns });
  const confChipsLength = getConferenceChips().length;

  const currentPath = Organization.getPath({ organizations, organization_id });

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
    [],
  );

  useEffect(() => {
    if (tableRef.current) {
      setTimeout(() => {
        tableRef.current?.scrollTo({ left: tableHorizontalScroll });
      }, 0);
    }
  }, [tableHorizontalScroll, order, orderBy]);

  const headCells = getHeaderColumns({ organization_id, view });

  if (data === null) {
    return <ClientSkeleton />;
  }

  const dataLength = (view === 'transfer' ? 5300 : Object.keys(data).length);

  let rows: (CBBRankingTable | CFBRankingTable)[] = allRows;

  if (filteredRows !== null && filteredRows !== false && filteredRows !== true) {
    // creates a shallow copy, since redux freezes the array / object
    rows = [...filteredRows];
  }

  const handleSort = (id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (tableRef && tableRef.current) {
      setTableHorizontalScroll(tableRef.current.scrollLeft);
    }
    dispatch(setDataKey({ key: 'order', value: (isAsc ? 'desc' : 'asc') }));
    dispatch(setDataKey({ key: 'orderBy', value: id }));
  };

  const handleTeam = (team_id) => {
    if (tableRef && tableRef.current) {
      dispatch(setDataKey({ key: 'tableScrollTop', value: tableRef.current.scrollTop }));
    }
    dispatch(setLoadingDisplay(true));
    startTransition(() => {
      router.push(`/${currentPath}/team/${team_id}?season=${season}`);
    });
  };

  const handlePlayer = (player_id) => {
    if (tableRef && tableRef.current) {
      dispatch(setDataKey({ key: 'tableScrollTop', value: tableRef.current.scrollTop }));
    }
    dispatch(setLoadingDisplay(true));
    startTransition(() => {
      router.push(`/${currentPath}/player/${player_id}?season=${season}`);
    });
  };

  const handleConference = (conference_id) => {
    if (tableRef && tableRef.current) {
      dispatch(setDataKey({ key: 'tableScrollTop', value: tableRef.current.scrollTop }));
    }
    dispatch(setLoadingDisplay(true));
    startTransition(() => {
      router.push(`/${currentPath}/conference/${conference_id}?season=${season}`);
    });
  };

  const handleCoach = (coach_id) => {
    if (tableRef && tableRef.current) {
      dispatch(setDataKey({ key: 'tableScrollTop', value: tableRef.current.scrollTop }));
    }
    dispatch(setLoadingDisplay(true));
    startTransition(() => {
      router.push(`/${currentPath}/coach/${coach_id}?season=${season}`);
    });
  };

  const descendingComparator = (a, b, orderBy) => {
    if ((orderBy in a) && b[orderBy] === null) {
      return 1;
    }
    if (a[orderBy] === null && (orderBy in b)) {
      return -1;
    }

    let a_value = a[orderBy];
    let a_secondary: number | null = null;
    let b_value = b[orderBy];
    let b_secondary: number | null = null;
    if ((view !== 'coach' && orderBy === 'wins') || orderBy === 'conf_record') {
      a_value = +a[orderBy].split('-')[0];
      a_secondary = +a[orderBy].split('-')[1];
      b_value = +b[orderBy].split('-')[0];
      b_secondary = +b[orderBy].split('-')[1];
    }

    const direction = (headCells[orderBy] && headCells[orderBy].sort) || 'lower';

    if (
      a_secondary !== null &&
      b_secondary !== null &&
      a_value === b_value
    ) {
      // these ones are reversed because we want the lower one (losses to be ranked higher)
      if (b_secondary < a_secondary) {
        return direction === 'higher' ? -1 : 1;
      }
      if (b_secondary > a_secondary) {
        return direction === 'higher' ? 1 : -1;
      }
    }

    if (b_value < a_value) {
      return direction === 'higher' ? 1 : -1;
    }
    if (b_value > a_value) {
      return direction === 'higher' ? -1 : 1;
    }
    return 0;
  };

  const getComparator = (order, orderBy) => {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  if (rows && rows.length) {
    rows.sort(getComparator(order, orderBy));
  }

  const TableComponents: TableComponentsType = {
    Scroller: React.forwardRef<HTMLDivElement>((props, ref) => {
      return (
        <TableContainer component={Paper} {...props} ref={ref} />
      );
    }),
    Table: (props) => <Table {...props} style={{ borderCollapse: 'separate' }} />,
    TableHead,
    TableRow: React.forwardRef<HTMLTableRowElement, TableRowProps>((props, ref) => {
      return (
        <StyledTableRow {...props} ref={ref} onClick={() => {
          const { item } = props;
          if ((view === 'player' || view === 'transfer') && item.player_id) {
            handlePlayer(item.player_id);
          } else if (view === 'team' && item.team_id) {
            handleTeam(item.team_id);
          } else if (view === 'conference' && item.conference_id) {
            handleConference(item.conference_id);
          } else if (view === 'coach' && item.coach_id) {
            handleCoach(item.coach_id);
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
            colSpan={tableColumns.length}
            style={{ height, padding: 0, border: 0 }}
          ></TableCell>
        </TableRow>
      );
    },
  };

  let rankCellMaxWidth = 50;
  if (width <= breakPoint) {
    rankCellMaxWidth = 35;
  }


  let confHeightModifier = 0;
  if (confChipsLength) {
    confHeightModifier = confChipsLength < 4 ? 40 : 80;
  }

  const tableStyle = {
    maxHeight: height - (tableFullscreen ? 100 : 280) - (width < 380 ? 30 : 0) - (tableFullscreen ? 0 : confHeightModifier) - 40,
    height: height - (tableFullscreen ? 100 : 280) - (width < 380 ? 30 : 0) - (tableFullscreen ? 0 : confHeightModifier) - 40,
  };

  if ((rows.length + 2) * 26 < tableStyle.height) {
    tableStyle.height = (rows.length + 2) * 27;
  }

  if (height < 450) {
    tableStyle.maxHeight = 250;
    tableStyle.height = 250;
  }

  const getTableHeader = () => {
    return (
      <TableRow>
        {tableColumns.map((column) => {
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
            tdStyle.left = (headCell.id === 'name' ? rankCellMaxWidth : 0);
            tdStyle.zIndex = 3;
          } else {
            tdStyle.whiteSpace = 'nowrap';
          }

          if (headCell.id === 'conf_record' || headCell.id === 'wins') {
            tdStyle.minWidth = 41;
          }

          if (headCell.id === 'name') {
            tdStyle.borderRight = `3px solid ${theme.palette.mode === 'light' ? theme.palette.info.light : theme.palette.info.dark}`;
          }

          let showSortArrow = true;
          if (width <= breakPoint && (headCell.id === 'rank' || headCell.id === 'wins' || headCell.id === 'conf_record')) {
            showSortArrow = false;
            if (headCell.id === 'rank') {
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
    );
  };


  const getTableContents = (index, row) => {
    const columns = tableColumns;

    let bgColor = (index % 2 === 0 ? theme.palette.grey[800] : theme.palette.grey[900]);
    if (theme.palette.mode === 'light') {
      bgColor = index % 2 === 0 ? theme.palette.grey[200] : theme.palette.grey[300];
    }

    const tdStyle: React.CSSProperties = {
      padding: '4px 5px',
      backgroundColor: bgColor,
      border: 0,
      borderTop: 0,
      borderLeft: 0,
      borderBottom: 0,
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
      borderRight: `3px solid ${theme.palette.mode === 'light' ? theme.palette.info.light : theme.palette.info.dark}`,
    };

    const conferenceCellStyle: React.CSSProperties = {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      maxWidth: 100,
    };

    const rankCellStyle: React.CSSProperties = {
      textAlign: 'center',
      position: 'sticky',
      left: 0,
      maxWidth: rankCellMaxWidth,
    };

    if (width <= breakPoint) {
      teamCellStyle.minWidth = 85;
      teamCellStyle.maxWidth = 85;
    }

    const tableCells: React.JSX.Element[] = [];

    for (let i = 0; i < columns.length; i++) {
      if (columns[i] === 'team_name') {
        tableCells.push(<TableCell title = {row[columns[i]]} key = {i} sx = {({
          ...tdStyle,
          minWidth: 85,
          maxWidth: 85,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
        })}>{row[columns[i]]}</TableCell>);
      } else if (columns[i] === 'name') {
        tableCells.push(<TableCell key = {i} sx = {({ ...tdStyle, ...teamCellStyle })}>{row[columns[i]]}</TableCell>);
      } else if (columns[i] === 'rank') {
        tableCells.push(<TableCell key = {i} sx = {({ ...tdStyle, ...rankCellStyle })}>{row[columns[i]]}</TableCell>);
      } else if (columns[i] === 'conf') {
        tableCells.push(<TableCell key = {i} sx = {({ ...tdStyle, ...conferenceCellStyle })}>{row[columns[i]]}</TableCell>);
      } else if (columns[i] === 'committed') {
        tableCells.push(<TableCell key = {i} sx = {tdStyle}>{row[columns[i]] === 1 ? <CheckIcon fontSize='small' color = 'success' /> : '-'}</TableCell>);
      } else {
        tableCells.push(<TableCell key = {i} sx = {tdStyle}>{row[columns[i]] !== null ? row[columns[i]] : '-'}{row[`${columns[i]}_rank`] && row[columns[i]] !== null ? <RankSpan rank = {row[`${columns[i]}_rank`]} useOrdinal = {(view !== 'player')} max = {dataLength} /> : ''}</TableCell>);
      }
    }

    return (
      <React.Fragment>
        {tableCells}
      </React.Fragment>
    );
  };

  return (
    <Contents>
      <div style = {{ padding: width < 600 ? `${tableFullscreen ? '10px' : '0px'} 10px 0px 10px` : `${tableFullscreen ? '10px' : '0px'} 20px 0px 20px` }}>
        {rows.length ? <TableVirtuoso scrollerRef={scrollerRef} initialScrollTop={tableScrollTop} style={tableStyle} data={rows} components={TableComponents} fixedHeaderContent={getTableHeader} itemContent={getTableContents} /> : <div><Typography variant='h6' style = {{ textAlign: 'center' }}>No results :(</Typography></div>}
      </div>
    </Contents>
  );
};

export { Client, ClientSkeleton };
