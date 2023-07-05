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
import Slide from '@mui/material/Slide';

import Typography from '@mui/material/Typography';

import CheckIcon from '@mui/icons-material/Check';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';


const SeasonPicker = (props) => {

  const selected = props.selected;
  const [open, setOpen] = useState(false);

  const options = [
    // {'value': 2024, 'label': '2024'},
    {'value': 2023, 'label': '2023'},
    {'value': 2022, 'label': '2022'},
    {'value': 2021, 'label': '2021'},
    {'value': 2020, 'label': '2020'},
    {'value': 2019, 'label': '2019'},
    {'value': 2018, 'label': '2018'},
    {'value': 2017, 'label': '2017'},
    {'value': 2016, 'label': '2016'},
    {'value': 2015, 'label': '2015'},
    {'value': 2014, 'label': '2014'},
    {'value': 2013, 'label': '2013'},
    {'value': 2012, 'label': '2012'},
    {'value': 2011, 'label': '2011'},
  ];


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
          {options.map((option) => (
            <ListItem key={option.value} button onClick={() => {
              if (props.actionHandler) {
                props.actionHandler(option.value);
              }
              handleClose();
            }}>
              <ListItemIcon>
                {+selected === +option.value ? <CheckIcon /> : ''}
              </ListItemIcon>
              <ListItemText primary={option.label} />
            </ListItem>
          ))}
        </List>
      </Dialog>
    </div>
  );
}

export default SeasonPicker;