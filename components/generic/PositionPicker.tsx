'use client';

import { useWindowDimensions, Dimensions } from '@/components/hooks/useWindowDimensions';
import { useAppDispatch } from '@/redux/hooks';
import { clearPositions, updatePositions } from '@/redux/features/display-slice';
import OptionPicker from './OptionPicker';


const PositionPicker = ({ selected }: { selected: string[]; }) => {
  const dispatch = useAppDispatch();
  const { width } = useWindowDimensions() as Dimensions;

  const options = [
    { value: 'all', label: 'All' },
    { value: 'G', label: 'Guard' },
    { value: 'F', label: 'Forward' },
    { value: 'C', label: 'Center' },
  ];

  const selectedOption = (selected && selected.length) ? selected : ['all'];

  const handlePosition = (value: string) => {
    if (value === 'all') {
      dispatch(clearPositions());
    } else {
      dispatch(updatePositions(value));
    }
  };

  return (
    <>
      <OptionPicker buttonName = {width < 500 ? 'Pos.' : 'Positions'} options = {options} selected = {selectedOption} actionHandler = {handlePosition} isRadio = {false} />
    </>
  );
};

export default PositionPicker;
