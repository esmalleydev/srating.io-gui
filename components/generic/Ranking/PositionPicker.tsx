'use client';

import { useWindowDimensions, Dimensions } from '@/components/hooks/useWindowDimensions';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { clearPositions, updatePositions } from '@/redux/features/display-slice';
import OptionPicker, { optionType } from '../OptionPicker';
import Organization from '@/components/helpers/Organization';


const PositionPicker = ({ selected, isRadio = false }: { selected: string[]; isRadio?: boolean; }) => {
  const dispatch = useAppDispatch();
  const { width } = useWindowDimensions() as Dimensions;
  const organization_id = useAppSelector((state) => state.organizationReducer.organization_id);

  let options: optionType[] = [];

  if (Organization.getCBBID() === organization_id) {
    options = [
      { value: 'all', label: 'All' },
      { value: 'G', label: 'Guard' },
      { value: 'F', label: 'Forward' },
      { value: 'C', label: 'Center' },
    ];
  } else if (Organization.getCFBID() === organization_id) {
    options = [
      { value: 'QB', label: 'Quarterback' },
      { value: 'rushing', label: 'Rushing' },
      { value: 'receiving', label: 'Receiving' },
    ];
  }

  const selectedOption = (selected && selected.length) ? selected : ['all'];

  const handlePosition = (value: string) => {
    if (isRadio) {
      dispatch(clearPositions());
      dispatch(updatePositions(value));
      return;
    }

    if (value === 'all') {
      dispatch(clearPositions());
    } else {
      dispatch(updatePositions(value));
    }
  };

  let buttonName = width < 500 ? 'Pos.' : 'Positions';

  if (isRadio && selectedOption && selectedOption.length === 1) {
    options.some((o) => {
      if (o.value === selectedOption[0]) {
        buttonName = o.label;
        return true;
      }
      return false;
    });
  }

  return (
    <>
      <OptionPicker buttonName = {buttonName} options = {options} selected = {selectedOption} actionHandler = {handlePosition} isRadio = {isRadio} />
    </>
  );
};

export default PositionPicker;
