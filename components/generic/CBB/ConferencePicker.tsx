import React, { useState } from 'react';
import { useWindowDimensions, Dimensions } from '@/components/hooks/useWindowDimensions';

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
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateConferences } from '@/redux/features/display-slice';

const ConferencePicker = () => {
  const dispatch = useAppDispatch();
  const conferences = useAppSelector(state => state.displayReducer.conferences);
  const { width } = useWindowDimensions() as Dimensions;

  const selected = conferences;
  const [confOpen, setConfOpen] = useState(false);

  const conferenceOptions = [
    {'value': null, 'label': 'All'},
    {'value': 'ACC', 'label': 'ACC'},
    {'value': 'Big 12', 'label': 'Big 12'},
    {'value': 'SEC', 'label': 'SEC'},
    {'value': 'Big Ten', 'label': 'Big Ten'},
    {'value': 'Pac-12', 'label': 'Pac-12'},
    {'value': 'Big East', 'label': 'Big East'},
    {'value': 'Atlantic 10', 'label': 'Atlantic 10'},
    {'value': 'Sun Belt', 'label': 'Sun Belt'},
    {'value': 'Patriot', 'label': 'Patriot'},
    {'value': 'Mountain West', 'label': 'Mountain West'},
    {'value': 'MAC', 'label': 'MAC'},
    {'value': 'MVC', 'label': 'MVC'},
    {'value': 'WCC', 'label': 'WCC'},
    {'value': 'Big West', 'label': 'Big West'},
    {'value': 'C-USA', 'label': 'C-USA'},
    {'value': 'Ivy League', 'label': 'Ivy League'},
    {'value': 'Summit League', 'label': 'Summit League'},
    {'value': 'Horizon', 'label': 'Horizon'},
    {'value': 'MAAC', 'label': 'MAAC'},
    {'value': 'OVC', 'label': 'OVC'},
    {'value': 'SoCon', 'label': 'SoCon'},
    {'value': 'SWAC', 'label': 'SWAC'},
    {'value': 'Big Sky', 'label': 'Big Sky'},
    {'value': 'Southland', 'label': 'Southland'},
    {'value': 'ASUN', 'label': 'ASUN'},
    {'value': 'America East', 'label': 'America East'},
    {'value': 'WAC', 'label': 'WAC'},
    {'value': 'AAC', 'label': 'AAC'},
    {'value': 'CAA', 'label': 'CAA'},
    {'value': 'Big South', 'label': 'Big South'},
    {'value': 'NEC', 'label': 'NEC'},
    {'value': 'MEAC', 'label': 'MEAC'},
    {'value': 'DI Independent', 'label': 'DI Independent'},
  ];


  const handleConfOpen = () => {
    setConfOpen(true);
  };

  const handleConfClose = () => {
    setConfOpen(false);
  };

  return (
    <div>
      <Button
        id="conf-picker-button"
        aria-controls={confOpen ? 'conf-picker-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={confOpen ? 'true' : undefined}
        variant="text"
        disableElevation
        onClick={handleConfOpen}
        endIcon={<KeyboardArrowDownIcon />}
      >
        {width < 500 ? 'Conf.' : 'Conferences'}
      </Button>
      <Dialog
        fullScreen
        open={confOpen}
        // TransitionComponent={Transition}
        keepMounted
        onClose={handleConfClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleConfClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Conferences
            </Typography>
          </Toolbar>
        </AppBar>
        <List>
          {conferenceOptions.map((confOption) => {
            const value = confOption.value;

            return (
              <ListItem key={value} button onClick={() => {
                dispatch(updateConferences(value));
                handleConfClose();
              }}>
                <ListItemIcon>
                  {value && selected.indexOf(value) > -1 ? <CheckIcon /> : ''}
                </ListItemIcon>
                <ListItemText primary={confOption.label} />
              </ListItem>
            )
          })}
        </List>
      </Dialog>
    </div>
  );
}

export default ConferencePicker;