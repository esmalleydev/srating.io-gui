'use client';

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
import { useAppDispatch } from '@/redux/hooks';
import { updatePositions } from '@/redux/features/display-slice';


const PositionPicker = ({ selected }) => {
  const dispatch = useAppDispatch();
  const { width } = useWindowDimensions() as Dimensions;

  const [open, setOpen] = useState(false);

  const options = [
    { value: 'all', label: 'All' },
    { value: 'G', label: 'Guard' },
    { value: 'F', label: 'Forward' },
    { value: 'C', label: 'Center' },
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
        id="position-picker-button"
        aria-controls={open ? 'position-picker-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="text"
        disableElevation
        onClick={handleOpen}
        endIcon={<KeyboardArrowDownIcon />}
      >
        {width < 500 ? 'Pos.' : 'Positions'}
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
              Positions
            </Typography>
          </Toolbar>
        </AppBar>
        <List>
          {options.map((option) => (
            <ListItem key={option.value} button onClick={() => {
              dispatch(updatePositions(option.value));
              handleClose();
            }}>
              <ListItemIcon>
                {selected.indexOf(option.value) > -1 ? <CheckIcon /> : ''}
              </ListItemIcon>
              <ListItemText primary={option.label} />
            </ListItem>
          ))}
        </List>
      </Dialog>
    </div>
  );
};

export default PositionPicker;
