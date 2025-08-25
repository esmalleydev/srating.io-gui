'use client';

import React, { useEffect } from 'react';

import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
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
  const conferences = useAppSelector((state) => state.displayReducer.conferences);
  const rows = getRows({ view });
  const { width } = useWindowDimensions() as Dimensions;
  const searchValue = useAppSelector((state) => state.rankingReducer.searchValue);
  // const [value, setValue] = useState<string>('');

  const handleSearch = (filteredRows) => {
    dispatch(setDataKey({ key: 'filteredRows', value: filteredRows }));
  };

  useEffect(() => {
    return () => {
      handleSearch(false);
    };
  }, []);

  useEffect(() => {
    onChange(null, searchValue);
  }, [conferences]);

  // useEffect(() => {
  //   console.timeEnd('Seach')
  // })


  const onChange = (e, v) => {
    // console.time('Search.onChange')
    const value: null | string = (e && e.target && e.target.value) || v;

    dispatch(setDataKey({ key: 'searchValue', value: (value || '') }));

    if (
      value &&
      value.length &&
      (rows.length < 5000 || value.length > 1) // performance issues, the search is slow on players table, takes ~100ms, with less values it is faster
    ) {
      const regex = new RegExp(value, 'i');
      const filteredRows = rows.filter((row) => {
        if (regex.test(row.name)) {
          return true;
        }

        if (view === 'transfer') {
          // apparently this is an equviant but i get a ts error, need to fix the type first. regex.test(row.committed_team_name ?? '')
          if (regex.test(('committed_team_name' in row && row.committed_team_name !== undefined ? row.committed_team_name : ''))) {
            return true;
          }

          if (regex.test(('team_name' in row && row.team_name !== undefined ? row.team_name : ''))) {
            return true;
          }
        }

        if (view === 'player') {
          if (regex.test(('team_name' in row && row.team_name !== undefined ? row.team_name : ''))) {
            return true;
          }
        }

        return false;
      });

      handleSearch(filteredRows);
    } else {
      handleSearch(false);
    }
    // console.timeEnd('Search.onChange')
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
        value = {searchValue}
        placeholder = {'Search'}
        onChange = {(e) => onChange(e, null)}
      />
    </div>
  );
};

export default Search;

