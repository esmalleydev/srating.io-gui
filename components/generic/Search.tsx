'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import useDebounce from '@/components/hooks/useDebounce';

import { styled, alpha } from '@mui/material/styles';

import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import Autocomplete from '@mui/material/Autocomplete';

import { useClientAPI } from '../clientAPI';
import { Coach, Player, Team } from '@/types/general';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setLoading as setLoadingDisplay } from '@/redux/features/display-slice';
import Text from '../utils/Text';
import Organization from '../helpers/Organization';
import Alert from './Alert';
import Division from '../helpers/Division';

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



const Search = (
  { onRouter, focus }:
  { onRouter?: () => void; focus: boolean },
) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const organization_id = useAppSelector((state) => state.organizationReducer.organization_id);
  const organizations = useAppSelector((state) => state.dictionaryReducer.organization);
  const path = Organization.getPath({ organizations, organization_id });

  const division_id = Organization.getCBBID() === organization_id ? Division.getD1() : Division.getFBS();

  type searchPlayer = Player & {
    begin: string;
    end: string;
  };

  type searchCoach = Coach & {
    begin: string;
    end: string;
  };

  const [value, setValue] = useState('');
  // const [autoCompleteValue, setAutoCompleteValue] = useState(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<searchPlayer[]>([]);
  const [coaches, setCoaches] = useState<searchCoach[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);


  const debouncedRequest = useDebounce(() => {
    useClientAPI({
      class: 'search',
      function: 'search',
      arguments: {
        organization_id,
        division_id,
        name: value,
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


  const onChange = (event, value, reason) => {
    if (reason === 'clear') {
      setValue('');
      setTeams([]);
      setPlayers([]);
      setCoaches([]);
      setLoading(false);
    } else {
      setValue(value || '');
      setLoading(true);
      debouncedRequest();
    }
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

  if (value.length) {
    teamOptions.sort((a, b) => {
      return Text.levenshtein(value, a.name) - Text.levenshtein(value, b.name);
    });
  }

  const playerOptions: OptionsType[] = players.map((player) => {
    return {
      group: 'Players',
      player_id: player.player_id,
      name: `${player.first_name} ${player.last_name} (${player.begin}-${player.end})`,
    };
  });

  if (value.length) {
    playerOptions.sort((a, b) => {
      return Text.levenshtein(value, a.name) - Text.levenshtein(value, b.name);
    });
  }

  const coachOptions: OptionsType[] = coaches.map((coach) => {
    return {
      group: 'Coaches',
      coach_id: coach.coach_id,
      name: `${coach.first_name} ${coach.last_name} (${coach.begin}-${coach.end})`,
    };
  });

  if (value.length) {
    coachOptions.sort((a, b) => {
      return Text.levenshtein(value, a.name) - Text.levenshtein(value, b.name);
    });
  }

  const options: OptionsType[] = [
    ...teamOptions,
    ...playerOptions,
    ...coachOptions,
  ];

  const handleClick = (event, option) => {
    if (!option || (!option.player_id && !option.team_id && !option.coach_id)) {
      return;
    }
    if (option && option.coach_id) {
      dispatch(setLoadingDisplay(true));
      startTransition(() => {
        router.push(`/${path}/coach/${option.coach_id}`);
        if (onRouter) {
          onRouter();
        }
      });
    } else if (option && option.player_id) {
      if (Organization.getCFBID() === organization_id) {
        setShowAlert(true);
        setValue('');
        setTeams([]);
        setPlayers([]);
        setCoaches([]);
        return;
      }
      dispatch(setLoadingDisplay(true));
      startTransition(() => {
        router.push(`/${path}/player/${option.player_id}`);
        if (onRouter) {
          onRouter();
        }
      });
    } else if (option && option.team_id) {
      dispatch(setLoadingDisplay(true));
      startTransition(() => {
        router.push(`/${path}/team/${option.team_id}`);
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
      <Alert open = {showAlert} title = 'Coming soon' message = 'Player page still under development, come back soon!' confirm = {() => setShowAlert(false)} />
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <Autocomplete
        id="search-team-player-coach"
        freeSolo
        // clearIcon = {<IconButton onClick={handleClear}><ClearIcon fontSize='small' /></IconButton>}
        onInputChange={onChange}
        filterOptions={(x) => x}
        onChange = {handleClick}
        loading = {loading}
        value = {null}
        options = {options}
        autoHighlight = {true}
        groupBy = {(option) => option.group}
        getOptionLabel = {(option) => { return option.name || 'Unknown'; }}
        fullWidth = {true}
        renderInput={(params) => {
          const { InputLabelProps, InputProps, ...rest } = params;
          rest.inputProps.value = value;
          return (
            <StyledInputBase
              {...params.InputProps}
              {...rest}
              value = {value}
              placeholder = {'Search'}
              autoFocus = {focus}
              sx = {{ minWidth: '200px' }}
              // onChange = {onChange}
            />
          );
        }}
      />
    </Container>
  );
};

export default Search;

