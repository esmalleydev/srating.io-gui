'use client';

import React, { useState, useTransition } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { styled, alpha } from '@mui/material/styles';
import { InputBase, Autocomplete } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import useDebounce from '@/components/hooks/useDebounce';
import { useClientAPI } from '@/components/clientAPI';
import { Team } from '@/types/general';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setDataKey } from '@/redux/features/compare-slice';
import Text from '@/components/utils/Text';

const Container = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.15) : alpha(theme.palette.common.black, 0.10),
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.25) : alpha(theme.palette.common.black, 0.20),
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
  },
}));

const Search = () => {
  const router = useRouter();
  const pathName = usePathname();
  const [isPending, startTransition] = useTransition();

  const [value, setValue] = useState('');
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();
  const organization_id = useAppSelector((state) => state.organizationReducer.organization_id);
  const division_id = useAppSelector((state) => state.organizationReducer.division_id);
  const home_team_id = useAppSelector((state) => state.compareReducer.home_team_id); // || searchParams?.get('home_team_id') || null;
  const away_team_id = useAppSelector((state) => state.compareReducer.away_team_id); // || searchParams?.get('away_team_id') || null;
  const next_search = useAppSelector((state) => state.compareReducer.next_search);

  const [blur, setBlur] = useState<boolean>(false);


  const debouncedRequest = useDebounce(() => {
    useClientAPI({
      class: 'search',
      function: 'search',
      arguments: {
        organization_id,
        division_id,
        name: value,
        team: 1,
        player: 0,
      },
    }).then((response) => {
      setTeams((response && response.teams) || []);
      setLoading(false);
    }).catch((e) => {
      setTeams([]);
      setLoading(false);
    });
  }, 200);


  const onChange = (event, value, reason) => {
    if (reason === 'clear') {
      setValue('');
      setTeams([]);
      setLoading(false);
    } else {
      setValue(value || '');
      setLoading(true);
      debouncedRequest();
    }
  };

  const options = teams.map((team) => {
    return {
      group: 'Teams',
      team_id: team.team_id,
      name: team.alt_name,
    };
  }).sort((a, b) => {
    return Text.levenshtein(value, a.name) - Text.levenshtein(value, b.name);
  });

  const handleClick = (event, option) => {
    if (!option || (!option.player_id && !option.team_id)) {
      return;
    }

    const new_team_id = (option && option.team_id);

    if (new_team_id) {
      let key = next_search;

      if (!away_team_id) {
        key = 'away';
      } else if (!home_team_id) {
        key = 'home';
      }

      if (!key) {
        key = 'away';
      }

      if (key === 'away') {
        dispatch(setDataKey({ key: 'away_team_id', value: new_team_id }));
        dispatch(setDataKey({ key: 'next_search', value: 'home' }));
      } else if (key === 'home') {
        dispatch(setDataKey({ key: 'home_team_id', value: new_team_id }));
        dispatch(setDataKey({ key: 'next_search', value: 'away' }));
      }

      startTransition(() => {
        const current = new URLSearchParams(window.location.search);
        const search = current.toString();
        const query = search ? `?${search}` : '';
        router.replace(`${pathName}${query}`);
      });

      setBlur(true);
      setValue('');
      setTeams([]);
    }
  };

  const inputBaseStyle: React.CSSProperties = {
    minWidth: '250px',
  };
  // sx={{backgroundColor: 'rgba(66, 165, 245, .5)'}}
  return (
    <Container>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <Autocomplete
        id = 'search-team-compare'
        freeSolo
        filterOptions={(x) => x}
        onChange = {handleClick}
        onInputChange={onChange}
        loading = {loading}
        value = {null}
        options = {options}
        autoHighlight = {true}
        getOptionLabel = {(option) => { return option.name || 'Unknown'; }}
        fullWidth = {true}
        blurOnSelect = {blur}
        renderInput={(params) => {
          const { InputLabelProps, InputProps, ...rest } = params;
          rest.inputProps.value = value;
          return (
            <StyledInputBase
              {...params.InputProps}
              {...rest}
              value = {value}
              placeholder = {'Add a team'}
              autoFocus = {true}
              sx = {inputBaseStyle}
              // onChange = {onChange}
            />
          );
        }}
      />
    </Container>
  );
};

export default Search;

