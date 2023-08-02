import React, { useState } from 'react';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';

import CheckIcon from '@mui/icons-material/Check';


/**
 * SortPicker
 * @param  {Object} props
 * @param  {Boolean} props.open
 * @param  {Function} props.closeHandler
 * @param  {Function} props.openHandler
 * @param  {Function} props.actionHandler
 * @return {<Dialog>}
 */
const SortPicker = (props) => {

  const selected = props.selected;

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
      // fullWidth={true}
      // maxWidth={'xs'}
      // TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>Pick sort order</DialogTitle>
      <List>
        {options.map((option) => (
          <ListItem key={option.value} button onClick={() => {
            props.actionHandler(option.value);
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
