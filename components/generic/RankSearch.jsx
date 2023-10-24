import React, { useState } from 'react';
import { styled, alpha, useTheme } from '@mui/material/styles';

import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';

const Container = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '200px',
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


const RankSearch = (props) => {
  const rows = props.rows;
  const [value, setValue] = useState('');

  const onChange = (e) => {
    const value = e.target.value;
    setValue(value || '');

    if (value.length) {
      const regex = new RegExp(value, 'i');
      const filteredRows = rows.filter(row => regex.test(row.name));
      props.callback(filteredRows);
    } else {
      props.callback(false);
    }
  };

  return (
    <Container>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase 
        value = {value}
        placeholder = {'Search ranks'}
        sx = {{'minWidth': '200px', 'maxWidth': '200px'}}
        onChange = {onChange} 
      />
    </Container>
  );
}

export default RankSearch;

