'use client';

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Table from './Table';
import Thead from './Thead';
import Tbody from './Tbody';
import Tr from './Tr';
import Td from './Td';
import Th from './Th';
import { useTheme } from '@/components/hooks/useTheme';
import { TableColumnsType } from '@/components/helpers/TableColumns';
import { Dimensions, useWindowDimensions } from '@/components/hooks/useWindowDimensions';
import Tooltip from '../hover/Tooltip';
import Objector from '@/components/utils/Objector';
import Sorter from '@/components/utils/Sorter';
import Theme from '@/components/utils/Theme';

// --- Types ---

export type defaultSortOrderType = 'asc' | 'desc';

export type ThemeType = ReturnType<Theme['getTheme']>;

export type CustomDecorateRows<T> = {
  rows: T[];
  startIndex: number;
  theme: ThemeType;
  width: number;
  breakPoint: number;
  rowHeight: number;
  displayColumns: string[];
  columns: TableColumnsType;
  handleRowClick?: (row: T) => void;
  rowKey: string;
}

export type CustomDecorateHeaderRow = {
  theme: ThemeType;
  width: number;
  breakPoint: number;
  displayColumns: string[];
  columns: TableColumnsType;
  order: string;
  orderBy: string;
  handleSort: (id: string) => void;
  useAlternateLabel: boolean;
}

interface VirtualTableProps<T> {
  ref?: React.RefObject<HTMLTableElement | null>;
  rows: T[];
  columns: TableColumnsType,
  displayColumns: string[],
  height?: number; // The fixed height of the scrollable area
  rowHeight?: number; // Fixed height of a row in px
  overscan?: number; // Buffer rows above/below viewport
  rowKey: string;
  handleRowClick?: (row: T) => void;
  defaultSortOrder: defaultSortOrderType,
  defaultSortOrderBy: string,
  initialScrollTop?: number,
  defaultEmpty?: string | number,
  sessionStorageKey?: string,
  secondaryKey?: string,
  customHandleSort?: (id: string) => void;
  customSortComparator?: (order: string, orderBy: string, direction?: string) => (a: unknown, b: unknown) => number,
  useAlternateLabel?: boolean;
  decorateRows?: (
    {
      rows,
      startIndex,
      theme,
      width,
      breakPoint,
      rowHeight,
      displayColumns,
      columns,
      handleRowClick,
      rowKey,
    }:
    CustomDecorateRows<T>
  ) => React.JSX.Element[];
  decorateHeaderRow?: (
    {
      displayColumns,
      columns,
      theme,
      width,
      breakPoint,
      order,
      orderBy,
      handleSort,
      useAlternateLabel,
    }:
    CustomDecorateHeaderRow
  ) => React.JSX.Element;
}



const VirtualTable = <T extends object>({
  ref,
  rows,
  columns,
  displayColumns,
  height = 500,
  rowHeight = 26,
  overscan = 50,
  rowKey,
  handleRowClick,
  defaultSortOrder,
  defaultSortOrderBy,
  initialScrollTop = 0,
  defaultEmpty = 0,
  sessionStorageKey,
  secondaryKey,
  customHandleSort,
  customSortComparator,
  useAlternateLabel = false,
  decorateRows: customDecorateRows,
  decorateHeaderRow: customDecorateHeaderRow,
}: VirtualTableProps<T>) => {
  const theme = useTheme();
  const breakPoint = 425;

  const { width } = useWindowDimensions() as Dimensions;

  const sessionOrder = sessionStorageKey ? sessionStorage.getItem(`${sessionStorageKey}.ORDER`) : null;
  const sessionOrderBy = sessionStorageKey ? sessionStorage.getItem(`${sessionStorageKey}.ORDERBY`) : null;

  const [scrollTop, setScrollTop] = useState(initialScrollTop);
  const [order, setOrder] = useState<string>(sessionOrder || defaultSortOrder);
  const [orderBy, setOrderBy] = useState<string>(sessionOrderBy || defaultSortOrderBy);
  // Ref to the <table> element to find the scrollable parent
  const tableRef = ref || useRef<HTMLTableElement | null>(null);


  const sortedRows = useMemo(() => {
    const data = [...rows];
    return customSortComparator
      ? data.sort(customSortComparator(order, orderBy, columns[orderBy]?.sort))
      : data.sort(Sorter.getComparator(order, orderBy, columns[orderBy]?.sort));
  }, [rows, order, orderBy, columns, customSortComparator]);


  useEffect(() => {
    const scrollContainer = tableRef.current?.parentElement;
    if (!scrollContainer) {
      return;
    }

    scrollContainer.style.overflowAnchor = 'none';

    const onScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      window.requestAnimationFrame(() => {
        setScrollTop(target.scrollTop);
      });
    };

    // todo doesnt work
    // This stops the browser from fighting your code when the user clicks "Back"
    // if ('scrollRestoration' in window.history) {
    //   window.history.scrollRestoration = 'manual';
    // }

    scrollContainer.addEventListener('scroll', onScroll, { passive: true });
    // eslint-disable-next-line consistent-return
    return () => {
      scrollContainer.removeEventListener('scroll', onScroll);

      // todo doesnt work
      // Re-enable auto restoration when unmounting
      // if ('scrollRestoration' in window.history) {
      //   window.history.scrollRestoration = 'auto';
      // }
    };
  }, [height, tableRef.current]);

  // this resets the actual dom scrollTop position when remounting this component when i have an initialScrollTop set
  useLayoutEffect(() => {
    const scrollContainer = tableRef.current?.parentElement;
    if (scrollContainer && initialScrollTop > 0) {
      scrollContainer.scrollTop = initialScrollTop;
    }
  }, [initialScrollTop]);


  // Virtualization calculations
  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const endIndex = Math.min(rows.length, Math.floor((scrollTop + height) / rowHeight) + overscan);

  const visibleRows = sortedRows.slice(startIndex, endIndex);
  const paddingTop = startIndex * rowHeight;
  const paddingBottom = (sortedRows.length - endIndex) * rowHeight;


  const handleSort = (id: string) => {
    const isAsc = orderBy === id && order === 'asc';
    if (sessionStorageKey) {
      sessionStorage.setItem(`${sessionStorageKey}.ORDER`, (isAsc ? 'desc' : 'asc'));
      sessionStorage.setItem(`${sessionStorageKey}.ORDERBY`, id);
    }
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(id);

    if (customHandleSort) {
      customHandleSort(id);
    }
  };

  let row_containers: React.JSX.Element[] = [];

  if (customDecorateRows) {
    row_containers = customDecorateRows({
      rows: visibleRows,
      startIndex,
      theme,
      width,
      breakPoint,
      rowHeight,
      displayColumns,
      columns,
      handleRowClick,
      rowKey,
    });
  } else {
    row_containers = visibleRows.map((row, index) => {
      const actualIndex = startIndex + index;
      const isEven = actualIndex % 2 === 0;
      let tdColor = isEven ? theme.grey[800] : theme.grey[900];

      if (theme.mode === 'light') {
        tdColor = isEven ? theme.grey[200] : theme.grey[300];
      }


      const tdStyle: React.CSSProperties = {
        padding: '4px 5px',
        backgroundColor: tdColor,
        border: 0,
        borderTop: 0,
        borderLeft: 0,
        borderBottom: 0,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        height: rowHeight,
        maxHeight: rowHeight,
        minHeight: rowHeight,
      };

      if (width <= breakPoint) {
        tdStyle.fontSize = '12px';
      }

      const tableCells: React.JSX.Element[] = [];

      for (let i = 0; i < displayColumns.length; i++) {
        const headCell = columns[displayColumns[i]];
        if (!headCell) {
          console.warn('missing headcell for: ', displayColumns[i]);
          continue;
        }
        const cellStyle = Objector.extender({}, tdStyle, headCell.style || {});

        let secondarySpan: string | React.JSX.Element = '';

        if (secondaryKey && row[`${displayColumns[i]}_${secondaryKey}`]) {
          secondarySpan = (
            <span style = {{ color: theme.grey[500] }}> {row[`${displayColumns[i]}_${secondaryKey}`]}</span>
          );
        }

        tableCells.push(
          <Td key = {i} style = {cellStyle}>{row[displayColumns[i]] || defaultEmpty}{secondarySpan}</Td>,
        );
      }

      const TableRowCSS = {
        '&:hover td': {
          backgroundColor: (theme.mode === 'light' ? theme.info.light : theme.info.dark),
        },
        '&:hover': {
          cursor: 'pointer',
        },
      };

      return (
        <Tr
          style = {TableRowCSS} // the TR component will convert this to a class
          key={row[rowKey]}
          onClick={() => {
            if (handleRowClick) {
              handleRowClick(row);
            }
          }}
        >
          {tableCells}
        </Tr>
      );
    });
  }

  let header_row: React.JSX.Element;
  if (customDecorateHeaderRow) {
    header_row = customDecorateHeaderRow(
      {
        displayColumns,
        columns,
        theme,
        width,
        breakPoint,
        order,
        orderBy,
        handleSort,
        useAlternateLabel,
      },
    );
  } else {
    header_row = (
      <Tr>
        {displayColumns.map((column, i) => {
          const headCell = columns[column];
          if (!headCell) {
            console.warn('missing headCell: ', column);
            return <></>;
          }
          const tdStyle: React.CSSProperties = {
            padding: '4px 5px',
            border: 0,
            backgroundColor: theme.mode === 'light' ? theme.info.light : theme.info.dark,
            position: 'sticky',
            top: 0,
            whiteSpace: 'nowrap',
          };

          if (width <= breakPoint) {
            tdStyle.fontSize = '13px';
          }

          let label = headCell.getLabel ? headCell.getLabel() : headCell.label;

          if (useAlternateLabel && (headCell.getAltLabel || headCell.alt_label)) {
            label = headCell.getAltLabel ? headCell.getAltLabel() : headCell.alt_label as string;
          }


          return (
            <Tooltip key={headCell.id} position = 'top' text={headCell.getTooltip ? headCell.getTooltip() : headCell.tooltip}>
              <Th
                style = {tdStyle}
                key={headCell.id}
                onClick={() => { handleSort(headCell.id); }}
                sortable = {true}
                sortDirection={orderBy === headCell.id ? order : false}
              >
                {label}
              </Th>
            </Tooltip>
          );
        })}
      </Tr>
    );
  }

  return (
    <Table ref={tableRef} overlayStyle = {{ height }}>
      <Thead>
        {header_row}
      </Thead>
      <Tbody>
        {paddingTop > 0 && (
          <tr style={{ height: paddingTop }}>
            <td colSpan={displayColumns.length} style={{
              padding: 0,
              border: 0,
              borderTop: 0,
              borderLeft: 0,
              borderBottom: 0,
            }} />
          </tr>
        )}
        {row_containers}

        {paddingBottom > 0 && (
          <tr style={{ height: paddingBottom }}>
            <td colSpan={displayColumns.length} style={{
              padding: 0,
              border: 0,
              borderTop: 0,
              borderLeft: 0,
              borderBottom: 0,
            }} />
          </tr>
        )}
      </Tbody>
    </Table>
  );
};

export default VirtualTable;
