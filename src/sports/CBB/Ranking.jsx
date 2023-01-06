import React, { useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import useWindowDimensions from '../../hooks/useWindowDimensions';

import moment from 'moment';

import CheckIcon from '@mui/icons-material/Check';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import CircularProgress from '@mui/material/CircularProgress';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import Typography from '@mui/material/Typography';

import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Chip from '@mui/material/Chip';
import { styled, alpha, useTheme } from '@mui/material/styles';

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
import { visuallyHidden } from '@mui/utils';

import Api from './../../Api.jsx';
const api = new Api();



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

const Transition = React.forwardRef(
  function Transition(
    props: TransitionProps & {
      children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
  }
);


const Ranking = (props) => {
  const self = this;
  let params = useParams();

  const navigate = useNavigate();
  const theme = useTheme();

  const { height, width } = useWindowDimensions();

  const defaultConferences = localStorage.getItem('default_cbb_conferences') ? JSON.parse(localStorage.getItem('default_cbb_conferences')) : [];

  const [season, setSeason] = useState(2023);
  const [request, setRequest] = useState();

  const [confOpen, setConfOpen] = useState(false);
  const [conferences, setConferences] = useState(defaultConferences);

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('composite_rank');

  let loading = (!request || !request.requested);

  if (loading) {
    api.Request({
      'class': 'team',
      'function': 'getCBBTeams',
      'arguments': {
        'season': season,
      }
    }).then(teams => {
      setRequest({
        'teams': teams,
        'requested': true,
      });
    }).catch((err) => {
      setRequest({'requested': true});
    });
  }

  if (loading) {
    return (<div style = {{'display': 'flex', 'justifyContent': 'center'}}><CircularProgress /></div>);
  }

  const conferenceOptions = [
    {'value': 'all', 'label': 'All'},
    {'value': 'ACC', 'label': 'ACC'},
    {'value': 'Big 12', 'label': 'Big 12'},
    {'value': 'SEC', 'label': 'SEC'},
    {'value': 'Big Ten', 'label': 'Big Ten'},
    {'value': 'Pac-12', 'label': 'Pac-12'},
    {'value': 'Big East', 'label': 'Big East'},
    {'value': 'Atlantic 10', 'label': 'Atlantic 10'},
    {'value': 'Sun Belt', 'label': 'Sun Belt'},
    {'value': 'Patriot', 'label': 'Patriot'},
    {'value': 'Mountain West', 'label': 'Mountain West'},
    {'value': 'MAC', 'label': 'MAC'},
    {'value': 'MVC', 'label': 'MVC'},
    {'value': 'WCC', 'label': 'WCC'},
    {'value': 'Big West', 'label': 'Big West'},
    {'value': 'C-USA', 'label': 'C-USA'},
    {'value': 'Ivy League', 'label': 'Ivy League'},
    {'value': 'Summit League', 'label': 'Summit League'},
    {'value': 'Horizon', 'label': 'Horizon'},
    {'value': 'MAAC', 'label': 'MAAC'},
    {'value': 'OVC', 'label': 'OVC'},
    {'value': 'SoCon', 'label': 'SoCon'},
    {'value': 'SWAC', 'label': 'SWAC'},
    {'value': 'Big Sky', 'label': 'Big Sky'},
    {'value': 'Southland', 'label': 'Southland'},
    {'value': 'ASUN', 'label': 'ASUN'},
    {'value': 'America East', 'label': 'America East'},
    {'value': 'WAC', 'label': 'WAC'},
    {'value': 'AAC', 'label': 'AAC'},
    {'value': 'CAA', 'label': 'CAA'},
    {'value': 'Big South', 'label': 'Big South'},
    {'value': 'NEC', 'label': 'NEC'},
    {'value': 'MEAC', 'label': 'MEAC'},
    {'value': 'DI Independent', 'label': 'DI Independent'},
  ];


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

    localStorage.setItem('default_cbb_conferences', JSON.stringify(currentConferences));
    setConferences(currentConferences);
  }

  const handleConfOpen = () => {
    setConfOpen(true);
  };

  const handleConfClose = () => {
    setConfOpen(false);
  };


  let confChips = [];
  for (let i = 0; i < conferences.length; i++) {
    confChips.push(<Chip sx = {{'margin': '5px'}} label={conferences[i]} onDelete={() => {handleConferences(conferences[i])}} />);
  }

  function handleTeam(team_id) {
    navigate('/CBB/Team/' + team_id);
  }

  // function handleConference(e) {
  //   let value = e.target.value;
  //   setConference(value);
  // };


  const headCells = [
    {
      id: 'name',
      numeric: false,
      label: 'Team',
      tooltip: 'Team',
    },
    {
      id: 'composite_rank',
      numeric: true,
      label: 'Rank',
      tooltip: 'Composite rank',
    },
    {
      id: 'ap_rank',
      numeric: true,
      label: 'AP',
      tooltip: 'Associated Press rank',
    },
    {
      id: 'wins',
      numeric: false,
      label: 'W/L',
      tooltip: 'Win/Loss',
    },
    {
      id: 'conf_record',
      numeric: false,
      label: 'Conf W/L',
      tooltip: 'Conference Win/Loss',
    },
    {
      id: 'elo_rank',
      numeric: true,
      label: 'ELO',
      tooltip: '>sportranking.io ELO rank',
    },
    {
      id: 'kenpom_rank',
      numeric: true,
      label: 'KP',
      tooltip: 'kenpom.com rank',
    },
    {
      id: 'srs_rank',
      numeric: true,
      label: 'SRS',
      tooltip: 'Simple rating system rank',
    },
    {
      id: 'net_rank',
      numeric: true,
      label: 'NET',
      tooltip: 'NET rank',
    },
    {
      id: 'elo',
      numeric: true,
      label: 'Rating',
      tooltip: '>sportranking.io ELO rating',
    },
    {
      id: 'coaches_rank',
      numeric: true,
      label: 'Coaches',
      tooltip: 'Coaches poll rank',
    },
    {
      id: 'conf',
      numeric: false,
      label: 'Conf.',
      tooltip: 'Conference',
    },
  ];

  const teams = request.teams;

  let rows = [];

  let lastUpdated = null;

  for (let team_id in teams) {
    let team = teams[team_id];
    if (!team.stats) {
    // if (!team.last_ranking || !team.stats) {
      // console.log('missing ranking or stats');
      // console.log(team);
      continue;
    }

    if (
      conferences.length &&
      conferences.indexOf(team.cbb_conference) === -1
    ) {
      continue;
    }

    if (
      team.last_ranking &&
      (
        !lastUpdated ||
        lastUpdated < team.last_ranking.date_of_rank
      )
    ) {
      lastUpdated = team.last_ranking.date_of_rank;
    }

    rows.push({
      'team_id': team.team_id,
      'composite_rank': team.last_ranking && team.last_ranking.composite_rank,
      'ap_rank': team.last_ranking && team.last_ranking.ap_rank,
      'name': team.kenpom,
      'wins': team.stats.wins + '-' + team.stats.losses,
      'conf_record': team.stats.confwins + '-' + team.stats.conflosses,
      'conf': team.cbb_conference,
      'elo_rank': team.last_ranking && team.last_ranking.elo_rank,
      'elo': team.elo,
      'kenpom_rank': team.last_ranking && team.last_ranking.kenpom_rank,
      // 'kenpom_rank': team.stats.kenpom_rank,
      'srs_rank': team.last_ranking && team.last_ranking.srs_rank,
      'net_rank': team.last_ranking && team.last_ranking.net_rank,
      'coaches_rank': team.last_ranking && team.last_ranking.coaches_rank,
    });
  }

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

    let a_value = a[orderBy];
    let b_value = b[orderBy];
    if (orderBy === 'wins' || orderBy === 'conf_record') {
      a_value = +a[orderBy].split('-')[0];
      b_value = +b[orderBy].split('-')[0];
    }

    if (b_value < a_value) {
      return -1;
    }
    if (b_value > a_value) {
      return 1;
    }
    return 0;
  }

  const getComparator = (order, orderBy) => {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  let row_index = 0;

  const row_containers = rows.sort(getComparator(order, orderBy)).slice().map((row) => {

    let teamCellStyle = {
      'cursor': 'pointer',
    };

    if (width < 900) {
      teamCellStyle.position = 'sticky';
      teamCellStyle.left = 0;
      teamCellStyle.backgroundColor = (theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[900]);
    }

    return (
      <StyledTableRow
        key={row.name}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        <TableCell sx = {teamCellStyle} onClick={() => {handleTeam(row.team_id)}}>
          {row.name}
        </TableCell>
        <TableCell>{row.composite_rank}</TableCell>
        <TableCell>{row.ap_rank}</TableCell>
        <TableCell>{row.wins}</TableCell>
        <TableCell>{row.conf_record}</TableCell>
        <TableCell>{row.elo_rank}</TableCell>
        <TableCell>{row.kenpom_rank}</TableCell>
        <TableCell>{row.srs_rank}</TableCell>
        <TableCell>{row.net_rank}</TableCell>
        <TableCell>{row.elo}</TableCell>
        <TableCell>{row.coaches_rank}</TableCell>
        <TableCell>{row.conf}</TableCell>
      </StyledTableRow>
    );
  });

  return (
    <div style = {{'padding': '20px'}}>
      <Typography variant = 'h5'>NCAAM college basketball rankings.</Typography>
      {lastUpdated ? <Typography color="text.secondary" variant = 'body1' style = {{'fontStyle': 'italic'}}>Last updated: {moment(lastUpdated.split('T')[0]).format('MMMM Do YYYY')}</Typography> : ''}
      <div style = {{'display': 'flex', 'justifyContent': 'center', 'alignItems': 'center', 'marginTop': '10px'}}>
        <Button
          id="conf-picker-button"
          aria-controls={confOpen ? 'conf-picker-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={confOpen ? 'true' : undefined}
          variant="text"
          disableElevation
          onClick={handleConfOpen}
          endIcon={<KeyboardArrowDownIcon />}
        >
          Conferences
        </Button>
        <Dialog
          fullScreen
          open={confOpen}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleConfClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleConfClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Conferences
            </Typography>
          </Toolbar>
        </AppBar>
          <List>
            {conferenceOptions.map((confOption) => (
              <ListItem key={confOption.value} button onClick={() => {
                handleConferences(confOption.value);
                handleConfClose();
              }}>
                <ListItemIcon>
                  {conferences.indexOf(confOption.value) > -1 ? <CheckIcon /> : ''}
                </ListItemIcon>
                <ListItemText primary={confOption.label} />
              </ListItem>
            ))}
          </List>
        </Dialog>
      </div>
      {confChips}
      <TableContainer component={Paper} sx = {{'maxHeight': height - 250}}>
        <Table size = 'small' stickyHeader>
          <TableHead>
            <TableRow>
              {headCells.map((headCell) => (
                <Tooltip key={headCell.id} disableFocusListener placement = 'top' title={headCell.tooltip}>
                  <StyledTableHeadCell
                    sx = {headCell.id == 'name' ? {'position': 'sticky', 'left': 0, 'z-index': 3} : {'whiteSpace': 'nowrap'}}
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
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {row_containers}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}


export default Ranking;
