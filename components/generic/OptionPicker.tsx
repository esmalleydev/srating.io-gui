import React, { useState } from 'react';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import CloseIcon from '@mui/icons-material/Close';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';

import Typography from '@mui/material/Typography';

import CheckIcon from '@mui/icons-material/Check';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

type optionType = {
  value: string;
  label: string;
};


const OptionPicker = (
  { 
    selected, 
    title,
    options,
    selectedLabel,
    actionHandler
  }: 
  { 
    selected: string, 
    title: string, 
    options: Array<optionType>,
    selectedLabel?: string,
    actionHandler?: Function
  }
) => {

  for (let i = 0; i < options.length; i++) {
    if (selected === options[i].value) {
      selectedLabel = options[i].label;
      break;
    }
  }

  const [open, setOpen] = useState(false);


  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        id="conf-picker-button"
        aria-controls={open ? 'conf-picker-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="text"
        disableElevation
        onClick={handleOpen}
        endIcon={<KeyboardArrowDownIcon />}
      >
        {selectedLabel}
      </Button>
      <Dialog
        fullScreen
        open={open}
        // TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {title}
            </Typography>
          </Toolbar>
        </AppBar>
        <List>
          {options.map((option) => (
            <ListItem key={option.value} button onClick={() => {
              if (actionHandler) {
                actionHandler(option.value);
              }
              handleClose();
            }}>
              <ListItemIcon>
                {selected === option.value ? <CheckIcon /> : ''}
              </ListItemIcon>
              <ListItemText primary={option.label} />
            </ListItem>
          ))}
        </List>
      </Dialog>
    </div>
  );
}

export default OptionPicker;