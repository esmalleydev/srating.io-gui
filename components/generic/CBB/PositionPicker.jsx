import React, { useState } from 'react';
import useWindowDimensions from '../../hooks/useWindowDimensions';

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


const PositionPicker = (props) => {

  const { width } = useWindowDimensions();

  const selected = props.selected;
  const [posOpen, setPosOpen] = useState(false);

  const conferenceOptions = [
    {'value': 'all', 'label': 'All'},
    {'value': 'G', 'label': 'Gaurd'},
    {'value': 'F', 'label': 'Forward'},
    {'value': 'C', 'label': 'Center'},
  ];


  const handlePosOpen = () => {
    setPosOpen(true);
  };

  const handlePosClose = () => {
    setPosOpen(false);
  };

  return (
    <div>
      <Button
        id="position-picker-button"
        aria-controls={posOpen ? 'position-picker-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={posOpen ? 'true' : undefined}
        variant="text"
        disableElevation
        onClick={handlePosOpen}
        endIcon={<KeyboardArrowDownIcon />}
      >
        {width < 500 ? 'Pos.' : 'Positions'}
      </Button>
      <Dialog
        fullScreen
        open={posOpen}
        // TransitionComponent={Transition}
        keepMounted
        onClose={handlePosClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handlePosClose}
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
          {conferenceOptions.map((confOption) => (
            <ListItem key={confOption.value} button onClick={() => {
              if (props.actionHandler) {
                props.actionHandler(confOption.value);
              }
              handlePosClose();
            }}>
              <ListItemIcon>
                {selected.indexOf(confOption.value) > -1 ? <CheckIcon /> : ''}
              </ListItemIcon>
              <ListItemText primary={confOption.label} />
            </ListItem>
          ))}
        </List>
      </Dialog>
    </div>
  );
}

export default PositionPicker;