'use client';

import {
  TableContainer, Table, TableHead, TableRow, Tooltip, TableSortLabel, Box, TableBody, TableCell,
  SortDirection,
  TableFooter,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { Dimensions, useWindowDimensions } from '../hooks/useWindowDimensions';
import { useEffect, useState } from 'react';
import Sorter from '../utils/Sorter';
import RankSpan from './RankSpan';
import { useTheme } from '../hooks/useTheme';
import Style from '../utils/Style';
import Paper from '../ux/container/Paper';


type defaultSortOrderType = 'asc' | 'desc';

const RankTable = (
  {
    rows,
    footerRow = null,
    columns,
    displayColumns,
    rowKey,
    defaultSortOrder,
    defaultSortOrderBy,
    defaultEmpty = 0,
    sessionStorageKey,
    getRankSpanMax,
    secondaryKey,
    handleRowClick,
    customSortComparator,
  }:
  {
    rows: object[],
    footerRow?: object | null,
    columns: object,
    displayColumns: string[],
    rowKey: string,
    defaultSortOrder: defaultSortOrderType,
    defaultSortOrderBy: string,
    defaultEmpty?: string | number,
    sessionStorageKey: string,
    getRankSpanMax?: (row: unknown) => number,
    secondaryKey?: string,
    handleRowClick?: (id: string) => void,
    customSortComparator?: (order: string, orderBy: string, direction?: string) => (a: unknown, b: unknown) => number,
  },
) => {
  const breakPoint = 425;
  let numberOfStickyColumns = 0;
  const { width } = useWindowDimensions() as Dimensions;
  const theme = useTheme();

  const sessionOrder = sessionStorage.getItem(`${sessionStorageKey}.ORDER`) || null;
  const sessionOrderBy = sessionStorage.getItem(`${sessionStorageKey}.ORDERBY`) || null;

  const [order, setOrder] = useState<string>(sessionOrder || defaultSortOrder);
  const [orderBy, setOrderBy] = useState<string>(sessionOrderBy || defaultSortOrderBy);

  const sortedRows = customSortComparator ?
    rows.sort(customSortComparator(order, orderBy, (columns[orderBy] && columns[orderBy].sort))) :
    rows.sort(Sorter.getComparator(order, orderBy, (columns[orderBy] && columns[orderBy].sort)));


  // Update internal state whenever the prop changes
  useEffect(() => {
    if (!sessionOrder) {
      setOrder(defaultSortOrder);
    }

    if (!sessionOrderBy) {
      setOrderBy(defaultSortOrderBy);
    }
  }, [defaultSortOrderBy, defaultSortOrder]);

  for (let i = 0; i < displayColumns.length; i++) {
    if (
      displayColumns[i] in columns &&
      'sticky' in columns[displayColumns[i]] &&
      columns[displayColumns[i]].sticky === true
    ) {
      numberOfStickyColumns++;
    }
  }

  const handleSort = (id: string) => {
    const isAsc = orderBy === id && order === 'asc';
    sessionStorage.setItem(`${sessionStorageKey}.ORDER`, (isAsc ? 'desc' : 'asc'));
    sessionStorage.setItem(`${sessionStorageKey}.ORDERBY`, id);
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(id);
  };

  let b = 0;
  const i_x_left = {};

  const row_containers = sortedRows.slice().map((row) => {
    let tdColor = (b % 2 === 0 ? theme.grey[800] : theme.grey[900]);

    if (theme.mode === 'light') {
      tdColor = b % 2 === 0 ? theme.grey[200] : theme.grey[300];
    }

    b++;

    const tdStyle: React.CSSProperties = {
      padding: '4px 5px',
      backgroundColor: tdColor,
      border: 0,
      borderTop: 0,
      borderLeft: 0,
      borderBottom: 0,
      whiteSpace: 'nowrap',
    };

    if (width <= breakPoint) {
      tdStyle.fontSize = '12px';
    }

    const tableCells: React.JSX.Element[] = [];

    for (let i = 0; i < displayColumns.length; i++) {
      const headCell = columns[displayColumns[i]];
      const cellStyle = { ...tdStyle };

      let tdWidth: number | null = null;
      const tdLeft: number = (i - 1 in i_x_left ? i_x_left[i - 1] : 0);

      if (headCell.widths) {
        tdWidth = headCell.widths.default;

        let lastBreakpoint: number | null = null;
        for (const bp in headCell.widths) {
          if (
            bp !== 'default' &&
            width <= Number(bp) &&
            (
              !lastBreakpoint ||
              lastBreakpoint > width
            )
          ) {
            lastBreakpoint = Number(bp);
            tdWidth = headCell.widths[bp];
          }
        }
      }

      if (tdWidth) {
        cellStyle.width = tdWidth;
        cellStyle.minWidth = tdWidth;
        cellStyle.maxWidth = tdWidth;
      }

      if (headCell.sticky) {
        cellStyle.position = 'sticky';
        cellStyle.overflow = 'hidden';
        cellStyle.whiteSpace = 'nowrap';
        cellStyle.textOverflow = 'ellipsis';
        cellStyle.zIndex = 3;
        cellStyle.left = tdLeft;

        if (!(i in i_x_left)) {
          i_x_left[i] = (tdWidth || 0) + (tdLeft || 0);
        }
      }

      if (i + 1 === numberOfStickyColumns) {
        cellStyle.borderRight = `3px solid ${theme.mode === 'light' ? theme.info.light : theme.info.dark}`;
      }

      let secondarySpan: string | React.JSX.Element = '';

      if (secondaryKey && row[`${displayColumns[i]}_${secondaryKey}`]) {
        secondarySpan = (
          <span style = {{ color: theme.grey[500] }}> {row[`${displayColumns[i]}_${secondaryKey}`]}</span>
        );
      } else if (row[`${displayColumns[i]}_rank`] && getRankSpanMax) {
        secondarySpan = <RankSpan key = {i} rank = {row[`${displayColumns[i]}_rank`]} max = {getRankSpanMax(row)} useOrdinal = {true} />;
      }

      tableCells.push(
        <TableCell key = {i} sx = {cellStyle}>{row[displayColumns[i]] || defaultEmpty}{secondarySpan}</TableCell>,
      );
    }

    const TableRowCSS = Style.getStyleClassName(`
      &:hover td: {
        backgroundColor: ${theme.mode === 'light' ? theme.info.light : theme.info.dark},
      },
      &:hover: {
        cursor: 'pointer',
      },
    `);

    return (
      <TableRow
        className={TableRowCSS}
        key={row[rowKey]}
        onClick={() => {
          if (handleRowClick) {
            handleRowClick(row[rowKey]);
          }
        }}
      >
        {tableCells}
      </TableRow>
    );
  });
  return (
    <div style = {{ overflow: 'scroll' }} >
      <TableContainer component={Paper}>
        <Table size="small" aria-label="data-table" style={{ borderCollapse: 'separate' }}>
          <TableHead>
            <TableRow>
              {displayColumns.map((column, i) => {
                const headCell = columns[column];
                const tdStyle: React.CSSProperties = {
                  padding: '4px 5px',
                  border: 0,
                  backgroundColor: theme.mode === 'light' ? theme.info.light : theme.info.dark,
                };

                let tdWidth: number | null = null;
                const tdLeft: number = (i - 1 in i_x_left ? i_x_left[i - 1] : 0);

                if (headCell.widths) {
                  tdWidth = headCell.widths.default;

                  let lastBreakpoint: number | null = null;
                  for (const bp in headCell.widths) {
                    if (
                      bp !== 'default' &&
                      width <= Number(bp) &&
                      (
                        !lastBreakpoint ||
                        lastBreakpoint > width
                      )
                    ) {
                      lastBreakpoint = Number(bp);
                      tdWidth = headCell.widths[bp];
                    }
                  }
                }

                if (tdWidth) {
                  tdStyle.width = tdWidth;
                  tdStyle.minWidth = tdWidth;
                  tdStyle.maxWidth = tdWidth;
                }


                if (width <= breakPoint) {
                  tdStyle.fontSize = '13px';
                }

                if (headCell.sticky) {
                  tdStyle.position = 'sticky';
                  tdStyle.zIndex = 3;
                  tdStyle.left = tdLeft;

                  if (!(i in i_x_left)) {
                    i_x_left[i] = (tdWidth || 0) + (tdLeft || 0);
                  }
                } else {
                  tdStyle.whiteSpace = 'nowrap';
                }

                if (i + 1 === numberOfStickyColumns) {
                  tdStyle.borderRight = `3px solid ${theme.mode === 'light' ? theme.info.light : theme.info.dark}`;
                }

                return (
                  <Tooltip key={headCell.id} disableFocusListener placement = 'top' title={headCell.tooltip}>
                    <TableCell
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
                    </TableCell>
                  </Tooltip>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {row_containers}
          </TableBody>
          {
            footerRow !== null ?
            <TableFooter>
              <TableRow>
                {displayColumns.map((column, i) => {
                  const headCell = columns[column];

                  const tdColor = theme.mode === 'light' ? theme.grey[300] : theme.grey[900];

                  const tdStyle: React.CSSProperties = {
                    padding: '4px 5px',
                    border: 0,
                    backgroundColor: tdColor,
                  };

                  let tdWidth: number | null = null;
                  const tdLeft: number = (i - 1 in i_x_left ? i_x_left[i - 1] : 0);

                  if (headCell.widths) {
                    tdWidth = headCell.widths.default;

                    let lastBreakpoint: number | null = null;
                    for (const bp in headCell.widths) {
                      if (
                        bp !== 'default' &&
                        width <= Number(bp) &&
                        (
                          !lastBreakpoint ||
                          lastBreakpoint > width
                        )
                      ) {
                        lastBreakpoint = Number(bp);
                        tdWidth = headCell.widths[bp];
                      }
                    }
                  }

                  if (tdWidth) {
                    tdStyle.width = tdWidth;
                    tdStyle.minWidth = tdWidth;
                    tdStyle.maxWidth = tdWidth;
                  }


                  if (width <= breakPoint) {
                    tdStyle.fontSize = '13px';
                  }

                  if (headCell.sticky) {
                    tdStyle.position = 'sticky';
                    tdStyle.zIndex = 3;
                    tdStyle.left = tdLeft;

                    if (!(i in i_x_left)) {
                      i_x_left[i] = (tdWidth || 0) + (tdLeft || 0);
                    }
                  } else {
                    tdStyle.whiteSpace = 'nowrap';
                  }

                  if (i + 1 === numberOfStickyColumns) {
                    tdStyle.borderRight = `3px solid ${theme.mode === 'light' ? theme.info.light : theme.info.dark}`;
                  }

                  if (column in footerRow) {
                    let secondarySpan: string | React.JSX.Element = '';

                    if (secondaryKey && footerRow[`${column}_${secondaryKey}`]) {
                      secondarySpan = (
                        <span style = {{ color: theme.grey[500] }}> {footerRow[`${column}_${secondaryKey}`]}</span>
                      );
                    }

                    return (
                      <TableCell key = {column} sx = {tdStyle}>{footerRow[column]}{secondarySpan}</TableCell>
                    );
                  }

                  return null;
                })}
              </TableRow>
            </TableFooter>
              : ''
          }
        </Table>
      </TableContainer>
    </div>
  );
};

export default RankTable;
