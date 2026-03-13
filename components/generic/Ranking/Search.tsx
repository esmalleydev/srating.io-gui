'use client';

import { useEffect } from 'react';

import SearchIcon from '@mui/icons-material/Search';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setDataKey } from '@/redux/features/ranking-slice';
import { getRows } from './DataHandler';
import { Dimensions, useWindowDimensions } from '@/components/hooks/useWindowDimensions';
import TextInput from '@/components/ux/input/TextInput';
import Inputs from '@/components/helpers/Inputs';


const Search = ({ view }: {view: string}) => {
  // console.time('Search')
  // console.time('Search.logic')
  const dispatch = useAppDispatch();
  const conferences = useAppSelector((state) => state.displayReducer.conferences);
  const rows = getRows({ view });
  const { width } = useWindowDimensions() as Dimensions;
  const searchValue = useAppSelector((state) => state.rankingReducer.searchValue);
  // const [value, setValue] = useState<string>('');

  const inputHandler = new Inputs();

  const handleSearch = (filteredRows) => {
    dispatch(setDataKey({ key: 'filteredRows', value: filteredRows }));
  };

  useEffect(() => {
    return () => {
      handleSearch(false);
    };
  }, []);

  useEffect(() => {
    onChange(searchValue);
  }, [conferences]);

  // useEffect(() => {
  //   console.timeEnd('Seach')
  // })

  // console.log(rows)


  const onChange = (v) => {
    // console.time('Search.onChange')
    const value = v || '';

    dispatch(setDataKey({ key: 'searchValue', value }));

    // Threshold check: ignore empty or very short strings on large datasets
    if (value.trim().length > 0 && (rows.length < 5000 || value.length > 1)) {
      // 1. Prepare terms: "John Doe" -> ["john", "doe"]
      const terms = value.toLowerCase().trim().split(/\s+/);

      const filteredRows = rows.filter((row) => {
        // 2. Collect all searchable strings for this row
        const searchableStrings = [
          row.name,
          row.player?.first_name,
          row.player?.last_name,
          view === 'transfer' ? row.committed_team_name : null,
          row.team_name,
        ].filter(Boolean).map((s: string) => s.toLowerCase());

        // 3. Every search term must be found in at least one of the searchable strings
        return terms.every((term) => searchableStrings.some((str) => str.includes(term)));
      });

      handleSearch(filteredRows);
    } else {
      handleSearch(false);
    }
    // console.timeEnd('Search.onChange')
  };


  const inputWidth = width > 425 ? '150px' : '125px';

  const inputStyle = {
    borderRadius: '4px',
    minWidth: inputWidth,
    maxWidth: inputWidth,
    maxHeight: 32,
    height: 32,
    paddingTop: '7px',
  };

  // console.timeEnd('Search.logic')
  return (
    <TextInput
      style = {inputStyle}
      placeholderStyle={{ top: 7 }}
      icon={<SearchIcon />}
      inputHandler={inputHandler}
      value = {searchValue}
      placeholder='Search'
      onChange={onChange}
      variant = 'filled'
      showError = {false}
      transformPlaceholder = {false}
    />
  );
};

export default Search;

