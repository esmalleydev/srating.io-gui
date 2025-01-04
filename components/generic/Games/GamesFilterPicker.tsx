'use client';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import OptionPicker from '../OptionPicker';
import { setGamesFilter } from '@/redux/features/display-slice';



const GamesFilterPicker = () => {
  const dispatch = useAppDispatch();
  const gamesFilter = useAppSelector((state) => state.displayReducer.gamesFilter);

  const filterOptions = {
    all: { value: 'all', label: 'All' },
    top_25: { value: 'top_25', label: 'Top 25' },
  };

  const selectedFilter = gamesFilter;
  const buttonName = selectedFilter in filterOptions ? filterOptions[selectedFilter].label : 'Unknown';


  const handleFilter = (value: string) => {
    dispatch(setGamesFilter(value));
  };


  return (
    <>
      <OptionPicker buttonName = {buttonName} options = {Object.values(filterOptions)} selected = {[selectedFilter]} actionHandler = {handleFilter} isRadio = {true} />
    </>
  );
};

export default GamesFilterPicker;
