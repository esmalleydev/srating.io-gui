import React, { useState } from 'react';
import { styled, alpha } from '@mui/material/styles';

import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { useAppDispatch } from '@/redux/hooks';
import { setDataKey } from '@/redux/features/ranking-slice';
import { getRows } from './DataHandler';

const Container = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.15) : alpha(theme.palette.common.black, 0.10),
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.25) : alpha(theme.palette.common.black, 0.20),
  },
  marginLeft: 0,
  width: '150px',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  // padding: theme.spacing(0, 2),
  paddingLeft: '10px',
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
    // padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    // paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    paddingLeft: '40px',
    transition: theme.transitions.create('width'),
    width: '100%',
  },
}));


const Search = ({ view }: {view: string}) => {
  const dispatch = useAppDispatch();
  const rows = getRows({ view });

  const handleSearch = (filteredRows) => {
    dispatch(setDataKey({ key: 'filteredRows', value: filteredRows }));
  };

  const [value, setValue] = useState<string>('');

  const onChange = (e) => {
    const { value } = e.target;
    setValue(value || '');

    if (value.length) {
      const regex = new RegExp(value, 'i');
      let filteredRows = rows.filter((row) => regex.test(row.name));

      if (view === 'transfer') {
        filteredRows = filteredRows.concat(rows.filter((row) => regex.test((
          'committed_team_name' in row && row.committed_team_name !== undefined ? row.committed_team_name : ''
        ))));
        filteredRows = filteredRows.concat(rows.filter((row) => regex.test((
          'team_name' in row && row.team_name !== undefined ? row.team_name : ''
        ))));
      }
      handleSearch(filteredRows);
    } else {
      handleSearch(false);
    }
  };

  return (
    <Container style = {{ marginBottom: '5px' }}>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        value = {value}
        placeholder = {'Search'}
        sx = {{ minWidth: '150px', maxWidth: '150px', maxHeight: '39px' }}
        onChange = {onChange}
      />
    </Container>
  );
};

export default Search;

