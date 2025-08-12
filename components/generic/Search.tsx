'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import useDebounce from '@/components/hooks/useDebounce';


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
import Color from '../utils/Color';
import Style from '../utils/Style';



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
  const conferences = useAppSelector((state) => state.dictionaryReducer.conference);
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

  // todo include conferences in search, but needs to be filtered in js first
  // const conferenceOptions: OptionsType[] = Object.values(conferences).map((conference) => {
  //   return {
  //     group: 'Conference',
  //     coach_id: conference.conference_id,
  //     name: conference.name,
  //   };
  // });

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

  const containerStyle = {
    position: 'relative',
    borderRadius: '4px',
    backgroundColor: Color.alphaColor('#fff', 0.15),
    '&:hover': {
      backgroundColor: Color.alphaColor('#fff', 0.25),
    },
    marginLeft: 0,
    width: '100%',
    '@media (min-width:600px)': {
      marginLeft: 8,
      width: 'auto',
    },
  };

  const iconContainerStyle = {
    padding: '0px 16px',
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };


  const inputStyle = {
    minWidth: '200px',
    backgroundColor: 'transparent',
    background: 'none',
    color: '#fff',
    font: 'inherit',
    letterSpacing: 'inherit',
    border: 0,
    boxSizing: 'content-box',
    margin: 0,
    padding: '8px 8px 8px 0px',
    '&::placeholder': {
      opacity: 0.7,
      color: '#fff',
    },
    '&:focus-visible': {
      outline: 'none',
    },
    // vertical padding + font size from searchIcon
    paddingLeft: 'calc(1em + 32px)',
    transition: 'width 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    width: '100%',
    '@media (min-width:600px)': {
      width: '200px',
      '&:focus': {
        width: '250px',
      },
    },
  };


  return (
    <div className={Style.getStyleClassName(containerStyle)}>
      <Alert open = {showAlert} title = 'Coming soon' message = 'Player page still under development, come back soon!' confirm = {() => setShowAlert(false)} />
      <div className={Style.getStyleClassName(iconContainerStyle)}>
        <SearchIcon />
      </div>
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
          return (
            <div ref={params.InputProps.ref}>
              <input
                {...params.inputProps}
                className={Style.getStyleClassName(inputStyle)}
                placeholder = 'Search'
                autoFocus = {focus}
                value = {value}
              />
            </div>
          );
        }}
      />
    </div>
  );
};

export default Search;

