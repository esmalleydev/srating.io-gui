import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import useWindowDimensions from '../../components/hooks/useWindowDimensions';

import cacheData from 'memory-cache';

import moment from 'moment';

import { TableVirtuoso } from 'react-virtuoso';

import CircularProgress from '@mui/material/CircularProgress';

import Typography from '@mui/material/Typography';

import Chip from '@mui/material/Chip';
import { styled, useTheme } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import Backdrop from '@mui/material/Backdrop';
import { visuallyHidden } from '@mui/utils';

import OptionPicker from '../../components/generic/OptionPicker';
import SeasonPicker from '../../components/generic/CBB/SeasonPicker';
import ConferencePicker from '../../components/generic/CBB/ConferencePicker';
import ColumnPicker from '../../components/generic/CBB/ColumnPicker';

import HelperCBB from '../../components/helpers/CBB';
import Api from '../../components/Api.jsx';
import BackdropLoader from '../../components/generic/BackdropLoader';
import RankSpan from '../../components/generic/CBB/RankSpan';
import RankSearch from '../../components/generic/RankSearch';
import PositionPicker from '../../components/generic/CBB/PositionPicker.jsx';


const api = new Api();


// TODO Filter out people who play under x minutes?


const StyledTableRow = styled(TableRow)(({ theme }) => ({
  // '&:nth-of-type(odd)': {
  //   backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[300] : theme.palette.grey[900],
  // },
  // '&:nth-of-type(even)': {
  //   backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
  // },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
  '&:hover td': {
    backgroundColor: theme.palette.mode === 'light' ? theme.palette.info.light : theme.palette.info.dark,
  },
  '&:hover': {
    cursor: 'pointer',
  }
}));

const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  'backgroundColor': theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[900],
}));


const Ranking = (props) => {
  const self = this;

  const router = useRouter();
  const theme = useTheme();

  const { height, width } = useWindowDimensions();

  const data = props.data;

  const [loading, setLoading] = useState(false);
  const [spin, setSpin] = useState(false);
  const [firstRender, setFirstRender] = useState(true);
  const [season, setSeason] = useState((router.query && router.query.season) || new HelperCBB().getCurrentSeason());
  const [rankView, setRankView] = useState((router.query && router.query.view) || 'team');
  const [conferences, setConferences] = useState([]);
  const [positions, setPositions] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('composite_rank');
  const [view, setView] = useState('composite');
  const [customColumns, setCustomColumns] = useState(['composite_rank', 'name']);
  const [customColumnsOpen, setCustomColumnsOpen] = useState(false);
  const [filteredRows, setFilteredRows] = useState(false);

  const [tableHorizontalScroll, setTableHorizontalScroll] = useState(0);
  const tableRef = useRef(null);

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
        // tableRef.current.scrollLeft = tableHorizontalScroll;
        tableRef.current.scrollTo({'left': tableHorizontalScroll});
      }, 0);
    }
  }, [tableHorizontalScroll, order, orderBy]);


  useEffect(() => {
    const handleStart = (url) => {;
      setLoading(true);
    };
    const handleComplete = (url) => {
      setLoading(false);
    };

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleComplete)

    setFirstRender(false);
    setConferences(localStorage.getItem('CBB.CONFERENCEPICKER.DEFAULT') ? JSON.parse(localStorage.getItem('CBB.CONFERENCEPICKER.DEFAULT')) : []);
    setPositions(localStorage.getItem('CBB.POSITIONPICKER.DEFAULT') ? JSON.parse(localStorage.getItem('CBB.POSITIONPICKER.DEFAULT')) : []);
    setView(localStorage.getItem('CBB.RANKING.VIEW') ? localStorage.getItem('CBB.RANKING.VIEW') : 'composite');
    setCustomColumns(localStorage.getItem('CBB.RANKING.COLUMNS.' + rankView) ?  JSON.parse(localStorage.getItem('CBB.RANKING.COLUMNS.' + rankView)) : ['composite_rank', 'name']);

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleComplete)
    }
  }, []);

  if (firstRender) {
    return (
      <div>
        <Head>
          <title>sRating | College basketball ranking</title>
          <meta name = 'description' content = 'View statistic ranking for all 362 teams' key = 'desc'/>
          <meta property="og:title" content="srating.io college basketball rankings" />
          <meta property="og:description" content="View statistic ranking for all 362 teams" />
          <meta name="twitter:card" content="summary" />
          <meta name = 'twitter:title' content = 'srating.io college basketball rankings' />
        </Head>
        <div style = {{'display': 'flex', 'justifyContent': 'center'}}>
          <CircularProgress />
        </div>
      </div>
    );
  }

  const rankViewOptions = [
    {'value': 'team', 'label': 'Team rankings'},
    {'value': 'player', 'label': 'Player rankings'},
  ];

  const handleRankView = (newRankView) => {
    localStorage.removeItem('CBB.RANKING.COLUMNS.' + rankView);
    localStorage.removeItem('CBB.POSITIONPICKER.DEFAULT');

    router.query.view = newRankView;
    router.push(router);

    setCustomColumns(['composite_rank', 'name']);
    setPositions([]);
    setOrder('asc');
    setOrderBy('composite_rank');
    setView('composite');
    setRankView(newRankView);
  }

  const handleSeason = (season) => {
    router.query.season = season;
    router.push(router);

    setSeason(season);
  }

  const handleConferences = (conference) => {
    let currentConferences = [...conferences];


    if (conference && conference !== 'all') {
      const conf_index = currentConferences.indexOf(conference);

      if (conf_index > -1) {
        currentConferences.splice(conf_index, 1);
      } else {
        currentConferences.push(conference);
      }
    } else {
      currentConferences = [];
    }

    localStorage.setItem('CBB.CONFERENCEPICKER.DEFAULT', JSON.stringify(currentConferences));
    setConferences(currentConferences);
  }

  let confChips = [];
  for (let i = 0; i < conferences.length; i++) {
    confChips.push(<Chip sx = {{'margin': '5px'}} label={conferences[i]} onDelete={() => {handleConferences(conferences[i])}} />);
  }

  const handlePositions = (position) => {
    let currentPositions = [...positions];

    if (position && position !== 'all') {
      const positionIndex = currentPositions.indexOf(position);

      if (positionIndex > -1) {
        currentPositions.splice(positionIndex, 1);
      } else {
        currentPositions.push(position);
      }
    } else {
      currentPositions = [];
    }

    localStorage.setItem('CBB.POSITIONPICKER.DEFAULT', JSON.stringify(currentPositions));
    setPositions(currentPositions);
  }

  let positionChips = [];
  for (let i = 0; i < positions.length; i++) {
    positionChips.push(<Chip sx = {{'margin': '5px'}} label={positions[i]} onDelete={() => {handlePositions(positions[i])}} />);
  }

  const handleTeam = (team_id) => {
    setSpin(true);
    router.push('/cbb/team/' + team_id+'?season='+season).then(() => {
      setSpin(false);
    });
  }

  const handlePlayer = (player_id) => {
    setSpin(true);
    router.push('/cbb/player/' + player_id+'?season='+season).then(() => {
      setSpin(false);
    });
  }

  const getColumns = () => {
    if (view === 'composite') {
      if (rankView === 'team') {
        return ['composite_rank', 'name', 'wins', 'conf_record', 'elo', 'adjusted_efficiency_rating', 'opponent_efficiency_rating', 'offensive_rating', 'defensive_rating', 'kenpom_rank', 'srs_rank', 'net_rank', 'ap_rank', 'coaches_rank', 'conf'];
      } else if (rankView === 'player') {
        return ['composite_rank', 'name', 'team_name', 'efficiency_rating', 'offensive_rating', 'defensive_rating', 'player_efficiency_rating', 'minutes_per_game', 'points_per_game', 'usage_percentage', 'true_shooting_percentage'];
      }
    } else if (view === 'offense') {
      if (rankView === 'team') {
        return ['composite_rank', 'name', 'offensive_rating', 'points', 'field_goal_percentage', 'two_point_field_goal_percentage', 'three_point_field_goal_percentage', 'free_throw_percentage', 'offensive_rebounds', 'assists'];
      } else if (rankView === 'player') {
        return ['composite_rank', 'name', 'offensive_rating', 'points_per_game', 'field_goal_percentage', 'two_point_field_goal_percentage', 'three_point_field_goal_percentage', 'free_throw_percentage', 'offensive_rebounds_per_game', 'assists_per_game'];
      }
    } else if (view === 'defense') {
      if (rankView === 'team') {
        return ['composite_rank', 'name', 'defensive_rating', 'defensive_rebounds', 'steals', 'blocks', 'opponent_points', 'opponent_field_goal_percentage', 'opponent_two_point_field_goal_percentage', 'opponent_three_point_field_goal_percentage'];
      } else if (rankView === 'player') {
        return ['composite_rank', 'name', 'defensive_rating', 'defensive_rebounds_per_game', 'steals_per_game', 'blocks_per_game', 'defensive_rebound_percentage', 'steal_percentage', 'block_percentage'];
      }
    } else if (view === 'special') {
      if (rankView === 'team') {
        return ['composite_rank', 'name', 'opponent_efficiency_rating', 'possessions', 'pace', 'turnovers', 'fouls'];
      } else if (rankView === 'player') {
        return ['composite_rank', 'name', 'position', 'number', 'height', 'games', 'turnovers_per_game', 'fouls_per_game', 'turnover_percentage'];
      }
    } else if (view === 'custom') {
      return customColumns;
    }

    return [];
  };


  const headCells = {
    'composite_rank': {
      id: 'composite_rank',
      numeric: true,
      label: 'Rk',
      tooltip: 'Composite rank',
      'sticky': true,
      'disabled': true,
      'sort': 'lower',
    },
    'name': {
      id: 'name',
      numeric: false,
      label: (rankView === 'player' ? 'Player' : 'Team'),
      tooltip: (rankView === 'player' ? 'Player name' : 'Team name'),
      'sticky': true,
      'disabled': true,
    },
    'conf': {
      id: 'conf',
      numeric: false,
      label: 'Conf.',
      tooltip: 'Conference',
    },
    'field_goal': {
      id: 'field_goal',
      numeric: true,
      label: 'FG',
      tooltip: 'Average field goals per game',
      'sort': 'higher',
    },
    'field_goal_attempts': {
      id: 'field_goal_attempts',
      numeric: true,
      label: 'FGA',
      tooltip: 'Average field goal attempts per game',
      'sort': 'higher',
    },
    'field_goal_percentage': {
      id: 'field_goal_percentage',
      numeric: true,
      label: 'FG%',
      tooltip: 'Average field goal percentage per game',
      'sort': 'higher',
    },
    'two_point_field_goal': {
      id: 'two_point_field_goal',
      numeric: true,
      label: '2FG',
      tooltip: 'Average two point field goals per game',
      'sort': 'higher',
    },
    'two_point_field_goal_attempts': {
      id: 'two_point_field_goal_attempts',
      numeric: true,
      label: '2FGA',
      tooltip: 'Average two point field goal attempts per game',
      'sort': 'higher',
    },
    'two_point_field_goal_percentage': {
      id: 'two_point_field_goal_percentage',
      numeric: true,
      label: '2FG%',
      tooltip: 'Average two point field goal percentage per game',
      'sort': 'higher',
    },
    'three_point_field_goal': {
      id: 'three_point_field_goal',
      numeric: true,
      label: '3FG',
      tooltip: 'Average three point field goals per game',
      'sort': 'higher',
    },
    'three_point_field_goal_attempts': {
      id: 'three_point_field_goal_attempts',
      numeric: true,
      label: '3FGA',
      tooltip: 'Average three field goal attempts per game',
      'sort': 'higher',
    },
    'three_point_field_goal_percentage': {
      id: 'three_point_field_goal_percentage',
      numeric: true,
      label: '3FG%',
      tooltip: 'Average three field goal percentage per game',
      'sort': 'higher',
    },
    'free_throws': {
      id: 'free_throws',
      numeric: true,
      label: 'FT',
      tooltip: 'Average free throws per game',
      'sort': 'higher',
    },
    'free_throw_attempts': {
      id: 'free_throw_attempts',
      numeric: true,
      label: 'FTA',
      tooltip: 'Average free throw attempts per game',
      'sort': 'higher',
    },
    'free_throw_percentage': {
      id: 'free_throw_percentage',
      numeric: true,
      label: 'FT%',
      tooltip: 'Average free throw percentage per game',
      'sort': 'higher',
    },
    'offensive_rebounds': {
      id: 'offensive_rebounds',
      numeric: true,
      label: 'ORB',
      tooltip: 'Average offensive rebounds per game',
      'sort': 'higher',
    },
    'defensive_rebounds': {
      id: 'defensive_rebounds',
      numeric: true,
      label: 'DRB',
      tooltip: 'Average defensive rebounds per game',
      'sort': 'higher',
    },
    'total_rebounds': {
      id: 'total_rebounds',
      numeric: true,
      label: 'TRB',
      tooltip: 'Average total rebounds per game',
      'sort': 'higher',
    },
    'assists': {
      id: 'assists',
      numeric: true,
      label: 'AST',
      tooltip: 'Average assists per game',
      'sort': 'higher',
    },
    'steals': {
      id: 'steals',
      numeric: true,
      label: 'STL',
      tooltip: 'Average steals per game',
      'sort': 'higher',
    },
    'blocks': {
      id: 'blocks',
      numeric: true,
      label: 'BLK',
      tooltip: 'Average blocks per game',
      'sort': 'higher',
    },
    'turnovers': {
      id: 'turnovers',
      numeric: true,
      label: 'TOV',
      tooltip: 'Average turnovers per game',
      'sort': 'lower',
    },
    'fouls': {
      id: 'fouls',
      numeric: true,
      label: 'PF',
      tooltip: 'Average fouls per game',
      'sort': 'lower',
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
    'efficiency_rating': {
      id: 'efficiency_rating',
      numeric: true,
      label: (rankView === 'team' ? 'EM' : 'ERT'),
      tooltip: (rankView === 'team' ? 'Efficiency margin (Offensive rating - Defensive rating)' : 'Efficiency rating'),
      'sort': 'higher',
    },
  };

  if (rankView === 'team') {
    Object.assign(headCells, {
      'ap_rank': {
        id: 'ap_rank',
        numeric: true,
        label: 'AP',
        tooltip: 'Associated Press rank',
        'sort': 'lower',
      },
      'wins': {
        id: 'wins',
        numeric: false,
        label: 'W/L',
        tooltip: 'Win/Loss',
        'sort': 'higher',
      },
      'conf_record': {
        id: 'conf_record',
        numeric: false,
        label: 'C W/L',
        tooltip: 'Conference Win/Loss',
        'sort': 'higher',
      },
      'kenpom_rank': {
        id: 'kenpom_rank',
        numeric: true,
        label: 'KP',
        tooltip: 'kenpom.com rank',
        'sort': 'lower',
      },
      'srs_rank': {
        id: 'srs_rank',
        numeric: true,
        label: 'SRS',
        tooltip: 'Simple rating system rank',
        'sort': 'lower',
      },
      'net_rank': {
        id: 'net_rank',
        numeric: true,
        label: 'NET',
        tooltip: 'NET rank',
        'sort': 'lower',
      },
      'elo': {
        id: 'elo',
        numeric: true,
        label: 'sRating',
        tooltip: 'srating.io ELO rating',
        'sort': 'higher',
      },
      'coaches_rank': {
        id: 'coaches_rank',
        numeric: true,
        label: 'Coaches',
        tooltip: 'Coaches poll rank',
        'sort': 'lower',
      },
      'possessions': {
        id: 'possessions',
        numeric: true,
        label: 'Poss.',
        tooltip: 'Average possessions per game',
        'sort': 'higher',
      },
      'pace': {
        id: 'pace',
        numeric: true,
        label: 'Pace',
        tooltip: 'Average pace per game',
        'sort': 'higher',
      },
      'adjusted_efficiency_rating': {
        id: 'adjusted_efficiency_rating',
        numeric: true,
        label: 'aEM',
        tooltip: 'Adjusted Efficiency margin (Offensive rating - Defensive rating) + SOS',
        'sort': 'higher',
      },
      'opponent_offensive_rating': {
        id: 'opponent_offensive_rating',
        numeric: true,
        label: 'oORT',
        tooltip: 'Opponent average Offensive rating',
        'sort': 'higher',
      },
      'opponent_defensive_rating': {
        id: 'opponent_defensive_rating',
        numeric: true,
        label: 'oDRT',
        tooltip: 'Opponent average Defensive rating ',
        'sort': 'lower',
      },
      'opponent_efficiency_rating': {
        id: 'opponent_efficiency_rating',
        numeric: true,
        label: 'SOS',
        tooltip: 'Strength of schedule (Opponent Efficiency margin (oORT - oDRT))',
        'sort': 'higher',
      },
      'opponent_field_goal': {
        id: 'opponent_field_goal',
        numeric: true,
        label: 'Opp. FG',
        tooltip: 'Opponent average field goals per game',
        'sort': 'lower',
      },
      'opponent_field_goal_attempts': {
        id: 'opponent_field_goal_attempts',
        numeric: true,
        label: 'Opp. FGA',
        tooltip: 'Opponent average field goal attempts per game',
        'sort': 'lower',
      },
      'opponent_field_goal_percentage': {
        id: 'opponent_field_goal_percentage',
        numeric: true,
        label: 'Opp. FG%',
        tooltip: 'Opponent average field goal percentage per game',
        'sort': 'lower',
      },
      'opponent_two_point_field_goal': {
        id: 'opponent_two_point_field_goal',
        numeric: true,
        label: 'Opp. 2FG',
        tooltip: 'Opponent average two point field goals per game',
        'sort': 'lower',
      },
      'opponent_two_point_field_goal_attempts': {
        id: 'opponent_two_point_field_goal_attempts',
        numeric: true,
        label: 'Opp. 2FGA',
        tooltip: 'Opponent average two point field goal attempts per game',
        'sort': 'lower',
      },
      'opponent_two_point_field_goal_percentage': {
        id: 'opponent_two_point_field_goal_percentage',
        numeric: true,
        label: 'Opp. 2FG%',
        tooltip: 'Opponent average two point field goal percentage per game',
        'sort': 'lower',
      },
      'opponent_three_point_field_goal': {
        id: 'opponent_three_point_field_goal',
        numeric: true,
        label: 'Opp. 3FG',
        tooltip: 'Opponent average three point field goals per game',
        'sort': 'lower',
      },
      'opponent_three_point_field_goal_attempts': {
        id: 'opponent_three_point_field_goal_attempts',
        numeric: true,
        label: 'Opp. 3FGA',
        tooltip: 'Opponent average three point field goal attempts per game',
        'sort': 'lower',
      },
      'opponent_three_point_field_goal_percentage': {
        id: 'opponent_three_point_field_goal_percentage',
        numeric: true,
        label: 'Opp. 3FG%',
        tooltip: 'Opponent average three point field goal percentage per game',
        'sort': 'lower',
      },
      'opponent_free_throws': {
        id: 'opponent_free_throws',
        numeric: true,
        label: 'Opp. FT',
        tooltip: 'Opponent average free throws per game',
        'sort': 'lower',
      },
      'opponent_free_throw_attempts': {
        id: 'opponent_free_throw_attempts',
        numeric: true,
        label: 'Opp. FTA',
        tooltip: 'Opponent average free throw attempts per game',
        'sort': 'lower',
      },
      'opponent_free_throw_percentage': {
        id: 'opponent_free_throw_percentage',
        numeric: true,
        label: 'Opp. FT%',
        tooltip: 'Opponent average free throw percentage per game',
        'sort': 'lower',
      },
      'opponent_offensive_rebounds': {
        id: 'opponent_offensive_rebounds',
        numeric: true,
        label: 'Opp. ORB',
        tooltip: 'Opponent average offensive rebounds per game',
        'sort': 'lower',
      },
      'opponent_defensive_rebounds': {
        id: 'opponent_defensive_rebounds',
        numeric: true,
        label: 'Opp. DRB',
        tooltip: 'Opponent average defensive rebounds per game',
        'sort': 'lower',
      },
      'opponent_total_rebounds': {
        id: 'opponent_total_rebounds',
        numeric: true,
        label: 'Opp. TRB',
        tooltip: 'Opponent average total rebounds per game',
        'sort': 'lower',
      },
      'opponent_assists': {
        id: 'opponent_assists',
        numeric: true,
        label: 'Opp. AST',
        tooltip: 'Opponent average assists per game',
        'sort': 'lower',
      },
      'opponent_steals': {
        id: 'opponent_steals',
        numeric: true,
        label: 'Opp. STL',
        tooltip: 'Opponent average steals per game',
        'sort': 'lower',
      },
      'opponent_blocks': {
        id: 'opponent_blocks',
        numeric: true,
        label: 'Opp. BLK',
        tooltip: 'Opponent average blocks per game',
        'sort': 'lower',
      },
      'opponent_turnovers': {
        id: 'opponent_turnovers',
        numeric: true,
        label: 'Opp. TOV',
        tooltip: 'Opponent average turnovers per game',
        'sort': 'higher',
      },
      'opponent_fouls': {
        id: 'opponent_fouls',
        numeric: true,
        label: 'Opp. PF',
        tooltip: 'Opponent average fouls per game',
        'sort': 'higher',
      },
      'opponent_points': {
        id: 'opponent_points',
        numeric: true,
        label: 'Opp. PTS',
        tooltip: 'Opponent average points per game',
        'sort': 'lower',
      },
      'opponent_possessions': {
        id: 'opponent_possessions',
        numeric: true,
        label: 'Opp. Poss.',
        tooltip: 'Opponent average possessions per game',
        'sort': 'lower',
      },
    });
  } else if (rankView === 'player') {
    Object.assign(headCells, {
      'team_name': {
        id: 'team_name',
        numeric: false,
        label: 'Team',
        tooltip: 'Team name',
      },
      'games': {
        id: 'games',
        numeric: false,
        label: 'G',
        tooltip: 'Games played',
      },
      'position': {
        id: 'position',
        numeric: false,
        label: 'Position',
        tooltip: 'Player position',
      },
      'number': {
        id: 'number',
        numeric: false,
        label: 'Number',
        tooltip: 'Jersey number',
      },
      'height': {
        id: 'height',
        numeric: false,
        label: 'Height',
        tooltip: 'Play height',
      },
      'minutes_played': {
        id: 'minutes_played',
        numeric: true,
        label: 'MP',
        tooltip: 'Minutes played',
        'sort': 'higher',
      },
      'minutes_per_game': {
        id: 'minutes_per_game',
        numeric: true,
        label: 'MPG',
        tooltip: 'Minutes played per game',
        'sort': 'higher',
      },
      'points_per_game': {
        id: 'points_per_game',
        numeric: true,
        label: 'PPG',
        tooltip: 'Points per game',
        'sort': 'higher',
      },
      'offensive_rebounds_per_game': {
        id: 'offensive_rebounds_per_game',
        numeric: true,
        label: 'ORB-G',
        tooltip: 'Offensive rebounds per game',
        'sort': 'higher',
      },
      'defensive_rebounds_per_game': {
        id: 'defensive_rebounds_per_game',
        numeric: true,
        label: 'DRB-G',
        tooltip: 'Defensive rebounds per game',
        'sort': 'higher',
      },
      'total_rebounds_per_game': {
        id: 'total_rebounds_per_game',
        numeric: true,
        label: 'TRB-G',
        tooltip: 'Total rebounds per game',
        'sort': 'higher',
      },
      'assists_per_game': {
        id: 'assists_per_game',
        numeric: true,
        label: 'AST-G',
        tooltip: 'Assists per game',
        'sort': 'higher',
      },
      'steals_per_game': {
        id: 'steals_per_game',
        numeric: true,
        label: 'STL-G',
        tooltip: 'Steals per game',
        'sort': 'higher',
      },
      'blocks_per_game': {
        id: 'blocks_per_game',
        numeric: true,
        label: 'BLK-G',
        tooltip: 'Blocks per game',
        'sort': 'higher',
      },
      'turnovers_per_game': {
        id: 'turnovers_per_game',
        numeric: true,
        label: 'TO-G',
        tooltip: 'Blocks per game',
        'sort': 'higher',
      },
      'fouls_per_game': {
        id: 'fouls_per_game',
        numeric: true,
        label: 'PF-G',
        tooltip: 'Fouls per game',
        'sort': 'higher',
      },
      'player_efficiency_rating': {
        id: 'player_efficiency_rating',
        numeric: true,
        label: 'PER',
        tooltip: 'Player efficiency rating.',
        'sort': 'higher',
      },
      'true_shooting_percentage': {
        id: 'true_shooting_percentage',
        numeric: true,
        label: 'TS%',
        tooltip: 'True shooting percentage, takes into account all field goals and free throws.',
        'sort': 'higher',
      },
      'effective_field_goal_percentage': {
        id: 'effective_field_goal_percentage',
        numeric: true,
        label: 'eFG%',
        tooltip: 'Effective field goal percentage, adjusted field goal % since 3 points greater than 2.',
        'sort': 'higher',
      },
      'offensive_rebound_percentage': {
        id: 'offensive_rebound_percentage',
        numeric: true,
        label: 'ORB%',
        tooltip: 'Offensive rebound percentage, estimate of % of offensive rebounds player had while on floor.',
        'sort': 'higher',
      },
      'defensive_rebound_percentage': {
        id: 'defensive_rebound_percentage',
        numeric: true,
        label: 'DRB%',
        tooltip: 'Defensive rebound percentage, estimate of % of defensive rebounds player had while on floor.',
        'sort': 'higher',
      },
      'total_rebound_percentage': {
        id: 'total_rebound_percentage',
        numeric: true,
        label: 'TRB%',
        tooltip: 'Total rebound percentage, estimate of % of total rebounds player had while on floor.',
        'sort': 'higher',
      },
      'assist_percentage': {
        id: 'assist_percentage',
        numeric: true,
        label: 'AST%',
        tooltip: 'Assist percentage, estimate of % of assists player had while on floor.',
        'sort': 'higher',
      },
      'steal_percentage': {
        id: 'steal_percentage',
        numeric: true,
        label: 'STL%',
        tooltip: 'Steal percentage, estimate of % of steals player had while on floor.',
        'sort': 'higher',
      },
      'block_percentage': {
        id: 'block_percentage',
        numeric: true,
        label: 'BLK%',
        tooltip: 'Block percentage, estimate of % of blocks player had while on floor.',
        'sort': 'higher',
      },
      'turnover_percentage': {
        id: 'turnover_percentage',
        numeric: true,
        label: 'TOV%',
        tooltip: 'Turnover percentage, estimate of % of turnovers player had while on floor.',
        'sort': 'higher',
      },
      'usage_percentage': {
        id: 'usage_percentage',
        numeric: true,
        label: 'USG%',
        tooltip: 'Usage percentage, estimate of % of plays ran through player while on floor.',
        'sort': 'higher',
      },
    });
  }

  let rows = [];

  let lastUpdated = null;

  const row_length_before_filter = Object.keys(data).length;

  for (let id in data) {
    let row = data[id];

    if (
      conferences.length &&
      conferences.indexOf(row.conference) === -1
    ) {
      continue;
    }

    if (rankView === 'team') {
      if (
        row.last_ranking &&
        (
          !lastUpdated ||
          lastUpdated < row.last_ranking.date_of_rank
        )
      ) {
        lastUpdated = row.last_ranking.date_of_rank;
      }

      const wins = (row.cbb_statistic_ranking && row.cbb_statistic_ranking.wins) || 0;
      const losses = (row.cbb_statistic_ranking && row.cbb_statistic_ranking.losses) || 0;
      const confwins = (row.cbb_statistic_ranking && row.cbb_statistic_ranking.confwins) || 0;
      const conflosses = (row.cbb_statistic_ranking && row.cbb_statistic_ranking.conflosses) || 0;

      rows.push({
        'team_id': row.team_id,
        'composite_rank': (row.last_ranking && row.last_ranking.composite_rank) || null,
        'ap_rank': (row.last_ranking && row.last_ranking.ap_rank) || null,
        'name': row.alt_name,
        'wins': wins + '-' + losses,
        'conf_record': confwins + '-' + conflosses,
        'conf': row.conference,
        'elo_rank': (row.last_ranking && row.last_ranking.elo_rank) || null,
        'elo': row.elo,
        'kenpom_rank': (row.last_ranking && row.last_ranking.kenpom_rank) || null,
        'srs_rank': (row.last_ranking && row.last_ranking.srs_rank) || null,
        'net_rank': (row.last_ranking && row.last_ranking.net_rank) || null,
        'coaches_rank': (row.last_ranking && row.last_ranking.coaches_rank) || null,
        // 'sos': row.cbb_statistic_ranking && row.cbb_statistic_ranking.sos,
        // 'sos_rank': row.cbb_statistic_ranking && row.cbb_statistic_ranking.sos_rank,
        'field_goal': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.field_goal) || null,
        'field_goal_attempts': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.field_goal_attempts) || null,
        'field_goal_percentage': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.field_goal_percentage) || null,
        'two_point_field_goal': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.two_point_field_goal) || null,
        'two_point_field_goal_attempts': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.two_point_field_goal_attempts) || null,
        'two_point_field_goal_percentage': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.two_point_field_goal_percentage) || null,
        'three_point_field_goal': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.three_point_field_goal) || null,
        'three_point_field_goal_attempts': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.three_point_field_goal_attempts) || null,
        'three_point_field_goal_percentage': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.three_point_field_goal_percentage) || null,
        'free_throws': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.free_throws) || null,
        'free_throw_attempts': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.free_throw_attempts) || null,
        'free_throw_percentage': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.free_throw_percentage) || null,
        'offensive_rebounds': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.offensive_rebounds) || null,
        'defensive_rebounds': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.defensive_rebounds) || null,
        'total_rebounds': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.total_rebounds) || null,
        'assists': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.assists) || null,
        'steals': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.steals) || null,
        'blocks': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.blocks) || null,
        'turnovers': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.turnovers) || null,
        'fouls': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.fouls) || null,
        'points': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.points) || null,
        'possessions': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.possessions) || null,
        'pace': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.pace) || null,
        'offensive_rating': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.offensive_rating) || null,
        'defensive_rating': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.defensive_rating) || null,
        'efficiency_rating': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.efficiency_rating) || null,
        'adjusted_efficiency_rating': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.adjusted_efficiency_rating) || null,
        'opponent_field_goal': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_field_goal) || null,
        'opponent_field_goal_attempts': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_field_goal_attempts) || null,
        'opponent_field_goal_percentage': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_field_goal_percentage) || null,
        'opponent_two_point_field_goal': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_two_point_field_goal) || null,
        'opponent_two_point_field_goal_attempts': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_two_point_field_goal_attempts) || null,
        'opponent_two_point_field_goal_percentage': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_two_point_field_goal_percentage) || null,
        'opponent_three_point_field_goal': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_three_point_field_goal) || null,
        'opponent_three_point_field_goal_attempts': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_three_point_field_goal_attempts) || null,
        'opponent_three_point_field_goal_percentage': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_three_point_field_goal_percentage) || null,
        'opponent_free_throws': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_free_throws) || null,
        'opponent_free_throw_attempts': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_free_throw_attempts) || null,
        'opponent_free_throw_percentage': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_free_throw_percentage) || null,
        'opponent_offensive_rebounds': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_offensive_rebounds) || null,
        'opponent_defensive_rebounds': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_defensive_rebounds) || null,
        'opponent_total_rebounds': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_total_rebounds) || null,
        'opponent_assists': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_assists) || null,
        'opponent_steals': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_steals) || null,
        'opponent_blocks': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_blocks) || null,
        'opponent_turnovers': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_turnovers) || null,
        'opponent_fouls': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_fouls) || null,
        'opponent_points': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_points) || null,
        'opponent_possessions': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_possessions) || null,
        'opponent_offensive_rating': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_offensive_rating) || null,
        'opponent_defensive_rating': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_defensive_rating) || null,
        'opponent_efficiency_rating': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_efficiency_rating) || null,
        'field_goal_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.field_goal_rank) || null,
        'field_goal_attempts_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.field_goal_attempts_rank) || null,
        'field_goal_percentage_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.field_goal_percentage_rank) || null,
        'two_point_field_goal_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.two_point_field_goal_rank) || null,
        'two_point_field_goal_attempts_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.two_point_field_goal_attempts_rank) || null,
        'two_point_field_goal_percentage_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.two_point_field_goal_percentage_rank) || null,
        'three_point_field_goal_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.three_point_field_goal_rank) || null,
        'three_point_field_goal_attempts_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.three_point_field_goal_attempts_rank) || null,
        'three_point_field_goal_percentage_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.three_point_field_goal_percentage_rank) || null,
        'free_throws_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.free_throws_rank) || null,
        'free_throw_attempts_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.free_throw_attempts_rank) || null,
        'free_throw_percentage_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.free_throw_percentage_rank) || null,
        'offensive_rebounds_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.offensive_rebounds_rank) || null,
        'defensive_rebounds_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.defensive_rebounds_rank) || null,
        'total_rebounds_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.total_rebounds_rank) || null,
        'assists_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.assists_rank) || null,
        'steals_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.steals_rank) || null,
        'blocks_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.blocks_rank) || null,
        'turnovers_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.turnovers_rank) || null,
        'fouls_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.fouls_rank) || null,
        'points_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.points_rank) || null,
        'possessions_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.possessions_rank) || null,
        'pace_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.pace_rank) || null,
        'offensive_rating_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.offensive_rating_rank) || null,
        'defensive_rating_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.defensive_rating_rank) || null,
        'efficiency_rating_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.efficiency_rating_rank) || null,
        'adjusted_efficiency_rating_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.adjusted_efficiency_rating_rank) || null,
        'opponent_field_goal_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_field_goal_rank) || null,
        'opponent_field_goal_attempts_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_field_goal_attempts_rank) || null,
        'opponent_field_goal_percentage_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_field_goal_percentage_rank) || null,
        'opponent_two_point_field_goal_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_two_point_field_goal_rank) || null,
        'opponent_two_point_field_goal_attempts_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_two_point_field_goal_attempts_rank) || null,
        'opponent_two_point_field_goal_percentage_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_two_point_field_goal_percentage_rank) || null,
        'opponent_three_point_field_goal_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_three_point_field_goal_rank) || null,
        'opponent_three_point_field_goal_attempts_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_three_point_field_goal_attempts_rank) || null,
        'opponent_three_point_field_goal_percentage_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_three_point_field_goal_percentage_rank) || null,
        'opponent_free_throws_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_free_throws_rank) || null,
        'opponent_free_throw_attempts_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_free_throw_attempts_rank) || null,
        'opponent_free_throw_percentage_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_free_throw_percentage_rank) || null,
        'opponent_offensive_rebounds_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_offensive_rebounds_rank) || null,
        'opponent_defensive_rebounds_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_defensive_rebounds_rank) || null,
        'opponent_total_rebounds_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_total_rebounds_rank) || null,
        'opponent_assists_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_assists_rank) || null,
        'opponent_steals_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_steals_rank) || null,
        'opponent_blocks_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_blocks_rank) || null,
        'opponent_turnovers_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_turnovers_rank) || null,
        'opponent_fouls_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_fouls_rank) || null,
        'opponent_points_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_points_rank) || null,
        'opponent_possessions_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_possessions_rank) || null,
        'opponent_offensive_rating_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_offensive_rating_rank) || null,
        'opponent_defensive_rating_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_defensive_rating_rank) || null,
        'opponent_efficiency_rating_rank': (row.cbb_statistic_ranking && row.cbb_statistic_ranking.opponent_efficiency_rating_rank) || null,
      });
    } else if (rankView === 'player') {
      if (
        !lastUpdated ||
        lastUpdated < row.date_of_rank
      ) {
        lastUpdated = row.date_of_rank;
      }
        
      row.name = row.player ? (row.player.first_name + ' ' + row.player.last_name) : null;
      row.number = row.player ? row.player.number : null;
      row.position = row.player ? row.player.position : null;
      row.height = row.player ? row.player.height : null;
      row.conf = row.conference;
      row.composite_rank = row.efficiency_rating_rank;

      if (
        positions.length &&
        positions.indexOf(row.position) === -1
      ) {
        continue;
      }

      rows.push(row);
    }
  }

  const allRows = rows;

  if (filteredRows) {
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

 
  rows = rows.sort(getComparator(order, orderBy)).slice();

  const handlCustomColumnsSave = (columns) => {
    setCustomColumnsOpen(false);
    localStorage.setItem('CBB.RANKING.COLUMNS.' + rankView, JSON.stringify(columns));
    setCustomColumns(columns);
    handleRankingView('custom');
  };

  const handlCustomColumnsExit = () => {
    setCustomColumnsOpen(false);
  };


  const TableComponents = {
    Scroller: React.forwardRef((props, ref) => {
      return (
        <TableContainer component={Paper} {...props} ref={ref} />
      );
    }),
    Table: (props) => <Table {...props} style={{ borderCollapse: 'separate' }} />,
    TableHead: TableHead,
    TableRow: React.forwardRef((props, ref) => {
      return (
        <StyledTableRow {...props} ref={ref} onClick={() => {
          if (props.item.player_id) {
            handlePlayer(props.item.player_id);
          } else {
            handleTeam(props.item.team_id);
          }
        }} />
      );
    }),
    TableBody: React.forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
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

  const getTableHeader = () => {
    return (
      <TableRow>
        {getColumns().map((column) => {
          const headCell = headCells[column];
          const tdStyle = {
            'padding': '4px 5px',
          };

          if (headCell.sticky) {
            tdStyle.position = 'sticky';
            tdStyle.left = (headCell.id === 'name' ? 50 : 0);
            tdStyle.zIndex = 3;
          } else {
            tdStyle.whiteSpace = 'nowrap';
          }

          return (
            <Tooltip key={headCell.id} disableFocusListener placement = 'top' title={headCell.tooltip}>
              <StyledTableHeadCell
                sx = {tdStyle}
                key={headCell.id}
                align={'left'}
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
            </Tooltip>
          );
        })}
      </TableRow>
    );
  }


  const getTableContents = (index, row) => {
    let columns = getColumns();

    const tdStyle = {
      'padding': '4px 5px',
      'backgroundColor': theme.palette.mode === 'light' ? (index % 2 === 0 ? theme.palette.grey[200] : theme.palette.grey[300]) : (index % 2 === 0 ? theme.palette.grey[800] : theme.palette.grey[900]),
    };

    if (width <= 425) {
      tdStyle.fontSize = '12px';
    }

    let teamCellStyle = {};
    teamCellStyle.position = 'sticky';
    teamCellStyle.left = 50;
    teamCellStyle.minWidth = 125;
    teamCellStyle.maxWidth = 125;

    const tableCells = [];

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
        tableCells.push(<TableCell key = {i} sx = {Object.assign({}, tdStyle, {'textAlign': 'center', 'position': 'sticky', 'left': 0, 'maxWidth': 50})}>{row[columns[i]]}</TableCell>);
      } else {
        tableCells.push(<TableCell key = {i} sx = {tdStyle}>{row[columns[i]] !== null ? row[columns[i]] : '-'}{row[columns[i] + '_rank'] && row[columns[i]] !== null ? <RankSpan rank = {row[columns[i] + '_rank']} useOrdinal = {(rankView === 'team')} max = {row_length_before_filter} />  : ''}</TableCell>);
      }
    } 

    return (
      <React.Fragment>
        {tableCells}
      </React.Fragment>
    );
  }


  const tableStyle = {
    'maxHeight': height - 280 - (width < 470 ? 60 : 0) - (confChips.length ? 60 : 0) - 40,
    'height': height - 280 - (width < 470 ? 60 : 0) - (confChips.length ? 60 : 0) - 40,
  };

  if ((rows.length + 2) * 29 < tableStyle.height) {
    tableStyle.height = (rows.length + 2) * 29;
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
      <Head>
        <title>sRating | College basketball ranking</title>
        <meta name = 'description' content = 'View statistic ranking for all 362 teams' key = 'desc'/>
        <meta property="og:title" content="srating.io college basketball rankings" />
        <meta property="og:description" content="View statistic ranking for all 362 teams" />
        <meta name="twitter:card" content="summary" />
        <meta name = 'twitter:title' content = 'srating.io college basketball rankings' />
      </Head>
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
              <Chip sx = {{'margin': '5px'}} label='Composite' variant={view !== 'composite' ? 'outlined' : ''} color={view !== 'composite' ? 'primary' : 'success'} onClick={() => handleRankingView('composite')} />
              <Chip sx = {{'margin': '5px'}} label='Offense' variant={view !== 'offense' ? 'outlined' : ''} color={view !== 'offense' ? 'primary' : 'success'} onClick={() => handleRankingView('offense')} />
              <Chip sx = {{'margin': '5px'}} label='Defense' variant={view !== 'defense' ? 'outlined' : ''} color={view !== 'defense' ? 'primary' : 'success'} onClick={() => handleRankingView('defense')} />
              <Chip sx = {{'margin': '5px'}} label='Special' variant={view !== 'special' ? 'outlined' : ''} color={view !== 'special' ? 'primary' : 'success'} onClick={() => handleRankingView('special')} />
              <Chip sx = {{'margin': '5px'}} label='Custom' variant={view !== 'custom' ? 'outlined' : ''} color={view !== 'custom' ? 'primary' : 'success'} onClick={() => {setCustomColumnsOpen(true)}} />
              <ColumnPicker key = {rankView} options = {headCells} open = {customColumnsOpen} selected = {customColumns} saveHandler = {handlCustomColumnsSave} closeHandler = {handlCustomColumnsExit} />
            </div>
            <div style = {{'display': 'flex', 'justifyContent': 'space-between', 'alignItems': 'center', 'marginTop': '10px'}}>
              <div style={{'display': 'flex'}}>
                <ConferencePicker selected = {conferences} actionHandler = {handleConferences} />
                {rankView === 'player' ? <PositionPicker selected = {positions} actionHandler = {handlePositions} /> : ''}
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
}


export async function getServerSideProps(context) {
  const seconds = 60 * 60 * 5; // cache for 5 hours
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage='+seconds+', stale-while-revalidate=59'
  );

  const CBB = new HelperCBB();

  const season =  (context.query && context.query.season) || CBB.getCurrentSeason();

  const view =  (context.query && context.query.view) || 'team';

  let data = {};

  const cachedLocation = 'CBB.RANKING.LOAD.'+season+ '.' + view;

  const cached = cacheData.get(cachedLocation);

  if (!cached) {
    const fxn = (view === 'player') ? 'getPlayerRanking': 'getTeamRanking';
    await api.Request({
      'class': 'cbb_ranking',
      'function': fxn,
      'arguments': {
        'season': season
      }
    }).then((response) => {
      data = response;
      cacheData.put(cachedLocation, data, 1000 * seconds);
    }).catch((e) => {

    });
  } else {
    data = cached;
  }

  return {
    'props': {
      'data': data,
      'generated': new Date().getTime(),
    },
  }
}



export default Ranking;
