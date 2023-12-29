import React from 'react';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';

import CheckIcon from '@mui/icons-material/Check';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setPicksSort } from '@/redux/features/display-slice';


/**
 * SortPicker
 * @param  {Object} props
 * @param  {Boolean} props.open
 * @param  {Function} props.closeHandler
 * @param  {Function} props.openHandler
 * @return {<Dialog>}
 */
const SortPicker = (props) => {
  const dispatch = useAppDispatch();
  const displaySlice = useAppSelector(state => state.displayReducer.value);
  const selected = displaySlice.picksSort;

  const options = [
    {
      'value': 'start_time',
      'label': 'Start time',
    },
    {
      'value': 'win_percentage',
      'label': 'Highest win percentage',
    },
    // {
    //   'value': 'best_value',
    //   'label': 'Best value',
    // },
  ];

  const handleOpen = () => {
    props.openHandler();
  };

  const handleClose = () => {
    props.closeHandler();
  };

  return (
    <Dialog
      open={props.open}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>Sort order</DialogTitle>
      <List>
        {options.map((option) => (
          <ListItem key={option.value} button onClick={() => {
            dispatch(setPicksSort(option.value));
            handleClose();
          }}>
            <ListItemIcon>
              {option.value === selected ? <CheckIcon /> : ''}
            </ListItemIcon>
            <ListItemText primary={option.label} />
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}

export default SortPicker;
