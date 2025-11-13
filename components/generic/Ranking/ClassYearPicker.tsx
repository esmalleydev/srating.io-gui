'use client';

import { useWindowDimensions, Dimensions } from '@/components/hooks/useWindowDimensions';
import { useAppDispatch } from '@/redux/hooks';
import OptionPicker, { optionType } from '../OptionPicker';
import { updateDataKey } from '@/redux/features/ranking-slice';
import { useEffect } from 'react';
import { getStore } from '@/app/StoreProvider';
import Objector from '@/components/utils/Objector';
import { Dialog, DialogTitle, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

import CheckIcon from '@mui/icons-material/Check';

const options: optionType[] = [
  { value: 'all', label: 'All' },
  { value: 'Fr.', label: 'Freshmen' },
  { value: 'So.', label: 'Sophomore' },
  { value: 'Jr.', label: 'Junior' },
  { value: 'Sr.', label: 'Senior' },
];

/**
 * Dont touch this
 */
const useEffectTimeout = () => {
  const timer = setTimeout(
    () => {
      let run = false;
      const current = new URLSearchParams(window.location.search);
      const urlClassYears = current.getAll('class_years');

      const store = getStore();
      const class_years = Objector.deepClone(store.getState().rankingReducer.class_years);

      if (class_years && class_years.length) {
        let same = true;
        for (let i = 0; i < class_years.length; i++) {
          if (!urlClassYears.includes(class_years[i])) {
            same = false;
            break;
          }
        }

        if (!same || urlClassYears.length !== class_years.length) {
          current.delete('class_years');
          for (let i = 0; i < class_years.length; i++) {
            current.append('class_years', class_years[i]);
          }
          run = true;
        }
      } else if (urlClassYears && urlClassYears.length) {
        current.delete('class_years');
        run = true;
      }

      if (run) {
        window.history.replaceState(null, '', `?${current.toString()}`);
      }
    },
    0,
  );

  return () => clearTimeout(timer);
};

const ClassYearPicker = ({ selected, isRadio = false }: { selected: string[]; isRadio?: boolean; }) => {
  const dispatch = useAppDispatch();
  const { width } = useWindowDimensions() as Dimensions;

  const selectedOption = (selected && selected.length) ? selected : ['all'];

  useEffect(useEffectTimeout, []);

  const handleClassYear = (value: string) => {
    if (isRadio) {
      dispatch(updateDataKey({ key: 'class_years', value: [] }));
      dispatch(updateDataKey({ key: 'class_years', value }));
    } else if (value === 'all') {
      dispatch(updateDataKey({ key: 'class_years', value: [] }));
    } else {
      dispatch(updateDataKey({ key: 'class_years', value }));
    }
  };

  let buttonName = width < 500 ? 'Cls.' : 'Class';

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
      <OptionPicker buttonName = {buttonName} options = {options} selected = {selectedOption} actionHandler = {handleClassYear} isRadio = {isRadio} />
    </>
  );
};


const ClassYearPickerDialog = (
  {
    open,
    closeHandler,
    openHandler,
    selected,
    isRadio = false,
  }:
  {
    open: boolean;
    closeHandler: () => void;
    openHandler: () => void;
    selected: string[];
    isRadio?: boolean;
  },
) => {
  const dispatch = useAppDispatch();

  const selectedOption = (selected && selected.length) ? selected : ['all'];

  useEffect(useEffectTimeout, []);

  const handleClassYear = (value: string) => {
    if (isRadio) {
      dispatch(updateDataKey({ key: 'class_years', value: [] }));
      dispatch(updateDataKey({ key: 'class_years', value }));
    } else if (value === 'all') {
      dispatch(updateDataKey({ key: 'class_years', value: [] }));
    } else {
      dispatch(updateDataKey({ key: 'class_years', value }));
    }
    handleClose();
  };

  const handleOpen = () => {
    openHandler();
  };

  const handleClose = () => {
    closeHandler();
  };

  return (
    <Dialog
      open={open}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-rank-picker-description"
    >
      <DialogTitle>Filter by class</DialogTitle>
      <List>
        {options.map((option) => (
          <ListItemButton key={option.value} onClick={() => {
            handleClassYear(option.value as string);
          }}>
            <ListItemIcon>
              {selectedOption.includes(option.value as string) ? <CheckIcon /> : ''}
            </ListItemIcon>
            <ListItemText primary={option.label} />
          </ListItemButton>
        ))}
      </List>
    </Dialog>
  );
};


export { ClassYearPickerDialog };
export default ClassYearPicker;
