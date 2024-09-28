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


const SeasonPicker = ({ selected, actionHandler, seasons }) => {
  const [open, setOpen] = useState(false);

  type option = {
    value: number;
    label: string;
  }

  const options: option[] = [];

  for (let i = 0; i < seasons.length; i++) {
    options.push({
      value: seasons[i],
      label: `${seasons[i] - 1} - ${seasons[i]}`,
    });
  }

  options.sort((a, b) => {
    return a.value > b.value ? -1 : 1;
  });


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
        {selected}
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
              Season
            </Typography>
          </Toolbar>
        </AppBar>
        <List>
          {options.map((option) => {
            return (
              <ListItem key={option.value} button onClick={() => {
                // dispatch(setSeason(option.value));
                actionHandler(option.value);
                handleClose();
              }}>
                <ListItemIcon>
                  {+selected === +option.value ? <CheckIcon /> : ''}
                </ListItemIcon>
                <ListItemText primary={option.label} />
              </ListItem>
            );
          })}
        </List>
      </Dialog>
    </div>
  );
};

export default SeasonPicker;
