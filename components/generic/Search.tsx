'use client';
import React, { useState, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import useDebounce from '../hooks/useDebounce';

import { styled, alpha, useTheme } from '@mui/material/styles';

import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import Autocomplete from '@mui/material/Autocomplete';

import BackdropLoader from '@/components/generic/BackdropLoader';
import { useClientAPI } from '../clientAPI';
import { Coach, Player, Team } from '@/types/cbb';

const Container = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '200px',
      '&:focus': {
        width: '250px',
      },
    },
  },
}));



const Search = ({ onRouter, focus }) => {
  const theme = useTheme();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  type searchPlayer = Player & {
    begin: string;
    end: string;
  };

  type searchCoach = Coach & {
    begin: string;
    end: string;
  };

  const [value, setValue] = useState('');
  const [autoCompleteValue, setAutoCompleteValue] = useState(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<searchPlayer[]>([]);
  const [coaches, setCoaches] = useState<searchCoach[]>([]);
  const [loading, setLoading] = useState(false);
  const [spin, setSpin] = useState(false);


  const debouncedRequest = useDebounce(() => {
    useClientAPI({
      'class': 'cbb',
      'function': 'search',
      'arguments': {
        'name': value,
      },
    }).then((response) => {
      setTeams((response && response.teams) || []);
      setPlayers((response && response.players) || []);
      setCoaches((response && response.coaches) || []);
      setLoading(false);
    }).catch((e) => {
      setTeams([]);
      setPlayers([]);
      setCoaches([]);
      setLoading(false);
    });
  }, 200);


  const onChange = (e) => {
    const value = e.target.value;
    setValue(value || '');

    setLoading(true);
    debouncedRequest();
  };

  type OptionsType = {
    group: string;
    name: string;
    team_id?: string;
    player_id?: string;
    coach_id?: string;
  };

  const teamOptions: OptionsType[] = teams.map((team) => {
    return {
      group: 'Teams',
      team_id: team.team_id,
      name: team.alt_name,
    };
  });
  
  const playerOptions: OptionsType[] = players.map((player) => {
    return {
      group: 'Players',
      player_id: player.player_id,
      name: player.first_name + ' ' + player.last_name + ' (' + player.begin + '-' + player.end + ')',
    };
  });
  
  const coachOptions: OptionsType[] = coaches.map((coach) => {
    return {
      group: 'Coaches',
      coach_id: coach.coach_id,
      name: coach.first_name + ' ' + coach.last_name + ' (' + coach.begin + '-' + coach.end + ')',
    };
  });
  
  const options: OptionsType[] = [
    ...teamOptions,
    ...playerOptions,
    ...coachOptions,
  ];

  const handleClick = (event, option) => {
    if (!option || (!option.player_id && !option.team_id && !option.coach_id)) {
      return;
    }
    setSpin(true);
    if (option && option.coach_id) {
      startTransition(() => {
        router.push('/cbb/coach/' + option.coach_id);
        setSpin(false);
        if (onRouter) {
          onRouter();
        }
      });
    } else if (option && option.player_id) {
      startTransition(() => {
        router.push('/cbb/player/' + option.player_id);
        setSpin(false);
        if (onRouter) {
          onRouter();
        }
      });
    } else if (option && option.team_id) {
      startTransition(() => {
        router.push('/cbb/team/' + option.team_id);
        setSpin(false);
        if (onRouter) {
          onRouter();
        }
      });
    }
    setValue('');
    setTeams([]);
    setPlayers([]);
    setCoaches([]);
  };


  return (
    <Container>
      <BackdropLoader open = {spin} />
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <Autocomplete
        id="search-team-player-coach"
        freeSolo
        filterOptions={(x) => x}
        onChange = {handleClick}
        loading = {loading}
        value = {null}
        options = {options}
        autoHighlight = {true}
        groupBy = {(option) => option.group}
        getOptionLabel = {(option) =>  {return option.name || 'Unknown';}}
        fullWidth = {true}
        renderInput={(params) => {
          const {InputLabelProps,InputProps,...rest} = params;
          rest.inputProps.value = value;
          return (
            <StyledInputBase 
              {...params.InputProps}
              {...rest}
              value = {value}
              placeholder = {'Search'}
              autoFocus = {focus}
              sx = {{'minWidth': '200px'}}
              onChange = {onChange} 
            />
          );
        }}
      />
    </Container>
  );
}

export default Search;

