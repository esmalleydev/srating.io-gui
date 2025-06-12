'use client';

import React, { useEffect, useState } from 'react';

import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { useAppDispatch } from '@/redux/hooks';
import { setDataKey } from '@/redux/features/ranking-slice';
import { getRows } from './DataHandler';
import { Dimensions, useWindowDimensions } from '@/components/hooks/useWindowDimensions';
import Style from '@/components/utils/Style';
import { useTheme } from '@/components/hooks/useTheme';
import Color from '@/components/utils/Color';


const Search = ({ view }: {view: string}) => {
  // console.time('Search')
  // console.time('Search.logic')
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const rows = getRows({ view });
  const { width } = useWindowDimensions() as Dimensions;

  const handleSearch = (filteredRows) => {
    dispatch(setDataKey({ key: 'filteredRows', value: filteredRows }));
  };

  useEffect(() => {
    return () => {
      handleSearch(false);
    };
  }, []);

  // useEffect(() => {
  //   console.timeEnd('Seach')
  // })
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
      if (view === 'player') {
        filteredRows = filteredRows.concat(rows.filter((row) => regex.test((
          'team_name' in row && row.team_name !== undefined ? row.team_name : ''
        ))));
      }
      handleSearch(filteredRows);
    } else {
      handleSearch(false);
    }
  };

  const inputWidth = width > 425 ? '150px' : '125px';

  const containerStyle = {
    marginBottom: '5px',
    width: inputWidth,
    position: 'relative',
    borderRadius: '4px',
    backgroundColor: theme.mode === 'dark' ? Color.alphaColor('#fff', 0.15) : Color.alphaColor('#000', 0.10),
    '&:hover': {
      backgroundColor: theme.mode === 'dark' ? Color.alphaColor('#fff', 0.25) : Color.alphaColor('#000', 0.20),
    },
    marginLeft: 0,
  };

  const iconContainerStyle = {
    paddingLeft: '10px',
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const inputStyle = {
    minWidth: inputWidth,
    maxWidth: inputWidth,
    maxHeight: '39px',
    color: 'inherit',
    '& .MuiInputBase-input': {
      paddingLeft: '40px',
      transition: 'width 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms', // todo I dont think this does anything
      width: '100%',
    },
  };

  // console.timeEnd('Search.logic')
  return (
    <div className={Style.getStyleClassName(containerStyle)}>
      <div className={Style.getStyleClassName(iconContainerStyle)}>
        <SearchIcon />
      </div>
      <InputBase
        className={Style.getStyleClassName(inputStyle)}
        value = {value}
        placeholder = {'Search'}
        onChange = {onChange}
      />
    </div>
  );
};

export default Search;

