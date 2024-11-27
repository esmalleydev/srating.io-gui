'use client';

import React, { useState, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import {
  Box, SortDirection, Table, TableBody, TableContainer, TableHead, TableRow, TableCell, Paper, TableSortLabel, Tooltip,
  Skeleton,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { visuallyHidden } from '@mui/utils';

import HelperTeam from '@/components/helpers/Team';
import RankSpan from '@/components/generic/RankSpan';
import { Dimensions, useWindowDimensions } from '@/components/hooks/useWindowDimensions';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setLoading } from '@/redux/features/display-slice';
import Organization from '@/components/helpers/Organization';
import CBB from '@/components/helpers/CBB';
import CFB from '@/components/helpers/CFB';
import ButtonSwitch from '../../ButtonSwitch';
import Locked from '../../Billing/Locked';
import { StatisticRanking as CBBStatisticRanking } from '@/types/cbb';
import { StatisticRanking as CFBStatisticRanking } from '@/types/cfb';


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

const Client = ({ organization_id, division_id, conference_id, season, subView }) => {
  const theme = useTheme();
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const { width } = useWindowDimensions() as Dimensions;
  const breakPoint = 425;

  const leftSwitch = 'Live';
  const rightSwitch = 'Predicted';

  let s = leftSwitch;
  if (subView === 'predicted') {
    s = rightSwitch;
  }

  const [view, setView] = useState<string>(s);
  const [order, setOrder] = useState<string>('asc');
  const dispatch = useAppDispatch();
  const teams = useAppSelector((state) => state.conferenceReducer.teams);
  // const team_season_conferences = useAppSelector((state) => state.conferenceReducer.team_season_conferences);
  const og_statistic_rankings = useAppSelector((state) => state.conferenceReducer.statistic_rankings);
  const elos = useAppSelector((state) => state.conferenceReducer.elos);
  const predictionsLoading = useAppSelector((state) => state.conferenceReducer.predictionsLoading);
  const predictions = useAppSelector((state) => state.conferenceReducer.predictions);
  const organizations = useAppSelector((state) => state.dictionaryReducer.organization);
  const path = Organization.getPath({ organizations, organization_id });
  let numberOfTeams = CBB.getNumberOfD1Teams(season);

  if (organization_id === Organization.getCFBID()) {
    numberOfTeams = CFB.getNumberOfTeams({ division_id, season });
  }

  const team_id_x_statistic_ranking_id = {};

  let statistic_rankings = { ...og_statistic_rankings };

  if (subView === 'predicted') {
    statistic_rankings = { ...statistic_rankings, ...predictions };
  }

  const hasConfGame = () => {
    for (const statistic_ranking_id in og_statistic_rankings) {
      const row = og_statistic_rankings[statistic_ranking_id];
      if (row.confwins || row.conflosses) {
        return true;
      }
    }
    return false;
  };

  const getDefaultSort = (newView: string | null = null) => {
    if (hasConfGame() || newView === 'Predicted' || (newView === null && subView === 'predicted')) {
      return 'conf_record';
    }

    return 'rank';
  };
  const [orderBy, setOrderBy] = useState<string>(getDefaultSort());


  for (const statistic_ranking_id in statistic_rankings) {
    const row = statistic_rankings[statistic_ranking_id];
    team_id_x_statistic_ranking_id[row.team_id] = statistic_ranking_id;
  }

  const team_id_x_elo_id = {};
  for (const elo_id in elos) {
    const row = elos[elo_id];
    team_id_x_elo_id[row.team_id] = elo_id;
  }

  interface AdditionalFields {
    record: string;
    conf_record: string;
    elo?: number;
    hasAccess: boolean;
  }

  type StatsRows = CBBStatisticRanking & CFBStatisticRanking & AdditionalFields;

  const rows: StatsRows[] = [];

  for (const team_id in teams) {
    const team = teams[team_id];

    const row = { ...statistic_rankings[team_id_x_statistic_ranking_id[team.team_id]] } as StatsRows;

    row.record = `${row.wins}-${row.losses}`;
    row.conf_record = `${row.confwins}-${row.conflosses}`;

    if (team.team_id in team_id_x_elo_id) {
      row.elo = elos[team_id_x_elo_id[team.team_id]].elo;
    }

    rows.push(row);
  }

  const getColumns = () => {
    if (Organization.getCFBID() === organization_id) {
      return ['rank', 'team', 'record', 'conf_record', 'elo', 'passing_rating_college', 'yards_per_play', 'points'];
    }
    return ['rank', 'team', 'record', 'conf_record', 'elo', 'adjusted_efficiency_rating', 'offensive_rating', 'defensive_rating'];
  };

  const columns = getColumns();

  const handleClick = (team_id, season) => {
    dispatch(setLoading(true));
    startTransition(() => {
      router.push(`/${path}/team/${team_id}?season=${season}`);
    });
  };

  const handleView = (value: string) => {
    if (value !== view) {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      current.set('subview', value.toLowerCase());
      const search = current.toString();
      const query = search ? `?${search}` : '';
      router.replace(`${pathName}${query}`);
    }
    setView(value);
    setOrderBy(getDefaultSort(value));
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
        elo: {
          id: 'elo',
          numeric: true,
          label: 'SR',
          tooltip: 'srating.io elo rank',
          sort: 'higher',
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
          sort: 'higher',
          sticky: false,
        },
        conf_record: {
          id: 'conf_record',
          numeric: false,
          label: 'CR',
          tooltip: 'Conference record',
          sort: 'higher',
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
        sort: 'higher',
        sticky: false,
      },
      conf_record: {
        id: 'conf_record',
        numeric: false,
        label: 'CR',
        tooltip: 'Conference record',
        sort: 'higher',
        sticky: false,
      },
      elo: {
        id: 'elo',
        numeric: true,
        label: 'SR',
        tooltip: 'srating.io elo rank',
        sort: 'higher',
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
    sessionStorage.setItem(`${path}.CONFERENCE.STANDINGS.${view}.ORDER`, (isAsc ? 'desc' : 'asc'));
    sessionStorage.setItem(`${path}.CONFERENCE.STANDINGS.${view}.ORDERBY`, id);
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(id);
  };

  let rankCellMaxWidth = 50;
  if (width <= breakPoint) {
    rankCellMaxWidth = 35;
  }

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
    if (orderBy === 'record' || orderBy === 'conf_record') {
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

  const getTable = () => {
    let b = 0;

    const row_containers = rows.sort(getComparator(order, orderBy)).slice().map((row) => {
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

      let recordContainer: React.JSX.Element = <></>;
      let confRecordContainer: React.JSX.Element = <></>;

      let filledContainers = false;
      if (view === 'Predicted') {
        if (predictionsLoading) {
          filledContainers = true;
          recordContainer = <Skeleton width={40} key = {1} />;
          confRecordContainer = <Skeleton width={40} key = {2} />;
        } else if (!row.hasAccess) {
          filledContainers = true;
          recordContainer = <Locked iconPadding={0} iconFontSize={'20px'} key = {1} />;
          confRecordContainer = <Locked iconPadding={0} iconFontSize={'20px'} key = {2} />;
        }
      }

      if (!filledContainers) {
        recordContainer = <>{row.record}</>;
        confRecordContainer = <>{row.conf_record}</>;
      }

      for (let i = 0; i < columns.length; i++) {
        if (columns[i] === 'rank') {
          tableCells.push(<TableCell key = {i} sx = {({ ...tdStyle, ...rankCellStyle })}>{row[columns[i]]}</TableCell>);
        } else if (columns[i] === 'team') {
          const teamHelper = new HelperTeam({ team: teams[row.team_id] });
          tableCells.push(<TableCell key = {i} sx = {tdStyle}>{teamHelper.getName()}</TableCell>);
        } else if (columns[i] === 'record') {
          tableCells.push(<TableCell key = {'record-table-cell'} sx = {tdStyle}>{recordContainer}</TableCell>);
        } else if (columns[i] === 'conf_record') {
          tableCells.push(<TableCell key = {'conf_record-table-cell'} sx = {tdStyle}>{confRecordContainer}</TableCell>);
        } else if (view === 'Predicted') {
          tableCells.push(<TableCell key = {i} sx = {tdStyle}>-</TableCell>);
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
      <ButtonSwitch leftTitle={leftSwitch} rightTitle={rightSwitch} selected={view} handleClick={handleView} fontSize='0.7rem' style = {{ paddingBottom: '10px' }} />
      {getTable()}
    </div>
  );
};

export default Client;
